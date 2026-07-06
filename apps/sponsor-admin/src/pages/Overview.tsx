import { Link } from 'react-router-dom';
import { StatCard, Panel, Badge } from '../components/ui/bits';
import { DonutChart, donutColor } from '../components/charts/charts';
import Icon from '../components/ui/Icon';
import { DH } from '../data/icons';
import { SPONSOR, PACKAGES, packageById, fmtUSD } from '../data/mock';
import { useStore } from '../state/StoreContext';

const STATUS_TONE = { confirmed: 'good', submitted: 'warm', draft: 'neutral', clash: 'alert' } as const;

export default function Overview() {
  const { doctors, flash } = useStore();

  const used = doctors.filter((d) => d.status !== 'draft').length;
  const confirmed = doctors.filter((d) => d.status === 'confirmed').length;
  const inReview = doctors.filter((d) => d.status === 'submitted').length;
  const clashes = doctors.filter((d) => d.status === 'clash').length;
  // Committed spend = package cost of every non-draft doctor.
  const invested = doctors
    .filter((d) => d.status !== 'draft')
    .reduce((s, d) => s + packageById(d.pkg).cost, 0);

  const pkgMix = PACKAGES.map((p) => ({
    name: p.name,
    count: doctors.filter((d) => d.pkg === p.id && d.status !== 'draft').length,
  }));

  const recent = doctors.slice(0, 7);

  return (
    <div className="animate-fade-in">
      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <StatCard
          label="Seats Used"
          value={`${used} / ${SPONSOR.seats}`}
          delta={`${SPONSOR.seats - used} left`}
          deltaLabel="in allocation"
          icon={DH.users}
        />
        <StatCard label="Confirmed Delegates" value={String(confirmed)} delta={`${inReview} in review`} deltaLabel="clash check running" icon={DH.check} />
        <StatCard
          label="Needs Attention"
          value={String(clashes)}
          delta={clashes > 0 ? 'clash hold' : 'all clear'}
          deltaLabel="resolved by congress"
          icon={DH.bell}
          negative={clashes > 0}
        />
        <StatCard label="Delegate Spend" value={fmtUSD(invested)} delta={fmtUSD(SPONSOR.paid)} deltaLabel="contract paid so far" icon={DH.wallet} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[360px_1fr]">
        {/* Package mix donut */}
        <Panel title="Package Mix">
          <div className="flex flex-col items-center gap-4 px-5 py-4">
            <DonutChart data={pkgMix} centerLabel="delegates" centerValue={String(used)} />
            <ul className="w-full space-y-2.5">
              {pkgMix.map((p, i) => (
                <li key={p.name} className="flex items-center gap-2.5">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ background: donutColor(i) }} />
                  <span className="flex-1 text-[12px] font-bold text-ink">{p.name}</span>
                  <span className="text-[12px] font-extrabold text-ink">{p.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </Panel>

        {/* Live roster activity */}
        <Panel
          title="Latest Roster Activity"
          action={
            <Link to="/doctors" className="flex items-center gap-1 text-[12px] font-extrabold text-brand hover:opacity-75">
              Manage roster
              <Icon d={DH.chev} s={13} sw={2.4} />
            </Link>
          }
        >
          <ul className="px-4 py-2 md:px-5">
            {recent.map((d) => (
              <li
                key={d.id}
                className={`flex items-center gap-3 border-b border-line py-2.5 transition-colors last:border-b-0 ${
                  flash[d.id] ? 'bg-brand-soft/50' : ''
                }`}
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12.5px] font-bold text-ink">{d.name}</span>
                  <span className="block truncate text-[11px] font-medium text-ink-soft">
                    {d.institution} · {packageById(d.pkg).name}
                  </span>
                </span>
                {d.badgeId && (
                  <span className="hidden text-[10.5px] font-bold tracking-wide text-ink-faint sm:block">
                    {d.badgeId}
                  </span>
                )}
                <Badge tone={STATUS_TONE[d.status]}>{d.status}</Badge>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {/* Clash advisory — the sponsor can't resolve these; set expectations */}
      {clashes > 0 && (
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-alert/25 bg-alert-soft px-4 py-3.5">
          <Icon d={DH.bell} s={18} c="#e05c5c" sw={2} />
          <div className="text-[12.5px] leading-relaxed font-semibold text-ink">
            <span className="font-extrabold text-alert">{clashes} delegate{clashes > 1 ? 's are' : ' is'} on clash hold</span>{' '}
            — another sponsor claimed the same doctor. The congress secretariat resolves these;
            you'll see the verdict here live. No action needed from your side.
          </div>
        </div>
      )}
    </div>
  );
}
