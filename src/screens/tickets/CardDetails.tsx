import { useState } from 'react';
import Button from '../../components/ui/Button';
import Icon from '../../components/ui/Icon';
import { GlowCircle } from '../../components/ui/bits';
import { D } from '../../data/icons';
import { useOrder } from '../../context/OrderContext';
import { PurchaseLayout } from './parts';

function formatCardNumber(v: string) {
  return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

function CardPreview({ number, holder, expiry }: { number: string; holder: string; expiry: string }) {
  const shown = number || '4891';
  const groups = formatCardNumber(shown).split(' ');
  const display = [0, 1, 2, 3]
    .map((i) => (i === 0 ? (groups[0] ?? '••••').padEnd(4, '•') : groups[i] ?? '••••'))
    .join('  ');
  return (
    <div className="relative h-[196px] w-full overflow-hidden rounded-[22px] bg-gradient-to-br from-brand-top to-brand-deep px-6 py-[22px] shadow-[0_24px_54px_-16px_rgba(20,20,20,0.55)] md:h-[220px]">
      <GlowCircle className="-top-11 -right-8 h-48 w-48 bg-[radial-gradient(circle,rgba(255,255,255,0.14),transparent_70%)]" />
      <GlowCircle className="-bottom-9 -left-4 h-40 w-40 bg-[radial-gradient(circle,rgba(31,31,31,0.28),transparent_70%)]" />
      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold tracking-[1.5px] text-white/65">APCN 2027</span>
          <span className="text-xl font-black tracking-tight text-white/90 italic">VISA</span>
        </div>
        <span className="flex h-9 w-[46px] items-center justify-center rounded-lg bg-gradient-to-br from-[#d4af37] to-[#f0d060]">
          <span className="grid h-5 w-8 grid-cols-[1fr_1px_1fr]">
            <span className="rounded-l-sm bg-white/30" />
            <span className="bg-black/12" />
            <span className="rounded-r-sm bg-white/30" />
          </span>
        </span>
        <div>
          <div className="text-lg font-bold tracking-[3px] text-white">{display}</div>
          <div className="mt-3 flex justify-between">
            <div>
              <div className="mb-[3px] text-[9px] tracking-[1px] text-white/50">CARD HOLDER</div>
              <div className="text-[13px] font-bold tracking-[0.4px] text-white uppercase">
                {holder || 'Your Name'}
              </div>
            </div>
            <div className="text-right">
              <div className="mb-[3px] text-[9px] tracking-[1px] text-white/50">EXPIRES</div>
              <div className="text-[13px] font-bold text-white">{expiry || '••/••'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CardField({
  label,
  value,
  onChange,
  placeholder,
  inputMode = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  inputMode?: 'text' | 'numeric';
}) {
  return (
    <label className="block">
      <div className="mb-[7px] text-[12.5px] font-bold text-ink-soft">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        className="h-[54px] w-full rounded-2xl border-[1.5px] border-line bg-white px-4 text-base font-bold text-ink outline-none transition-all placeholder:font-normal placeholder:text-ink-faint focus:border-brand focus:shadow-[0_0_0_4px_rgba(241,90,36,0.10)]"
      />
    </label>
  );
}

export default function CardDetailsScreen() {
  const order = useOrder();
  const [number, setNumber] = useState('');
  const [holder, setHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const footer = (
    <>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-ink-soft">Charging</span>
        <span className="text-[22px] font-extrabold text-brand">USD {order.total}</span>
      </div>
      <Button to="/tickets/receipt">Pay USD {order.total} Now</Button>
    </>
  );

  return (
    <PurchaseLayout
      step={4}
      title="Card Details"
      footer={footer}
      sidebarCta={<Button to="/tickets/receipt">Pay USD {order.total} Now</Button>}
    >
      <div className="mb-6 md:mx-auto md:max-w-md lg:mx-0">
        <CardPreview number={number} holder={holder} expiry={expiry} />
      </div>

      <div className="flex flex-col gap-3.5">
        <CardField
          label="Card Number"
          value={number}
          onChange={(v) => setNumber(formatCardNumber(v))}
          placeholder="4891 •••• •••• ••••"
          inputMode="numeric"
        />
        <CardField label="Cardholder Name" value={holder} onChange={setHolder} placeholder="Dr. Ahmad Santoso" />
        <div className="flex gap-3">
          <div className="flex-1">
            <CardField
              label="Expiry (MM/YY)"
              value={expiry}
              onChange={(v) => setExpiry(formatExpiry(v))}
              placeholder="MM/YY"
              inputMode="numeric"
            />
          </div>
          <div className="flex-1">
            <CardField
              label="CVV"
              value={cvv}
              onChange={(v) => setCvv(v.replace(/\D/g, '').slice(0, 4))}
              placeholder="•••"
              inputMode="numeric"
            />
          </div>
        </div>
      </div>

      <div className="mt-[18px] flex items-center gap-2.5 rounded-[14px] border border-good/20 bg-good-soft px-3.5 py-3">
        <Icon d={D.lock} s={18} c="#3f9a78" sw={2} />
        <div className="flex-1">
          <div className="text-[12.5px] font-bold text-good">Secure Payment</div>
          <div className="mt-px text-[11.5px] text-ink-soft">Your card info is encrypted and never stored.</div>
        </div>
      </div>
    </PurchaseLayout>
  );
}
