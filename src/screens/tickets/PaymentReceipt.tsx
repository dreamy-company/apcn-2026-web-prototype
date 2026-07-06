import Icon from '../../components/ui/Icon';
import { ReceiptLine, GlowCircle } from '../../components/ui/bits';
import { D } from '../../data/icons';
import { useOrder } from '../../context/OrderContext';
import { Link } from 'react-router-dom';

export default function PaymentReceiptScreen() {
  const order = useOrder();
  const methodLabel =
    order.paymentMethod === 'card'
      ? 'Visa ···· 4891'
      : order.paymentMethod === 'bca'
        ? 'BCA Virtual Account'
        : order.paymentMethod === 'mandiri'
          ? 'Mandiri Virtual Account'
          : order.paymentMethod.toUpperCase();

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-brand-top via-brand to-brand-deep">
      <GlowCircle className="-top-16 -right-12 h-60 w-60 bg-[radial-gradient(circle,rgba(31,31,31,0.35),transparent_70%)]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-lg flex-col px-5 py-6 md:justify-center md:py-12">
        <div className="flex animate-screen-in flex-col items-center gap-3.5 pb-[22px] text-center">
          <div className="flex h-24 w-24 animate-pop-in items-center justify-center rounded-full bg-white/14">
            <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-white shadow-[0_10px_28px_-8px_rgba(0,0,0,0.3)]">
              <Icon d={D.check} s={34} c="#3f9a78" sw={2.5} />
            </div>
          </div>
          <div>
            <h1 className="text-[26px] font-extrabold tracking-tight text-white">Payment Successful!</h1>
            <p className="mt-1.5 text-sm leading-normal text-white/78">
              Your APCN 2027 registration is confirmed.
            </p>
          </div>
        </div>

        <div className="mb-4 animate-screen-in overflow-hidden rounded-3xl bg-white shadow-[0_20px_50px_-16px_rgba(0,0,0,0.35)]">
          <div className="flex items-center gap-3 bg-gradient-to-r from-brand-deep to-brand-top px-5 py-4">
            <span className="flex h-[38px] w-[38px] items-center justify-center rounded-xl bg-white/14">
              <Icon d={D.file} s={19} c="#fff" sw={1.9} />
            </span>
            <div className="flex-1">
              <div className="text-[10px] font-extrabold tracking-[1.3px] uppercase text-white/55">
                Official Payment Receipt
              </div>
              <div className="mt-px text-[15px] font-extrabold text-white">APCN 2027 · Bali, Indonesia</div>
            </div>
            <span className="flex shrink-0 items-center gap-[5px] rounded-full bg-good-soft px-[11px] py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-good" />
              <span className="text-[10px] font-extrabold text-good">PAID</span>
            </span>
          </div>
          <div className="px-5 pt-3.5 pb-3.5">
            <ReceiptLine label="Order ID" value="APCN-ORD-2027-08421" bold />
            <ReceiptLine label="Payment Date" value="12 Jan 2027 · 14:32 WIB" />
            <ReceiptLine label="Registrant" value="Dr. Ahmad Santoso" />
            <ReceiptLine label="Method" value={methodLabel} />
          </div>
          <div className="relative flex h-[18px] items-center">
            <span className="absolute -left-[9px] h-[18px] w-[18px] rounded-full bg-brand" />
            <span className="mx-2.5 flex-1 border-t-[1.5px] border-dashed border-line" />
            <span className="absolute -right-[9px] h-[18px] w-[18px] rounded-full bg-brand" />
          </div>
          <div className="px-5 pt-1.5 pb-4">
            {order.items.map((i) => (
              <ReceiptLine key={i.label} label={i.label} value={`USD ${i.price}`} />
            ))}
            <ReceiptLine label="Early Bird Discount" value={`− USD ${order.discount}`} green />
            <div className="flex items-center justify-between pt-3.5 pb-1">
              <span className="text-[15px] font-extrabold text-ink">Total Paid</span>
              <span className="text-[22px] font-extrabold text-brand">USD {order.total}</span>
            </div>
          </div>
        </div>

        <div className="mt-1 flex flex-col gap-3">
          <button
            type="button"
            className="flex h-[54px] w-full items-center justify-center gap-2.5 rounded-[18px] bg-white text-[15px] font-extrabold text-brand shadow-[0_12px_30px_-10px_rgba(0,0,0,0.35)] transition-colors hover:bg-brand-soft"
          >
            <Icon d={D.dl} s={19} c="#f15a24" sw={2.2} />
            Download Receipt PDF
          </button>
          <Link
            to="/dashboard"
            className="flex h-[54px] w-full items-center justify-center gap-2.5 rounded-[18px] border-[1.5px] border-white/25 bg-white/14 text-[15px] font-extrabold text-white transition-colors hover:bg-white/25"
          >
            <Icon d={D.home} s={19} c="#fff" sw={2} />
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
