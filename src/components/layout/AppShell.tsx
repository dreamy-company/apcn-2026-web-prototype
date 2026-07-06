import { NavLink, Outlet, useLocation } from 'react-router-dom';
import Icon from '../ui/Icon';
import { D } from '../../data/icons';

const NAV_ITEMS = [
  { key: 'Home', d: D.home, to: '/dashboard' },
  { key: 'Program', d: D.sched, to: '/program' },
  { key: 'Speakers', d: D.person, to: '/speakers' },
  { key: 'E-Poster', d: D.image, to: '/eposter' },
  { key: 'Check-in', d: D.check, to: '/checkin/history' },
  { key: 'Alerts', d: D.bell, to: '/notifications' },
  { key: 'Profile', d: D.user, to: '/profile' },
];

// Mobile keeps the prototype's 5-slot tab bar with a central search FAB.
const MOBILE_ITEMS = [
  { key: 'Home', d: D.home, to: '/dashboard' },
  { key: 'Program', d: D.sched, to: '/program' },
  { key: 'Search', d: D.search, to: '/program', fab: true },
  { key: 'Alerts', d: D.bell, to: '/notifications' },
  { key: 'Profile', d: D.user, to: '/profile' },
];

function DesktopSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-line bg-white md:flex">
      <NavLink to="/dashboard" className="flex items-center gap-2.5 px-6 py-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-top to-brand text-[11px] font-extrabold text-white">
          AP
        </span>
        <span>
          <span className="block text-[15px] leading-tight font-extrabold text-ink">APCN 2027</span>
          <span className="block text-[10.5px] font-semibold text-ink-faint">Bali · 12–15 May</span>
        </span>
      </NavLink>
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {NAV_ITEMS.map((it) => (
          <NavLink
            key={it.key}
            to={it.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-bold transition-colors ${
                isActive ? 'bg-brand-soft text-brand' : 'text-ink-soft hover:bg-field hover:text-ink'
              }`
            }
          >
            <Icon d={it.d} s={19} sw={2} />
            {it.key}
          </NavLink>
        ))}
      </nav>
      <div className="px-3 pb-6">
        <NavLink
          to="/tickets"
          className="flex items-center justify-center gap-2 rounded-xl bg-brand px-3.5 py-3 text-sm font-extrabold text-white shadow-[0_10px_24px_-10px_rgba(241,90,36,0.6)] transition-transform hover:bg-[#e0501d] active:scale-[0.98]"
        >
          <Icon d={D.ticket} s={18} sw={2} />
          Buy Ticket
        </NavLink>
      </div>
    </aside>
  );
}

function MobileTabBar() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 bg-white px-2.5 pt-1.5 shadow-[0_-2px_12px_-4px_rgba(20,20,20,0.12)] md:hidden">
      <div className="flex h-[62px] items-center pb-[env(safe-area-inset-bottom)]">
        {MOBILE_ITEMS.map((it) => {
          const on = !it.fab && pathname.startsWith(it.to);
          if (it.fab) {
            return (
              <NavLink key={it.key} to={it.to} className="flex flex-1 flex-col items-center gap-1">
                <span className="-mt-[18px] flex h-[50px] w-[50px] items-center justify-center rounded-full bg-gradient-to-br from-brand-top to-brand shadow-[0_6px_18px_-6px_rgba(241,90,36,0.7)]">
                  <Icon d={D.search} s={20} c="#fff" sw={2.2} />
                </span>
                <span className="text-[10px] font-bold text-brand">{it.key}</span>
              </NavLink>
            );
          }
          return (
            <NavLink key={it.key} to={it.to} className="flex flex-1 flex-col items-center gap-1 pt-1">
              <Icon d={it.d} s={22} c={on ? '#f15a24' : '#b8b3ab'} sw={2} />
              <span className={`text-[10px] ${on ? 'font-extrabold text-brand' : 'font-semibold text-ink-faint'}`}>
                {it.key}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

export default function AppShell() {
  return (
    <div className="min-h-screen bg-paper">
      <DesktopSidebar />
      <main className="pb-[78px] md:pb-0 md:pl-60">
        <Outlet />
      </main>
      <MobileTabBar />
    </div>
  );
}
