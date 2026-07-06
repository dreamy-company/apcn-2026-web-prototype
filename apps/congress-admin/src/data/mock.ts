// Deterministic mock data for the admin dashboard. A seeded PRNG (mulberry32)
// keeps every table row and statistic stable across reloads, so the UI reads
// like a live system without a backend.

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(20270512);

const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rng() * arr.length)];
const int = (min: number, max: number) => min + Math.floor(rng() * (max - min + 1));

// ── Domain vocabulary shared with the attendee app ─────────────────────────
export const TICKET_TYPES = [
  { id: 'full', name: 'Full Congress Pass', price: 720 },
  { id: 'single', name: 'Single Day Pass', price: 250 },
  { id: 'wa', name: 'Workshop A · Advanced Dialysis', price: 150 },
  { id: 'wb', name: 'Workshop B · Kidney Transplant', price: 150 },
] as const;
export type TicketTypeId = (typeof TICKET_TYPES)[number]['id'];

export const ROLES = ['Physician', 'Researcher', 'Industry', 'Delegate'] as const;
export type Role = (typeof ROLES)[number];

export const COUNTRIES = [
  'Indonesia', 'Japan', 'China', 'Taiwan', 'Korea', 'India', 'Australia',
  'Hong Kong', 'Singapore', 'Malaysia', 'Thailand', 'Philippines',
] as const;

const FIRST = ['Ahmad', 'Amelia', 'Rina', 'Jin-Ho', 'Sara', 'Arvind', 'Mai-Szu', 'Akihiko', 'Xueqing', 'Hung-Chun', 'Sanjay', 'Wai-Kei', 'Yusuke', 'Muh Geot', 'Dewi', 'Kenji', 'Li Wei', 'Priya', 'Hana', 'Budi', 'Mei Ling', 'Ravi', 'Siti', 'Takeshi'];
const LAST = ['Santoso', 'Tan', 'Tanaka', 'Kim', 'Putri', 'Bagga', 'Wu', 'Koshino', 'Yu', 'Chen', 'Vikrant', 'Lo', 'Suzuki', 'Wong', 'Lestari', 'Nakamura', 'Zhang', 'Sharma', 'Sato', 'Wijaya', 'Lim', 'Patel', 'Rahayu', 'Yamada'];

export const CONGRESS_DAYS = ['12 May', '13 May', '14 May', '15 May'] as const;
const SESSIONS = [
  { title: 'Opening Ceremony & APSN Presidential Address', room: 'Plenary Hall', day: 0 },
  { title: 'Epidemiology of CKD in Asia-Pacific: Registry Data', room: 'Room 1 · 701A', day: 0 },
  { title: 'PD Access: Hands-on Catheter Insertion Workshop', room: 'Room 3 · 701C', day: 0 },
  { title: 'Glomerular Disease: New Treatment Paradigms', room: 'Plenary Hall', day: 1 },
  { title: 'Biomarkers in AKI: From Bench to Bedside', room: 'Room 2 · 701B', day: 1 },
  { title: 'Innovation in Kidney Replacement Therapy', room: 'Plenary Hall', day: 2 },
  { title: 'E-Poster Viewing & Interactive Discussion', room: 'Gallery Hall', day: 2 },
  { title: 'Closing Ceremony & Best Poster Award Presentation', room: 'Plenary Hall', day: 3 },
] as const;

// ── Attendees ───────────────────────────────────────────────────────────────
export type AttendeeStatus = 'registered' | 'checked-in' | 'no-show';

export interface Attendee {
  id: string;            // APCN-2027-XXXXX badge id
  name: string;
  email: string;
  role: Role;
  country: string;
  ticketType: TicketTypeId;
  registeredAt: string;  // e.g. "08 Jan 2027"
  status: AttendeeStatus;
  checkins: number;
}

const REG_MONTHS = ['Nov 2026', 'Dec 2026', 'Jan 2027', 'Feb 2027', 'Mar 2027'];

