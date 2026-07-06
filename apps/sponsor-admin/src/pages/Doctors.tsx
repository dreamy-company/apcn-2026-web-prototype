import { useMemo, useState } from 'react';
import { Badge, Panel, SearchInput, FilterSelect } from '../components/ui/bits';
import { DataTable, Pagination, useTableState, type Column } from '../components/ui/DataTable';
import Icon from '../components/ui/Icon';
import { DH } from '../data/icons';
import {
  PACKAGES, PARTNER_HOTELS, SPONSOR, packageById, fmtUSD,
  type PackageId, type SponsoredDoctor,
} from '../data/mock';
import { useStore } from '../state/StoreContext';

const STATUS_TONE = { confirmed: 'good', submitted: 'warm', draft: 'neutral', clash: 'alert' } as const;
const STATUSES = ['draft', 'submitted', 'confirmed', 'clash'] as const;

function SyncChip({ id }: { id: string }) {
  const { syncing, flash } = useStore();
  if (syncing[id]) {
    return (
      <span className="flex items-center gap-1.5 rounded-full bg-warm-soft px-2 py-0.5 text-[10.5px] font-extrabold text-ink-soft">
        <span className="h-2.5 w-2.5 animate-spin rounded-full border-[1.5px] border-ink-faint border-t-brand" />
        syncing
      </span>
    );
  }
  if (flash[id]) {
    return (
      <span className="flex animate-fade-in items-center gap-1 rounded-full bg-good-soft px-2 py-0.5 text-[10.5px] font-extrabold text-good">
        <Icon d={DH.check} s={10} c="#3f9a78" sw={3} />
        synced
      </span>
    );
  }
  return null;
}

