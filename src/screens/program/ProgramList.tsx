import { useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import Icon from '../../components/ui/Icon';
import { D } from '../../data/icons';
import { DAYS, SESSIONS } from '../../data/sessions';
import { SessionCard } from './parts';
import ProgramFilterSheet from './ProgramFilter';

function DateTabs({ activeIdx, onChange }: { activeIdx: number; onChange: (i: number) => void }) {
  return (
    <div className="bg-brand-deep pb-3.5">
      <div className="mx-auto grid max-w-5xl grid-cols-4 gap-2 px-3 md:px-8">
        {DAYS.map((day, i) => {
          const on = i === activeIdx;
          return (
            <button
              type="button"
              key={day.n}
              onClick={() => onChange(i)}
              className={`rounded-[14px] pt-2 pb-[9px] text-center transition-colors ${
                on
                  ? 'bg-white text-brand-deep'
                  : 'border border-white/10 bg-white/8 text-white/85 hover:bg-white/15'
              }`}
            >
              <div className="text-[10.5px] font-bold tracking-[1.2px] opacity-70">{day.d.toUpperCase()}</div>
              <div className="mt-px text-xl leading-tight font-extrabold">{day.n}</div>
              <div className="mt-px text-[9.5px] font-semibold tracking-[0.4px] opacity-50">MAY</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const TRACKS = ['All tracks', 'Plenary', 'Symposium', 'Workshop'];

export default function ProgramListScreen() {
  const [dayIdx, setDayIdx] = useState(1);
  const [track, setTrack] = useState('Plenary');
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState(2);

  return (
    <div className="min-h-screen animate-screen-in bg-paper">
      <PageHeader title="Program" backTo="/dashboard">
        <DateTabs activeIdx={dayIdx} onChange={setDayIdx} />
      </PageHeader>

      <div className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 pt-3.5 pb-3 md:px-8">
          <button
            type="button"
            className="flex h-11 flex-1 items-center gap-2 rounded-[14px] border-[1.5px] border-line bg-field px-3.5 md:max-w-xs"
          >
            <Icon d={D.pin} s={16} c="#f15a24" sw={2} />
            <span className="text-sm font-bold text-ink">Room 1 · 701A</span>
            <Icon d={D.chevDown} s={16} c="#8a8580" sw={2} />
          </button>
          <button
            type="button"
            className="flex h-11 items-center gap-[7px] rounded-[14px] border-[1.5px] border-warm bg-warm-soft px-3"
          >
            <Icon d={D.globe} s={15} c="#141414" sw={2} />
            <span className="text-[13px] font-bold whitespace-nowrap text-[#141414]">AI Translate</span>
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 md:px-8">
        <div className="flex gap-2 overflow-x-auto pt-3 pb-1">
          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-brand px-3 py-[7px] text-xs font-bold whitespace-nowrap text-white"
          >
            <Icon d={D.filter} s={13} c="#fff" sw={2.2} />
            Filter{activeFilters > 0 && ` · ${activeFilters}`}
          </button>
          {TRACKS.map((c) => {
            const on = track === c;
            return (
              <button
                type="button"
                key={c}
                onClick={() => setTrack(c)}
                className={`shrink-0 rounded-full border px-3 py-[7px] text-xs font-bold whitespace-nowrap transition-colors ${
                  on ? 'border-brand bg-brand-soft text-brand' : 'border-line bg-white text-ink-soft hover:border-ink-faint'
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>

        <div className="flex items-baseline justify-between px-1 pt-2.5 pb-1.5">
          <div className="text-[12.5px] font-bold tracking-[0.3px] text-ink-soft">
            {DAYS[dayIdx].d.toUpperCase()} · {DAYS[dayIdx].n} MAY · 12 SESSIONS
          </div>
          <div className="text-xs font-bold text-brand">Sort · Time ↓</div>
        </div>

        <div className="grid gap-3.5 pt-1.5 pb-8 md:grid-cols-2 xl:grid-cols-3">
          {SESSIONS.map((s, i) => (
            <SessionCard key={s.id} session={s} starred={i === 0} />
          ))}
        </div>
      </div>

      {filterOpen && (
        <ProgramFilterSheet
          onClose={() => setFilterOpen(false)}
          onApply={(count) => {
            setActiveFilters(count);
            setFilterOpen(false);
          }}
        />
      )}
    </div>
  );
}
