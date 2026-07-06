import { Link, useLocation } from 'react-router-dom';
import Icon from '../../components/ui/Icon';
import { GlowCircle } from '../../components/ui/bits';
import { D } from '../../data/icons';

interface SubmissionState {
  title?: string;
  category?: string;
  type?: string;
}

function TimelineStep({
  label,
  sub,
  done,
  active,
  last,
}: {
  label: string;
  sub: string;
  done?: boolean;
  active?: boolean;
  last?: boolean;
}) {
  return (
    <div className={`flex gap-3.5 ${last ? '' : 'pb-5'}`}>
      <div className="flex w-7 shrink-0 flex-col items-center">
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 ${
            done ? 'border-good bg-good' : active ? 'border-white bg-white' : 'border-white/30 bg-white/18'
          }`}
        >
          {done ? (
            <Icon d={D.check} s={14} c="#fff" sw={3} />
          ) : active ? (
            <span className="h-2 w-2 rounded-full bg-brand" />
          ) : null}
        </span>
        {!last && <span className={`mt-1 w-0.5 flex-1 rounded-[1px] ${done ? 'bg-good' : 'bg-white/20'}`} />}
      </div>
      <div className="flex-1 pt-[3px]">
        <div className={`text-[13.5px] font-extrabold ${done || active ? 'text-white' : 'text-white/55'}`}>{label}</div>
        <div className={`mt-0.5 text-[11.5px] ${done || active ? 'text-white/70' : 'text-white/40'}`}>{sub}</div>
      </div>
    </div>
  );
}

export default function SubmissionSuccessScreen() {
  const state = (useLocation().state ?? {}) as SubmissionState;
  const details = [
    { l: 'Submission ID', v: 'APCN-EP-2027-00423' },
    { l: 'Category', v: state.category ?? 'CKD & Progression' },
    { l: 'Type', v: state.type ?? 'E-Poster' },
    { l: 'Submitted', v: '12 Jan 2027' },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-brand-top via-brand to-brand-deep">
      <GlowCircle className="-top-16 -right-12 h-60 w-60 bg-[radial-gradient(circle,rgba(255,255,255,0.12),transparent_70%)]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-lg flex-col px-5 py-6 md:justify-center md:py-12">
        <div className="flex animate-screen-in flex-col items-center gap-3.5 pb-[22px] text-center">
          <div className="flex h-24 w-24 animate-pop-in items-center justify-center rounded-full bg-white/14">
            <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-white shadow-[0_10px_28px_-8px_rgba(0,0,0,0.3)]">
              <Icon d={D.check} s={34} c="#3f9a78" sw={2.5} />
            </div>
          </div>
          <div>
            <h1 className="text-[26px] font-extrabold tracking-tight text-white">Submitted!</h1>
            <p className="mt-1.5 text-sm leading-normal text-white/75">
              {state.title ? (
                <>
                  “{state.title}” is under review by the scientific committee.
                </>
              ) : (
                'Your e-poster is under review by the scientific committee.'
              )}
            </p>
          </div>
        </div>

        <div className="mb-5 rounded-[20px] border border-white/18 bg-white/12 px-[18px] py-4">
          <div className="grid grid-cols-2 gap-y-2.5">
            {details.map(({ l, v }) => (
              <div key={l}>
                <div className="text-[10px] font-bold tracking-[0.6px] uppercase text-white/50">{l}</div>
                <div className="mt-[3px] text-[13px] font-bold text-white">{v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-5 rounded-[20px] border border-white/12 bg-white/8 px-[18px] py-[18px]">
          <div className="mb-4 text-[11px] font-extrabold tracking-[1.3px] uppercase text-white/50">
            Review Timeline
          </div>
          <TimelineStep label="Submitted" sub="12 January 2027" done />
          <TimelineStep label="Under Review" sub="Scientific committee assessment" active />
          <TimelineStep label="Results Announced" sub="15 March 2027" />
          <TimelineStep label="Best E-Poster Award" sub="Awarded at congress · 12 May 2027" last />
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            className="flex h-[54px] w-full items-center justify-center gap-2.5 rounded-[18px] bg-white text-[15px] font-extrabold text-brand shadow-[0_12px_30px_-10px_rgba(0,0,0,0.35)] transition-colors hover:bg-brand-soft"
          >
            <Icon d={D.pen} s={19} c="#f15a24" sw={2} />
            View My Submission
          </button>
          <Link
            to="/dashboard"
            className="flex h-[54px] w-full items-center justify-center gap-2.5 rounded-[18px] border-[1.5px] border-white/25 bg-white/14 text-[15px] font-extrabold text-white transition-colors hover:bg-white/25"
          >
            <Icon d={D.home} s={19} c="#fff" sw={2} />
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
