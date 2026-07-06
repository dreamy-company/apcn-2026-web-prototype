import type { ReactNode } from 'react';
import StepHeader from '../../components/layout/StepHeader';
import { LineItem } from '../../components/ui/bits';
import { useOrder } from '../../context/OrderContext';

/**
 * Shared purchase-flow scaffold: step header on top; on lg+ the content sits
 * beside a sticky order summary card (replacing the prototype's mobile
 * bottom sheet).
 */
export function PurchaseLayout({
  step,
  title,
  backTo,
  children,
  footer,
  sidebarCta,
}: {
  step: number;
  title: string;
  backTo?: string;
  children: ReactNode;
  footer: ReactNode;
  sidebarCta?: ReactNode;
}) {
  return (
    <div className="min-h-screen animate-screen-in bg-paper pb-40 lg:pb-16">
      <StepHeader step={step} total={5} title={title} backTo={backTo} />
      <div className="mx-auto max-w-3xl px-4 pt-[18px] md:px-8 lg:grid lg:max-w-5xl lg:grid-cols-[1fr_360px] lg:items-start lg:gap-8">
        <div>{children}</div>
        <aside className="hidden lg:sticky lg:top-28 lg:block">
          <OrderSummaryCard cta={sidebarCta} />
        </aside>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white shadow-[0_-8px_28px_-8px_rgba(20,16,12,0.22)] lg:hidden">
        <div className="mx-auto max-w-3xl px-[18px] pt-3.5 pb-4 md:px-8">{footer}</div>
      </div>
    </div>
  );
}

function OrderSummaryCard({ cta }: { cta?: ReactNode }) {
  const order = useOrder();
  return (
    <div className="rounded-[20px] border border-line bg-white p-5 shadow-[0_8px_24px_-12px_rgba(20,16,12,0.2)]">
      <div className="mb-2 text-[11px] font-extrabold tracking-[1.3px] uppercase text-ink-faint">
        Your Order
      </div>
      {order.items.map((i) => (
        <LineItem key={i.label} label={i.label} amount={`USD ${i.price}`} />
      ))}
      <LineItem label="Early Bird Discount (10%)" amount={`− USD ${order.discount}`} green />
      <div className="flex items-center justify-between pt-3.5 pb-1">
        <span className="text-base font-extrabold text-ink">Total Due</span>
        <span className="text-[22px] font-extrabold text-brand">USD {order.total}</span>
      </div>
      {cta && <div className="mt-3">{cta}</div>}
    </div>
  );
}