export const ATTENDEES: Attendee[] = Array.from({ length: 148 }, (_, i) => {
  const first = pick(FIRST);
  const last = pick(LAST);
  const status: AttendeeStatus = rng() < 0.62 ? 'checked-in' : rng() < 0.85 ? 'registered' : 'no-show';
  return {
    id: `APCN-2027-${String(4801 + i).padStart(5, '0')}`,
    name: `Dr. ${first} ${last}`,
    email: `${first.toLowerCase().replace(/[^a-z]/g, '')}.${last.toLowerCase().replace(/[^a-z]/g, '')}@${pick(['gmail.com', 'hospital.org', 'university.edu', 'clinic.co'])}`,
    role: pick(ROLES),
    country: pick(COUNTRIES),
    ticketType: pick(TICKET_TYPES).id,
    registeredAt: `${String(int(1, 28)).padStart(2, '0')} ${pick(REG_MONTHS)}`,
    status,
    checkins: status === 'checked-in' ? int(1, 8) : 0,
  };
});

// ── Orders ──────────────────────────────────────────────────────────────────
export type OrderStatus = 'paid' | 'pending' | 'refunded';

export interface Order {
  id: string;            // APCN-ORD-2027-XXXXX
  buyer: string;
  attendeeId: string;
  items: string[];
  ticketType: TicketTypeId;
  amount: number;        // USD after early-bird discount when applicable
  method: 'Card' | 'GoPay' | 'OVO' | 'DANA' | 'BCA VA' | 'Mandiri VA';
  status: OrderStatus;
  date: string;          // "12 Jan 2027"
  dayIndex: number;      // 0..13 within the 14-day trend window
}

export const ORDERS: Order[] = ATTENDEES.slice(0, 121).map((a, i) => {
  const ticket = TICKET_TYPES.find((t) => t.id === a.ticketType)!;
  const addWorkshop = ticket.id === 'full' || ticket.id === 'single' ? rng() < 0.4 : false;
  const items = [ticket.name, ...(addWorkshop ? ['Workshop A · Advanced Dialysis'] : [])];
  const subtotal = ticket.price + (addWorkshop ? 150 : 0);
  const earlyBird = rng() < 0.55;
  const dayIndex = int(0, 13);
  return {
    id: `APCN-ORD-2027-${String(8301 + i).padStart(5, '0')}`,
    buyer: a.name,
    attendeeId: a.id,
    items,
    ticketType: ticket.id,
    amount: earlyBird ? Math.round(subtotal * 0.9) : subtotal,
    method: pick(['Card', 'Card', 'Card', 'GoPay', 'OVO', 'DANA', 'BCA VA', 'Mandiri VA']),
    status: rng() < 0.82 ? 'paid' : rng() < 0.7 ? 'pending' : 'refunded',
    date: `${String(dayIndex + 4).padStart(2, '0')} Jan 2027`,
    dayIndex,
  };
});

// ── Check-in scans ───────────────────────────────────────────────────────────
export interface CheckinScan {
  id: string;
  attendee: string;
  badgeId: string;
  session: string;
  room: string;
  day: number;           // index into CONGRESS_DAYS
  time: string;          // "09:41"
  gate: string;
}

const checkedIn = ATTENDEES.filter((a) => a.status === 'checked-in');

export const SCANS: CheckinScan[] = Array.from({ length: 312 }, (_, i) => {
  const a = pick(checkedIn);
  const s = pick(SESSIONS);
  return {
    id: `SCAN-${String(i + 1).padStart(4, '0')}`,
    attendee: a.name,
    badgeId: a.id,
    session: s.title,
    room: s.room,
    day: s.day,
    time: `${String(int(8, 16)).padStart(2, '0')}:${String(int(0, 59)).padStart(2, '0')}`,
    gate: pick(['Gate A', 'Gate B', 'Gate C', 'Mobile Scan']),
  };
}).sort((x, y) => x.day - y.day || x.time.localeCompare(y.time));
