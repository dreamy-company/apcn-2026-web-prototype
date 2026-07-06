// Super-admin-specific UI pieces, kept apart from the shared bits.tsx
// (same split as hotel-admin's hotelBits.tsx).
import type { ReactNode } from 'react';
import Icon from './Icon';
import { D } from '../../data/icons';

/** Amber banner marking super-admin powers that bypass normal safeguards. */
export function OverrideNotice({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-brand/30 bg-brand-soft px-3.5 py-3">
      <Icon d={D.bolt} s={16} c="#f15a24" sw={2.2} className="mt-0.5" />
      <p className="text-[12px] leading-relaxed font-semibold text-ink">{children}</p>
    </div>
  );
}

/** Sticky bulk-action bar shown while table rows are check-selected. */
export function BulkBar({
  count,
  onClear,
  children,
}: {
  count: number;
  onClear: () => void;
  children: ReactNode; // action buttons
}) {
  if (count === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-line bg-brand-soft/60 px-4 py-2.5 md:px-5">
      <span className="text-[12.5px] font-extrabold text-brand">{count} selected</span>
      <button type="button" onClick={onClear} className="text-[12px] font-bold text-ink-soft underline hover:text-ink">
        Clear
      </button>
      <span className="mx-1 h-4 w-px bg-brand/25" />
      {children}
    </div>
  );
}

/** Small solid/outline action button for toolbars, drawers and bulk bars. */
export function ActionButton({
  label,
  icon,
  tone = 'neutral',
  onClick,
  disabled,
}: {
  label: string;
  icon?: string;
  tone?: 'brand' | 'alert' | 'good' | 'neutral';
  onClick?: () => void;
  disabled?: boolean;
}) {
  const tones = {
    brand: 'bg-brand text-white hover:opacity-90',
    alert: 'bg-alert text-white hover:opacity-90',
    good: 'bg-good text-white hover:opacity-90',
    neutral: 'border border-line bg-white text-ink hover:bg-field',
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex h-8 items-center gap-1.5 rounded-lg px-3 text-[12px] font-extrabold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${tones[tone]}`}
    >
      {icon && <Icon d={icon} s={13} sw={2.4} />}
      {label}
    </button>
  );
}

/** Brand-styled checkbox for bulk row selection. */
export function Check({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={on}
      onClick={(e) => {
        e.stopPropagation(); // don't trigger the row's drawer
        onChange(!on);
      }}
      className={`flex h-[18px] w-[18px] items-center justify-center rounded-[5px] border transition-colors ${
        on ? 'border-brand bg-brand' : 'border-ink-faint bg-white hover:border-brand'
      }`}
    >
      {on && <Icon d={D.check} s={11} c="#fff" sw={3} />}
    </button>
  );
}

/** Label/value pair for drawer detail sheets. */
export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-b border-line py-2.5 last:border-b-0">
      <div className="text-[10.5px] font-extrabold tracking-[0.6px] uppercase text-ink-faint">{label}</div>
      <div className="mt-0.5 text-[13.5px] font-bold text-ink">{children}</div>
    </div>
  );
}

/** Capacity bar for hotel quota rows; turns red when over-committed. */
export function QuotaBar({ booked, held, allocated }: { booked: number; held: number; allocated: number }) {
  const over = booked + held > allocated;
  const pct = (n: number) => `${Math.min(100, (n / Math.max(allocated, booked + held)) * 100)}%`;
  return (
    <div className="w-full min-w-[120px]">
      <div className="flex h-2 overflow-hidden rounded-full bg-field">
        <span className={over ? 'bg-alert' : 'bg-brand'} style={{ width: pct(booked) }} />
        <span className="bg-brand-top/60" style={{ width: pct(held) }} />
      </div>
      <div className={`mt-1 text-[10.5px] font-bold ${over ? 'text-alert' : 'text-ink-soft'}`}>
        {booked + held}/{allocated} committed{over ? ' · over block' : ''}
      </div>
    </div>
  );
}
