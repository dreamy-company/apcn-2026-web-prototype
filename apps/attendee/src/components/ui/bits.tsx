import type { ReactNode } from 'react';

export function SecLabel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mb-2.5 text-[11px] font-extrabold tracking-[1.3px] uppercase text-ink-faint ${className}`}>
      {children}
    </div>
  );
}

export function Divider({ label }: { label: string }) {
  return (
    <div className="my-1 flex items-center gap-3.5">
      <div className="h-px flex-1 bg-line" />
      <span className="text-[13px] font-medium text-ink-faint">{label}</span>
      <div className="h-px flex-1 bg-line" />
    </div>
  );
}

export function Toggle({ on, onChange }: { on: boolean; onChange?: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange?.(!on)}
      className={`flex h-[26px] w-[46px] rounded-full p-[3px] transition-colors duration-200 ${
        on ? 'justify-end bg-brand' : 'justify-start bg-line'
      }`}
    >
      <span className="h-5 w-5 rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.25)]" />
    </button>
  );
}

export function LineItem({
  label,
  amount,
  green,
  bold,
}: {
  label: string;
  amount: string;
  green?: boolean;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-line py-[11px] last:border-b-0">
      <span className="text-sm font-semibold text-ink-soft">{label}</span>
      <span className={`text-sm ${bold ? 'font-extrabold' : 'font-bold'} ${green ? 'text-good' : 'text-ink'}`}>
        {amount}
      </span>
    </div>
  );
}

export function ReceiptLine({
  label,
  value,
  green,
  bold,
}: {
  label: string;
  value: string;
  green?: boolean;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-dashed border-line py-2.5">
      <span className="text-[13px] font-medium text-ink-soft">{label}</span>
      <span className={`text-[13px] ${bold ? 'font-extrabold' : 'font-bold'} ${green ? 'text-good' : 'text-ink'}`}>
        {value}
      </span>
    </div>
  );
}

export function StatBar({
  items,
  className = '',
}: {
  items: { v: string; l: string }[];
  className?: string;
}) {
  return (
    <div
      className={`grid rounded-[18px] border border-white/10 bg-white/8 py-3.5 ${className}`}
      style={{ gridTemplateColumns: items.map(() => '1fr').join(' 1px ') }}
    >
      {items.flatMap((item, i) => [
        i > 0 && <div key={`sep${i}`} className="my-1 w-px bg-white/12" />,
        <div key={item.l} className="text-center">
          <div className="text-[21px] font-extrabold text-white">{item.v}</div>
          <div className="mt-[3px] text-[11px] font-semibold text-white/50">{item.l}</div>
        </div>,
      ])}
    </div>
  );
}

export function GlowCircle({ className }: { className: string }) {
  return <div className={`pointer-events-none absolute rounded-full ${className}`} />;
}
