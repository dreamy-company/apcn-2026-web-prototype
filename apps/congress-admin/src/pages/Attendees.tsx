import { useEffect, useMemo, useState } from 'react';
import { Badge, Panel, SearchInput, FilterSelect } from '../components/ui/bits';
import { DataTable, Pagination, useTableState, type Column } from '../components/ui/DataTable';
import Drawer from '../components/ui/Drawer';
import Icon from '../components/ui/Icon';
import { D } from '../data/icons';
import { ATTENDEES, ROLES, COUNTRIES, TICKET_TYPES, ORDERS, type Attendee } from '../data/mock';
import { totals, fmtUSD } from '../data/stats';

const STATUS_TONE = { 'checked-in': 'good', registered: 'brand', 'no-show': 'neutral' } as const;

const ticketName = (id: string) => TICKET_TYPES.find((t) => t.id === id)?.name ?? id;

function AttendeeDetail({ attendee }: { attendee: Attendee }) {
  const order = ORDERS.find((o) => o.attendeeId === attendee.id);
  return (
    <div className="space-y-5">
      {/* Identity header */}
      <div className="flex items-center gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ffb877] to-brand-top text-lg font-extrabold text-white">
          {attendee.name.replace('Dr. ', '').split(' ').map((w) => w[0]).slice(0, 2).join('')}
        </span>
        <div>
          <div className="text-[16px] font-extrabold text-ink">{attendee.name}</div>
          <div className="text-[12.5px] font-medium text-ink-soft">{attendee.email}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { l: 'Badge ID', v: attendee.id },
          { l: 'Role', v: attendee.role },
          { l: 'Country', v: attendee.country },
          { l: 'Registered', v: attendee.registeredAt },
          { l: 'Ticket', v: ticketName(attendee.ticketType) },
          { l: 'Check-ins', v: String(attendee.checkins) },
        ].map(({ l, v }) => (
          <div key={l} className="rounded-xl bg-field px-3.5 py-3">
            <div className="text-[10px] font-bold tracking-[0.6px] uppercase text-ink-faint">{l}</div>
            <div className="mt-1 text-[13px] font-bold text-ink">{v}</div>
          </div>
        ))}
      </div>

      <div>
        <div className="mb-2 text-[11px] font-extrabold tracking-[1px] uppercase text-ink-faint">Order</div>
        {order ? (
          <div className="rounded-xl border border-line px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-extrabold text-ink">{order.id}</span>
              <Badge tone={order.status === 'paid' ? 'good' : order.status === 'pending' ? 'warm' : 'alert'}>
                {order.status}
              </Badge>
            </div>
            {order.items.map((it) => (
              <div key={it} className="mt-1.5 text-[12px] font-semibold text-ink-soft">
                {it}
              </div>
            ))}
            <div className="mt-2 border-t border-dashed border-line pt-2 text-right text-[14px] font-extrabold text-brand">
              {fmtUSD(order.amount)}
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-field px-4 py-3 text-[12.5px] font-semibold text-ink-faint">
            No order on record (comp / invited).
          </div>
        )}
      </div>

      <div className="flex gap-2.5">
        <button
          type="button"
          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-brand text-[13px] font-extrabold text-white hover:bg-[#e0501d]"
        >
          <Icon d={D.mail} s={15} c="#fff" sw={2.2} />
          Email Attendee
        </button>
        <button
          type="button"
          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-line text-[13px] font-extrabold text-ink hover:bg-field"
        >
          <Icon d={D.pen} s={15} sw={2.2} />
          Edit
        </button>
      </div>
    </div>
  );
}

export default function Attendees() {
  const [role, setRole] = useState('');
  const [country, setCountry] = useState('');
  const [selected, setSelected] = useState<Attendee | null>(null);

  const filtered = useMemo(
    () => ATTENDEES.filter((a) => (!role || a.role === role) && (!country || a.country === country)),
    [role, country],
  );

  const table = useTableState(filtered, (a) => [a.name, a.email, a.id, a.country]);
  useEffect(() => table.resetPage(), [role, country]); // eslint-disable-line react-hooks/exhaustive-deps

  const columns: Column<Attendee>[] = [
    {
      key: 'name',
      header: 'Attendee',
      sortValue: (a) => a.name,
      render: (a) => (
        <div>
          <div className="font-extrabold text-ink">{a.name}</div>
          <div className="mt-0.5 text-[11.5px] font-medium text-ink-soft">{a.email}</div>
        </div>
      ),
    },
    { key: 'id', header: 'Badge ID', render: (a) => <span className="font-semibold tracking-wide text-ink-soft">{a.id}</span> },
    { key: 'role', header: 'Role', sortValue: (a) => a.role, render: (a) => <span className="font-semibold text-ink-soft">{a.role}</span> },
    { key: 'country', header: 'Country', sortValue: (a) => a.country, render: (a) => <span className="font-semibold text-ink-soft">{a.country}</span> },
    {
      key: 'ticket',
      header: 'Ticket',
      render: (a) => <span className="text-[12px] font-semibold text-ink-soft">{ticketName(a.ticketType)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      sortValue: (a) => a.status,
      render: (a) => <Badge tone={STATUS_TONE[a.status]}>{a.status}</Badge>,
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Quick counts */}
      <div className="mb-4 flex flex-wrap gap-2.5">
        {[
          { l: 'Total attendees', v: totals.attendees },
          { l: 'Checked in', v: totals.checkedIn },
          { l: 'Registered only', v: ATTENDEES.filter((a) => a.status === 'registered').length },
          { l: 'No-shows', v: ATTENDEES.filter((a) => a.status === 'no-show').length },
        ].map(({ l, v }) => (
          <span key={l} className="rounded-full border border-line bg-white px-3.5 py-2 text-[12px] font-bold text-ink-soft">
            {l}: <span className="font-extrabold text-ink">{v}</span>
          </span>
        ))}
      </div>

      <Panel>
        <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-3 md:px-5">
          <SearchInput value={table.query} onChange={table.setQuery} placeholder="Search name, email, badge ID…" />
          <FilterSelect value={role} onChange={setRole} options={ROLES} allLabel="All roles" />
          <FilterSelect value={country} onChange={setCountry} options={COUNTRIES} allLabel="All countries" />
        </div>
        <DataTable
          columns={columns}
          rows={table.pageRows}
          rowKey={(a) => a.id}
          onRowClick={setSelected}
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

      {selected && (
        <Drawer title="Attendee Profile" onClose={() => setSelected(null)}>
          <AttendeeDetail attendee={selected} />
        </Drawer>
      )}
    </div>
  );
}
