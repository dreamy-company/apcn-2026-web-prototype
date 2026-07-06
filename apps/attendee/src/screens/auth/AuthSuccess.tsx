import { Link } from 'react-router-dom';
import Icon from '../../components/ui/Icon';
import Button from '../../components/ui/Button';
import { D } from '../../data/icons';
import { GlowCircle } from '../../components/ui/bits';

const NEXT_STEPS = [
  { icon: D.cal, t: 'Browse the program', s: '4 days · 120+ sessions', to: '/program' },
  { icon: D.ticket, t: 'Buy your ticket', s: 'Early-bird until 31 Jan', to: '/tickets' },
];

export default function AuthSuccessScreen() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-b from-brand-top via-brand to-brand-deep">
      <GlowCircle className="-top-16 -left-16 h-60 w-60 bg-[radial-gradient(circle,rgba(255,255,255,0.16),transparent_70%)]" />
      <GlowCircle className="right-[-80px] bottom-52 h-64 w-64 bg-[radial-gradient(circle,rgba(31,31,31,0.4),transparent_70%)]" />

      <div className="relative mx-auto flex w-full max-w-md flex-1 flex-col justify-between px-7 py-7 lg:max-w-lg lg:justify-center lg:gap-10">
        <div className="flex flex-1 flex-col items-center justify-center text-center lg:flex-none">
          <div className="mb-7 flex h-[108px] w-[108px] animate-pop-in items-center justify-center rounded-full bg-white/14">
            <div className="flex h-[76px] w-[76px] items-center justify-center rounded-full bg-white">
              <Icon d={D.check} s={38} c="#3f9a78" sw={2.6} />
            </div>
          </div>
          <h1 className="animate-screen-in text-[32px] leading-tight font-extrabold tracking-tight text-white">
            You're all set,
            <br />
            Dr. Tan!
          </h1>
          <p className="mt-3.5 max-w-[290px] text-[15.5px] leading-relaxed text-white/80 lg:max-w-sm">
            Your APCN 2027 account is ready. Explore the scientific program and grab your ticket.
          </p>

          <div className="mt-8 flex w-full flex-col gap-3">
            {NEXT_STEPS.map((c) => (
              <Link
                key={c.t}
                to={c.to}
                className="flex items-center gap-3.5 rounded-[18px] border border-white/18 bg-white/12 px-4 py-3.5 text-left transition-colors hover:bg-white/20"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-[13px] bg-white/16">
                  <Icon d={c.icon} s={22} c="#fff" sw={1.8} />
                </span>
                <span className="flex-1">
                  <span className="block text-base font-bold text-white">{c.t}</span>
                  <span className="mt-0.5 block text-[13px] text-white/70">{c.s}</span>
                </span>
                <Icon d={D.chev} s={20} c="rgba(255,255,255,0.7)" sw={2} />
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3">
          <Button variant="light" to="/program">
            Explore the program
          </Button>
          <Button variant="outlineOnSurface" to="/dashboard">
            Maybe later
          </Button>
        </div>
      </div>
    </div>
  );
}
