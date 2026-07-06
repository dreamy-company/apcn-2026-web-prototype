import { Link } from 'react-router-dom';
import { StatCard, Badge, Panel } from '../components/ui/bits';
import { LineChart, DonutChart, donutColor } from '../components/charts/charts';
import Icon from '../components/ui/Icon';
import { D } from '../data/icons';
import { ORDERS, SCANS } from '../data/mock';
import { totals, conversionRate, revenueTrend, salesByType, fmtUSD } from '../data/stats';

const ORDER_TONE = { paid: 'good', pending: 'warm', refunded: 'alert' } as const;

// 14-day window labels for the revenue trend (4–17 Jan).
const TREND_LABELS = Array.from({ length: 14 }, (_, i) => `${i + 4} Jan`);

export default function Overview() {
  const recentOrders = [...ORDERS].sort((a, b) => b.dayIndex - a.dayIndex).slice(0, 6);
  const liveScans = [...SCANS].reverse().slice(0, 7);

  return (
    <div className="animate-fade-in">
      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <StatCard label="Tickets Sold" value={String(totals.ticketsSold)} delta="+12.4%" icon={D.ticket} />
        <StatCard label="Total Revenue" value={fmtUSD(totals.revenue)} delta="+8.1%" icon={D.dollar} />
        <StatCard
          label="Check-in Conversion"
          value={`${conversionRate}%`}
          delta="+3.2 pts"
          deltaLabel="vs yesterday"
          icon={D.scan}
        />
        <StatCard
          label="E-Poster Submissions"
          value={String(totals.eposterSubmissions)}
          delta="-2.5%"
          negative
          icon={D.file}
        />
      </div>

      {/* Charts row */}
      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_340px]">
        <Panel
          title="Revenue · Last 14 Days"
          action={
            <span className="rounded-full bg-good-soft px-2.5 py-1 text-[11px] font-extrabold text-good">
              {fmtUSD(totals.revenue)} total
            </span>
          }
        >
          <div className="px-3 py-3 md:px-4">
            <LineChart data={revenueTrend} labels={TREND_LABELS.map((l, i) => (i % 2 === 0 ? l : ''))} />
          </div>
        </Panel>

        <Panel title="Sales by Ticket Type">
          <div className="flex flex-col items-center gap-4 px-5 py-4 sm:flex-row lg:flex-col xl:flex-row">
            <DonutChart data={salesByType.map((s) => ({ name: s.name, count: s.count }))} />
            <ul className="w-full space-y-2.5">
              {salesByType.map((s, i) => (
                <li key={s.id} className="flex items-center gap-2.5">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ background: donutColor(i) }} />
                  <span className="flex-1 truncate text-[12px] font-bold text-ink">{s.name}</span>
                  <span className="text-[12px] font-extrabold text-ink">{s.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </Panel>
      </div>

      {/* Tables row */}
      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_340px]">
        <Panel
          title="Recent Orders"
          action={
            <Link to="/sales" className="flex items-center gap-1 text-[12px] font-extrabold text-brand hover:opacity-75">
              View all
              <Icon d={D.chev} s={13} sw={2.4} />
            </Link>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left">
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-b border-line last:border-b-0">
                    <td className="px-4 py-3 md:px-5">
                      <div className="text-[12.5px] font-extrabold text-ink">{o.id}</div>
                      <div className="mt-0.5 text-[11.5px] font-medium text-ink-soft">{o.buyer}</div>
                    </td>
                    <td className="px-4 py-3 text-[12px] font-semibold text-ink-soft">{o.date}</td>
                    <td className="px-4 py-3 text-[13px] font-extrabold text-ink">{fmtUSD(o.amount)}</td>
                    <td className="px-4 py-3">
                      <Badge tone={ORDER_TONE[o.status]}>{o.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel
          title="Live Check-in Feed"
          action={<span className="h-2 w-2 animate-pulse rounded-full bg-good" aria-label="Live" />}
        >
          <ul className="px-4 py-2 md:px-5">
            {liveScans.map((s) => (
              <li key={s.id} className="flex items-start gap-3 border-b border-line py-2.5 last:border-b-0">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-good-soft">
                  <Icon d={D.check} s={13} c="#3f9a78" sw={2.6} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12.5px] font-bold text-ink">{s.attendee}</span>
                  <span className="block truncate text-[11px] font-medium text-ink-soft">{s.session}</span>
                </span>
                <span className="shrink-0 text-[11px] font-bold text-ink-faint">{s.time}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
