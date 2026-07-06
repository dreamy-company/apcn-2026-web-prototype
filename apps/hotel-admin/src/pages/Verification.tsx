import { useMemo, useState } from 'react';
import { Badge, Panel, SearchInput } from '../components/ui/bits';
import { DataTable, Pagination, useTableState, type Column } from '../components/ui/DataTable';
import { Modal, SegmentedToggle, SyncBadge } from '../components/ui/hotelBits';
import Icon from '../components/ui/Icon';
import { DH } from '../data/icons';
import { fmtUSD, type Booking, type BookingStatus } from '../data/mock';
import { useStore } from '../state/StoreContext';
import { useScopedData, hotelName, roomTypeName } from '../state/selectors';

const STATUS_TONE = { pending: 'warm', approved: 'good', rejected: 'alert' } as const;
const PAY_TONE = { settled: 'good', pending: 'brand', unpaid: 'neutral' } as const;

/** Quick ✓ / ✗ actions shared by table rows and kanban cards. */
function QuickActions({ booking, compact }: { booking: Booking; compact?: boolean }) {
  const { approve, reject, syncing } = useStore();
  if (booking.status !== 'pending') return null;
  const busy = !!syncing[booking.id];
  return (
    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        aria-label="Approve booking"
        disabled={busy}
        onClick={() => approve(booking.id)}
        className={`flex items-center justify-center gap-1 rounded-lg bg-good text-white transition-colors enabled:hover:bg-[#358566] disabled:opacity-50 ${
          compact ? 'h-8 w-8' : 'h-8 px-3 text-[12px] font-extrabold'
        }`}
      >
        <Icon d={DH.check} s={13} c="#fff" sw={2.8} />
        {!compact && 'Approve'}
      </button>
      <button
        type="button"
        aria-label="Reject booking"
        disabled={busy}
        onClick={() => reject(booking.id)}
        className={`flex items-center justify-center gap-1 rounded-lg border border-alert/40 bg-alert-soft text-alert transition-colors enabled:hover:bg-alert enabled:hover:text-white disabled:opacity-50 ${
          compact ? 'h-8 w-8' : 'h-8 px-3 text-[12px] font-extrabold'
        }`}
      >
        <Icon d={DH.x} s={13} sw={2.8} />
        {!compact && 'Reject'}
      </button>
    </div>
  );
}

/** Booking summary modal — full context before the verdict. */
function BookingModal({ booking, onClose }: { booking: Booking; onClose: () => void }) {
  const { approve, reject } = useStore();
  const facts = [
    { l: 'Participant', v: booking.participant },
    { l: 'Congress Badge', v: booking.badgeId },
    { l: 'Hotel', v: hotelName(booking.hotelId) },
    { l: 'Room Type', v: roomTypeName(booking.hotelId, booking.roomTypeId) },
    { l: 'Stay', v: `${booking.checkIn} → ${booking.checkOut} · ${booking.nights} nights` },
    { l: 'Rooms', v: String(booking.rooms) },
    { l: 'Requested', v: booking.requestedAt },
    { l: 'Amount', v: fmtUSD(booking.amount) },
  ];
  return (
    <Modal
      title={`Booking ${booking.id}`}
      onClose={onClose}
      footer={
        booking.status === 'pending' ? (
          <>
            <button
              type="button"
              onClick={() => {
                reject(booking.id);
                onClose();
              }}
              className="flex h-10 items-center gap-1.5 rounded-xl border border-alert/40 bg-alert-soft px-4 text-[13px] font-extrabold text-alert hover:bg-alert hover:text-white"
            >
              <Icon d={DH.x} s={14} sw={2.6} />
              Reject
            </button>
            <button
              type="button"
              onClick={() => {
                approve(booking.id);
                onClose();
              }}
              className="flex h-10 items-center gap-1.5 rounded-xl bg-good px-5 text-[13px] font-extrabold text-white shadow-[0_8px_18px_-8px_rgba(63,154,120,0.6)] hover:bg-[#358566]"
            >
              <Icon d={DH.check} s={14} c="#fff" sw={2.6} />
              Approve booking
            </button>
          </>
        ) : undefined
      }
    >
      <div className="mb-4 flex items-center gap-2">
        <Badge tone={STATUS_TONE[booking.status]}>{booking.status}</Badge>
        <Badge tone={PAY_TONE[booking.payment]}>payment {booking.payment}</Badge>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {facts.map(({ l, v }) => (
          <div key={l} className="rounded-xl bg-field px-3.5 py-3">
            <div className="text-[10px] font-bold tracking-[0.6px] uppercase text-ink-faint">{l}</div>
            <div className="mt-1 text-[13px] font-bold text-ink">{v}</div>
          </div>
        ))}
      </div>
      {booking.note && (
        <div className="mt-3 rounded-xl border border-warm-soft bg-warm-soft/60 px-3.5 py-3 text-[12.5px] font-semibold text-ink">
          <span className="font-extrabold">Guest note:</span> {booking.note}
        </div>
      )}
    </Modal>
  );
}

