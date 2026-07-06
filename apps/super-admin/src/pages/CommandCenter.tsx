import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { StatCard, Badge, Panel } from '../components/ui/bits';
import { LineChart, DonutChart, donutColor } from '../components/charts/charts';
import Icon from '../components/ui/Icon';
import { D } from '../data/icons';
import { useStore } from '../state/StoreContext';
import { LEDGER, HOTELS, SPONSORS, hotelById, fmtUSD, type LedgerSource } from '../data/mock';

const SOURCES: LedgerSource[] = ['Tickets', 'Hotels', 'Sponsors'];
const SEVERITY_TONE = { info: 'neutral', override: 'brand', critical: 'alert' } as const;

// 14-day window labels shared with the ledger trend (4–17 Jan).
const TREND_LABELS = Array.from({ length: 14 }, (_, i) => `${i + 4} Jan`);

export default function CommandCenter() {
  const { state } = useStore();

  // Aggregates over the unified ledger + live store — the "one number" views.
  const stats = useMemo(() => {
    const settled = LEDGER.filter((l) => l.status === 'settled');
    const revenue = settled.reduce((s, l) => s + l.amount, 0);
    const bySource = SOURCES.map((src) => ({
      name: src,
      count: settled.filter((l) => l.source === src).reduce((s, l) => s + l.amount, 0),
    }));
    // Occupancy = committed rooms (booked + held) ÷ allocated block, per hotel.
    const occupancy = HOTELS.map((h) => {
      const qs = state.quotas.filter((q) => q.hotelId === h.id);
      const committed = qs.reduce((s, q) => s + q.booked + q.held, 0);
      const allocated = qs.reduce((s, q) => s + q.allocated, 0);
      return { hotel: h, pct: Math.round((committed / allocated) * 100) };
    });
    const globalOcc = Math.round(
      (occupancy.reduce((s, o) => s + o.pct, 0) / occupancy.length),
    );
    // Daily settled inflow across all three streams.
    const trend = Array.from({ length: 14 }, (_, day) =>
      settled.filter((l) => l.dayIndex === day && l.amount > 0).reduce((s, l) => s + l.amount, 0),
    );
    return { revenue, bySource, occupancy, globalOcc, trend };
  }, [state.quotas]);

  const activeSponsors = SPONSORS.filter((s) => s.paid > 0).length;
  const clashes = state.sponsorships.filter((s) => s.status === 'clash').length;
  const recentAudit = state.audit.slice(0, 7);

  return (
    <div className="animate-fade-in">
      {/* Global KPI cards — one per governed domain + the aggregate */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <StatCard label="Total Revenue" value={fmtUSD(stats.revenue)} delta="+9.6%" icon={D.dollar} />
        <StatCard label="Total Attendees" value={String(state.tickets.length)} delta="+12.4%" icon={D.users} />
        <StatCard label="Active Sponsors" value={`${activeSponsors} / ${SPONSORS.length}`} delta="+1" deltaLabel="new this week" icon={D.briefcase} />
        <StatCard
          label="Global Hotel Occupancy"
          value={`${stats.globalOcc}%`}
          delta="+4.1 pts"
          deltaLabel="vs last week"
          icon={D.building}
        />
      </div>

      {/* Charts row: unified inflow trend + revenue mix by stream */}
      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_340px]">
        <Panel
          title="Settled Inflow · All Streams · Last 14 Days"
          action={
            <span className="rounded-full bg-good-soft px-2.5 py-1 text-[11px] font-extrabold text-good">
              {fmtUSD(stats.revenue)} total
            </span>
          }
        >
          <div className="px-3 py-3 md:px-4">
            <LineChart data={stats.trend} labels={TREND_LABELS.map((l, i) => (i % 2 === 0 ? l : ''))} />
          </div>
        </Panel>

        <Panel title="Revenue Mix by Stream">
          <div className="flex flex-col items-center gap-4 px-5 py-4">
            <DonutChart data={stats.bySource.map((s) => ({ name: s.name, count: Math.round(s.count / 1000) }))} />
            <ul className="w-full space-y-2.5">
              {stats.bySource.map((s, i) => (
                <li key={s.name} className="flex items-center gap-2.5">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ background: donutColor(i) }} />
                  <span className="flex-1 truncate text-[12px] font-bold text-ink">{s.name}</span>
                  <span className="text-[12px] font-extrabold text-ink">{fmtUSD(s.count)}</span>
                </li>
              ))}
            </ul>
          </div>
        </Panel>
      </div>

      {/* Domain health row: occupancy per property + attention queue + audit feed */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel
          title="Occupancy by Property"
          action={
            <Link to="/hotels" className="flex items-center gap-1 text-[12px] font-extrabold text-brand hover:opacity-75">
              Manage quotas
              <Icon d={D.chev} s={13} sw={2.4} />
            </Link>
          }
        >
          <ul className="px-4 py-3 md:px-5">
            {stats.occupancy.map(({ hotel, pct }) => (
              <li key={hotel.id} className="border-b border-line py-2.5 last:border-b-0">
                <div className="flex items-center justify-between">
                  <span className="truncate text-[12.5px] font-bold text-ink">{hotel.name}</span>
                  <span className={`text-[12px] font-extrabold ${pct > 100 ? 'text-alert' : 'text-ink'}`}>{pct}%</span>
                </div>
                {/* Simple div-based bar; >100% (forced overrides) renders red */}
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-field">
                  <div
                    className={pct > 100 ? 'h-full bg-alert' : pct > 85 ? 'h-full bg-brand' : 'h-full bg-brand-top'}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Needs Attention">
          <ul className="px-4 py-3 md:px-5">
            {[
              { icon: D.alertTri, tone: 'text-alert bg-alert-soft', label: `${clashes} sponsor clash${clashes === 1 ? '' : 'es'} awaiting ruling`, to: '/sponsors' },
              { icon: D.building, tone: 'text-brand bg-brand-soft', label: `${state.quotas.filter((q) => q.booked + q.held > q.allocated).length} room blocks over-committed`, to: '/hotels' },
              { icon: D.dollar, tone: 'text-brand bg-brand-soft', label: `${LEDGER.filter((l) => l.status === 'pending').length} ledger lines unreconciled`, to: '/ledger' },
              { icon: D.ban, tone: 'text-ink-soft bg-field', label: `${state.admins.filter((a) => a.status === 'suspended').length} sub-admin account suspended`, to: '/access' },
              { icon: D.ticket, tone: 'text-good bg-good-soft', label: `${state.tickets.filter((t) => t.status === 'no-show').length} no-shows flagged for follow-up`, to: '/tickets' },
            ].map((it) => (
              <li key={it.label}>
                <Link to={it.to} className="group flex items-center gap-3 border-b border-line py-2.5 last:border-b-0">
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${it.tone}`}>
                    <Icon d={it.icon} s={15} sw={2.2} />
                  </span>
                  <span className="flex-1 text-[12.5px] font-bold text-ink group-hover:text-brand">{it.label}</span>
                  <Icon d={D.chev} s={14} c="#b8b3ab" sw={2.2} />
                </Link>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          title="Latest Audit Activity"
          action={
            <Link to="/access" className="flex items-center gap-1 text-[12px] font-extrabold text-brand hover:opacity-75">
              Full log
              <Icon d={D.chev} s={13} sw={2.4} />
            </Link>
          }
        >
          <ul className="px-4 py-2 md:px-5">
            {recentAudit.map((e) => (
              <li key={e.id} className="flex items-start gap-3 border-b border-line py-2.5 last:border-b-0">
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12.5px] font-bold text-ink">{e.action} · {e.target}</span>
                  <span className="block truncate text-[11px] font-medium text-ink-soft">{e.actor} · {e.at}</span>
                </span>
                <Badge tone={SEVERITY_TONE[e.severity]}>{e.severity}</Badge>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {/* Sponsor commitment strip — contract value vs cash received */}
      <div className="mt-4">
        <Panel
          title="Sponsor Commitments vs Received"
          action={
            <Link to="/sponsors" className="flex items-center gap-1 text-[12px] font-extrabold text-brand hover:opacity-75">
              Allocations
              <Icon d={D.chev} s={13} sw={2.4} />
            </Link>
          }
        >
          <div className="grid gap-x-6 gap-y-3 px-4 py-4 sm:grid-cols-2 md:px-5 xl:grid-cols-3">
            {SPONSORS.map((s) => {
              const pct = Math.round((s.paid / s.committed) * 100);
              const hotels = state.sponsorships.filter((x) => x.sponsorId === s.id && x.hotelId).length;
              return (
                <div key={s.id} className="rounded-xl border border-line p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="truncate text-[13px] font-extrabold text-ink">{s.company}</span>
                    <Badge tone={s.tier === 'Platinum' ? 'brand' : s.tier === 'Gold' ? 'warm' : 'neutral'}>{s.tier}</Badge>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-field">
                    <div className={`h-full ${pct === 100 ? 'bg-good' : 'bg-brand'}`} style={{ width: `${pct}%` }} />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[11px] font-bold">
                    <span className="text-ink-soft">{fmtUSD(s.paid)} of {fmtUSD(s.committed)}</span>
                    <span className={pct === 100 ? 'text-good' : 'text-brand'}>{pct}%</span>
                  </div>
                  <div className="mt-1 text-[10.5px] font-semibold text-ink-faint">
                    {hotels} sponsored stays · e.g. {hotelById(state.sponsorships.find((x) => x.sponsorId === s.id && x.hotelId)?.hotelId ?? '')?.name ?? '—'}
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>
    </div>
  );
}
