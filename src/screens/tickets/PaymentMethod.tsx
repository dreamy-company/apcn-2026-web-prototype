import { useNavigate } from 'react-router-dom';
import Icon from '../../components/ui/Icon';
import Button from '../../components/ui/Button';
import { SecLabel } from '../../components/ui/bits';
import { D } from '../../data/icons';
import { PAYMENT_METHODS, WALLETS, type PaymentOption } from '../../data/tickets';
import { useOrder } from '../../context/OrderContext';
import { PurchaseLayout } from './parts';

function PayRow({ option, selected, onSelect }: { option: PaymentOption; selected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-center gap-3.5 rounded-2xl border-[1.5px] px-4 py-3.5 text-left transition-all ${
        selected
          ? 'border-brand bg-brand-soft shadow-[0_6px_18px_-8px_rgba(241,90,36,0.3)]'
          : 'border-[#ded9d2] bg-white shadow-[0_2px_8px_-4px_rgba(20,16,12,0.12)] hover:border-ink-faint'
      }`}
    >
      <span className={`flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[13px] ${selected ? 'bg-brand' : 'bg-field'}`}>
        <Icon d={D.card} s={20} c={selected ? '#fff' : '#f15a24'} sw={1.9} />
      </span>
      <span className="flex-1">
        <span className={`flex items-center gap-2 text-[14.5px] font-extrabold ${selected ? 'text-brand' : 'text-ink'}`}>
          {option.label}
          {option.tag && (
            <span className="rounded-full bg-warm px-[7px] py-0.5 text-[10px] font-extrabold text-white">{option.tag}</span>
          )}
        </span>
        {option.sub && <span className="mt-0.5 block text-xs text-ink-soft">{option.sub}</span>}
      </span>
      <span
        className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-2 ${
          selected ? 'border-brand bg-brand' : 'border-[#ded9d2] bg-transparent'
        }`}
      >
        {selected && <Icon d={D.check} s={12} c="#fff" sw={3} />}
      </span>
    </button>
  );
}

export default function PaymentMethodScreen() {
  const order = useOrder();
  const navigate = useNavigate();
  const continueTo = order.paymentMethod === 'card' ? '/tickets/card' : '/tickets/receipt';

  const footer = (
    <>
      <div className="mb-3 flex items-center gap-1.5">
        <Icon d={D.lock} s={14} c="#3f9a78" sw={2} />
        <span className="text-[11.5px] font-semibold text-ink-soft">Secured by SSL · 256-bit encryption</span>
      </div>
      <Button to={continueTo} trailingIcon={D.chev}>
        Continue to Payment
      </Button>
    </>
  );

  return (
    <PurchaseLayout
      step={3}
      title="Payment Method"
      footer={footer}
      sidebarCta={
        <Button to={continueTo} trailingIcon={D.chev}>
          Continue to Payment
        </Button>
      }
    >
      <div className="mb-5 flex justify-center lg:justify-start">
        <div className="flex items-center gap-2.5 rounded-full border-[1.5px] border-brand/20 bg-brand-soft px-6 py-2.5">
          <Icon d={D.card} s={18} c="#f15a24" sw={2} />
          <div>
            <div className="text-[11px] font-bold tracking-[0.5px] text-ink-faint">Amount to Pay</div>
            <div className="text-[22px] font-extrabold text-brand">USD {order.total}</div>
          </div>
        </div>
      </div>

      <SecLabel>Credit / Debit Card</SecLabel>
      <div className="mb-4">
        <PayRow
          option={PAYMENT_METHODS[0]}
          selected={order.paymentMethod === 'card'}
          onSelect={() => order.setPaymentMethod('card')}
        />
      </div>

      <SecLabel>Digital Wallet</SecLabel>
      <div className="mb-4 grid grid-cols-3 gap-2.5">
        {WALLETS.map((w) => {
          const on = order.paymentMethod === w.id;
          return (
            <button
              type="button"
              key={w.id}
              onClick={() => order.setPaymentMethod(w.id)}
              className={`flex h-[52px] flex-col items-center justify-center gap-[3px] rounded-[14px] border-[1.5px] transition-colors ${
                on ? 'border-brand bg-brand-soft' : 'border-line bg-white hover:border-ink-faint'
              }`}
            >
              <span className="h-5 w-5 rounded-md" style={{ background: w.color }} />
              <span className={`text-[11px] font-extrabold ${on ? 'text-brand' : 'text-ink-soft'}`}>{w.label}</span>
            </button>
          );
        })}
      </div>

      <SecLabel>Virtual Account</SecLabel>
      <div className="flex flex-col gap-2.5">
        {PAYMENT_METHODS.slice(1).map((m) => (
          <PayRow
            key={m.id}
            option={m}
            selected={order.paymentMethod === m.id}
            onSelect={() => order.setPaymentMethod(m.id)}
          />
        ))}
      </div>

      {order.paymentMethod !== 'card' && (
        <button
          type="button"
          onClick={() => navigate('/tickets/receipt')}
          className="mt-4 hidden text-[13px] font-bold text-brand lg:block"
        >
          Skip card entry — pay via {order.paymentMethod === 'bca' || order.paymentMethod === 'mandiri' ? 'virtual account' : 'wallet'} →
        </button>
      )}
    </PurchaseLayout>
  );
}
