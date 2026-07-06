import { useState } from 'react';
import { Panel } from '../components/ui/bits';
import { Modal, QuotaBar, SyncBadge } from '../components/ui/hotelBits';
import Icon from '../components/ui/Icon';
import { DH } from '../data/icons';
import { type Hotel } from '../data/hotels';
import type { Quota } from '../data/mock';
import { useStore, quotaKey } from '../state/StoreContext';
import { useScopedData, roomTypeName } from '../state/selectors';

function Stepper({ onDelta, disabled }: { onDelta: (d: number) => void; disabled?: boolean }) {
  return (
    <div className="flex items-center gap-1">
      {[
        { d: -1, icon: DH.minus, label: 'Decrease allocation' },
        { d: +1, icon: DH.plus, label: 'Increase allocation' },
      ].map(({ d, icon, label }) => (
        <button
          type="button"
          key={d}
          aria-label={label}
          disabled={disabled}
          onClick={() => onDelta(d)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink transition-colors enabled:hover:border-brand enabled:hover:bg-brand-soft enabled:hover:text-brand disabled:opacity-40"
        >
          <Icon d={icon} s={14} sw={2.4} />
        </button>
      ))}
    </div>
  );
}

function QuotaRow({ quota }: { quota: Quota }) {
  const { adjustQuota, syncing, flash } = useStore();
  const key = quotaKey(quota.hotelId, quota.roomTypeId);
  const free = quota.allocated - quota.booked - quota.held;

  return (
    <div
      className={`grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 border-b border-line px-4 py-3.5 transition-colors last:border-b-0 md:grid-cols-[220px_1fr_150px_auto] md:px-5 ${
        flash[key] ? 'bg-brand-soft/50' : ''
      }`}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="truncate text-[13.5px] font-extrabold text-ink">
            {roomTypeName(quota.hotelId, quota.roomTypeId)}
          </span>
          <SyncBadge syncing={!!syncing[key]} flashed={!!flash[key] && !syncing[key]} />
        </div>
        <div className="mt-0.5 text-[11.5px] font-semibold text-ink-soft">
          {quota.booked} booked · {quota.held} held ·{' '}
          <span className={free <= 3 ? 'font-extrabold text-alert' : 'text-good'}>{free} free</span>
        </div>
      </div>
      <div className="col-span-2 md:col-span-1">
        <QuotaBar allocated={quota.allocated} booked={quota.booked} held={quota.held} />
      </div>
      <div className="hidden text-right md:block">
        <span className="text-lg font-extrabold text-ink">{quota.allocated}</span>
        <span className="ml-1 text-[11px] font-semibold text-ink-faint">allocated</span>
      </div>
      <Stepper onDelta={(d) => adjustQuota(quota.hotelId, quota.roomTypeId, d)} disabled={!!syncing[key]} />
    </div>
  );
}

/** "Add allocation" — bulk-extend a room block via modal. */
function AddAllocationModal({ hotel, onClose }: { hotel: Hotel; onClose: () => void }) {
  const { adjustQuota } = useStore();
  const [roomTypeId, setRoomTypeId] = useState(hotel.roomTypes[0].id);
  const [count, setCount] = useState('10');

  return (
    <Modal
      title={`Add Allocation · ${hotel.name}`}
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 items-center rounded-xl border border-line px-4 text-[13px] font-extrabold text-ink hover:bg-field"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              adjustQuota(hotel.id, roomTypeId, Number(count) || 0);
              onClose();
            }}
            className="flex h-10 items-center rounded-xl bg-brand px-5 text-[13px] font-extrabold text-white shadow-[0_8px_18px_-8px_rgba(241,90,36,0.6)] hover:bg-[#e0501d]"
          >
            Add {count || 0} rooms
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <label className="block">
          <div className="mb-1.5 text-[12px] font-bold text-ink-soft">Room Type</div>
          <select
            value={roomTypeId}
            onChange={(e) => setRoomTypeId(e.target.value)}
            className="h-10 w-full rounded-lg border border-line bg-field px-3 text-[13px] font-semibold outline-none focus:border-brand"
          >
            {hotel.roomTypes.map((rt) => (
              <option key={rt.id} value={rt.id}>
                {rt.name} · USD {rt.rate}/night
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <div className="mb-1.5 text-[12px] font-bold text-ink-soft">Rooms to add to the congress block</div>
          <input
            value={count}
            onChange={(e) => setCount(e.target.value.replace(/\D/g, ''))}
            inputMode="numeric"
            className="h-10 w-full rounded-lg border border-line bg-field px-3 text-[13px] font-bold outline-none focus:border-brand focus:bg-white"
          />
        </label>
        <div className="rounded-xl bg-warm-soft px-3.5 py-2.5 text-[12px] font-semibold text-ink">
          The addition is applied optimistically and confirmed by the allocation service —
          watch the row's <span className="font-extrabold">syncing</span> badge.
        </div>
      </div>
    </Modal>
  );
}

export default function QuotaManagement() {
  const { hotels, quotas } = useScopedData();
  const [modalHotel, setModalHotel] = useState<Hotel | null>(null);

  return (
    <div className="animate-fade-in space-y-4">
      {/* Legend for the stacked quota bars */}
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-line bg-white px-4 py-2.5 text-[11.5px] font-bold text-ink-soft">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-4 rounded-sm bg-brand" /> Booked</span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-4 rounded-sm bg-brand-top/70 [background-image:repeating-linear-gradient(45deg,rgba(255,255,255,0.5)_0_4px,transparent_4px_8px)]" />
          Held (pending verification)
        </span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-4 rounded-sm bg-field" /> Available</span>
        <span className="ml-auto hidden items-center gap-1.5 text-good md:flex">
          <span className="h-2 w-2 animate-pulse rounded-full bg-good" />
          Rows glow when the live feed updates them
        </span>
      </div>

      {hotels.map((h) => (
        <Panel
          key={h.id}
          title={h.name}
          action={
            <button
              type="button"
              onClick={() => setModalHotel(h)}
              className="flex h-8 items-center gap-1.5 rounded-lg bg-brand px-3 text-[12px] font-extrabold text-white shadow-[0_6px_14px_-6px_rgba(241,90,36,0.6)] hover:bg-[#e0501d]"
            >
              <Icon d={DH.plus} s={13} c="#fff" sw={2.4} />
              Add allocation
            </button>
          }
        >
          {quotas
            .filter((q) => q.hotelId === h.id)
            .map((q) => (
              <QuotaRow key={quotaKey(q.hotelId, q.roomTypeId)} quota={q} />
            ))}
        </Panel>
      ))}

      {modalHotel && <AddAllocationModal hotel={modalHotel} onClose={() => setModalHotel(null)} />}
    </div>
  );
}
