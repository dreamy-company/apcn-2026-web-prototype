import { Link } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import Icon from '../../components/ui/Icon';
import { GlowCircle } from '../../components/ui/bits';
import { D } from '../../data/icons';
import { CHECKIN_DAYS, TYPE_META } from '../../data/checkin';

const ENTRY = CHECKIN_DAYS[2].entries[1]; // E-Poster viewing · Fri 14 May

export default function CheckInSuccessScreen() {
  const meta = TYPE_META[ENTRY.type];
  const todayEntries = CHECKIN_DAYS[2].entries;

  return (
    <div className="min-h-screen animate-screen-in bg-paper pb-24">
      <PageHeader title="Check-in" backTo="/dashboard" right={<div className="w-10" />} />

      <div className="relative flex flex-col items-center gap-3 overflow-hidden bg-brand-deep pb-7">
        <GlowCircle className="-top-10 -right-5 h-44 w-44 bg-[radial-gradient(circle,rgba(255,255,255,0.10),transparent_70%)]" />
        <GlowCircle className="-bottom-12 left-2.5 h-40 w-40 bg-[radial-gradient(circle,rgba(63,154,120,0.28),transparent_70%)]" />
        <div className="relative z-10 flex h-[88px] w-[88px] animate-pop-in items-center justify-center rounded-full bg-good shadow-[0_20px_40px_-12px_rgba(0,0,0,0.4)]">
          <Icon d={D.check} s={42} c="#fff" sw={2.8} />
        </div>
        <div className="relative z-10 text-center">
          <h2 className="text-[22px] font-extrabold tracking-tight text-white">Check-in Successful!</h2>
          <div className="mt-1 text-[13px] font-medium text-white/60">Dr. Ahmad Santoso · APCN-2027-04821</div>
        </div>
        <div className="relative z-10 flex gap-2">
          <span className="rounded-full border border-good/32 bg-good/18 px-[13px] py-[5px] text-xs font-extrabold text-good">
            8th check-in
          </span>
          <span className="rounded-full border border-white/16 bg-white/11 px-[13px] py-[5px] text-xs font-bold text-white/75">
            Day 3 of 4
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 pt-4 md:px-8 lg:grid lg:grid-cols-2 lg:items-start lg:gap-4">
        <div className="mb-3 overflow-hidden rounded-[18px] border border-line bg-white shadow-[0_6px_20px_-8px_rgba(20,16,12,0.22)]">
          <div className="h-1" style={{ background: `linear-gradient(90deg,${meta.color},${meta.color}77)` }} />
          <div className="px-4 py-3.5">
            <div className="mb-[5px] text-[10px] font-bold tracking-[0.8px] uppercase text-ink-faint">
              Now Attending
            </div>
            <div className="mb-3 flex items-start justify-between gap-2">
              <div className="flex-1 text-[15px] leading-snug font-extrabold text-ink">{ENTRY.title}</div>
              <span
                className="shrink-0 rounded-full px-2.5 py-1 text-[10.5px] font-extrabold"
                style={{ color: meta.color, background: meta.soft }}
              >
                {ENTRY.type}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: D.pin, label: 'Room', value: ENTRY.room },
                { icon: D.clock, label: 'Session', value: ENTRY.sessionTime },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-center gap-[9px]">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-brand-soft">
                    <Icon d={icon} s={15} c="#f15a24" sw={2} />
                  </span>
                  <span>
                    <span className="block text-[9.5px] font-bold tracking-[0.6px] uppercase text-ink-faint">
                      {label}
                    </span>
                    <span className="block text-[12.5px] font-bold text-ink">{value}</span>
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-1.5 border-t-[1.5px] border-dashed border-line pt-3">
              <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-good" />
              <span className="text-xs font-bold text-good">Scanned at {ENTRY.checkinTime}</span>
              <span className="ml-auto text-[11.5px] font-medium text-ink-faint">Fri, 14 May 2027</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-white px-4 py-3.5 shadow-[0_4px_12px_-8px_rgba(20,16,12,0.14)]">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[11px] font-extrabold tracking-[1.1px] uppercase text-ink-faint">
              Today · Fri 14 May
            </span>
            <span className="rounded-full bg-brand-soft px-2 py-[3px] text-[10.5px] font-extrabold text-brand">
              {todayEntries.length} sessions
            </span>
          </div>
          {todayEntries.map((e, i) => {
            const em = TYPE_META[e.type];
            const isCurrent = e.id === ENTRY.id;
            return (
              <div
                key={e.id}
                className={`flex items-center gap-3 rounded-xl px-2.5 py-[9px] ${i < todayEntries.length - 1 ? 'mb-1' : ''}`}
                style={{ background: isCurrent ? em.soft : 'transparent' }}
              >
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: em.color }} />
                <span className="flex-1">
                  <span className="block text-[12.5px] leading-snug font-bold text-ink">{e.title}</span>
                  <span className="mt-px block text-[11px] font-semibold text-ink-faint">{e.room}</span>
                </span>
                <span className="shrink-0 text-right">
                  <span
                    className="block text-[11.5px] font-bold"
                    style={{ color: isCurrent ? em.color : '#8a8580' }}
                  >
                    {e.checkinTime}
                  </span>
                  {isCurrent && (
                    <span className="mt-px block text-[9.5px] font-extrabold" style={{ color: em.color }}>
                      NOW
                    </span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-[78px] z-30 border-t border-line bg-white shadow-[0_-8px_20px_-12px_rgba(20,16,12,0.18)] md:bottom-0 md:left-60">
        <div className="mx-auto grid max-w-3xl grid-cols-[52px_1fr] gap-2.5 px-4 py-3 md:px-8">
          <button
            type="button"
            aria-label="Share"
            className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl border-[1.5px] border-line bg-white hover:bg-field"
          >
            <Icon d={D.share} s={20} c="#f15a24" sw={2.2} />
          </button>
          <Link
            to="/checkin/history"
            className="flex h-[52px] items-center justify-center gap-2 rounded-2xl bg-brand text-[15px] font-extrabold text-white shadow-[0_8px_20px_-8px_rgba(241,90,36,0.6)] transition-colors hover:bg-[#e0501d]"
          >
            View All Check-ins
            <Icon d={D.chev} s={18} c="#fff" sw={2.4} />
          </Link>
        </div>
      </div>
    </div>
  );
}
