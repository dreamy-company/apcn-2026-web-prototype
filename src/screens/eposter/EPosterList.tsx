import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import Icon from '../../components/ui/Icon';
import { D } from '../../data/icons';
import { CATS, type PosterCategory, type PosterStatus } from '../../data/eposter';

export function StatusBadge({ status }: { status: PosterStatus }) {
  const cfg = {
    open: { label: 'Open', bg: 'bg-good-soft', color: 'text-good', dot: 'bg-good' },
    soon: { label: 'Closing Soon', bg: 'bg-warm-soft', color: 'text-[#1a1a1a]', dot: 'bg-[#1a1a1a]' },
    full: { label: 'Full', bg: 'bg-[#f5f5f5]', color: 'text-ink-faint', dot: 'bg-ink-faint' },
  }[status];
  return (
    <span className={`flex shrink-0 items-center gap-[5px] rounded-full px-2.5 py-1 ${cfg.bg}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      <span className={`text-[10.5px] font-extrabold tracking-[0.3px] ${cfg.color}`}>{cfg.label}</span>
    </span>
  );
}

function PosterCard({ cat }: { cat: PosterCategory }) {
  const isFull = cat.status === 'full';
  const filled = cat.total - cat.slots;
  const pct = Math.round((filled / cat.total) * 100);
  const inner = (
    <div className="overflow-hidden rounded-[20px] border border-line bg-white shadow-[0_4px_14px_-8px_rgba(20,16,12,0.2)] transition-transform duration-150 hover:-translate-y-0.5">
      <div className="h-[7px]" style={{ background: `linear-gradient(90deg,${cat.palette[0]},${cat.palette[1]})` }} />
      <div className="px-4 py-3.5">
        <div className="mb-3 flex items-start gap-2.5">
          <div className="flex-1">
            <div className={`text-[15px] leading-tight font-extrabold ${isFull ? 'text-ink-soft' : 'text-ink'}`}>
              {cat.topic}
            </div>
            <div className="mt-1 flex items-center gap-[5px] text-xs text-ink-faint">
              <Icon d={D.cal} s={12} c="#b8b3ab" sw={2} />
              {cat.deadline}
            </div>
          </div>
          <StatusBadge status={cat.status} />
        </div>
        <div className="mb-2.5">
          <div className="mb-1.5 flex justify-between">
            <span className="text-[11.5px] font-semibold text-ink-soft">{filled} submitted</span>
            <span className={`text-[11.5px] font-bold ${isFull ? 'text-ink-faint' : 'text-ink'}`}>
              {isFull ? 'No slots left' : `${cat.slots} slots left`}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-[3px] bg-field">
            <div
              className="h-full rounded-[3px]"
              style={{
                width: `${pct}%`,
                background: isFull ? '#b8b3ab' : `linear-gradient(90deg,${cat.palette[0]},${cat.palette[1]})`,
              }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[11.5px] font-semibold text-ink-faint">{cat.total} max submissions</span>
          {!isFull && (
            <span className="flex items-center gap-1 text-[13px] font-extrabold text-brand">
              Submit
              <Icon d={D.chev} s={16} sw={2.4} />
            </span>
          )}
        </div>
      </div>
    </div>
  );
  return isFull ? <div className="opacity-90">{inner}</div> : <Link to={`/eposter/${cat.id}`}>{inner}</Link>;
}

const TABS = ['E-Poster', 'Abstract'] as const;

export default function EPosterListScreen() {
  const [tab, setTab] = useState<(typeof TABS)[number]>('E-Poster');

  return (
    <div className="min-h-screen animate-screen-in bg-paper">
      <PageHeader title="E-Poster & Abstract" backTo="/dashboard">
        <div className="bg-brand-deep">
          <div className="mx-auto max-w-5xl px-3.5 md:px-8">
            <div className="grid grid-cols-[1fr_1px_1fr_1px_1fr] rounded-t-[14px] border border-b-0 border-white/10 bg-white/8 py-3">
              {[
                { v: '4', l: 'Open Topics' },
                { v: '43', l: 'Submitted' },
                { v: '28 Feb', l: 'Deadline' },
              ].flatMap((item, i) => [
                i > 0 && <div key={`s${i}`} className="my-1 w-px bg-white/12" />,
                <div key={item.l} className="text-center">
                  <div className="text-lg font-extrabold text-white">{item.v}</div>
                  <div className="mt-0.5 text-[10.5px] font-semibold text-white/50">{item.l}</div>
                </div>,
              ])}
            </div>
          </div>
        </div>
        <div className="flex bg-white">
          <div className="mx-auto flex w-full max-w-5xl md:px-8">
            {TABS.map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 border-b-[2.5px] pt-[13px] pb-[11px] text-center text-[14.5px] transition-colors md:flex-none md:px-10 ${
                  tab === t ? 'border-brand font-extrabold text-brand' : 'border-transparent font-semibold text-ink-soft'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </PageHeader>

      <div className="mx-auto max-w-5xl px-4 pt-4 pb-8 md:px-8">
        <div className="mb-3 flex items-center gap-2.5 rounded-[14px] border border-[rgba(31,31,31,0.25)] bg-warm-soft px-3.5 py-[11px]">
          <Icon d={D.cal} s={17} c="#2b2b2b" sw={2} />
          <span className="flex-1 text-[12.5px] font-bold text-[#0d0d0d]">
            Submission deadline: <span className="text-warm">28 February 2027</span>
          </span>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {CATS.map((cat) => (
            <PosterCard key={cat.id} cat={cat} />
          ))}
        </div>
      </div>
    </div>
  );
}
