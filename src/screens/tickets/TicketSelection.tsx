import Icon from '../../components/ui/Icon';
import Button from '../../components/ui/Button';
import { SecLabel } from '../../components/ui/bits';
import { D } from '../../data/icons';
import { PASSES, WORKSHOPS, type PassOption, type WorkshopOption } from '../../data/tickets';
import { useOrder } from '../../context/OrderContext';
import { PurchaseLayout } from './parts';

function TicketCard({ pass, selected, onSelect }: { pass: PassOption; selected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-[18px] border-[1.5px] p-4 text-left transition-all ${
        selected
          ? 'border-brand bg-brand-soft shadow-[0_8px_24px_-10px_rgba(241,90,36,0.35)]'
          : 'border-[#ded9d2] bg-white shadow-[0_3px_10px_-6px_rgba(20,16,12,0.18)] hover:border-ink-faint'
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className={`text-[15px] font-extrabold ${selected ? 'text-brand' : 'text-ink'}`}>{pass.name}</span>
            {pass.badge && (
              <span className="rounded-full bg-warm px-2 py-0.5 text-[10px] font-extrabold whitespace-nowrap text-white">
                {pass.badge}
              </span>
            )}
          </span>
          <span className="mt-1 block text-[12.5px] leading-normal text-ink-soft">{pass.desc}</span>
          {pass.note && <span className="mt-1.5 block text-[11.5px] font-bold text-good">{pass.note}</span>}
        </span>
        <span
          className={`mt-px flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
            selected ? 'border-brand bg-brand' : 'border-[#ded9d2] bg-transparent'
          }`}
        >
          {selected && <Icon d={D.check} s={13} c="#fff" sw={3} />}
        </span>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className={`text-xl font-extrabold ${selected ? 'text-brand' : 'text-ink'}`}>
          USD {pass.price.toLocaleString()}
        </span>
        {pass.originalPrice && (
          <span className="text-[13px] text-ink-faint line-through">USD {pass.originalPrice.toLocaleString()}</span>
        )}
      </div>
    </button>
  );
}

function WorkshopCheckbox({ workshop, checked, onToggle }: { workshop: WorkshopOption; checked: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex w-full items-center gap-3.5 rounded-[18px] border-[1.5px] px-4 py-3.5 text-left transition-all ${
        checked
          ? 'border-brand bg-brand-soft shadow-[0_6px_20px_-10px_rgba(241,90,36,0.3)]'
          : 'border-[#ded9d2] bg-white shadow-[0_3px_10px_-6px_rgba(20,16,12,0.15)] hover:border-ink-faint'
      }`}
    >
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] border-2 ${
          checked ? 'border-brand bg-brand' : 'border-[#ded9d2] bg-transparent'
        }`}
      >
        {checked && <Icon d={D.check} s={13} c="#fff" sw={3} />}
      </span>
      <span className="flex-1">
        <span className={`block text-[14.5px] font-extrabold ${checked ? 'text-brand' : 'text-ink'}`}>
          {workshop.name}
        </span>
        <span className="mt-0.5 block text-xs text-ink-soft">{workshop.desc}</span>
      </span>
      <span className={`shrink-0 text-[15px] font-extrabold ${checked ? 'text-brand' : 'text-ink'}`}>
        USD {workshop.price}
      </span>
    </button>
  );
}

export default function TicketSelectionScreen() {
  const order = useOrder();

  const footer = (
    <>
      <div className="mb-3.5 flex items-center justify-between">
        <div>
          <div className="text-[11.5px] font-semibold text-ink-soft">
            {order.itemCount} item{order.itemCount !== 1 && 's'} selected
          </div>
          <div className="mt-0.5 text-2xl font-extrabold text-ink">USD {order.subtotal}</div>
        </div>
        <span className="rounded-full bg-good-soft px-2.5 py-1 text-[11px] font-bold text-good">
          Early bird at checkout
        </span>
      </div>
      <Button to="/tickets/summary" trailingIcon={D.chev}>
        Review Order
      </Button>
    </>
  );

  return (
    <PurchaseLayout
      step={1}
      title="Choose Your Ticket"
      backTo="/dashboard"
      footer={footer}
      sidebarCta={
        <Button to="/tickets/summary" trailingIcon={D.chev}>
          Review Order
        </Button>
      }
    >
      <SecLabel>Seminar Registration</SecLabel>
      <div className="mb-[22px] flex flex-col gap-2.5 md:grid md:grid-cols-2 md:items-start lg:flex lg:flex-col">
        {PASSES.map((p) => (
          <TicketCard key={p.id} pass={p} selected={order.passId === p.id} onSelect={() => order.setPassId(p.id)} />
        ))}
      </div>
      <SecLabel>Workshop Add-ons</SecLabel>
      <div className="flex flex-col gap-2.5">
        {WORKSHOPS.map((w) => (
          <WorkshopCheckbox
            key={w.id}
            workshop={w}
            checked={order.workshopIds.includes(w.id)}
            onToggle={() => order.toggleWorkshop(w.id)}
          />
        ))}
      </div>
    </PurchaseLayout>
  );
}
