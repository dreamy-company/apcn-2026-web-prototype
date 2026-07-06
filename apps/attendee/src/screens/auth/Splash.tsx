import Icon from '../../components/ui/Icon';
import Button from '../../components/ui/Button';
import { D } from '../../data/icons';
import { GlowCircle } from '../../components/ui/bits';

export default function SplashScreen() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-b from-brand-top via-brand to-brand-deep">
      <GlowCircle className="-top-20 -right-16 h-64 w-64 bg-[radial-gradient(circle,rgba(31,31,31,0.45),transparent_70%)]" />
      <GlowCircle className="bottom-32 -left-24 h-72 w-72 bg-[radial-gradient(circle,rgba(255,255,255,0.16),transparent_70%)]" />

      <div className="relative mx-auto flex w-full max-w-md flex-1 flex-col justify-between px-7 py-8 lg:max-w-lg">
        <div className="mt-4 flex justify-center">
          <span className="rounded-full border border-white/25 px-4 py-[7px] text-[13px] font-semibold tracking-[2px] text-white/80">
            WELCOME TO
          </span>
        </div>

        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex h-24 w-24 animate-pop-in items-center justify-center rounded-[27px] bg-white shadow-[0_16px_40px_-12px_rgba(0,0,0,0.4)]">
            <span className="text-2xl font-extrabold text-brand">APSN</span>
          </div>
          <div className="animate-screen-in">
            <h1 className="text-[46px] leading-none font-extrabold tracking-tight text-white lg:text-[56px]">
              APCN 2027
            </h1>
            <p className="mx-auto mt-3 max-w-[280px] text-base leading-normal font-medium text-white/80 lg:max-w-sm">
              Asia Pacific Congress of Nephrology — your ticket, program &amp; badge in one place.
            </p>
          </div>
          <div className="mt-0.5 flex flex-wrap justify-center gap-2">
            {[
              { icon: D.cal, t: '12–15 May 2027' },
              { icon: D.globe, t: 'Bali, Indonesia' },
            ].map(({ icon, t }) => (
              <span
                key={t}
                className="flex items-center gap-[7px] rounded-full bg-white/14 px-3.5 py-2 text-[13.5px] font-semibold text-white"
              >
                <Icon d={icon} s={15} c="#fff" sw={1.8} />
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button variant="light" to="/signup">
            Create your account
          </Button>
          <Button variant="outlineOnSurface" to="/login">
            I already have an account
          </Button>
        </div>
      </div>
    </div>
  );
}
