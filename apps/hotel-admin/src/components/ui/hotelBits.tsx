import type { ReactNode } from 'react';
import Icon from './Icon';
import { DH } from '../../data/icons';

/** Center dialog for booking summaries and quota allocation forms. */
export function Modal({
  title,
  onClose,
  children,
  footer,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/45" />
      <div
        className="relative flex max-h-[85vh] w-full max-w-lg animate-fade-in flex-col rounded-2xl bg-white shadow-[0_30px_70px_-20px_rgba(0,0,0,0.45)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-[15px] font-extrabold text-ink">{title}</h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-line hover:bg-field"
          >
            <Icon d={DH.x} s={15} sw={2.2} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="flex justify-end gap-2.5 border-t border-line px-5 py-3.5">{footer}</div>}
      </div>
    </div>
  );
}

/** Two-option view switcher (table ⇄ kanban). */
export function SegmentedToggle<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string; icon: string }[];
}) {
  return (
    <div className="flex gap-1 rounded-lg bg-field p-1">
      {options.map((o) => (
        <button
          type="button"
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`flex h-8 items-center gap-1.5 rounded-md px-3 text-[12px] font-extrabold transition-all ${
            value === o.value ? 'bg-white text-brand shadow-[0_2px_6px_-2px_rgba(20,16,12,0.25)]' : 'text-ink-soft hover:text-ink'
          }`}
        >
          <Icon d={o.icon} s={14} sw={2.2} />
          {o.label}
        </button>
      ))}
    </div>
  );
}

/**
 * Stacked allocation bar: booked (solid) + held-pending (striped) against the
 * allocated total. Turns red as the block approaches capacity.
 */
export function QuotaBar({ allocated, booked, held }: { allocated: number; booked: number; held: number }) {
  const bookedPct = Math.min(100, (booked / allocated) * 100);
  const heldPct = Math.min(100 - bookedPct, (held / allocated) * 100);
  const nearFull = booked + held >= allocated * 0.9;
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-field">
      <div className="flex h-full">
        <div
          className={`h-full transition-all duration-500 ${nearFull ? 'bg-alert' : 'bg-brand'}`}
          style={{ width: `${bookedPct}%` }}
        />
        {/* Striped segment = rooms held for pending verifications. */}
        <div
          className="h-full bg-brand-top/70 transition-all duration-500"
          style={{
            width: `${heldPct}%`,
            backgroundImage:
              'repeating-linear-gradient(45deg, rgba(255,255,255,0.5) 0 4px, transparent 4px 8px)',
          }}
        />
      </div>
    </div>
  );
}

/** Optimistic write indicator: spinner while awaiting mock-server ack, then a check. */
export function SyncBadge({ syncing, flashed }: { syncing: boolean; flashed: boolean }) {
  if (syncing) {
    return (
      <span className="flex items-center gap-1.5 rounded-full bg-warm-soft px-2 py-0.5 text-[10.5px] font-extrabold text-ink-soft">
        <span className="h-2.5 w-2.5 animate-spin rounded-full border-[1.5px] border-ink-faint border-t-brand" />
        syncing
      </span>
    );
  }
  if (flashed) {
    return (
      <span className="flex animate-fade-in items-center gap-1 rounded-full bg-good-soft px-2 py-0.5 text-[10.5px] font-extrabold text-good">
        <Icon d={DH.check} s={10} c="#3f9a78" sw={3} />
        synced
      </span>
    );
  }
  return null;
}
