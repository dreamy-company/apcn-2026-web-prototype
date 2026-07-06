import { useMemo, useState } from 'react';
import { Panel, Badge, SearchInput, FilterSelect } from '../components/ui/bits';
import { BulkBar, ActionButton, Check, Field, OverrideNotice } from '../components/ui/superBits';
import { DataTable, Pagination, useTableState, type Column } from '../components/ui/DataTable';
import Drawer from '../components/ui/Drawer';
import Icon from '../components/ui/Icon';
import { D } from '../data/icons';
import { useStore } from '../state/StoreContext';
import { SPONSORS, sponsorById, hotelById, fmtUSD, type Sponsorship, type SponsorshipStatus } from '../data/mock';

const STATUSES: SponsorshipStatus[] = ['confirmed', 'pending', 'clash', 'bypassed'];
const STATUS_TONE = { confirmed: 'good', pending: 'warm', clash: 'alert', bypassed: 'brand' } as const;

export default function SponsorAllocations() {
  const { state, dispatch } = useStore();
  const [sponsor, setSponsor] = useState('');
  const [status, setStatus] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState<Sponsorship | null>(null);

  const rows = useMemo(
    () =>
      state.sponsorships.filter(
        (s) => (!sponsor || s.sponsorId === sponsor) && (!status || s.status === status),
      ),
    [state.sponsorships, sponsor, status],
  );
  const table = useTableState(rows, (s) => [s.id, s.doctor, s.badgeId], 12);

  const openLive = open ? state.sponsorships.find((s) => s.id === open.id) ?? null : null;
  const clashCount = state.sponsorships.filter((s) => s.status === 'clash').length;

  const bulkConfirm = () => {
    dispatch({ type: 'CONFIRM_SPONSORSHIP', ids: [...selected] });
    setSelected(new Set());
  };

  const columns: Column<Sponsorship>[] = [
    {
      key: 'sel',
      header: '',
      render: (s) => (
        <Check
          on={selected.has(s.id)}
          onChange={(v) =>
            setSelected((prev) => {
              const next = new Set(prev);
              v ? next.add(s.id) : next.delete(s.id);
              return next;
            })
          }
        />
      ),
      className: 'w-10',
    },
    {
      key: 'doctor',
      header: 'Sponsored Doctor',
      sortValue: (s) => s.doctor,
      render: (s) => (
        <div>
          <div className="text-[12.5px] font-extrabold text-ink">{s.doctor}</div>
          <div className="mt-0.5 text-[11px] font-medium text-ink-soft">{s.badgeId} · {s.id}</div>
        </div>
      ),
    },
    {
      key: 'sponsor',
      header: 'Sponsor',
      sortValue: (s) => s.sponsorId,
      render: (s) => {
        const sp = sponsorById(s.sponsorId)!;
        return (
          <div>
            <div className="text-[12.5px] font-bold text-ink">{sp.company}</div>
            {/* Clash rows show the competing claim inline */}
            {s.status === 'clash' && s.clashWith && (
              <div className="mt-0.5 flex items-center gap-1 text-[11px] font-bold text-alert">
                <Icon d={D.alertTri} s={11} sw={2.4} />
                also claimed by {sponsorById(s.clashWith)?.company}
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: 'pkg',
      header: 'Package',
      sortValue: (s) => s.pkg,
      render: (s) => (
        <div>
          <span className="text-[12px] font-bold text-ink">{s.pkg}</span>
          {s.hotelId && (
            <div className="mt-0.5 text-[11px] font-medium text-ink-soft">{hotelById(s.hotelId)?.name}</div>
          )}
        </div>
      ),
      className: 'hidden md:table-cell',
    },
    {
      key: 'requested',
      header: 'Requested',
      sortValue: (s) => s.requestedAt,
      render: (s) => <span className="text-[12px] font-semibold text-ink-soft">{s.requestedAt}</span>,
      className: 'hidden lg:table-cell',
    },
    {
      key: 'status',
      header: 'Status',
      sortValue: (s) => s.status,
      render: (s) => <Badge tone={STATUS_TONE[s.status]}>{s.status}</Badge>,
    },
  ];

  return (
    <div className="animate-fade-in space-y-4">
      <OverrideNotice>
        Clash detection blocks a doctor from being claimed by two sponsors. As Super Admin you can bypass
        the block (both sponsors keep the claim) or reassign the doctor — both rulings are logged as critical.
      </OverrideNotice>

      {/* Sponsor allocation summary cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {SPONSORS.map((sp) => {
          const used = state.sponsorships.filter((x) => x.sponsorId === sp.id && x.status !== 'clash').length;
          return (
            <button
              key={sp.id}
              type="button"
              onClick={() => setSponsor(sponsor === sp.id ? '' : sp.id)}
              className={`rounded-xl border p-3 text-left transition-colors ${
                sponsor === sp.id ? 'border-brand bg-brand-soft' : 'border-line bg-white hover:bg-field'
              }`}
            >
              <div className="truncate text-[12px] font-extrabold text-ink">{sp.company}</div>
              <div className="mt-1 text-[18px] font-extrabold text-ink">
                {used}<span className="text-[12px] font-bold text-ink-faint"> / {sp.seats} seats</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-field">
                <div className={`h-full ${used > sp.seats ? 'bg-alert' : 'bg-brand'}`} style={{ width: `${Math.min(100, (used / sp.seats) * 100)}%` }} />
              </div>
            </button>
          );
        })}
      </div>

      <Panel
        title="Doctor Sponsorships"
        action={
          clashCount > 0 && (
            <button
              type="button"
              onClick={() => { setStatus('clash'); table.resetPage(); }}
              className="flex items-center gap-1.5 rounded-full bg-alert-soft px-2.5 py-1 text-[11px] font-extrabold text-alert hover:opacity-80"
            >
              <Icon d={D.alertTri} s={11} sw={2.4} />
              {clashCount} unresolved clash{clashCount === 1 ? '' : 'es'}
            </button>
          )
        }
      >
        <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-3 md:px-5">
          <SearchInput value={table.query} onChange={table.setQuery} placeholder="Search doctor, badge, record…" />
          <FilterSelect value={status} onChange={(v) => { setStatus(v); table.resetPage(); }} options={STATUSES} allLabel="All statuses" />
        </div>

        <BulkBar count={selected.size} onClear={() => setSelected(new Set())}>
          <ActionButton label="Confirm pending" icon={D.check} tone="good" onClick={bulkConfirm} />
        </BulkBar>

        <DataTable
          columns={columns}
          rows={table.pageRows}
          rowKey={(s) => s.id}
          onRowClick={setOpen}
          sortKey={table.sort?.key}
          sortDir={table.sort?.dir}
          onSort={table.toggleSort}
        />
        <Pagination page={table.page} totalPages={table.totalPages} total={table.total} pageSize={table.pageSize} onPage={table.setPage} />
      </Panel>

      {/* Sponsorship drawer: detail + clash ruling */}
      {openLive && (
        <Drawer title={openLive.id} onClose={() => setOpen(null)}>
          <Field label="Doctor">{openLive.doctor}</Field>
          <Field label="Badge">{openLive.badgeId}</Field>
          <Field label="Sponsor">{sponsorById(openLive.sponsorId)?.company} ({sponsorById(openLive.sponsorId)?.tier})</Field>
          <Field label="Package">
            {openLive.pkg}
            {openLive.hotelId ? ` · ${hotelById(openLive.hotelId)?.name}` : ''}
          </Field>
          <Field label="Requested">{openLive.requestedAt}</Field>
          <Field label="Status">
            <Badge tone={STATUS_TONE[openLive.status]}>{openLive.status}</Badge>
          </Field>

          {/* Clash ruling — only rendered while the record is contested */}
          {openLive.status === 'clash' && openLive.clashWith && (
            <div className="mt-5 rounded-xl border border-alert/40 bg-alert-soft px-3.5 py-3">
              <div className="flex items-center gap-2 text-[12.5px] font-extrabold text-alert">
                <Icon d={D.alertTri} s={15} sw={2.2} />
                Sponsorship clash
              </div>
              <p className="mt-1 text-[11.5px] leading-relaxed font-semibold text-ink-soft">
                {sponsorById(openLive.sponsorId)?.company} and {sponsorById(openLive.clashWith)?.company} both
                claim {openLive.doctor}. Standard flow blocks this — your ruling overrides it.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <ActionButton
                  label="Bypass — allow both"
                  icon={D.bolt}
                  tone="alert"
                  onClick={() => dispatch({ type: 'RESOLVE_CLASH', id: openLive.id, mode: 'bypass' })}
                />
                <ActionButton
                  label={`Reassign to ${sponsorById(openLive.clashWith)?.company}`}
                  icon={D.swap}
                  onClick={() => dispatch({ type: 'RESOLVE_CLASH', id: openLive.id, mode: 'reassign' })}
                />
              </div>
            </div>
          )}

          {openLive.status === 'pending' && (
            <div className="mt-5">
              <ActionButton
                label="Confirm sponsorship"
                icon={D.check}
                tone="good"
                onClick={() => dispatch({ type: 'CONFIRM_SPONSORSHIP', ids: [openLive.id] })}
              />
            </div>
          )}

          {/* Seat economics for context while ruling */}
          <div className="mt-5 rounded-xl bg-field px-3.5 py-3">
            <div className="text-[11px] font-extrabold tracking-[0.6px] uppercase text-ink-faint">Sponsor account</div>
            <div className="mt-1 text-[12.5px] font-bold text-ink">
              {fmtUSD(sponsorById(openLive.sponsorId)?.paid ?? 0)} received of {fmtUSD(sponsorById(openLive.sponsorId)?.committed ?? 0)} committed
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
}
