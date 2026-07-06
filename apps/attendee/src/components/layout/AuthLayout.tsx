import type { ReactNode } from 'react';
import Icon from '../ui/Icon';
import { D } from '../../data/icons';
import { GlowCircle } from '../ui/bits';

/**
 * Auth screens: full-bleed form on mobile; on lg+ a split panel with a
 * brand-gradient hero on the left and the form card on the right.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-paper">
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-brand-top via-brand to-brand-deep lg:flex lg:w-[44%] lg:flex-col lg:justify-between lg:p-12 xl:p-16">
        <GlowCircle className="-top-20 -right-16 h-72 w-72 bg-[radial-gradient(circle,rgba(31,31,31,0.45),transparent_70%)]" />
        <GlowCircle className="bottom-28 -left-24 h-80 w-80 bg-[radial-gradient(circle,rgba(255,255,255,0.16),transparent_70%)]" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-[20px] bg-white shadow-[0_16px_40px_-12px_rgba(0,0,0,0.4)]">
          <span className="text-[17px] font-extrabold text-brand">APSN</span>
        </div>
        <div className="relative">
          <div className="text-[44px] leading-none font-extrabold tracking-tight text-white xl:text-[54px]">
            APCN 2027
          </div>
          <p className="mt-5 max-w-sm text-[15.5px] leading-relaxed font-medium text-white/80">
            Asia Pacific Congress of Nephrology — your ticket, program &amp; badge in one place.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
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
        <div className="relative text-xs font-semibold tracking-[2px] text-white/50">
          23<sup>RD</sup> ASIA PACIFIC CONGRESS OF NEPHROLOGY
        </div>
      </aside>
      <main className="flex flex-1 justify-center overflow-y-auto">
        <div className="flex min-h-screen w-full max-w-md flex-col px-7 py-6 lg:justify-center lg:py-12">
          {children}
        </div>
      </main>
    </div>
  );
}
