import { useMemo, useState } from 'react';
import { Panel, Badge } from '../components/ui/bits';
import { QuotaBar, Field, ActionButton, OverrideNotice } from '../components/ui/superBits';
import { DataTable, type Column } from '../components/ui/DataTable';
import Drawer from '../components/ui/Drawer';
import Icon from '../components/ui/Icon';
import { D } from '../data/icons';
import { useStore } from '../state/StoreContext';
import { HOTELS, hotelById, fmtUSD, type Quota } from '../data/mock';

export default function HotelQuotas() {
  const { state, dispatch } = useStore();
  const [hotelFilter, setHotelFilter] = useState(''); // '' = all properties
  const [open, setOpen] = useState<Quota | null>(null);
  const [draft, setDraft] = useState(0); // allocated value being edited in the drawer
  const [confirmForce, setConfirmForce] = useState(false);

  const rows = useMemo(
    () => state.quotas.filter((q) => !hotelFilter || q.hotelId === hotelFilter),
    [state.quotas, hotelFilter],
  );

  // Live version of the opened row so the bar updates after dispatch.
  const openLive = open
    ? state.quotas.find((q) => q.hotelId === open.hotelId && q.roomTypeId === open.roomTypeId)!
    : null;
  const openHotel = openLive ? hotelById(openLive.hotelId)! : null;
  const openRoom = openHotel?.roomTypes.find((rt) => rt.id === openLive!.roomTypeId);
  // Shrinking below committed rooms requires the explicit "force" step.
  const isForce = openLive ? draft < openLive.booked + openLive.held : false;

  const openDrawer = (q: Quota) => {
    setOpen(q);
    setDraft(q.allocated);
    setConfirmForce(false);
  };

  const apply = () => {
    dispatch({ type: 'OVERRIDE_QUOTA', hotelId: openLive!.hotelId, roomTypeId: openLive!.roomTypeId, allocated: draft });
    setOpen(null);
  };

  const columns: Column<Quota>[] = [
    {
      key: 'hotel',
      header: 'Property · Room',
      sortValue: (q) => `${q.hotelId}-${q.roomTypeId}`,
      render: (q) => {
        const h = hotelById(q.hotelId)!;
        const rt = h.roomTypes.find((r) => r.id === q.roomTypeId)!;
        return (
          <div>
            <div className="text-[12.5px] font-extrabold text-ink">{h.name}</div>
            <div className="mt-0.5 text-[11px] font-medium text-ink-soft">
              {rt.name} · {fmtUSD(rt.rate)}/night
            </div>
          </div>
        );
      },
    },
    {
      key: 'allocated',
      header: 'Allocated',
      sortValue: (q) => q.allocated,
      render: (q) => (
        <span className="flex items-center gap-1.5 text-[13px] font-extrabold text-ink">
          {q.allocated}
          {q.overridden && <Icon d={D.bolt} s={12} c="#f15a24" sw={2.4} />}
        </span>
      ),
    },
    {
      key: 'booked',
      header: 'Booked / Held',
      sortValue: (q) => q.booked + q.held,
      render: (q) => (
        <span className="text-[12.5px] font-bold text-ink-soft">
          {q.booked} · {q.held} held
        </span>
      ),
      className: 'hidden md:table-cell',
    },
    {
      key: 'usage',
      header: 'Block Usage',
      sortValue: (q) => (q.booked + q.held) / q.allocated,
      render: (q) => <QuotaBar booked={q.booked} held={q.held} allocated={q.allocated} />,
    },
    {
      key: 'state',
      header: 'State',
      render: (q) =>
        q.booked + q.held > q.allocated ? (
          <Badge tone="alert">over block</Badge>
        ) : q.overridden ? (
          <Badge tone="brand">overridden</Badge>
        ) : (
          <Badge tone="good">healthy</Badge>
        ),
    },
  ];

  return (
    <div className="animate-fade-in space-y-4">
      <OverrideNotice>
        Editing an allocation here overrides the hotel admin's block, including shrinking below already
        committed rooms. Forced reductions are flagged critical in the audit log.
      </OverrideNotice>

      {/* Property switcher chips */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setHotelFilter('')}
          className={`h-9 rounded-lg border px-3.5 text-[12.5px] font-bold ${
            !hotelFilter ? 'border-brand bg-brand text-white' : 'border-line bg-white text-ink-soft hover:bg-field'
          }`}
        >
          All properties
        </button>
        {HOTELS.map((h) => (
          <button
            key={h.id}
            type="button"
            onClick={() => setHotelFilter(h.id)}
            className={`h-9 rounded-lg border px-3.5 text-[12.5px] font-bold ${
              hotelFilter === h.id ? 'border-brand bg-brand text-white' : 'border-line bg-white text-ink-soft hover:bg-field'
            }`}
          >
            {h.name}
          </button>
        ))}
      </div>

      <Panel title={`Room Blocks · ${hotelFilter ? hotelById(hotelFilter)!.name : 'All Properties'}`}>
        <DataTable columns={columns} rows={rows} rowKey={(q) => `${q.hotelId}-${q.roomTypeId}`} onRowClick={openDrawer} />
      </Panel>

      {/* Quota override drawer */}
      {openLive && openHotel && openRoom && (
        <Drawer title={`${openHotel.name} · ${openRoom.name}`} onClose={() => setOpen(null)}>
          <Field label="Property admin">{openHotel.admin}</Field>
          <Field label="Nightly rate">{fmtUSD(openRoom.rate)}</Field>
          <Field label="Confirmed bookings">{openLive.booked} rooms</Field>
          <Field label="Held (pending verification)">{openLive.held} rooms</Field>
          <Field label="Current allocation">{openLive.allocated} rooms</Field>

          <div className="mt-5">
            <div className="mb-2 text-[11px] font-extrabold tracking-[0.6px] uppercase text-ink-faint">
              Override allocation
            </div>
            {/* Stepper: minus / value / plus */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => { setDraft((d) => Math.max(0, d - 1)); setConfirmForce(false); }}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-line text-lg font-extrabold hover:bg-field"
              >
                −
              </button>
              <span className={`min-w-16 text-center text-[26px] font-extrabold ${isForce ? 'text-alert' : 'text-ink'}`}>
                {draft}
              </span>
              <button
                type="button"
                onClick={() => { setDraft((d) => d + 1); setConfirmForce(false); }}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-line text-lg font-extrabold hover:bg-field"
              >
                +
              </button>
            </div>

            {/* Danger path: shrinking below committed rooms needs a second, explicit step */}
            {isForce && (
              <div className="mt-4 rounded-xl border border-alert/40 bg-alert-soft px-3.5 py-3">
                <div className="flex items-center gap-2 text-[12.5px] font-extrabold text-alert">
                  <Icon d={D.alertTri} s={15} sw={2.2} />
                  Below {openLive.booked + openLive.held} committed rooms
                </div>
                <p className="mt-1 text-[11.5px] leading-relaxed font-semibold text-ink-soft">
                  {openLive.booked + openLive.held - draft} existing booking(s) will need relocation. This is a
                  forced override and is logged as critical.
                </p>
                <label className="mt-2 flex items-center gap-2 text-[12px] font-bold text-ink">
                  <input type="checkbox" checked={confirmForce} onChange={(e) => setConfirmForce(e.target.checked)} className="accent-[#e05c5c]" />
                  I understand, force this quota
                </label>
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <ActionButton
                label={isForce ? 'Force override' : 'Apply override'}
                icon={D.bolt}
                tone={isForce ? 'alert' : 'brand'}
                disabled={draft === openLive.allocated || (isForce && !confirmForce)}
                onClick={apply}
              />
              <ActionButton label="Cancel" onClick={() => setOpen(null)} />
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
}
