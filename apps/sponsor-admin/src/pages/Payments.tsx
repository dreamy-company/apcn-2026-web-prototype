import { Badge, Panel } from '../components/ui/bits';
import Icon from '../components/ui/Icon';
import { DH } from '../data/icons';
import { SPONSOR, TIER_BENEFITS, INSTALMENTS, fmtUSD } from '../data/mock';

const STATUS_TONE = { settled: 'good', due: 'warm', upcoming: 'neutral' } as const;

export default function Payments() {
  const paidPct = Math.round((SPONSOR.paid / SPONSOR.committed) * 100);
  const nextDue = INSTALMENTS.find((i) => i.status === 'due');

  return (
    <div className="grid animate-fade-in gap-4 lg:grid-cols-[1fr_360px]">
      <div className="flex flex-col gap-4">
        {/* Contract progress */}
        <Panel title="Contract Progress">
          <div className="px-5 py-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <div className="text-[11px] font-extrabold tracking-[0.6px] uppercase text-ink-faint">
                  Paid to date
                </div>
                <div className="mt-1 text-[30px] font-extrabold tracking-tight text-ink">
                  {fmtUSD(SPONSOR.paid)}
                  <span className="ml-2 text-[15px] font-bold text-ink-faint">of {fmtUSD(SPONSOR.committed)}</span>
                </div>
              </div>
              <span className="rounded-full bg-good-soft px-3 py-1.5 text-[13px] font-extrabold text-good">
                {paidPct}% settled
              </span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-field">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-top to-brand transition-all duration-500"
                style={{ width: `${paidPct}%` }}
              />
            </div>
            {nextDue && (
              <div className="mt-3.5 flex items-center gap-2.5 rounded-xl border border-warm-soft bg-warm-soft/60 px-3.5 py-2.5">
                <Icon d={DH.clock} s={16} c="#2b2b2b" sw={2} />
                <span className="text-[12.5px] font-semibold text-ink">
                  Next instalment <span className="font-extrabold">{fmtUSD(nextDue.amount)}</span> due{' '}
                  <span className="font-extrabold">{nextDue.due}</span>
                </span>
              </div>
            )}
          </div>
        </Panel>

        {/* Instalment schedule */}
        <Panel title="Instalment Schedule">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left">
              <thead>
                <tr className="border-b border-line">
                  {['#', 'Amount', 'Due Date', 'Status', 'Paid', 'Reference', ''].map((h) => (
                    <th key={h} className="px-4 py-3 text-[11px] font-extrabold tracking-[0.6px] uppercase text-ink-soft md:px-5">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {INSTALMENTS.map((inst) => (
                  <tr key={inst.no} className="border-b border-line last:border-b-0">
                    <td className="px-4 py-3.5 text-[13px] font-extrabold text-ink md:px-5">{inst.no}</td>
                    <td className="px-4 py-3.5 text-[13px] font-extrabold text-ink md:px-5">{fmtUSD(inst.amount)}</td>
                    <td className="px-4 py-3.5 text-[13px] font-semibold text-ink-soft md:px-5">{inst.due}</td>
                    <td className="px-4 py-3.5 md:px-5">
                      <Badge tone={STATUS_TONE[inst.status]}>{inst.status}</Badge>
                    </td>
                    <td className="px-4 py-3.5 text-[12.5px] font-semibold text-ink-soft md:px-5">{inst.paidAt ?? '—'}</td>
                    <td className="px-4 py-3.5 text-[12px] font-semibold tracking-wide text-ink-faint md:px-5">{inst.ref ?? '—'}</td>
                    <td className="px-4 py-3.5 text-right md:px-5">
                      {inst.status === 'settled' ? (
                        <button type="button" className="flex items-center gap-1.5 text-[12px] font-extrabold text-brand hover:opacity-75">
                          <Icon d={DH.dl} s={13} sw={2.2} />
                          Invoice
                        </button>
                      ) : inst.status === 'due' ? (
                        <button type="button" className="flex h-8 items-center rounded-lg bg-brand px-3 text-[12px] font-extrabold text-white shadow-[0_6px_14px_-6px_rgba(241,90,36,0.6)] hover:bg-[#e0501d]">
                          Pay now
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>

      {/* Contract summary + tier benefits */}
      <div className="flex flex-col gap-4">
        <Panel title="Contract Summary">
          <div className="grid grid-cols-2 gap-3 px-5 py-4">
            {[
              { l: 'Sponsor ID', v: SPONSOR.id },
              { l: 'Tier', v: SPONSOR.tier },
              { l: 'Commitment', v: fmtUSD(SPONSOR.committed) },
              { l: 'Delegate Seats', v: String(SPONSOR.seats) },
              { l: 'PIC Account', v: SPONSOR.pic },
              { l: 'Congress', v: 'APCN 2027 · Bali' },
            ].map(({ l, v }) => (
              <div key={l} className="rounded-xl bg-field px-3.5 py-3">
                <div className="text-[10px] font-bold tracking-[0.6px] uppercase text-ink-faint">{l}</div>
                <div className="mt-1 truncate text-[12.5px] font-bold text-ink">{v}</div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title={`${SPONSOR.tier} Tier Benefits`}>
          <ul className="px-5 py-3">
            {TIER_BENEFITS.map((b) => (
              <li key={b} className="flex items-start gap-2.5 border-b border-line py-2.5 last:border-b-0">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-good-soft">
                  <Icon d={DH.check} s={11} c="#3f9a78" sw={3} />
                </span>
                <span className="text-[12.5px] leading-snug font-semibold text-ink">{b}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
