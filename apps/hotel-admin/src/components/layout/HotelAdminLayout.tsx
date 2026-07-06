import { useMemo, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import Icon from '../ui/Icon';
import { DH } from '../../data/icons';
import { HOTELS } from '../../data/hotels';
import { useHotel } from '../../state/HotelContext';
import { useStore } from '../../state/StoreContext';
import { useLiveSync } from '../../hooks/useLiveSync';

const NAV = [
  { label: 'Overview', to: '/', icon: DH.dashboard },
  { label: 'Quota Management', to: '/quota', icon: DH.bed },
  { label: 'Verification Queue', to: '/verify', icon: DH.check },
  { label: 'Financial Recap', to: '/finance', icon: DH.wallet },
];

const TITLES: Record<string, string> = {
  '/': 'Overview',
  '/quota': 'Quota Management',
  '/verify': 'Booking Verification',
  '/finance': 'Financial Recap',
};

/** Multi-hotel context switcher — the heart of the sidebar. */
function HotelSwitcher({ onPick }: { onPick?: () => void }) {
  const { selected, setSelected } = useHotel();
  const { quotas } = useStore();
  const [open, setOpen] = useState(false);

  // Occupancy hint shown per hotel in the dropdown.
  const occupancy = useMemo(() => {
    const map: Record<string, { used: number; total: number }> = {};
    for (const q of quotas) {
      const m = (map[q.hotelId] ??= { used: 0, total: 0 });
      m.used += q.booked + q.held;
      m.total += q.allocated;
    }
    return map;
  }, [quotas]);

  const current = selected === 'all' ? null : HOTELS.find((h) => h.id === selected);

  return (
    <div className="relative px-3">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2.5 rounded-xl border border-white/12 bg-white/6 px-3 py-2.5 text-left transition-colors hover:bg-white/10"
      >
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white"
          style={{ background: current ? current.color : 'linear-gradient(135deg,#f7931e,#f15a24)' }}
        >
          <Icon d={current ? DH.building2 : DH.globe} s={16} c="#fff" sw={2} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-extrabold text-white">
            {current ? current.name : 'All Properties'}
          </span>
          <span className="block text-[10.5px] font-semibold text-white/45">
            {current ? `${current.area} · ${current.stars}★ · ${current.distanceKm} km to venue` : `${HOTELS.length} hotels · aggregated`}
          </span>
        </span>
        <Icon d={DH.chevDown} s={15} c="rgba(255,255,255,0.5)" sw={2.2} className={open ? 'rotate-180' : ''} />
      </button>

      {open && (
        <div className="absolute inset-x-3 z-50 mt-1.5 animate-fade-in overflow-hidden rounded-xl border border-white/10 bg-[#232323] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.6)]">
          {[{ id: 'all' as const, name: 'All Properties', sub: 'Aggregated summary' }, ...HOTELS.map((h) => ({ id: h.id, name: h.name, sub: `${h.area} · ${h.stars}★` }))].map(
            (opt) => {
              const occ = opt.id !== 'all' ? occupancy[opt.id] : undefined;
              const on = selected === opt.id;
              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => {
                    setSelected(opt.id);
                    setOpen(false);
                    onPick?.();
                  }}
                  className={`flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left transition-colors ${
                    on ? 'bg-brand/20' : 'hover:bg-white/6'
                  }`}
                >
                  <span className="min-w-0 flex-1">
                    <span className={`block truncate text-[12.5px] font-bold ${on ? 'text-brand-top' : 'text-white'}`}>
                      {opt.name}
                    </span>
                    <span className="block text-[10.5px] text-white/40">{opt.sub}</span>
                  </span>
                  {occ && (
                    <span className="shrink-0 text-[10.5px] font-extrabold text-white/55">
                      {Math.round((occ.used / occ.total) * 100)}%
                    </span>
                  )}
                  {on && <Icon d={DH.check} s={14} c="#f7931e" sw={2.6} />}
                </button>
              );
            },
          )}
        </div>
      )}
    </div>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { bookings } = useStore();
  const pendingCount = bookings.filter((b) => b.status === 'pending').length;

  return (
    <>
      <div className="flex items-center gap-2.5 px-6 pt-6 pb-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-top to-brand text-white">
          <Icon d={DH.bed} s={18} c="#fff" sw={2} />
        </span>
        <span>
          <span className="block text-[15px] leading-tight font-extrabold text-white">APCN Hotels</span>
          <span className="block text-[10.5px] font-semibold text-white/40">Accommodation Desk</span>
        </span>
      </div>

      <HotelSwitcher onPick={onNavigate} />

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
            {it.to === '/verify' && pendingCount > 0 && (
              <span className="flex h-[20px] min-w-[20px] animate-pulse items-center justify-center rounded-full bg-brand-top px-1.5 text-[10.5px] font-extrabold text-white">
                {pendingCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 pb-5">
        <div className="flex items-center gap-3 rounded-xl bg-white/6 px-3 py-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#ffb877] to-brand-top text-[11px] font-extrabold text-white">
            HD
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[12.5px] font-bold text-white">Hotel Desk</span>
            <span className="block text-[10.5px] text-white/40">hotels@apcn2027.org</span>
          </span>
          <Icon d={DH.logout} s={16} c="rgba(255,255,255,0.4)" sw={2} />
        </div>
      </div>
    </>
  );
}

export default function HotelAdminLayout() {
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
              {TITLES[pathname] ?? 'Hotel Admin'}
            </h1>
            {/* Live connection chip — reflects the (mock) SSE feed status. */}
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
