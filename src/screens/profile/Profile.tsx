import { Link } from 'react-router-dom';
import Icon from '../../components/ui/Icon';
import { StatBar } from '../../components/ui/bits';
import { D } from '../../data/icons';

function MenuRow({
  icon,
  label,
  sub,
  badge,
  danger,
  last,
  to,
}: {
  icon: string;
  label: string;
  sub?: string;
  badge?: string;
  danger?: boolean;
  last?: boolean;
  to?: string;
}) {
  const inner = (
    <>
      <span
        className={`flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[14px] ${
          danger ? 'bg-[#fff1f1]' : 'bg-brand-soft'
        }`}
      >
        <Icon d={icon} s={19} c={danger ? '#e74444' : '#f15a24'} sw={1.9} />
      </span>
      <span className="flex-1">
        <span className={`block text-[14.5px] font-bold ${danger ? 'text-[#e74444]' : 'text-ink'}`}>{label}</span>
        {sub && (
          <span className={`mt-0.5 block text-xs ${danger ? 'text-[#e74444] opacity-75' : 'text-ink-soft'}`}>
            {sub}
          </span>
        )}
      </span>
      {badge && (
        <span className="flex h-[22px] min-w-[22px] items-center justify-center rounded-full bg-warm px-1.5 text-[11.5px] font-extrabold text-white">
          {badge}
        </span>
      )}
      <Icon d={D.chev} s={18} c="#b8b3ab" sw={2.2} />
    </>
  );
  const cls = 'flex w-full items-center gap-3.5 px-4 py-[15px] text-left transition-colors hover:bg-field';
  return (
    <div>
      {to ? (
        <Link to={to} className={cls}>
          {inner}
        </Link>
      ) : (
        <button type="button" className={cls}>
          {inner}
        </button>
      )}
      {!last && <div className="mx-4 h-px bg-line" />}
    </div>
  );
}

function MenuCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-[20px] border border-line bg-white shadow-[0_4px_14px_-8px_rgba(20,16,12,0.18)]">
      {children}
    </div>
  );
}

function MenuLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-1 pt-2 text-[10.5px] font-extrabold tracking-[1.3px] uppercase text-ink-faint">{children}</div>
  );
}

export default function ProfileScreen() {
  return (
    <div className="min-h-screen animate-screen-in bg-paper">
      <div className="bg-brand-deep">
        <div className="mx-auto max-w-5xl px-5 pt-[18px] pb-[26px] md:px-8">
          <div className="mb-[22px] flex items-center justify-between">
            <h1 className="text-lg font-extrabold text-white md:text-xl">Profile</h1>
            <Link
              to="/settings"
              aria-label="Settings"
              className="flex h-10 w-10 items-center justify-center rounded-[14px] border-[1.5px] border-white/22 transition-colors hover:bg-white/10"
            >
              <Icon d={D.settings} s={21} c="#fff" sw={1.8} />
            </Link>
          </div>
          <div className="md:flex md:items-center md:gap-10">
            <div className="flex items-center gap-4">
              <Link to="/profile/edit" className="relative shrink-0">
                <span className="flex h-[78px] w-[78px] items-center justify-center rounded-[26px] border-[3px] border-white/28 bg-gradient-to-br from-[#ffb877] to-brand-top text-[26px] font-extrabold text-white">
                  AS
                </span>
                <span className="absolute -right-1 -bottom-1 flex h-[26px] w-[26px] items-center justify-center rounded-full border-[2.5px] border-brand-deep bg-warm">
                  <Icon d={D.pen} s={12} c="#fff" sw={2.2} />
                </span>
              </Link>
              <div className="min-w-0 flex-1">
                <div className="text-xl font-extrabold tracking-tight text-white">Dr. Ahmad Santoso</div>
                <div className="mt-[3px] text-[12.5px] font-medium text-white/65">
                  Nephrology · Jakarta, Indonesia
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="rounded-full bg-warm px-[11px] py-1 text-[10.5px] font-extrabold tracking-[0.5px] text-white">
                    ● PARTICIPANT
                  </span>
                  <span className="rounded-full border border-white/18 bg-white/10 px-[11px] py-1 text-[10.5px] font-bold tracking-[0.4px] text-white/85">
                    APCN 2027
                  </span>
                </div>
              </div>
            </div>
            <StatBar
              className="mt-[22px] md:mt-0 md:min-w-[340px] md:flex-1"
              items={[
                { v: '240', l: 'Points' },
                { v: '8', l: 'Sessions' },
                { v: '3', l: 'Downloads' },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-5xl flex-col gap-2.5 px-4 pt-[18px] pb-8 md:px-8">
        <div className="md:grid md:grid-cols-2 md:items-start md:gap-6">
          <div className="flex flex-col gap-2.5">
            <MenuLabel>Account</MenuLabel>
            <MenuCard>
              <MenuRow icon={D.user} label="Edit Profile" sub="Personal info & credentials" to="/profile/edit" />
              <MenuRow icon={D.ticket} label="My Tickets" sub="Registration & access passes" badge="2" to="/profile/tickets" />
              <MenuRow icon={D.sched} label="My Schedule" sub="Saved sessions" to="/program" />
              <MenuRow icon={D.file} label="Certificates" sub="CME & attendance" to="/checkin/history" last />
            </MenuCard>
          </div>
          <div className="mt-2.5 flex flex-col gap-2.5 md:mt-0">
            <MenuLabel>Preferences</MenuLabel>
            <MenuCard>
              <MenuRow icon={D.bell} label="Notifications" sub="Push & email alerts" to="/notifications" />
              <MenuRow icon={D.globe} label="Language & Region" sub="English (US)" to="/settings" />
              <MenuRow icon={D.info} label="Help & Support" sub="FAQs and contact" last />
            </MenuCard>
            <MenuLabel>Danger Zone</MenuLabel>
            <MenuCard>
              <MenuRow icon={D.logout} label="Log Out" sub="Sign out of this device" danger to="/" last />
            </MenuCard>
          </div>
        </div>
        <div className="pt-2 text-center text-[11px] font-medium text-ink-faint">
          APCN 2027 · v1.0.0 · Build 2027.01
        </div>
      </div>
    </div>
  );
}
