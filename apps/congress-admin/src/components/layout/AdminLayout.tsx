import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import Icon from '../ui/Icon';
import { D } from '../../data/icons';

const NAV = [
  { label: 'Overview', to: '/', icon: D.dashboard },
  { label: 'Ticket Sales', to: '/sales', icon: D.ticket },
  { label: 'Attendees', to: '/attendees', icon: D.users },
  { label: 'Check-in Logs', to: '/checkins', icon: D.scan },
  { label: 'Settings', to: '/settings', icon: D.settings },
];

const TITLES: Record<string, string> = {
  '/': 'Overview',
  '/sales': 'Ticket Sales',
  '/attendees': 'Attendee Management',
  '/checkins': 'Check-in Logs',
  '/settings': 'Settings',
};

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      {/* Brand block */}
      <div className="flex items-center gap-2.5 px-6 py-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-top to-brand text-[11px] font-extrabold text-white">
          AP
        </span>
        <span>
          <span className="block text-[15px] leading-tight font-extrabold text-white">APCN 2027</span>
          <span className="block text-[10.5px] font-semibold text-white/40">Admin Console</span>
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {NAV.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.to === '/'}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-bold transition-colors ${
                isActive ? 'bg-brand text-white shadow-[0_8px_20px_-8px_rgba(241,90,36,0.6)]' : 'text-white/55 hover:bg-white/8 hover:text-white'
              }`
            }
          >
            <Icon d={it.icon} s={19} sw={2} />
            {it.label}
          </NavLink>
        ))}
      </nav>

      {/* Live event badge + signed-in admin */}
      <div className="px-4 pb-5">
        <div className="mb-3 flex items-center gap-2 rounded-xl border border-good/30 bg-good/15 px-3 py-2.5">
          <span className="h-2 w-2 animate-pulse rounded-full bg-good" />
          <span className="text-[11.5px] font-bold text-good">Event live · Day 3 of 4</span>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-white/6 px-3 py-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#ffb877] to-brand-top text-[11px] font-extrabold text-white">
            OP
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[12.5px] font-bold text-white">Ops Team</span>
            <span className="block text-[10.5px] text-white/40">admin@apcn2027.org</span>
          </span>
          <Icon d={D.logout} s={16} c="rgba(255,255,255,0.4)" sw={2} />
        </div>
      </div>
    </>
  );
}

export default function AdminLayout() {
  const { pathname } = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-paper">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col bg-brand-deep lg:flex">
        <SidebarContent />
      </aside>

      {/* Mobile nav drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setDrawerOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <aside
            className="absolute inset-y-0 left-0 flex w-64 animate-fade-in flex-col bg-brand-deep"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent onNavigate={() => setDrawerOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-60">
        {/* Topbar: page title + global search + actions */}
        <header className="sticky top-0 z-30 border-b border-line bg-white/94 backdrop-blur-md">
          <div className="flex items-center gap-3 px-4 py-3 md:px-6">
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setDrawerOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-line lg:hidden"
            >
              <Icon d={D.menu} s={18} sw={2.2} />
            </button>
            <h1 className="flex-1 text-[17px] font-extrabold tracking-tight text-ink md:text-lg">
              {TITLES[pathname] ?? 'Admin'}
            </h1>
            <label className="hidden h-9 items-center gap-2 rounded-lg border border-line bg-field px-3 md:flex md:w-64">
              <Icon d={D.search} s={15} c="#b8b3ab" sw={2} />
              <input
                placeholder="Search orders, attendees…"
                className="w-full bg-transparent text-[13px] font-medium outline-none placeholder:text-ink-faint"
              />
            </label>
            <button
              type="button"
              aria-label="Notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-line hover:bg-field"
            >
              <Icon d={D.bell} s={17} sw={2} />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-brand" />
            </button>
          </div>
        </header>

        <main className="px-4 py-5 md:px-6 md:py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
