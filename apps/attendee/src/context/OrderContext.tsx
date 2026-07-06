import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { PASSES, WORKSHOPS, EARLY_BIRD_RATE, type PassOption, type WorkshopOption } from '../data/tickets';

interface OrderItem {
  label: string;
  price: number;
}

interface OrderState {
  passId: string;
  setPassId: (id: string) => void;
  workshopIds: string[];
  toggleWorkshop: (id: string) => void;
  paymentMethod: string;
  setPaymentMethod: (id: string) => void;
  pass: PassOption;
  workshops: WorkshopOption[];
  items: OrderItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  total: number;
}

const OrderContext = createContext<OrderState | null>(null);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [passId, setPassId] = useState('single');
  const [workshopIds, setWorkshopIds] = useState<string[]>(['wa']);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const value = useMemo<OrderState>(() => {
    const pass = PASSES.find((p) => p.id === passId) ?? PASSES[0];
    const workshops = WORKSHOPS.filter((w) => workshopIds.includes(w.id));
    const items: OrderItem[] = [
      { label: pass.shortName, price: pass.price },
      ...workshops.map((w) => ({ label: w.name, price: w.price })),
    ];
    const subtotal = items.reduce((s, i) => s + i.price, 0);
    const discount = Math.round(subtotal * EARLY_BIRD_RATE);
    return {
      passId,
      setPassId,
      workshopIds,
      toggleWorkshop: (id: string) =>
        setWorkshopIds((prev) => (prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id])),
      paymentMethod,
      setPaymentMethod,
      pass,
      workshops,
      items,
      itemCount: items.length,
      subtotal,
      discount,
      total: subtotal - discount,
    };
  }, [passId, workshopIds, paymentMethod]);

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder(): OrderState {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrder must be used within OrderProvider');
  return ctx;
}
