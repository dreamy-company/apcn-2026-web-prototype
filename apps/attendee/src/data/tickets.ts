export interface PassOption {
  id: string;
  name: string;
  shortName: string;
  desc: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  note?: string;
}

export const PASSES: PassOption[] = [
  {
    id: 'full',
    name: 'Full Congress Pass',
    shortName: 'Full Congress Pass — 4 days',
    desc: 'All sessions · 4 days · 12–15 May 2027',
    price: 720,
    originalPrice: 800,
    badge: 'Early Bird',
    note: 'Save USD 80 · ends 31 Jan',
  },
  {
    id: 'single',
    name: 'Single Day Pass',
    shortName: 'Single Day Pass — Thu 13 May',
    desc: 'All sessions for Thu 13 May',
    price: 250,
    badge: 'Most Flexible',
  },
];

export interface WorkshopOption {
  id: string;
  name: string;
  desc: string;
  price: number;
}

export const WORKSHOPS: WorkshopOption[] = [
  { id: 'wa', name: 'Workshop A · Advanced Dialysis', desc: 'Half-day · 12 May · Room B2', price: 150 },
  { id: 'wb', name: 'Workshop B · Kidney Transplant', desc: 'Half-day · 13 May · Room B3', price: 150 },
];

export const EARLY_BIRD_RATE = 0.1;

export interface PaymentOption {
  id: string;
  label: string;
  sub?: string;
  tag?: string;
}

export const PAYMENT_METHODS: PaymentOption[] = [
  { id: 'card', label: 'Credit or Debit Card', sub: 'Visa · Mastercard · JCB · Amex', tag: 'Recommended' },
  { id: 'bca', label: 'BCA Virtual Account', sub: 'Instant confirmation · 24/7' },
  { id: 'mandiri', label: 'Mandiri Virtual Account', sub: 'Instant confirmation · 24/7' },
];

export const WALLETS: { id: string; label: string; color: string }[] = [
  { id: 'gopay', label: 'GoPay', color: '#00AED6' },
  { id: 'ovo', label: 'OVO', color: '#4C3494' },
  { id: 'dana', label: 'DANA', color: '#108BE3' },
];