/** Kanban card — used in all three columns. */
function KanbanCard({ booking, onOpen }: { booking: Booking; onOpen: () => void }) {
  const { syncing, flash } = useStore();
  return (
    // div, not button: the card hosts its own approve/reject buttons.
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => e.key === 'Enter' && onOpen()}
      className={`w-full cursor-pointer rounded-xl border border-line bg-white p-3.5 text-left shadow-[0_2px_8px_-4px_rgba(20,16,12,0.15)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_16px_-6px_rgba(20,16,12,0.25)] ${
        flash[booking.id] ? 'ring-2 ring-brand-top' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-[13px] font-extrabold text-ink">{booking.participant}</span>
        <SyncBadge syncing={!!syncing[booking.id]} flashed={!!flash[booking.id] && !syncing[booking.id]} />
      </div>
      <div className="mt-0.5 text-[11px] font-semibold tracking-wide text-ink-faint">{booking.id} · {booking.badgeId}</div>
      <div className="mt-2 text-[12px] font-bold text-ink-soft">
        {hotelName(booking.hotelId)}
        <span className="font-medium"> · {roomTypeName(booking.hotelId, booking.roomTypeId)}</span>
      </div>
      <div className="mt-1 flex items-center gap-2 text-[11.5px] font-semibold text-ink-soft">
        <Icon d={DH.cal} s={12} c="#b8b3ab" sw={2.2} />
        {booking.checkIn}–{booking.checkOut} · {booking.nights}n
      </div>
      <div className="mt-2.5 flex items-center justify-between border-t border-dashed border-line pt-2.5">
        <span className="text-[13px] font-extrabold text-brand">{fmtUSD(booking.amount)}</span>
        <QuickActions booking={booking} compact />
      </div>
    </div>
  );
}

const VIEWS = [
  { value: 'table' as const, label: 'Table', icon: DH.rows },
  { value: 'kanban' as const, label: 'Kanban', icon: DH.columns },
];
const TABS: BookingStatus[] = ['pending', 'approved', 'rejected'];

export default function Verification() {
  const { bookings } = useScopedData();
  const { syncing, flash } = useStore();
  // `?view=kanban` deep-links the board layout.
  const [view, setView] = useState<'table' | 'kanban'>(() =>
    new URLSearchParams(window.location.search).get('view') === 'kanban' ? 'kanban' : 'table',
  );
  const [tab, setTab] = useState<BookingStatus>('pending');
  const [selected, setSelected] = useState<Booking | null>(null);

  const counts = useMemo(
    () => Object.fromEntries(TABS.map((t) => [t, bookings.filter((b) => b.status === t).length])),
    [bookings],
  );

  const tabRows = useMemo(() => bookings.filter((b) => b.status === tab), [bookings, tab]);
  const table = useTableState(tabRows, (b) => [b.participant, b.id, b.badgeId, hotelName(b.hotelId)]);

  const columns: Column<Booking>[] = [
    {
      key: 'participant',
      header: 'Participant',
      sortValue: (b) => b.participant,
      render: (b) => (
        <div className="flex items-center gap-2">
          <div>
            <div className="font-extrabold text-ink">{b.participant}</div>
            <div className="mt-0.5 text-[11px] font-medium tracking-wide text-ink-soft">{b.id} · {b.badgeId}</div>
          </div>
          <SyncBadge syncing={!!syncing[b.id]} flashed={!!flash[b.id] && !syncing[b.id]} />
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
      render: (b) => (
        <span className="font-semibold text-ink-soft">
          {b.checkIn}–{b.checkOut} · {b.nights}n{b.rooms > 1 ? ` · ${b.rooms} rooms` : ''}
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      sortValue: (b) => b.amount,
      render: (b) => <span className="font-extrabold text-ink">{fmtUSD(b.amount)}</span>,
    },
    { key: 'payment', header: 'Payment', render: (b) => <Badge tone={PAY_TONE[b.payment]}>{b.payment}</Badge> },
    { key: 'actions', header: 'Actions', render: (b) => <QuickActions booking={b} /> },
  ];

  return (
    <div className="animate-fade-in">
      {/* Toolbar: status tabs (table mode), search, view toggle */}
      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        {view === 'table' && (
          <div className="flex gap-1.5">
            {TABS.map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setTab(t)}
                className={`flex h-9 items-center gap-1.5 rounded-lg px-3 text-[12.5px] font-extrabold capitalize transition-colors ${
                  tab === t ? 'bg-brand text-white' : 'bg-white text-ink-soft ring-1 ring-line hover:text-ink'
                }`}
              >
                {t}
                <span className={`rounded-full px-1.5 text-[10.5px] ${tab === t ? 'bg-white/25' : 'bg-field'}`}>
                  {counts[t]}
                </span>
              </button>
            ))}
          </div>
        )}
        {view === 'table' && (
          <SearchInput value={table.query} onChange={table.setQuery} placeholder="Search participant, booking, badge…" />
        )}
        <div className="ml-auto">
          <SegmentedToggle value={view} onChange={setView} options={VIEWS} />
        </div>
      </div>

      {view === 'table' ? (
        <Panel>
          <DataTable
            columns={columns}
            rows={table.pageRows}
            rowKey={(b) => b.id}
            onRowClick={setSelected}
            sortKey={table.sort?.key}
            sortDir={table.sort?.dir}
            onSort={table.toggleSort}
            emptyLabel={`No ${tab} bookings.`}
          />
          <Pagination
            page={table.page}
            totalPages={table.totalPages}
            total={table.total}
            pageSize={table.pageSize}
            onPage={table.setPage}
          />
        </Panel>
      ) : (
        /* Kanban: three status columns; approve/reject moves cards live. */
        <div className="grid gap-4 md:grid-cols-3">
          {TABS.map((status) => {
            const cards = bookings.filter((b) => b.status === status);
            const tone = { pending: 'bg-warm-soft text-ink', approved: 'bg-good-soft text-good', rejected: 'bg-alert-soft text-alert' }[status];
            return (
              <div key={status} className="rounded-2xl border border-line bg-field/60 p-3">
                <div className="mb-3 flex items-center justify-between px-1">
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase ${tone}`}>{status}</span>
                  <span className="text-[12px] font-extrabold text-ink-soft">{cards.length}</span>
                </div>
                <div className="flex max-h-[70vh] flex-col gap-2.5 overflow-y-auto pr-0.5">
                  {cards.slice(0, 30).map((b) => (
                    <KanbanCard key={b.id} booking={b} onOpen={() => setSelected(b)} />
                  ))}
                  {cards.length === 0 && (
                    <div className="py-8 text-center text-[12px] font-semibold text-ink-faint">Empty</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selected && <BookingModal booking={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
