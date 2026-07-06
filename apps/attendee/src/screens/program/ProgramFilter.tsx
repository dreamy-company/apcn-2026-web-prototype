import { useState } from 'react';
import Icon from '../../components/ui/Icon';
import { D } from '../../data/icons';

const GROUPS: { label: string; options: string[] }[] = [
  { label: 'Track', options: ['Plenary', 'Symposium', 'Workshop', 'Poster', 'Industry'] },
  { label: 'Room', options: ['Plenary Hall', 'Room 1 · 701A', 'Room 2 · 701B', 'Room 3', 'Hall A'] },
  { label: 'Specialty', options: ['Glomerular', 'Dialysis', 'Transplant', 'CKD', 'AKI'] },
];

interface Props {
  onClose: () => void;
  onApply: (activeCount: number) => void;
}

/**
 * The prototype's filter screen, translated responsively: a bottom sheet on
 * mobile, a centered dialog on md+.
 */
export default function ProgramFilterSheet({ onClose, onApply }: Props) {
  const [active, setActive] = useState<string[]>(['Plenary', 'Symposium', 'Room 1 · 701A']);

  function toggle(option: string) {
    setActive((prev) => (prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(18,18,18,0.55)] md:items-center" onClick={onClose}>
      <div
        className="flex max-h-[85vh] w-full animate-screen-in flex-col rounded-t-[28px] bg-white px-[22px] pt-3 pb-6 shadow-[0_-20px_50px_-10px_rgba(0,0,0,0.4)] md:max-w-lg md:rounded-[28px] md:pt-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3.5 h-1 w-10 self-center rounded-sm bg-line md:hidden" />
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-ink">Filter</h2>
          <button type="button" onClick={() => setActive([])} className="text-[13px] font-bold text-brand">
            Reset
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {GROUPS.map((g) => (
            <div key={g.label} className="mb-5">
              <div className="mb-2.5 text-xs font-extrabold tracking-[1px] text-ink-soft">
                {g.label.toUpperCase()}
              </div>
              <div className="flex flex-wrap gap-2">
                {g.options.map((o) => {
                  const on = active.includes(o);
                  return (
                    <button
                      type="button"
                      key={o}
                      onClick={() => toggle(o)}
                      className={`flex items-center gap-1.5 rounded-full border-[1.5px] px-3.5 py-[9px] text-[13px] font-bold transition-colors ${
                        on ? 'border-brand bg-brand text-white' : 'border-line bg-white text-ink hover:border-ink-faint'
                      }`}
                    >
                      {on && <Icon d={D.check} s={13} c="#fff" sw={2.6} />}
                      {o}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => onApply(active.length)}
          className="mt-3.5 h-14 w-full rounded-[18px] bg-brand text-base font-extrabold text-white shadow-[0_12px_28px_-10px_rgba(241,90,36,0.5)] transition-colors hover:bg-[#e0501d]"
        >
          Show 18 sessions
        </button>
      </div>
    </div>
  );
}
