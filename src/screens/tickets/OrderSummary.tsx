import Button from '../../components/ui/Button';
import { SecLabel, LineItem, GlowCircle } from '../../components/ui/bits';
import { D } from '../../data/icons';
import { useOrder } from '../../context/OrderContext';
import { PurchaseLayout } from './parts';

export default function OrderSummaryScreen() {
  const order = useOrder();

  const footer = (
    <>
      <div className="mb-3.5 flex items-center justify-between">
        <span className="text-sm font-semibold text-ink-soft">Total to pay</span>
        <span className="text-2xl font-extrabold text-brand">USD {order.total}</span>
      </div>
      <Button to="/tickets/payment" trailingIcon={D.chev}>
        Proceed to Payment
      </Button>
    </>
  );

  return (
    <PurchaseLayout
      step={2}
      title="Order Summary"
      footer={footer}
      sidebarCta={
        <Button to="/tickets/payment" trailingIcon={D.chev}>
          Proceed to Payment
        </Button>
      }
    >
      <div className="relative mb-5 flex items-center gap-3.5 overflow-hidden rounded-[18px] bg-gradient-to-r from-brand-deep to-brand-top px-4 py-3.5">
        <GlowCircle className="-top-5 -right-5 h-24 w-24 bg-[radial-gradient(circle,rgba(255,255,255,0.12),transparent_70%)]" />
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border border-white/20 bg-white/14 text-sm font-extrabold text-white">
          AS
        </span>
        <div className="relative flex-1">
          <div className="text-[10px] font-extrabold tracking-[1.2px] uppercase text-white/55">Registrant</div>
          <div className="mt-0.5 text-[15px] font-extrabold text-white">Dr. Ahmad Santoso</div>
          <div className="mt-px text-xs text-white/65">Physician · Full Registration</div>
        </div>
      </div>

      <SecLabel>Order Items</SecLabel>
      <div className="mb-3.5 rounded-[18px] border border-line bg-white px-4 py-1 shadow-[0_4px_14px_-8px_rgba(20,16,12,0.16)]">
        {order.items.map((i) => (
          <LineItem key={i.label} label={i.label} amount={`USD ${i.price}`} />
        ))}
      </div>

      <SecLabel>Price Breakdown</SecLabel>
      <div className="rounded-[18px] border border-line bg-white px-4 py-1 shadow-[0_4px_14px_-8px_rgba(20,16,12,0.16)]">
        <LineItem label={`Subtotal (${order.itemCount} item${order.itemCount !== 1 ? 's' : ''})`} amount={`USD ${order.subtotal}`} />
        <LineItem label="Early Bird Discount (10%)" amount={`− USD ${order.discount}`} green />
        <LineItem label="Tax & Service Fee" amount="USD 0" />
        <div className="flex items-center justify-between pt-3.5 pb-2.5">
          <span className="text-base font-extrabold text-ink">Total Due</span>
          <span className="text-[22px] font-extrabold text-brand">USD {order.total}</span>
        </div>
      </div>
    </PurchaseLayout>
  );
}