/** Add-doctor modal: creates a draft that joins the next submission batch. */
function AddDoctorModal({ onClose }: { onClose: () => void }) {
  const { addDraft } = useStore();
  const [name, setName] = useState('');
  const [institution, setInstitution] = useState('');
  const [country, setCountry] = useState('Indonesia');
  const [pkg, setPkg] = useState<PackageId>('ticket');
  const [hotelId, setHotelId] = useState<string>(PARTNER_HOTELS[0].id);

  function submit() {
    if (!name.trim()) return;
    addDraft({
      name: name.trim().startsWith('Dr') ? name.trim() : `Dr. ${name.trim()}`,
      institution: institution.trim() || '—',
      country,
      pkg,
      hotelId: pkg === 'ticket' ? undefined : hotelId,
    });
    onClose();
  }

  const input =
    'h-10 w-full rounded-lg border border-line bg-field px-3 text-[13px] font-semibold text-ink outline-none focus:border-brand focus:bg-white';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/45" />
      <div
        className="relative w-full max-w-lg animate-fade-in rounded-2xl bg-white shadow-[0_30px_70px_-20px_rgba(0,0,0,0.45)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-[15px] font-extrabold text-ink">Add Sponsored Doctor</h2>
          <button type="button" aria-label="Close" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg border border-line hover:bg-field">
            <Icon d={DH.x} s={15} sw={2.2} />
          </button>
        </div>
        <div className="space-y-3.5 px-5 py-4">
          <label className="block">
            <div className="mb-1.5 text-[12px] font-bold text-ink-soft">Doctor Name</div>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Dr. Full Name" className={input} />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <div className="mb-1.5 text-[12px] font-bold text-ink-soft">Institution</div>
              <input value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder="Hospital / University" className={input} />
            </label>
            <label className="block">
              <div className="mb-1.5 text-[12px] font-bold text-ink-soft">Country</div>
              <input value={country} onChange={(e) => setCountry(e.target.value)} className={input} />
            </label>
          </div>
          <div>
            <div className="mb-1.5 text-[12px] font-bold text-ink-soft">Package</div>
            <div className="grid gap-2 sm:grid-cols-3">
              {PACKAGES.map((p) => {
                const on = pkg === p.id;
                return (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => setPkg(p.id)}
                    className={`rounded-xl border-[1.5px] px-3 py-2.5 text-left transition-all ${
                      on ? 'border-brand bg-brand-soft' : 'border-line bg-white hover:border-ink-faint'
                    }`}
                  >
                    <span className={`block text-[12.5px] font-extrabold ${on ? 'text-brand' : 'text-ink'}`}>{p.name}</span>
                    <span className="block text-[10.5px] text-ink-soft">{p.desc}</span>
                    <span className={`mt-1 block text-[12px] font-extrabold ${on ? 'text-brand' : 'text-ink'}`}>
                      {fmtUSD(p.cost)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          {pkg !== 'ticket' && (
            <label className="block">
              <div className="mb-1.5 text-[12px] font-bold text-ink-soft">Partner Hotel</div>
              <select value={hotelId} onChange={(e) => setHotelId(e.target.value)} className={input}>
                {PARTNER_HOTELS.map((h) => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>
            </label>
          )}
        </div>
        <div className="flex justify-end gap-2.5 border-t border-line px-5 py-3.5">
          <button type="button" onClick={onClose} className="flex h-10 items-center rounded-xl border border-line px-4 text-[13px] font-extrabold text-ink hover:bg-field">
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            className="flex h-10 items-center gap-1.5 rounded-xl bg-brand px-5 text-[13px] font-extrabold text-white shadow-[0_8px_18px_-8px_rgba(241,90,36,0.6)] hover:bg-[#e0501d]"
          >
            <Icon d={DH.plus} s={14} c="#fff" sw={2.4} />
            Add as draft
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Doctors() {
  const { doctors, submitDrafts, removeDraft } = useStore();
  const [status, setStatus] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const drafts = doctors.filter((d) => d.status === 'draft');
  const used = doctors.filter((d) => d.status !== 'draft').length;
  const seatsLeft = SPONSOR.seats - used;

  const filtered = useMemo(
    () => doctors.filter((d) => !status || d.status === status),
    [doctors, status],
  );
  const table = useTableState(filtered, (d) => [d.name, d.institution, d.country, d.badgeId ?? '']);

  const columns: Column<SponsoredDoctor>[] = [
    {
      key: 'name',
      header: 'Doctor',
      sortValue: (d) => d.name,
      render: (d) => (
        <div className="flex items-center gap-2">
          <div>
            <div className="font-extrabold text-ink">{d.name}</div>
            <div className="mt-0.5 text-[11.5px] font-medium text-ink-soft">
              {d.institution} · {d.country}
            </div>
          </div>
          <SyncChip id={d.id} />
        </div>
      ),
    },
    {
      key: 'badge',
      header: 'Badge',
      render: (d) =>
        d.badgeId ? (
          <span className="font-semibold tracking-wide text-ink-soft">{d.badgeId}</span>
        ) : (
          <span className="text-[11.5px] font-semibold text-ink-faint">— on confirmation</span>
        ),
    },
    {
      key: 'pkg',
      header: 'Package',
      sortValue: (d) => d.pkg,
      render: (d) => (
        <div>
          <div className="text-[12.5px] font-bold text-ink">{packageById(d.pkg).name}</div>
          {d.hotelId && (
            <div className="mt-0.5 text-[11.5px] font-medium text-ink-soft">
              {PARTNER_HOTELS.find((h) => h.id === d.hotelId)?.name}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'cost',
      header: 'Cost',
      sortValue: (d) => packageById(d.pkg).cost,
      render: (d) => <span className="font-extrabold text-ink">{fmtUSD(packageById(d.pkg).cost)}</span>,
    },
    { key: 'added', header: 'Added', render: (d) => <span className="font-semibold text-ink-soft">{d.addedAt}</span> },
    {
      key: 'status',
      header: 'Status',
      sortValue: (d) => d.status,
      render: (d) => (
        <div className="flex items-center gap-2">
          <Badge tone={STATUS_TONE[d.status]}>{d.status === 'clash' ? 'clash hold' : d.status}</Badge>
          {d.status === 'draft' && (
            <button
              type="button"
              aria-label="Remove draft"
              onClick={(e) => {
                e.stopPropagation();
                removeDraft(d.id);
              }}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-line text-ink-faint hover:border-alert hover:text-alert"
            >
              <Icon d={DH.x} s={12} sw={2.4} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Toolbar: seat budget, filters, batch submit, add */}
      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        <span className={`rounded-full border px-3.5 py-2 text-[12px] font-bold ${seatsLeft <= 3 ? 'border-alert/30 bg-alert-soft text-alert' : 'border-line bg-white text-ink-soft'}`}>
          Seats: <span className="font-extrabold text-ink">{used}</span> / {SPONSOR.seats}
        </span>
        <SearchInput value={table.query} onChange={table.setQuery} placeholder="Search doctor, institution, badge…" />
        <FilterSelect value={status} onChange={setStatus} options={STATUSES} allLabel="All statuses" />
        <div className="ml-auto flex gap-2">
          {drafts.length > 0 && (
            <button
              type="button"
              onClick={() => submitDrafts(drafts.map((d) => d.id))}
              disabled={seatsLeft < drafts.length}
              className="flex h-9 items-center gap-1.5 rounded-lg bg-good px-3.5 text-[12.5px] font-extrabold text-white shadow-[0_6px_14px_-6px_rgba(63,154,120,0.6)] enabled:hover:bg-[#358566] disabled:opacity-50"
            >
              <Icon d={DH.check} s={14} c="#fff" sw={2.6} />
              Submit {drafts.length} draft{drafts.length > 1 ? 's' : ''}
            </button>
          )}
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="flex h-9 items-center gap-1.5 rounded-lg bg-brand px-3.5 text-[12.5px] font-extrabold text-white shadow-[0_6px_14px_-6px_rgba(241,90,36,0.6)] hover:bg-[#e0501d]"
          >
            <Icon d={DH.plus} s={14} c="#fff" sw={2.4} />
            Add doctor
          </button>
        </div>
      </div>

      <Panel>
        <DataTable
          columns={columns}
          rows={table.pageRows}
          rowKey={(d) => d.id}
          sortKey={table.sort?.key}
          sortDir={table.sort?.dir}
          onSort={table.toggleSort}
          emptyLabel="No doctors match your filters."
        />
        <Pagination
          page={table.page}
          totalPages={table.totalPages}
          total={table.total}
          pageSize={table.pageSize}
          onPage={table.setPage}
        />
      </Panel>

      {modalOpen && <AddDoctorModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}
