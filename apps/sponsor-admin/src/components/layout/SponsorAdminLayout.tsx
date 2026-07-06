import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import Icon from '../ui/Icon';
import { DH } from '../../data/icons';
import { SPONSOR } from '../../data/mock';
import { useStore } from '../../state/StoreContext';
import { useLiveSync } from '../../hooks/useLiveSync';

const NAV = [
  { label: 'Overview', to: '/', icon: DH.dashboard },
  { label: 'Sponsored Doctors', to: '/doctors', icon: DH.users },
  { label: 'Payments & Contract', to: '/payments', icon: DH.wallet },
];

const TITLES: Record<string, string> = {
  '/': 'Sponsorship Overview',
  '/doctors': 'Sponsored Doctors',
  '/payments': 'Payments & Contract',
};

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { doctors } = useStore();
  const used = doctors.filter((d) => d.status !== 'draft').length;
  const clashes = doctors.filter((d) => d.status === 'clash').length;

  return (
    <>
      {/* Company block — the sponsor's identity and tier */}
      <div className="flex items-center gap-2.5 px-6 pt-6 pb-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-top to-brand text-[13px] font-extrabold text-white">
          K
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[15px] leading-tight font-extrabold text-white">
            {SPONSOR.company}
          </span>
          <span className="mt-0.5 flex items-center gap-1.5">
            <span className="rounded-md bg-brand/25 px-1.5 py-px text-[9.5px] font-extrabold tracking-[0.6px] text-brand-top uppercase">
              {SPONSOR.tier}
            </span>
            <span className="text-[10.5px] font-semibold text-white/40">APCN 2027</span>
          </span>
        </span>
      </div>

      {/* Seat usage — the sponsor's core budget at a glance */}
      <div className="mx-3 rounded-xl border border-white/12 bg-white/6 px-3.5 py-3">
        <div className="mb-1.5 flex items-baseline justify-between">
          <span className="text-[10.5px] font-extrabold tracking-[0.8px] uppercase text-white/45">
            Delegate Seats
          </span>
          <span className="text-[12px] font-extrabold text-white">
            {used}<span className="text-white/40"> / {SPONSOR.seats}</span>
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/12">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-top to-brand transition-all duration-500"
            style={{ width: `${Math.min(100, (used / SPONSOR.seats) * 100)}%` }}
          />
        </div>
      </div>

      <nav className="mt-4 flex flex-1 flex-col gap-1 px-3">
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
            <span className="flex-1">{it.label}</span>
            {it.to === '/doctors' && clashes > 0 && (
              <span className="flex h-[20px] min-w-[20px] animate-pulse items-center justify-center rounded-full bg-alert px-1.5 text-[10.5px] font-extrabold text-white">
                {clashes}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 pb-5">
        <div className="flex items-center gap-3 rounded-xl bg-white/6 px-3 py-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#ffb877] to-brand-top text-[11px] font-extrabold text-white">
            KE
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[12.5px] font-bold text-white">Kidneya Events</span>
            <span className="block truncate text-[10.5px] text-white/40">{SPONSOR.pic}</span>
          </span>
          <Icon d={DH.logout} s={16} c="rgba(255,255,255,0.4)" sw={2} />
        </div>
      </div>
    </>
  );
}

export default function SponsorAdminLayout() {
  const { pathname } = useLocation();
  const { connected, secondsAgo } = useLiveSync();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-paper">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-brand-deep lg:flex">
        <SidebarContent />
      </aside>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setDrawerOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <aside
            className="absolute inset-y-0 left-0 flex w-72 animate-fade-in flex-col bg-brand-deep"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent onNavigate={() => setDrawerOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-line bg-white/94 backdrop-blur-md">
          <div className="flex items-center gap-3 px-4 py-3 md:px-6">
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setDrawerOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-line lg:hidden"
            >
              <Icon d={DH.menu} s={18} sw={2.2} />
            </button>
            <h1 className="flex-1 text-[17px] font-extrabold tracking-tight text-ink md:text-lg">
              {TITLES[pathname] ?? 'Sponsor Admin'}
            </h1>
            {/* Clash-checker feed status */}
            <span
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11.5px] font-extrabold ${
                connected ? 'border-good/25 bg-good-soft text-good' : 'border-alert/25 bg-alert-soft text-alert'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${connected ? 'animate-pulse bg-good' : 'bg-alert'}`} />
              {connected ? `Live · synced ${secondsAgo}s ago` : 'Reconnecting…'}
            </span>
          </div>
        </header>

        <main className="px-4 py-5 md:px-6 md:py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
