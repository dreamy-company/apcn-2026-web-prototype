import { Link } from 'react-router-dom';
import Icon from '../../components/ui/Icon';
import { GlowCircle } from '../../components/ui/bits';
import { D } from '../../data/icons';
import { TOPIC, type Session, type SessionKind } from '../../data/sessions';
import doctorPhoto from '../../assets/doctorPhoto.avif';

export function ThumbBlock({ kind, height = 120 }: { kind: SessionKind; height?: number }) {
  const { palette, topic } = TOPIC[kind];
  const [from, to] = palette;
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height, background: `linear-gradient(125deg,${from},${to})` }}
    >
      <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.07)_0_14px,rgba(255,255,255,0)_14px_30px)]" />
      <GlowCircle className="-top-7 -right-5 h-[110px] w-[110px] bg-[radial-gradient(circle,rgba(255,255,255,0.20),transparent_70%)]" />
      <div className="absolute bottom-2.5 left-3 font-mono text-[10.5px] font-semibold tracking-[1.4px] uppercase text-white/75">
        {topic}
      </div>
    </div>
  );
}

export function SessionCard({ session, starred }: { session: Session; starred?: boolean }) {
  return (
    <div className="overflow-hidden rounded-[18px] border border-line bg-white shadow-[0_4px_14px_-8px_rgba(20,16,12,0.22)] transition-transform duration-150 hover:-translate-y-0.5">
      <div className="relative">
        <ThumbBlock kind={session.kind} height={110} />
        <button
          type="button"
          aria-label="Star session"
          className="absolute top-2.5 right-2.5 flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white shadow-[0_4px_12px_-4px_rgba(0,0,0,0.3)]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={starred ? '#2b2b2b' : 'none'}>
            <path d={D.star} stroke="#2b2b2b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="absolute top-3 left-3 rounded-full bg-white/92 px-2.5 py-1 text-[10.5px] font-extrabold tracking-[0.6px] uppercase text-brand-deep">
          {session.category}
        </span>
      </div>
      <div className="px-4 pt-3.5 pb-3">
        <Link to={`/program/${session.id}`} className="text-[15px] leading-tight font-extrabold text-ink hover:text-brand">
          {session.title}
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-3.5">
          <span className="flex items-center gap-[5px] text-[12.5px] font-semibold text-ink-soft">
            <Icon d={D.clock} s={14} c="#b8b3ab" sw={2} />
            {session.time}
          </span>
          <span className="flex items-center gap-[5px] rounded-full bg-brand-soft px-2.5 py-1 text-[11.5px] font-extrabold text-brand">
            <Icon d={D.pin} s={13} c="#f15a24" sw={2.2} />
            {session.room}
          </span>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="flex">
            {session.speakers.slice(0, 2).map((s, i) => (
              <img
                key={s.initials}
                src={doctorPhoto}
                alt={s.initials}
                className={`h-[26px] w-[26px] shrink-0 rounded-full border-2 border-white object-cover object-top ${
                  i > 0 ? '-ml-2' : ''
                }`}
              />
            ))}
          </span>
          <span className="flex-1 text-[12.5px] leading-tight font-semibold text-ink">{session.speakerLabel}</span>
        </div>
        <div className="mt-3.5 grid grid-cols-2 border-t border-dashed border-line pt-3">
          <Link
            to={`/program/${session.id}`}
            className="flex items-center justify-center gap-1.5 text-[13px] font-bold text-brand hover:opacity-75"
          >
            <Icon d={D.chevRight} s={14} sw={2.4} />
            View Agenda
          </Link>
          <Link
            to={`/program/${session.id}/qa`}
            className="flex items-center justify-center gap-1.5 border-l border-line text-[13px] font-bold text-brand hover:opacity-75"
          >
            <Icon d={D.chat} s={14} sw={2} />
            Q&amp;A
          </Link>
        </div>
      </div>
    </div>
  );
}
