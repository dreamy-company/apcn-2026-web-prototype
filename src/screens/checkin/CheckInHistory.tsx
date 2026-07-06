import { useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import Icon from '../../components/ui/Icon';
import { StatBar } from '../../components/ui/bits';
import { D } from '../../data/icons';
import { CHECKIN_DAYS, TYPE_META, TOTAL_CHECKINS, type CheckInDay, type CheckInEntry } from '../../data/checkin';

function CheckInCard({ entry, isLast }: { entry: CheckInEntry; isLast: boolean }) {
  const meta = TYPE_META[entry.type];
  return (
    <div className={`flex items-stretch gap-3 ${isLast ? '' : 'pb-3'}`}>
      <div className="flex w-[18px] shrink-0 flex-col items-center">
        <span
          className="z-10 mt-[19px] h-3 w-3 shrink-0 rounded-full border-[2.5px] border-paper"
          style={{ background: meta.color, boxShadow: `0 0 0 2px ${meta.color}` }}
        />
        {!isLast && <span className="mt-[5px] w-0.5 flex-1 rounded-sm bg-line" />}
      </div>
      <div className="flex-1 overflow-hidden rounded-2xl border border-line bg-white shadow-[0_4px_12px_-8px_rgba(20,16,12,0.18)]">
        <div className="h-[3px]" style={{ background: `linear-gradient(90deg,${meta.color},${meta.color}66)` }} />
        <div className="px-3.5 pt-[11px] pb-[13px]">
          <div className="mb-[7px] flex items-center justify-between gap-2">
            <span
              className="shrink-0 rounded-full px-2 py-[3px] text-[10.5px] font-extrabold"
              style={{ color: meta.color, background: meta.soft }}
            >
              {entry.type}
            </span>
            <span className="flex items-center gap-[5px]">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-good" />
              <span className="text-[11px] font-bold whitespace-nowrap text-ink-faint">
                {entry.checkinTime} checked in
              </span>
            </span>
          </div>
          <div className="mb-[9px] text-[13.5px] leading-snug font-extrabold text-ink">{entry.title}</div>
          <div className="flex flex-wrap gap-3.5">
            <span className="flex items-center gap-[5px] text-[11.5px] font-semibold text-ink-soft">
              <Icon d={D.pin} s={12} c="#b8b3ab" sw={2} />
              {entry.room}
            </span>
            <span className="flex items-center gap-[5px] text-[11.5px] font-semibold text-ink-soft">
              <Icon d={D.clock} s={12} c="#b8b3ab" sw={2} />
              {entry.sessionTime}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DayGroup({ group }: { group: CheckInDay }) {
  return (
    <div className="mb-6 break-inside-avoid">
      <div className="mb-3.5 flex items-center gap-2.5">
        <span className="text-[10.5px] font-extrabold tracking-[1.3px] uppercase whitespace-nowrap text-ink-faint">
          {group.day} · {group.date}
        </span>
        <span className="h-px flex-1 bg-line" />
        <span className="shrink-0 rounded-full bg-brand-soft px-2 py-[3px] text-[10.5px] font-extrabold whitespace-nowrap text-brand">
          {group.entries.length} session{group.entries.length > 1 ? 's' : ''}
        </span>
      </div>
      {group.entries.map((e, i) => (
        <CheckInCard key={e.id} entry={e} isLast={i === group.entries.length - 1} />
      ))}
    </div>
  );
}

export default function CheckInHistoryScreen() {
  const [filter, setFilter] = useState('ALL');
  const filteredDays = filter === 'ALL' ? CHECKIN_DAYS : CHECKIN_DAYS.filter((d) => d.short === filter);

  return (
    <div className="min-h-screen animate-screen-in bg-paper">
      <PageHeader
        title="Daily Check-in"
        backTo="/dashboard"
        right={
          <button
            type="button"
            aria-label="Share"
            className="flex h-10 w-10 items-center justify-center rounded-[13px] border-[1.5px] border-white/22 hover:bg-white/10"
          >
            <Icon d={D.share} s={20} c="#fff" sw={2} />
          </button>
        }
      >
        <div className="bg-brand-deep pb-[18px]">
          <div className="mx-auto max-w-5xl px-4 md:px-8">
            <div className="mb-3.5 flex items-center gap-3">
              <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[13px] border-[1.5px] border-white/18 bg-white/12 text-[15px] font-extrabold text-white">
                AS
              </span>
              <div>
                <div className="text-[15px] font-extrabold text-white">Dr. Ahmad Santoso</div>
                <div className="mt-0.5 text-[11.5px] font-medium text-white/55">
                  Participant · Full Registration · APCN-2027-04821
                </div>
              </div>
            </div>
            <StatBar
              className="md:max-w-lg"
              items={[
                { v: String(TOTAL_CHECKINS), l: 'Check-ins' },
                { v: '4', l: 'Days Attended' },
                { v: 'Full', l: 'Access Level' },
              ]}
            />
          </div>
        </div>
        <div className="border-b border-line bg-white">
          <div className="mx-auto flex max-w-5xl gap-[7px] overflow-x-auto px-4 py-2.5 md:px-8">
            {[{ k: 'ALL', label: 'All Days' }, ...CHECKIN_DAYS.map((d) => ({ k: d.short, label: d.short }))].map(
              (f) => (
                <button
                  type="button"
                  key={f.k}
                  onClick={() => setFilter(f.k)}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-extrabold transition-colors ${
                    filter === f.k ? 'bg-brand text-white' : 'bg-field text-ink-soft hover:bg-line'
                  }`}
                >
                  {f.label}
                </button>
              ),
            )}
          </div>
        </div>
      </PageHeader>

      <div className="mx-auto max-w-5xl px-4 pt-[18px] pb-8 md:px-8">
        <div className="md:columns-2 md:gap-8 xl:columns-3">
          {filteredDays.map((d) => (
            <DayGroup key={d.short} group={d} />
          ))}
        </div>

        <button
          type="button"
          className="mt-1 flex w-full items-center gap-3.5 rounded-[18px] border border-line bg-white px-4 py-3.5 text-left shadow-[0_4px_14px_-8px_rgba(20,16,12,0.18)] transition-transform hover:-translate-y-0.5 md:max-w-md"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-good-soft">
            <Icon d={D.cert} s={20} c="#3f9a78" sw={2} />
          </span>
          <span className="flex-1">
            <span className="block text-[13.5px] font-extrabold text-ink">Download Attendance Certificate</span>
            <span className="mt-0.5 block text-xs font-semibold text-ink-soft">
              Based on {TOTAL_CHECKINS} check-ins · APCN 2027
            </span>
          </span>
          <Icon d={D.chev} s={17} c="#b8b3ab" sw={2.2} />
        </button>
      </div>
    </div>
  );
}
