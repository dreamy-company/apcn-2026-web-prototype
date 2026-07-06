import type { ReactNode } from 'react';
import Icon from './Icon';
import { D } from '../../data/icons';

/** KPI card for the Overview grid: label, big value, delta vs last period. */
export function StatCard({
  label,
  value,
  delta,
  deltaLabel = 'vs last week',
  icon,
  negative,
}: {
  label: string;
  value: string;
  delta: string;
  deltaLabel?: string;
  icon: string;
  negative?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4 shadow-[0_2px_10px_-6px_rgba(20,16,12,0.15)] md:p-5">
      <div className="flex items-start justify-between">
        <span className="text-[12px] font-bold tracking-[0.4px] uppercase text-ink-soft">{label}</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-brand-soft">
          <Icon d={icon} s={17} c="#f15a24" sw={2} />
        </span>
      </div>
      <div className="mt-1.5 text-[26px] font-extrabold tracking-tight text-ink md:text-[30px]">{value}</div>
      <div className="mt-1 flex items-center gap-1.5">
        <span
          className={`flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[11px] font-extrabold ${
            negative ? 'bg-alert-soft text-alert' : 'bg-good-soft text-good'
          }`}
        >
          <Icon d={negative ? D.trendDown : D.trendUp} s={11} sw={2.4} />
          {delta}
        </span>
        <span className="text-[11px] font-semibold text-ink-faint">{deltaLabel}</span>
      </div>
    </div>
  );
}

type BadgeTone = 'good' | 'warm' | 'alert' | 'brand' | 'neutral';

const BADGE_TONES: Record<BadgeTone, string> = {
  good: 'bg-good-soft text-good',
  warm: 'bg-warm-soft text-[#1a1a1a]',
  alert: 'bg-alert-soft text-alert',
  brand: 'bg-brand-soft text-brand',
  neutral: 'bg-field text-ink-soft',
};

/** Status pill with a leading dot, used across all tables. */
export function Badge({ tone, children }: { tone: BadgeTone; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-extrabold ${BADGE_TONES[tone]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}

/** Card shell used by charts and tables. */
export function Panel({
  title,
  action,
  children,
  className = '',
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-line bg-white shadow-[0_2px_10px_-6px_rgba(20,16,12,0.15)] ${className}`}>
      {title && (
        <div className="flex items-center justify-between border-b border-line px-4 py-3.5 md:px-5">
          <h2 className="text-[14px] font-extrabold text-ink">{title}</h2>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

/** Debounce-free controlled search box for table toolbars. */
export function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <label className="flex h-9 flex-1 items-center gap-2 rounded-lg border border-line bg-field px-3 focus-within:border-brand md:max-w-xs">
      <Icon d={D.search} s={15} c="#b8b3ab" sw={2} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-[13px] font-medium outline-none placeholder:text-ink-faint"
      />
    </label>
  );
}

/** Native select styled as a filter chip. */
export function FilterSelect({
  value,
  onChange,
  options,
  allLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  allLabel: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`h-9 rounded-lg border px-2.5 text-[12.5px] font-bold outline-none ${
        value ? 'border-brand bg-brand-soft text-brand' : 'border-line bg-white text-ink-soft'
      }`}
    >
      <option value="">{allLabel}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

/** iOS-style toggle reused from the attendee app's design language. */
export function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={`flex h-[26px] w-[46px] rounded-full p-[3px] transition-colors duration-200 ${
        on ? 'justify-end bg-brand' : 'justify-start bg-line'
      }`}
    >
      <span className="h-5 w-5 rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.25)]" />
    </button>
  );
}
