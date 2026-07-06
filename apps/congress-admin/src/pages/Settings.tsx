import { useState } from 'react';
import { Panel, Toggle } from '../components/ui/bits';
import Icon from '../components/ui/Icon';
import { D } from '../data/icons';
import { TICKET_TYPES } from '../data/mock';

function LabeledInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <div className="mb-1.5 text-[12px] font-bold text-ink-soft">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-lg border border-line bg-field px-3 text-[13px] font-semibold text-ink outline-none focus:border-brand focus:bg-white"
      />
    </label>
  );
}

export default function Settings() {
  // Event info
  const [name, setName] = useState('APCN 2027 · 23rd Asia Pacific Congress of Nephrology');
  const [venue, setVenue] = useState('Bali International Convention Centre, Indonesia');
  const [dates, setDates] = useState('12–15 May 2027');
  // Feature toggles
  const [regOpen, setRegOpen] = useState(true);
  const [earlyBird, setEarlyBird] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyPush, setNotifyPush] = useState(false);
  // Editable pricing table (local state only — prototype)
  const [prices, setPrices] = useState<Record<string, string>>(
    Object.fromEntries(TICKET_TYPES.map((t) => [t.id, String(t.price)])),
  );
  const [saved, setSaved] = useState(false);

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="grid animate-fade-in gap-4 lg:grid-cols-2">
      <Panel title="Event Information">
        <div className="space-y-3.5 px-4 py-4 md:px-5">
          <LabeledInput label="Event Name" value={name} onChange={setName} />
          <LabeledInput label="Venue" value={venue} onChange={setVenue} />
          <LabeledInput label="Dates" value={dates} onChange={setDates} />
        </div>
      </Panel>

      <Panel title="Registration & Notifications">
        <div className="px-4 py-2 md:px-5">
          {[
            { l: 'Registration Open', s: 'Attendees can buy tickets', v: regOpen, set: setRegOpen },
            { l: 'Early Bird Pricing', s: '10% discount until 31 Jan 2027', v: earlyBird, set: setEarlyBird },
            { l: 'Email Notifications', s: 'Order confirmations & digests', v: notifyEmail, set: setNotifyEmail },
            { l: 'Push Notifications', s: 'Session reminders to the mobile app', v: notifyPush, set: setNotifyPush },
          ].map(({ l, s, v, set }, i, arr) => (
            <div key={l} className={`flex items-center gap-3 py-3.5 ${i < arr.length - 1 ? 'border-b border-line' : ''}`}>
              <span className="flex-1">
                <span className="block text-[13.5px] font-bold text-ink">{l}</span>
                <span className="block text-[11.5px] text-ink-soft">{s}</span>
              </span>
              <Toggle on={v} onChange={set} />
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Ticket Pricing (USD)" className="lg:col-span-2">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left">
            <thead>
              <tr className="border-b border-line">
                {['Ticket Type', 'Current Price', 'Early Bird (−10%)', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-[11px] font-extrabold tracking-[0.6px] uppercase text-ink-soft md:px-5">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TICKET_TYPES.map((t) => {
                const price = Number(prices[t.id]) || 0;
                return (
                  <tr key={t.id} className="border-b border-line last:border-b-0">
                    <td className="px-4 py-3 text-[13px] font-extrabold text-ink md:px-5">{t.name}</td>
                    <td className="px-4 py-2.5 md:px-5">
                      <input
                        value={prices[t.id]}
                        onChange={(e) =>
                          setPrices((p) => ({ ...p, [t.id]: e.target.value.replace(/\D/g, '') }))
                        }
                        inputMode="numeric"
                        className="h-9 w-24 rounded-lg border border-line bg-field px-2.5 text-[13px] font-bold text-ink outline-none focus:border-brand focus:bg-white"
                      />
                    </td>
                    <td className="px-4 py-3 text-[13px] font-bold text-good md:px-5">
                      {earlyBird ? `USD ${Math.round(price * 0.9)}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-right md:px-5">
                      <span className="text-[11.5px] font-bold text-ink-faint">auto-applied at checkout</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-line px-4 py-3.5 md:px-5">
          {saved && (
            <span className="flex items-center gap-1.5 text-[12.5px] font-extrabold text-good">
              <Icon d={D.check} s={14} c="#3f9a78" sw={2.6} />
              Settings saved
            </span>
          )}
          <button
            type="button"
            onClick={save}
            className="flex h-10 items-center gap-2 rounded-xl bg-brand px-5 text-[13px] font-extrabold text-white shadow-[0_8px_18px_-8px_rgba(241,90,36,0.6)] hover:bg-[#e0501d]"
          >
            Save Changes
          </button>
        </div>
      </Panel>
    </div>
  );
}
