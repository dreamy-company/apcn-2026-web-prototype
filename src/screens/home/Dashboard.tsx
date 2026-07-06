import { Link } from 'react-router-dom';
import Icon from '../../components/ui/Icon';
import QRCode from '../../components/ui/QRCode';
import { GlowCircle } from '../../components/ui/bits';
import { D } from '../../data/icons';
import { FEATURE_DATA, type Feature } from '../../data/features';

function HeroBanner() {
  return (
    <div className="relative flex min-h-[124px] flex-col justify-center overflow-hidden rounded-[20px] bg-gradient-to-r from-brand via-brand-top to-[#ff8f4d] px-5 py-[18px] md:min-h-[170px] md:px-8">
      <GlowCircle className="-top-10 -right-8 h-40 w-40 bg-[radial-gradient(circle,rgba(255,255,255,0.18),transparent_70%)]" />
      <GlowCircle className="right-10 -bottom-12 h-36 w-36 bg-[radial-gradient(circle,rgba(31,31,31,0.35),transparent_70%)]" />
      <div className="relative">
        <div className="mb-2 text-[10.5px] font-bold tracking-[1.5px] text-white/80 md:text-xs">
          23<sup>rd</sup> ASIA PACIFIC CONGRESS OF NEPHROLOGY
        </div>
        <div className="text-[30px] leading-none font-extrabold tracking-tight text-white md:text-[42px]">
          APCN 2027
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            { icon: D.cal, t: '12–15 May 2027' },
            { icon: D.globe, t: 'Bali, Indonesia' },
          ].map(({ icon, t }) => (
            <span
              key={t}
              className="flex items-center gap-1.5 rounded-full bg-white/16 px-[11px] py-1.5 text-xs font-bold text-white"
            >
              <Icon d={icon} s={13} c="#fff" sw={1.8} />
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function CheckInBadge() {
  return (
    <div className="overflow-hidden rounded-[22px] border border-line bg-white shadow-[0_10px_32px_-12px_rgba(20,16,12,0.32)]">
      <div className="relative flex items-center gap-3.5 overflow-hidden bg-gradient-to-r from-brand-deep to-brand-top px-[18px] py-3.5">
        <GlowCircle className="-top-8 -right-5 h-32 w-32 bg-[radial-gradient(circle,rgba(255,255,255,0.15),transparent_70%)]" />
        <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[13px] border border-white/22 bg-white/14">
          <Icon d={D.qrScan} s={22} c="#fff" sw={1.6} />
        </span>
        <div className="flex-1">
          <div className="text-[10px] font-extrabold tracking-[1.4px] uppercase text-white/55">
            My Check-in Badge
          </div>
          <div className="mt-[3px] text-[15.5px] font-extrabold text-white">Dr. Ahmad Santoso</div>
          <div className="mt-px text-xs font-medium text-white/65">Physician · Full Registration</div>
        </div>
        <span className="flex shrink-0 items-center gap-[5px] rounded-full bg-good-soft px-[11px] py-[5px]">
          <span className="h-[7px] w-[7px] rounded-full bg-good" />
          <span className="text-[10.5px] font-extrabold tracking-[0.4px] text-good">VALID</span>
        </span>
      </div>
      <div className="flex items-center gap-[18px] px-[18px] pt-4 pb-[18px]">
        <div className="shrink-0 rounded-[14px] border-[1.5px] border-line bg-white p-2 shadow-[0_4px_16px_-6px_rgba(20,16,12,0.16)]">
          <QRCode size={114} />
        </div>
        <div className="flex flex-1 flex-col gap-2.5">
          <div>
            <div className="text-[10px] font-bold tracking-[0.7px] uppercase text-ink-faint">Ticket ID</div>
            <div className="mt-[3px] text-[12.5px] font-extrabold tracking-[1.6px] text-brand-deep">
              APCN-2027-04821
            </div>
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-[0.7px] uppercase text-ink-faint">Access</div>
            <div className="mt-[3px] text-[13px] font-bold text-ink">Participant – Full</div>
          </div>
          <div className="flex items-center gap-[7px] rounded-[10px] bg-brand-soft px-2.5 py-2">
            <Icon d={D.chev} s={12} c="#f15a24" sw={2.4} />
            <span className="text-[11px] font-bold text-brand">Scan at every session entrance</span>
          </div>
        </div>
      </div>
      <div className="relative flex h-[18px] items-center">
        <span className="absolute -left-[9px] h-[18px] w-[18px] rounded-full bg-brand-deep" />
        <span className="mx-2.5 flex-1 border-t-[1.5px] border-dashed border-line" />
        <span className="absolute -right-[9px] h-[18px] w-[18px] rounded-full bg-brand-deep" />
      </div>
      <div className="flex items-center justify-between px-[18px] pt-2.5 pb-3.5">
        <span className="flex items-center gap-1.5">
          <Icon d={D.cal} s={13} c="#b8b3ab" sw={1.8} />
          <span className="text-[11.5px] font-semibold text-ink-faint">12–15 May 2027 · Bali, Indonesia</span>
        </span>
        <Link to="/profile/tickets/APCN-2027-04821" className="flex items-center gap-[3px]">
          <span className="text-xs font-bold text-brand">View Ticket</span>
          <Icon d={D.chev} s={14} c="#f15a24" sw={2.2} />
        </Link>
      </div>
    </div>
  );
}

function FeatureTile({ feat, highlight }: { feat: Feature; highlight?: boolean }) {
  const inner = (
    <>
      <span className="flex h-16 w-16 shrink-0 items-center justify-center">
        <img src={feat.img} alt={feat.label} className="block h-full w-full object-contain" />
      </span>
      <span className="max-w-[84px] text-center text-[11px] leading-[1.25] font-bold text-ink">
        {feat.label}
      </span>
    </>
  );
  const cls = `flex min-h-[112px] flex-col items-center justify-center gap-2 rounded-[18px] bg-white px-2 py-3 transition-transform duration-150 hover:-translate-y-0.5 ${
    highlight
      ? 'shadow-[0_0_0_2.5px_#2b2b2b,0_6px_18px_-10px_rgba(20,16,12,0.3)]'
      : 'shadow-[0_4px_14px_-8px_rgba(20,16,12,0.26)]'
  }`;
  return feat.to ? (
    <Link to={feat.to} className={cls}>
      {inner}
    </Link>
  ) : (
    <div className={`${cls} cursor-pointer`}>{inner}</div>
  );
}

export default function DashboardScreen() {
  return (
    <div className="min-h-screen animate-screen-in bg-brand-deep">
      <header className="sticky top-0 z-30 bg-brand-deep">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-[18px] py-2.5 md:px-8 md:py-4">
          <button type="button" aria-label="Menu" className="flex h-10 w-10 items-center justify-center md:hidden">
            <Icon d={D.menu} s={24} c="#fff" sw={2.2} />
          </button>
          <div className="flex-1 text-center text-lg font-extrabold tracking-[0.2px] text-white md:text-left md:text-xl">
            APCN 2027
          </div>
          <Link to="/checkin" aria-label="Check in" className="flex h-10 w-10 items-center justify-center">
            <Icon d={D.qrScan} s={22} c="#fff" sw={1.4} />
          </Link>
        </div>
      </header>

      <div className="mx-auto flex items-center gap-3 bg-white/9 px-[18px] py-2.5 md:px-8">
        <Icon d={D.bell} s={19} c="#ffd9b3" sw={1.8} />
        <span className="text-xs leading-normal font-medium text-[#ffe8cf] md:text-[13px]">
          E-certificates are issued within one month after the congress.
        </span>
      </div>

      <div className="mx-auto max-w-6xl px-4 pt-3.5 pb-10 md:px-8 md:pt-6">
        <div className="grid gap-4 lg:grid-cols-[1fr_420px] lg:items-start lg:gap-6">
          <div className="flex flex-col gap-4">
            <HeroBanner />
            <div className="hidden lg:block">
              <div className="px-0.5 pt-2 pb-2 text-[11px] font-extrabold tracking-[1.4px] uppercase text-white/45">
                Features
              </div>
              <div className="grid grid-cols-3 gap-3 xl:grid-cols-4">
                {FEATURE_DATA.map((f) => (
                  <FeatureTile key={f.key} feat={f} highlight={f.key === 'program'} />
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <CheckInBadge />
            <div className="lg:hidden">
              <div className="px-0.5 pt-2 pb-2 text-[11px] font-extrabold tracking-[1.4px] uppercase text-white/45">
                Features
              </div>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {FEATURE_DATA.map((f) => (
                  <FeatureTile key={f.key} feat={f} highlight={f.key === 'program'} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
