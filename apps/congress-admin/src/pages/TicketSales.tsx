import { useEffect, useMemo, useState } from 'react';
import { Badge, Panel, SearchInput, FilterSelect } from '../components/ui/bits';
import { DataTable, Pagination, useTableState, type Column } from '../components/ui/DataTable';
import Icon from '../components/ui/Icon';
import { D } from '../data/icons';
import { ORDERS, TICKET_TYPES, type Order } from '../data/mock';
import { salesByType, fmtUSD } from '../data/stats';

const ORDER_TONE = { paid: 'good', pending: 'warm', refunded: 'alert' } as const;
const STATUSES = ['paid', 'pending', 'refunded'] as const;

export default function TicketSales() {
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');

  // Page-level filters run before the shared search/sort/pagination hook.
  const filtered = useMemo(
    () =>
      ORDERS.filter(
        (o) =>
          (!status || o.status === status) &&
          (!type || TICKET_TYPES.find((t) => t.id === o.ticketType)?.name === type),
      ),
    [status, type],
  );

  const table = useTableState(filtered, (o) => [o.id, o.buyer, o.method]);
  useEffect(() => table.resetPage(), [status, type]); // eslint-disable-line react-hooks/exhaustive-deps

  const columns: Column<Order>[] = [
    {
      key: 'id',
      header: 'Order',
      sortValue: (o) => o.id,
      render: (o) => (
        <div>
          <div className="font-extrabold text-ink">{o.id}</div>
          <div className="mt-0.5 text-[11.5px] font-medium text-ink-soft">{o.buyer}</div>
        </div>
      ),
    },
    {
      key: 'items',
      header: 'Items',
      render: (o) => (
        <div className="max-w-[220px]">
          {o.items.map((it) => (
            <div key={it} className="truncate text-[12px] font-semibold text-ink-soft">
              {it}
            </div>
          ))}
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      sortValue: (o) => o.amount,
      render: (o) => <span className="font-extrabold text-ink">{fmtUSD(o.amount)}</span>,
    },
    { key: 'method', header: 'Method', render: (o) => <span className="font-semibold text-ink-soft">{o.method}</span> },
    {
      key: 'date',
      header: 'Date',
      sortValue: (o) => o.dayIndex,
      render: (o) => <span className="font-semibold text-ink-soft">{o.date}</span>,
    },
    { key: 'status', header: 'Status', render: (o) => <Badge tone={ORDER_TONE[o.status]}>{o.status}</Badge> },
  ];

  return (
    <div className="animate-fade-in">
      {/* Revenue-by-type summary strip */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {salesByType.map((s) => (
          <div key={s.id} className="rounded-2xl border border-line bg-white px-4 py-3.5">
            <div className="truncate text-[11px] font-extrabold tracking-[0.4px] uppercase text-ink-soft">
              {s.name}
            </div>
            <div className="mt-1 text-lg font-extrabold text-ink">{fmtUSD(s.revenue)}</div>
            <div className="text-[11.5px] font-semibold text-ink-faint">{s.count} sold</div>
          </div>
        ))}
      </div>

      <Panel className="mt-4">
        {/* Toolbar: search + filters + export */}
        <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-3 md:px-5">
          <SearchInput value={table.query} onChange={table.setQuery} placeholder="Search order ID, buyer, method…" />
          <FilterSelect value={status} onChange={setStatus} options={STATUSES} allLabel="All statuses" />
          <FilterSelect
            value={type}
            onChange={setType}
            options={TICKET_TYPES.map((t) => t.name)}
            allLabel="All ticket types"
          />
          <button
            type="button"
            className="ml-auto flex h-9 items-center gap-1.5 rounded-lg bg-brand px-3 text-[12.5px] font-extrabold text-white shadow-[0_6px_14px_-6px_rgba(241,90,36,0.6)] hover:bg-[#e0501d]"
          >
            <Icon d={D.export} s={14} c="#fff" sw={2.2} />
            Export CSV
          </button>
        </div>
        <DataTable
          columns={columns}
          rows={table.pageRows}
          rowKey={(o) => o.id}
          sortKey={table.sort?.key}
          sortDir={table.sort?.dir}
          onSort={table.toggleSort}
        />
        <Pagination
          page={table.page}
          totalPages={table.totalPages}
          total={table.total}
          pageSize={table.pageSize}
          onPage={table.setPage}
        />
      </Panel>
    </div>
  );
}
