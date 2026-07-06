import { useMemo, useState } from 'react';
import { Panel, Badge, SearchInput, FilterSelect } from '../components/ui/bits';
import { BulkBar, ActionButton, Check, Field, OverrideNotice } from '../components/ui/superBits';
import { DataTable, Pagination, useTableState, type Column } from '../components/ui/DataTable';
import Drawer from '../components/ui/Drawer';
import { useStore } from '../state/StoreContext';
import { TICKET_TYPES, COUNTRIES, sponsorById, fmtUSD, type Ticket, type TicketStatus } from '../data/mock';
import { D } from '../data/icons';

const STATUSES: TicketStatus[] = ['registered', 'checked-in', 'no-show', 'suspended'];
const STATUS_TONE = { registered: 'brand', 'checked-in': 'good', 'no-show': 'warm', suspended: 'alert' } as const;

export default function TicketControl() {
  const { state, dispatch } = useStore();
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [country, setCountry] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState<Ticket | null>(null);

  // Doctors covered by a sponsor pay nothing — surfaced in the amount column.
  const sponsorOf = useMemo(() => {
    const map = new Map<string, string>();
    state.sponsorships.forEach((s) => {
      if (s.status === 'confirmed' || s.status === 'bypassed') map.set(s.badgeId, s.sponsorId);
    });
    return map;
  }, [state.sponsorships]);

  // Page filters run before the generic table state (search/sort/paginate).
  const rows = useMemo(
    () =>
      state.tickets.filter(
        (t) =>
          (!status || t.status === status) &&
          (!type || t.ticketType === type) &&
          (!country || t.country === country),
      ),
    [state.tickets, status, type, country],
  );
  const table = useTableState(rows, (t) => [t.id, t.name, t.email], 12);

  // Drawer must track live store state so override buttons reflect instantly.
  const openLive = open ? state.tickets.find((t) => t.id === open.id) ?? null : null;

  const allOnPage = table.pageRows.length > 0 && table.pageRows.every((r) => selected.has(r.id));
  const toggleAll = () =>
    setSelected((prev) => {
      const next = new Set(prev);
      table.pageRows.forEach((r) => (allOnPage ? next.delete(r.id) : next.add(r.id)));
      return next;
    });

  const bulkSet = (s: TicketStatus) => {
    dispatch({ type: 'SET_TICKET_STATUS', ids: [...selected], status: s });
    setSelected(new Set());
  };

  const columns: Column<Ticket>[] = [
    {
      key: 'sel',
      header: '',
      render: (t) => (
        <Check
          on={selected.has(t.id)}
          onChange={(v) =>
            setSelected((prev) => {
              const next = new Set(prev);
              v ? next.add(t.id) : next.delete(t.id);
              return next;
            })
          }
        />
      ),
      className: 'w-10',
    },
    {
      key: 'attendee',
      header: 'Attendee',
      sortValue: (t) => t.name,
      render: (t) => (
        <div>
          <div className="text-[12.5px] font-extrabold text-ink">{t.name}</div>
          <div className="mt-0.5 text-[11px] font-medium text-ink-soft">{t.id}</div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role · Country',
      render: (t) => (
        <span className="text-[12px] font-semibold text-ink-soft">
          {t.role} · {t.country}
        </span>
      ),
      className: 'hidden md:table-cell',
    },
    {
      key: 'type',
      header: 'Ticket',
      sortValue: (t) => t.ticketType,
      render: (t) => (
        <span className="text-[12px] font-bold text-ink">{TICKET_TYPES.find((tt) => tt.id === t.ticketType)!.name}</span>
      ),
    },
    {
      key: 'amount',
      header: 'Paid',
      sortValue: (t) => (sponsorOf.has(t.id) ? 0 : t.amount),
      render: (t) =>
        sponsorOf.has(t.id) ? (
          <Badge tone="warm">{sponsorById(sponsorOf.get(t.id)!)?.company}</Badge>
        ) : (
          <span className="text-[13px] font-extrabold text-ink">{fmtUSD(t.amount)}</span>
        ),
    },
    {
      key: 'status',
      header: 'Status',
      sortValue: (t) => t.status,
      render: (t) => <Badge tone={STATUS_TONE[t.status]}>{t.status}</Badge>,
    },
  ];

  return (
    <div className="animate-fade-in space-y-4">
      <OverrideNotice>
        Status changes made here bypass gate scanners and payment checks, apply immediately across the
        attendee &amp; check-in apps, and are recorded in the audit log.
      </OverrideNotice>

      <Panel>
        {/* Toolbar: search + the three page filters */}
        <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-3 md:px-5">
          <SearchInput value={table.query} onChange={table.setQuery} placeholder="Search badge ID, name, email…" />
          <FilterSelect value={status} onChange={(v) => { setStatus(v); table.resetPage(); }} options={STATUSES} allLabel="All statuses" />
          <FilterSelect value={type} onChange={(v) => { setType(v); table.resetPage(); }} options={TICKET_TYPES.map((t) => t.id)} allLabel="All ticket types" />
          <FilterSelect value={country} onChange={(v) => { setCountry(v); table.resetPage(); }} options={COUNTRIES} allLabel="All countries" />
          <button
            type="button"
            onClick={toggleAll}
            className="ml-auto text-[12px] font-bold text-brand underline hover:opacity-75"
          >
            {allOnPage ? 'Unselect page' : 'Select page'}
          </button>
        </div>

        {/* Bulk override bar appears once anything is selected */}
        <BulkBar count={selected.size} onClear={() => setSelected(new Set())}>
          <ActionButton label="Mark checked-in" icon={D.check} tone="good" onClick={() => bulkSet('checked-in')} />
          <ActionButton label="Mark registered" onClick={() => bulkSet('registered')} />
          <ActionButton label="Mark no-show" onClick={() => bulkSet('no-show')} />
          <ActionButton label="Suspend" icon={D.ban} tone="alert" onClick={() => bulkSet('suspended')} />
        </BulkBar>

        <DataTable
          columns={columns}
          rows={table.pageRows}
          rowKey={(t) => t.id}
          onRowClick={setOpen}
          sortKey={table.sort?.key}
          sortDir={table.sort?.dir}
          onSort={table.toggleSort}
        />
        <Pagination page={table.page} totalPages={table.totalPages} total={table.total} pageSize={table.pageSize} onPage={table.setPage} />
      </Panel>

      {/* Row drawer: full profile + one-click status override */}
      {openLive && (
        <Drawer title={openLive.id} onClose={() => setOpen(null)}>
          <Field label="Attendee">{openLive.name}</Field>
          <Field label="Email">{openLive.email}</Field>
          <Field label="Role · Country">{openLive.role} · {openLive.country}</Field>
          <Field label="Ticket">{TICKET_TYPES.find((tt) => tt.id === openLive.ticketType)!.name}</Field>
          <Field label="Paid">
            {sponsorOf.has(openLive.id)
              ? `Sponsored by ${sponsorById(sponsorOf.get(openLive.id)!)?.company}`
              : fmtUSD(openLive.amount)}
          </Field>
          <Field label="Registered">{openLive.registeredAt}</Field>
          <Field label="Current status">
            <Badge tone={STATUS_TONE[openLive.status]}>{openLive.status}</Badge>
          </Field>

          <div className="mt-5">
            <div className="mb-2 text-[11px] font-extrabold tracking-[0.6px] uppercase text-ink-faint">
              Override status
            </div>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <ActionButton
                  key={s}
                  label={s}
                  tone={s === 'suspended' ? 'alert' : s === 'checked-in' ? 'good' : 'neutral'}
                  disabled={s === openLive.status}
                  onClick={() => dispatch({ type: 'SET_TICKET_STATUS', ids: [openLive.id], status: s })}
                />
              ))}
            </div>
            <p className="mt-3 text-[11.5px] leading-relaxed font-semibold text-ink-soft">
              The change is written to the audit log under your account and takes effect immediately at all gates.
            </p>
          </div>
        </Drawer>
      )}
    </div>
  );
}
