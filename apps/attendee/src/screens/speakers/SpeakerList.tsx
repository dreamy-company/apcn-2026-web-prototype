import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import Icon from '../../components/ui/Icon';
import { D } from '../../data/icons';
import { CHAIRS, SPEAKERS, type Speaker } from '../../data/speakers';
import doctorPhoto from '../../assets/doctorPhoto.avif';

function SpeakerRow({ speaker: s }: { speaker: Speaker }) {
  return (
    <Link
      to={`/speakers/${s.id}`}
      className="flex items-center gap-3.5 rounded-[18px] border border-line bg-white px-4 py-3.5 shadow-[0_4px_12px_-8px_rgba(20,16,12,0.20)] transition-transform duration-150 hover:-translate-y-0.5"
    >
      <img
        src={doctorPhoto}
        alt={s.name}
        className="block h-12 w-12 shrink-0 rounded-[15px] border-2 border-brand-soft object-cover object-top"
      />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[14.5px] font-extrabold text-ink">{s.name}</span>
        <span className="mt-0.5 block text-[12.5px] font-semibold text-ink-soft">{s.role}</span>
        <span className="mt-px block truncate text-[11.5px] font-medium text-ink-faint">
          {s.institution} · {s.country}
        </span>
      </span>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-brand-soft">
        <Icon d={D.chev} s={16} c="#f15a24" sw={2.4} />
      </span>
    </Link>
  );
}

const TABS = ['Chair', 'Speakers'] as const;

export default function SpeakerListScreen() {
  const [tab, setTab] = useState<(typeof TABS)[number]>('Chair');
  const [query, setQuery] = useState('');

  const list = useMemo(() => {
    const base = tab === 'Chair' ? CHAIRS : SPEAKERS;
    const q = query.trim().toLowerCase();
    if (!q) return base;
    return base.filter((s) =>
      [s.name, s.institution, s.country].some((v) => v.toLowerCase().includes(q)),
    );
  }, [tab, query]);

  return (
    <div className="min-h-screen animate-screen-in bg-paper">
      <PageHeader title="Speaker" backTo="/dashboard" right={<div className="w-10" />}>
        <div className="bg-brand-deep">
          <div className="mx-auto max-w-5xl px-3.5 md:px-8">
            <label className="mb-3.5 flex h-11 items-center gap-2.5 rounded-[14px] border border-white/14 bg-white/11 px-3.5 md:max-w-md">
              <Icon d={D.search} s={17} c="rgba(255,255,255,0.45)" sw={2} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search speakers…"
                className="flex-1 bg-transparent text-sm font-medium text-white outline-none placeholder:text-white/45"
              />
            </label>
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
                {t}{' '}
                <span className={`text-[11.5px] ${tab === t ? 'text-brand' : 'text-ink-faint'}`}>
                  ({t === 'Chair' ? CHAIRS.length : SPEAKERS.length})
                </span>
              </button>
            ))}
          </div>
        </div>
      </PageHeader>

      <div className="mx-auto max-w-5xl px-4 pt-3.5 pb-8 md:px-8">
        <div className="mb-2 text-[11px] font-extrabold tracking-[1.2px] uppercase text-ink-faint">
          {list.length} {tab === 'Chair' ? 'Session Chairs' : 'Speakers'} · APCN 2027
        </div>
        <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-3">
          {list.map((s) => (
            <SpeakerRow key={s.id} speaker={s} />
          ))}
        </div>
      </div>
    </div>
  );
}
