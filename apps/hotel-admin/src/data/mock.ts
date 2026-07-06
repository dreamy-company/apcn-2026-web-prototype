// Deterministic mock dataset (seeded PRNG) — quotas per hotel/room-type and
// participant booking requests. The store treats this as initial server state.
import { HOTELS } from './hotels';

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
const rng = mulberry32(20270510);
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rng() * arr.length)];
const int = (min: number, max: number) => min + Math.floor(rng() * (max - min + 1));

// ── Quotas ──────────────────────────────────────────────────────────────────
export interface Quota {
  hotelId: string;
  roomTypeId: string;
  allocated: number; // rooms reserved for the congress block
  booked: number;    // confirmed (approved) bookings
  held: number;      // pending verification — held against the block
}

export const INITIAL_QUOTAS: Quota[] = HOTELS.flatMap((h) =>
  h.roomTypes.map((rt) => {
    const allocated = int(20, 60);
    const booked = int(Math.floor(allocated * 0.3), Math.floor(allocated * 0.8));
    const held = int(0, Math.max(1, Math.floor((allocated - booked) * 0.6)));
    return { hotelId: h.id, roomTypeId: rt.id, allocated, booked, held };
  }),
);

// ── Bookings ────────────────────────────────────────────────────────────────
export type BookingStatus = 'pending' | 'approved' | 'rejected';
export type PaymentStatus = 'unpaid' | 'pending' | 'settled';

export interface Booking {
  id: string;           // HTL-2027-XXXX
  participant: string;
  badgeId: string;      // APCN-2027-XXXXX — links to the congress registration
  hotelId: string;
  roomTypeId: string;
  checkIn: string;      // "10 May"
  checkOut: string;     // "16 May"
  nights: number;
  rooms: number;
  amount: number;       // rate * nights * rooms
  status: BookingStatus;
  payment: PaymentStatus;
  requestedAt: string;  // "07 Apr 2027 · 14:32"
  note?: string;
}

const FIRST = ['Ahmad', 'Amelia', 'Rina', 'Jin-Ho', 'Sara', 'Arvind', 'Mai-Szu', 'Akihiko', 'Xueqing', 'Hung-Chun', 'Sanjay', 'Wai-Kei', 'Yusuke', 'Dewi', 'Kenji', 'Li Wei', 'Priya', 'Hana', 'Budi', 'Mei Ling', 'Ravi', 'Siti', 'Takeshi'];
const LAST = ['Santoso', 'Tan', 'Tanaka', 'Kim', 'Putri', 'Bagga', 'Wu', 'Koshino', 'Yu', 'Chen', 'Vikrant', 'Lo', 'Suzuki', 'Lestari', 'Nakamura', 'Zhang', 'Sharma', 'Sato', 'Wijaya', 'Lim', 'Patel', 'Rahayu', 'Yamada'];
const NOTES = [
  'Late arrival — flight lands 23:40.',
  'Requests twin beds.',
  'Sharing with co-author, needs 2 keys.',
  'Wheelchair-accessible room required.',
  'Early check-in requested (07:00).',
  undefined, undefined, undefined,
];

export const INITIAL_BOOKINGS: Booking[] = Array.from({ length: 92 }, (_, i) => {
  const hotel = pick(HOTELS);
  const rt = pick(hotel.roomTypes);
  const inDay = int(10, 12);
  const outDay = int(inDay + 1, 16);
  const nights = outDay - inDay;
  const rooms = rng() < 0.9 ? 1 : 2;
  const status: BookingStatus = rng() < 0.38 ? 'pending' : rng() < 0.85 ? 'approved' : 'rejected';
  // Payment progresses with verification: approved bookings are mostly settled.
  const payment: PaymentStatus =
    status === 'approved' ? (rng() < 0.7 ? 'settled' : 'pending') : status === 'pending' ? (rng() < 0.4 ? 'pending' : 'unpaid') : 'unpaid';
  return {
    id: `HTL-2027-${String(1001 + i).padStart(4, '0')}`,
    participant: `Dr. ${pick(FIRST)} ${pick(LAST)}`,
    badgeId: `APCN-2027-${String(int(4801, 4948)).padStart(5, '0')}`,
    hotelId: hotel.id,
    roomTypeId: rt.id,
    checkIn: `${inDay} May`,
    checkOut: `${outDay} May`,
    nights,
    rooms,
    amount: rt.rate * nights * rooms,
    status,
    payment,
    requestedAt: `${String(int(1, 28)).padStart(2, '0')} ${pick(['Feb', 'Mar', 'Apr'])} 2027 · ${String(int(8, 22)).padStart(2, '0')}:${String(int(0, 59)).padStart(2, '0')}`,
    note: pick(NOTES),
  };
});

export const fmtUSD = (n: number) => `USD ${n.toLocaleString('en-US')}`;
