import { useMemo } from 'react';
import { Badge, Panel } from '../components/ui/bits';
import { DataTable, Pagination, useTableState, type Column } from '../components/ui/DataTable';
import { BarChart, DonutChart, donutColor } from '../components/charts/charts';
import Icon from '../components/ui/Icon';
import { DH } from '../data/icons';
import { fmtUSD, type Booking } from '../data/mock';
import { useScopedData, hotelName, roomTypeName } from '../state/selectors';

const PAY_TONE = { settled: 'good', pending: 'brand', unpaid: 'neutral' } as const;

export default function Finance() {
  const { hotels, bookings } = useScopedData();

  // Per-hotel recap: revenue = approved bookings; split by payment state.
  const recap = useMemo(
    () =>
      hotels.map((h) => {
        const hb = bookings.filter((b) => b.hotelId === h.id && b.status === 'approved');
        const settled = hb.filter((b) => b.payment === 'settled').reduce((s, b) => s + b.amount, 0);
        const pending = hb.filter((b) => b.payment !== 'settled').reduce((s, b) => s + b.amount, 0);
        return { hotel: h, revenue: settled + pending, settled, pending, count: hb.length };
      }),
    [hotels, bookings],
  );

  const totalSettled = recap.reduce((s, r) => s + r.settled, 0);
  const totalPending = recap.reduce((s, r) => s + r.pending, 0);

  // Transactions table = approved bookings (the financial ledger).
  const ledger = useMemo(() => bookings.filter((b) => b.status === 'approved'), [bookings]);
  const table = useTableState(ledger, (b) => [b.participant, b.id, hotelName(b.hotelId)]);

  const columns: Column<Booking>[] = [
    {
      key: 'id',
      header: 'Booking',
      sortValue: (b) => b.id,
      render: (b) => (
        <div>
          <div className="font-extrabold text-ink">{b.id}</div>
          <div className="mt-0.5 text-[11.5px] font-medium text-ink-soft">{b.participant}</div>
        </div>
      ),
    },
    {
      key: 'hotel',
      header: 'Hotel / Room',
      sortValue: (b) => hotelName(b.hotelId),
      render: (b) => (
        <div>
          <div className="text-[12.5px] font-bold text-ink">{hotelName(b.hotelId)}</div>
          <div className="mt-0.5 text-[11.5px] font-medium text-ink-soft">{roomTypeName(b.hotelId, b.roomTypeId)}</div>
        </div>
      ),
    },
    {
      key: 'stay',
      header: 'Stay',
      render: (b) => <span className="font-semibold text-ink-soft">{b.checkIn}–{b.checkOut} · {b.nights}n</span>,
    },
    {
      key: 'amount',
      header: 'Amount',
      sortValue: (b) => b.amount,
      render: (b) => <span className="font-extrabold text-ink">{fmtUSD(b.amount)}</span>,
    },
    {
      key: 'payment',
      header: 'Payment',
      sortValue: (b) => b.payment,
      render: (b) => <Badge tone={PAY_TONE[b.payment]}>{b.payment}</Badge>,
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Per-hotel recap cards */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {recap.map(({ hotel, revenue, settled, pending, count }) => (
          <div key={hotel.id} className="rounded-2xl border border-line bg-white p-4 shadow-[0_2px_10px_-6px_rgba(20,16,12,0.15)]">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-[10px]" style={{ background: `${hotel.color}22` }}>
                <Icon d={DH.building2} s={17} c={hotel.color} sw={2} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-extrabold text-ink">{hotel.name}</div>
                <div className="text-[11px] font-semibold text-ink-faint">{count} confirmed bookings</div>
              </div>
            </div>
            <div className="mt-3 text-[22px] font-extrabold tracking-tight text-ink">{fmtUSD(revenue)}</div>
            {/* Settled vs pending split bar */}
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-field">
              <div className="h-full bg-good" style={{ width: `${revenue ? (settled / revenue) * 100 : 0}%` }} />
            </div>
            <div className="mt-2 flex justify-between text-[11.5px] font-bold">
              <span className="text-good">{fmtUSD(settled)} settled</span>
              <span className="text-ink-soft">{fmtUSD(pending)} pending</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="mt-4 grid gap-4 lg:grid-cols-[340px_1fr]">
        <Panel title="Settled vs Pending">
          <div className="flex flex-col items-center gap-3 px-5 py-4">
            <DonutChart
              data={[
                { name: 'Settled', count: Math.round(totalSettled / 100) },
                { name: 'Pending', count: Math.round(totalPending / 100) },
              ]}
              centerValue={`${Math.round((totalSettled / Math.max(1, totalSettled + totalPending)) * 100)}%`}
              centerLabel="settled"
            />
            <ul className="w-full space-y-2">
              {[
                { name: 'Settled', v: totalSettled },
                { name: 'Pending payments', v: totalPending },
              ].map((s, i) => (
                <li key={s.name} className="flex items-center gap-2.5">
                  <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: donutColor(i) }} />
                  <span className="flex-1 text-[12px] font-bold text-ink">{s.name}</span>
                  <span className="text-[12px] font-extrabold text-ink">{fmtUSD(s.v)}</span>
                </li>
              ))}
            </ul>
          </div>
        </Panel>

        <Panel title="Revenue per Hotel (USD)">
          <div className="px-4 py-3">
            <BarChart
              data={recap.map((r) => ({
                label: r.hotel.name.split(' ').slice(0, 2).join(' '),
                count: r.revenue,
              }))}
            />
          </div>
        </Panel>
      </div>

      {/* Ledger */}
      <Panel
        className="mt-4"
        title="Transactions"
        action={
          <button
            type="button"
            className="flex h-8 items-center gap-1.5 rounded-lg bg-brand px-3 text-[12px] font-extrabold text-white shadow-[0_6px_14px_-6px_rgba(241,90,36,0.6)] hover:bg-[#e0501d]"
          >
            <Icon d={DH.export} s={13} c="#fff" sw={2.2} />
            Export
          </button>
        }
      >
        <DataTable
          columns={columns}
          rows={table.pageRows}
          rowKey={(b) => b.id}
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
