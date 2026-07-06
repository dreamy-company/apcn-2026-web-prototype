import { Link } from 'react-router-dom';
import { StatCard, Panel, Badge } from '../components/ui/bits';
import { BarChart } from '../components/charts/charts';
import { QuotaBar } from '../components/ui/hotelBits';
import Icon from '../components/ui/Icon';
import { DH } from '../data/icons';
import { fmtUSD } from '../data/mock';
import { useStore } from '../state/StoreContext';
import { useScopedData, hotelName, roomTypeName } from '../state/selectors';

export default function Overview() {
  const { hotels, quotas, bookings, isAll } = useScopedData();
  const { flash } = useStore();

  // Context-aware aggregates — recompute whenever live events mutate the store.
  const allocated = quotas.reduce((s, q) => s + q.allocated, 0);
  const booked = quotas.reduce((s, q) => s + q.booked, 0);
  const held = quotas.reduce((s, q) => s + q.held, 0);
  const occupancy = Math.round(((booked + held) / Math.max(1, allocated)) * 100);
  const pending = bookings.filter((b) => b.status === 'pending').length;
  const revenue = bookings.filter((b) => b.status === 'approved').reduce((s, b) => s + b.amount, 0);

  // Room types at ≥90% of the block trigger capacity alerts.
  const nearFull = quotas.filter((q) => q.booked + q.held >= q.allocated * 0.9);

  const occupancyPerHotel = hotels.map((h) => {
    const hq = quotas.filter((q) => q.hotelId === h.id);
    const used = hq.reduce((s, q) => s + q.booked + q.held, 0);
    const total = hq.reduce((s, q) => s + q.allocated, 0);
    return { label: h.name.split(' ').slice(0, 2).join(' '), count: Math.round((used / Math.max(1, total)) * 100) };
  });

  const recent = bookings.slice(0, 7);

  return (
    <div className="animate-fade-in">
      {/* KPI cards react to the hotel switcher */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <StatCard label="Room Allocation" value={String(allocated)} delta={`${held} held`} deltaLabel="pending holds" icon={DH.bed} />
        <StatCard label="Rooms Booked" value={String(booked)} delta="+5 today" deltaLabel="via live feed" icon={DH.check} />
        <StatCard label="Occupancy" value={`${occupancy}%`} delta={`${allocated - booked - held} free`} deltaLabel="rooms remaining" icon={DH.building2} negative={occupancy >= 90} />
        <StatCard label="Confirmed Revenue" value={fmtUSD(revenue)} delta={`${pending} pending`} deltaLabel="await verification" icon={DH.wallet} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_360px]">
        {/* Left: occupancy chart (all) or per-room-type quota bars (single hotel) */}
        <Panel title={isAll ? 'Occupancy by Hotel (%)' : `Room Blocks · ${hotels[0]?.name}`}>
          {isAll ? (
            <div className="px-4 py-3">
              <BarChart data={occupancyPerHotel} />
            </div>
          ) : (
            <div className="px-4 py-2 md:px-5">
              {quotas.map((q) => {
                const key = `${q.hotelId}:${q.roomTypeId}`;
                return (
                  <div
                    key={key}
                    className={`border-b border-line py-3.5 transition-colors last:border-b-0 ${flash[key] ? 'bg-brand-soft/50' : ''}`}
                  >
                    <div className="mb-2 flex items-baseline justify-between">
                      <span className="text-[13px] font-extrabold text-ink">{roomTypeName(q.hotelId, q.roomTypeId)}</span>
                      <span className="text-[11.5px] font-bold text-ink-soft">
                        {q.booked} booked · {q.held} held · {q.allocated} allocated
                      </span>
                    </div>
                    <QuotaBar allocated={q.allocated} booked={q.booked} held={q.held} />
                  </div>
                );
              })}
            </div>
          )}
        </Panel>

        {/* Right: capacity alerts + live booking feed */}
        <div className="flex flex-col gap-4">
          <Panel
            title="Capacity Alerts"
            action={
              nearFull.length > 0 && (
                <span className="rounded-full bg-alert-soft px-2.5 py-1 text-[11px] font-extrabold text-alert">
                  {nearFull.length} near full
                </span>
              )
            }
          >
            <div className="px-4 py-2 md:px-5">
              {nearFull.length === 0 && (
                <div className="py-4 text-center text-[12.5px] font-semibold text-ink-faint">
                  All room blocks have healthy availability.
                </div>
              )}
              {nearFull.slice(0, 4).map((q) => (
                <div key={`${q.hotelId}:${q.roomTypeId}`} className="flex items-center gap-3 border-b border-line py-2.5 last:border-b-0">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-alert-soft">
                    <Icon d={DH.bell} s={15} c="#e05c5c" sw={2.2} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[12.5px] font-bold text-ink">
                      {roomTypeName(q.hotelId, q.roomTypeId)}
                    </span>
                    <span className="block text-[11px] font-medium text-ink-soft">{hotelName(q.hotelId)}</span>
                  </span>
                  <span className="text-[12px] font-extrabold text-alert">
                    {q.allocated - q.booked - q.held} left
                  </span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel
            title="Latest Booking Requests"
            action={
              <Link to="/verify" className="flex items-center gap-1 text-[12px] font-extrabold text-brand hover:opacity-75">
                Open queue
                <Icon d={DH.chev} s={13} sw={2.4} />
              </Link>
            }
          >
            <ul className="px-4 py-2 md:px-5">
              {recent.map((b) => (
                <li
                  key={b.id}
                  className={`flex items-center gap-3 border-b border-line py-2.5 transition-colors last:border-b-0 ${
                    flash[b.id] ? 'bg-brand-soft/50' : ''
                  }`}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[12.5px] font-bold text-ink">{b.participant}</span>
                    <span className="block truncate text-[11px] font-medium text-ink-soft">
                      {hotelName(b.hotelId)} · {b.checkIn}–{b.checkOut}
                    </span>
                  </span>
                  <Badge tone={b.status === 'approved' ? 'good' : b.status === 'pending' ? 'warm' : 'alert'}>
                    {b.status}
                  </Badge>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
