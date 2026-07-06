// Unified mock dataset for the Super Admin console. One seeded PRNG
// (mulberry32) makes every row deterministic across reloads, and ID formats
// match the sibling apps (APCN-2027-… badges, HTL-2027-… bookings) so the
// three consoles read like views over the same backend.

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

export const fmtUSD = (n: number) => `USD ${n.toLocaleString('en-US')}`;

// ── Shared vocabulary ────────────────────────────────────────────────────────
export const TICKET_TYPES = [
  { id: 'full', name: 'Full Congress Pass', price: 720 },
  { id: 'single', name: 'Single Day Pass', price: 250 },
  { id: 'wa', name: 'Workshop A · Advanced Dialysis', price: 150 },
  { id: 'wb', name: 'Workshop B · Kidney Transplant', price: 150 },
] as const;
export type TicketTypeId = (typeof TICKET_TYPES)[number]['id'];

export const ROLES = ['Physician', 'Researcher', 'Industry', 'Delegate'] as const;
export const COUNTRIES = [
  'Indonesia', 'Japan', 'China', 'Taiwan', 'Korea', 'India', 'Australia',
  'Hong Kong', 'Singapore', 'Malaysia', 'Thailand', 'Philippines',
] as const;

const FIRST = ['Ahmad', 'Amelia', 'Rina', 'Jin-Ho', 'Sara', 'Arvind', 'Mai-Szu', 'Akihiko', 'Xueqing', 'Hung-Chun', 'Sanjay', 'Wai-Kei', 'Yusuke', 'Muh Geot', 'Dewi', 'Kenji', 'Li Wei', 'Priya', 'Hana', 'Budi', 'Mei Ling', 'Ravi', 'Siti', 'Takeshi'];
const LAST = ['Santoso', 'Tan', 'Tanaka', 'Kim', 'Putri', 'Bagga', 'Wu', 'Koshino', 'Yu', 'Chen', 'Vikrant', 'Lo', 'Suzuki', 'Wong', 'Lestari', 'Nakamura', 'Zhang', 'Sharma', 'Sato', 'Wijaya', 'Lim', 'Patel', 'Rahayu', 'Yamada'];

// ── Attendee tickets (Master Data → Ticket Control) ─────────────────────────
export type TicketStatus = 'registered' | 'checked-in' | 'no-show' | 'suspended';

export interface Ticket {
  id: string;            // APCN-2027-XXXXX badge id
  name: string;
  email: string;
  role: (typeof ROLES)[number];
  country: string;
  ticketType: TicketTypeId;
  amount: number;        // paid amount (0 when sponsored)
  sponsorId?: string;    // set when a corporate sponsor covers this doctor
  registeredAt: string;
  status: TicketStatus;
}

const REG_MONTHS = ['Nov 2026', 'Dec 2026', 'Jan 2027', 'Feb 2027', 'Mar 2027'];

export const INITIAL_TICKETS: Ticket[] = Array.from({ length: 148 }, (_, i) => {
  const first = pick(FIRST);
  const last = pick(LAST);
  const ticket = pick(TICKET_TYPES);
  const status: TicketStatus = rng() < 0.6 ? 'checked-in' : rng() < 0.82 ? 'registered' : 'no-show';
  return {
    id: `APCN-2027-${String(4801 + i).padStart(5, '0')}`,
    name: `Dr. ${first} ${last}`,
    email: `${first.toLowerCase().replace(/[^a-z]/g, '')}.${last.toLowerCase().replace(/[^a-z]/g, '')}@${pick(['gmail.com', 'hospital.org', 'university.edu', 'clinic.co'])}`,
    role: pick(ROLES),
    country: pick(COUNTRIES),
    ticketType: ticket.id,
    amount: rng() < 0.55 ? Math.round(ticket.price * 0.9) : ticket.price, // early-bird
    registeredAt: `${String(int(1, 28)).padStart(2, '0')} ${pick(REG_MONTHS)}`,
    status,
  };
});

// ── Hotels & quotas (Master Data → Hotel Quotas) ─────────────────────────────
export interface RoomTypeDef { id: string; name: string; rate: number }
export interface Hotel {
  id: string;
  name: string;
  area: string;
  stars: number;
  admin: string;         // responsible hotel-admin account
  roomTypes: RoomTypeDef[];
}

export const HOTELS: Hotel[] = [
  { id: 'mulia', name: 'The Mulia Nusa Dua', area: 'Nusa Dua', stars: 5, admin: 'mulia@apcn2027.org', roomTypes: [
    { id: 'deluxe', name: 'Deluxe Room', rate: 210 },
    { id: 'premier', name: 'Premier Ocean View', rate: 280 },
    { id: 'suite', name: 'Executive Suite', rate: 420 },
  ]},
  { id: 'grandhyatt', name: 'Grand Hyatt Bali', area: 'Nusa Dua', stars: 5, admin: 'hyatt@apcn2027.org', roomTypes: [
    { id: 'kingview', name: 'King Garden View', rate: 175 },
    { id: 'clubaccess', name: 'Club Access Room', rate: 240 },
    { id: 'suite', name: 'Grand Suite', rate: 380 },
  ]},
  { id: 'conrad', name: 'Conrad Bali', area: 'Tanjung Benoa', stars: 5, admin: 'conrad@apcn2027.org', roomTypes: [
    { id: 'deluxe', name: 'Deluxe Garden', rate: 160 },
    { id: 'oceanfront', name: 'Ocean Front Room', rate: 225 },
  ]},
  { id: 'padma', name: 'Padma Resort Legian', area: 'Legian', stars: 5, admin: 'padma@apcn2027.org', roomTypes: [
    { id: 'deluxe', name: 'Deluxe Chalet', rate: 145 },
    { id: 'premier', name: 'Premier Room', rate: 190 },
  ]},
  { id: 'aston', name: 'Aston Denpasar', area: 'Denpasar', stars: 4, admin: 'aston@apcn2027.org', roomTypes: [
    { id: 'superior', name: 'Superior Room', rate: 85 },
    { id: 'deluxe', name: 'Deluxe Room', rate: 110 },
  ]},
];
export const hotelById = (id: string) => HOTELS.find((h) => h.id === id);

export interface Quota {
  hotelId: string;
  roomTypeId: string;
  allocated: number;     // rooms in the congress block
  booked: number;        // confirmed bookings
  held: number;          // pending verification, held against the block
  overridden?: boolean;  // true once the super admin force-edits it
}

export const INITIAL_QUOTAS: Quota[] = HOTELS.flatMap((h) =>
  h.roomTypes.map((rt) => {
    const allocated = int(20, 60);
    const booked = int(Math.floor(allocated * 0.35), Math.floor(allocated * 0.85));
    const held = int(0, Math.max(1, Math.floor((allocated - booked) * 0.6)));
    return { hotelId: h.id, roomTypeId: rt.id, allocated, booked, held };
  }),
);

// Settled hotel revenue per property feeds the ledger + occupancy chart.
export const HOTEL_REVENUE: Record<string, number> = Object.fromEntries(
  HOTELS.map((h) => {
    const nightly = h.roomTypes.reduce((s, rt) => s + rt.rate, 0) / h.roomTypes.length;
    return [h.id, Math.round(nightly * int(90, 220))];
  }),
);

// ── Corporate sponsors & doctor sponsorships ─────────────────────────────────
export type SponsorTier = 'Platinum' | 'Gold' | 'Silver';

export interface Sponsor {
  id: string;
  company: string;
  tier: SponsorTier;
  pic: string;           // person in charge (sponsor-admin account)
  committed: number;     // USD contractual commitment
  paid: number;          // USD received so far
  seats: number;         // sponsored-doctor allocation
}

export const SPONSORS: Sponsor[] = [
  { id: 'SPN-01', company: 'Novaris Pharma', tier: 'Platinum', pic: 'delegates@novaris.com', committed: 120_000, paid: 120_000, seats: 40 },
  { id: 'SPN-02', company: 'Kidneya Therapeutics', tier: 'Platinum', pic: 'events@kidneya.co', committed: 100_000, paid: 75_000, seats: 35 },
  { id: 'SPN-03', company: 'Baxton Medical', tier: 'Gold', pic: 'apac@baxton.med', committed: 60_000, paid: 60_000, seats: 20 },
  { id: 'SPN-04', company: 'RenalCare Devices', tier: 'Gold', pic: 'sponsor@renalcare.io', committed: 55_000, paid: 30_000, seats: 18 },
  { id: 'SPN-05', company: 'Astra BioLabs', tier: 'Silver', pic: 'congress@astrabio.com', committed: 25_000, paid: 25_000, seats: 8 },
  { id: 'SPN-06', company: 'MedEquip Asia', tier: 'Silver', pic: 'mice@medequip.asia', committed: 20_000, paid: 0, seats: 6 },
];
export const sponsorById = (id: string) => SPONSORS.find((s) => s.id === id);

export type SponsorshipStatus = 'confirmed' | 'pending' | 'clash' | 'bypassed';

export interface Sponsorship {
  id: string;            // SPD-XXXX
  sponsorId: string;
  doctor: string;
  badgeId: string;       // links back to a Ticket
  pkg: 'Ticket only' | 'Ticket + Hotel' | 'Full package';
  hotelId?: string;      // when the package includes accommodation
  status: SponsorshipStatus;
  clashWith?: string;    // sponsorId of the competing sponsor (status 'clash')
  requestedAt: string;
}

// Sponsored doctors are drawn from real tickets; ~10% get double-claimed by a
// second sponsor to exercise the clash-detection UI.
export const INITIAL_SPONSORSHIPS: Sponsorship[] = (() => {
  const rows: Sponsorship[] = [];
  let seq = 1;
  SPONSORS.forEach((sp, si) => {
    const count = Math.min(sp.seats, int(Math.floor(sp.seats * 0.5), sp.seats));
    for (let i = 0; i < count; i++) {
      const t = INITIAL_TICKETS[(si * 23 + i * 5) % INITIAL_TICKETS.length];
      const clash = rng() < 0.08;
      rows.push({
        id: `SPD-${String(seq++).padStart(4, '0')}`,
        sponsorId: sp.id,
        doctor: t.name,
        badgeId: t.id,
        pkg: pick(['Ticket only', 'Ticket + Hotel', 'Full package'] as const),
        hotelId: rng() < 0.6 ? pick(HOTELS).id : undefined,
        status: clash ? 'clash' : rng() < 0.8 ? 'confirmed' : 'pending',
        clashWith: clash ? SPONSORS[(si + 1) % SPONSORS.length].id : undefined,
        requestedAt: `${String(int(1, 28)).padStart(2, '0')} ${pick(['Feb 2027', 'Mar 2027', 'Apr 2027'])}`,
      });
    }
  });
  return rows;
})();

// ── Sub-admin accounts (RBAC) ────────────────────────────────────────────────
export type AdminRole = 'Super Admin' | 'Event Admin' | 'Hotel Admin' | 'Sponsor Admin' | 'Finance Admin';
export type AdminStatus = 'active' | 'suspended';

export interface SubAdmin {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  scope: string;         // which property/sponsor/module the account governs
  status: AdminStatus;
  lastActive: string;
}

export const INITIAL_ADMINS: SubAdmin[] = [
  { id: 'ADM-001', name: 'Zarrin Nadhira', email: 'zarrinnadhira@gmail.com', role: 'Super Admin', scope: 'Entire system', status: 'active', lastActive: 'Now' },
  { id: 'ADM-002', name: 'Ops Team', email: 'admin@apcn2027.org', role: 'Event Admin', scope: 'Ticketing & check-ins', status: 'active', lastActive: '4 min ago' },
  { id: 'ADM-003', name: 'Made Wirawan', email: 'mulia@apcn2027.org', role: 'Hotel Admin', scope: 'The Mulia Nusa Dua', status: 'active', lastActive: '12 min ago' },
  { id: 'ADM-004', name: 'Ayu Lestari', email: 'hyatt@apcn2027.org', role: 'Hotel Admin', scope: 'Grand Hyatt Bali', status: 'active', lastActive: '1 hr ago' },
  { id: 'ADM-005', name: 'Kadek Surya', email: 'conrad@apcn2027.org', role: 'Hotel Admin', scope: 'Conrad Bali', status: 'suspended', lastActive: '3 days ago' },
  { id: 'ADM-006', name: 'Novaris Delegates', email: 'delegates@novaris.com', role: 'Sponsor Admin', scope: 'Novaris Pharma', status: 'active', lastActive: '26 min ago' },
  { id: 'ADM-007', name: 'Kidneya Events', email: 'events@kidneya.co', role: 'Sponsor Admin', scope: 'Kidneya Therapeutics', status: 'active', lastActive: '2 hr ago' },
  { id: 'ADM-008', name: 'Finance Desk', email: 'finance@apcn2027.org', role: 'Finance Admin', scope: 'Global ledger', status: 'active', lastActive: '38 min ago' },
];

// ── Audit log seed ───────────────────────────────────────────────────────────
export type AuditSeverity = 'info' | 'override' | 'critical';

export interface AuditEntry {
  id: string;
  at: string;            // "07 Jul 2027 · 14:32"
  actor: string;         // admin email
  role: AdminRole;
  action: string;        // short verb phrase
  target: string;        // entity id / name
  detail: string;
  severity: AuditSeverity;
}

const AUDIT_SEED_ROWS: Omit<AuditEntry, 'id'>[] = [
  { at: '07 Jul 2027 · 09:14', actor: 'mulia@apcn2027.org', role: 'Hotel Admin', action: 'Approved booking', target: 'HTL-2027-0341', detail: 'Deluxe Room · 4 nights · payment settled.', severity: 'info' },
  { at: '07 Jul 2027 · 08:52', actor: 'admin@apcn2027.org', role: 'Event Admin', action: 'Resent e-ticket', target: 'APCN-2027-04913', detail: 'Delivery bounced; re-sent to corrected address.', severity: 'info' },
  { at: '06 Jul 2027 · 17:40', actor: 'delegates@novaris.com', role: 'Sponsor Admin', action: 'Submitted sponsorship batch', target: 'Novaris Pharma', detail: '12 doctors · Full package · awaiting clash check.', severity: 'info' },
  { at: '06 Jul 2027 · 16:05', actor: 'zarrinnadhira@gmail.com', role: 'Super Admin', action: 'Suspended sub-admin', target: 'ADM-005', detail: 'Conrad Bali account locked pending contract review.', severity: 'critical' },
  { at: '06 Jul 2027 · 11:30', actor: 'hyatt@apcn2027.org', role: 'Hotel Admin', action: 'Rejected booking', target: 'HTL-2027-0308', detail: 'Club Access Room block exhausted for 12–14 May.', severity: 'info' },
  { at: '05 Jul 2027 · 15:22', actor: 'zarrinnadhira@gmail.com', role: 'Super Admin', action: 'Quota override', target: 'Grand Hyatt Bali · Grand Suite', detail: 'Allocated 24 → 30 (venue block extension signed).', severity: 'override' },
  { at: '05 Jul 2027 · 10:48', actor: 'finance@apcn2027.org', role: 'Finance Admin', action: 'Reconciled payout', target: 'Padma Resort Legian', detail: 'USD 18,240 settled to property (batch #22).', severity: 'info' },
  { at: '04 Jul 2027 · 19:03', actor: 'events@kidneya.co', role: 'Sponsor Admin', action: 'Payment received', target: 'Kidneya Therapeutics', detail: 'USD 25,000 instalment 2 of 4 confirmed.', severity: 'info' },
];

export const INITIAL_AUDIT: AuditEntry[] = AUDIT_SEED_ROWS.map((r, i) => ({
  id: `AUD-${String(1000 - i).padStart(4, '0')}`,
  ...r,
}));

// ── Global financial ledger ──────────────────────────────────────────────────
export type LedgerSource = 'Tickets' | 'Hotels' | 'Sponsors';
export type LedgerStatus = 'settled' | 'pending' | 'refunded';

export interface LedgerEntry {
  id: string;            // LGR-XXXX
  date: string;
  source: LedgerSource;
  ref: string;           // originating document id
  party: string;
  description: string;
  amount: number;        // USD, negative = outflow (refund/payout)
  status: LedgerStatus;
  dayIndex: number;      // 0..13 for the trend chart
}

export const LEDGER: LedgerEntry[] = (() => {
  const rows: LedgerEntry[] = [];
  let seq = 1;
  const push = (r: Omit<LedgerEntry, 'id'>) =>
    rows.push({ id: `LGR-${String(seq++).padStart(4, '0')}`, ...r });

  // Ticket sales — one ledger line per paid registration (sampled subset).
  INITIAL_TICKETS.slice(0, 90).forEach((t) => {
    const day = int(0, 13);
    const refunded = rng() < 0.05;
    push({
      date: `${String(day + 4).padStart(2, '0')} Jan 2027`,
      source: 'Tickets',
      ref: t.id,
      party: t.name,
      description: TICKET_TYPES.find((tt) => tt.id === t.ticketType)!.name,
      amount: refunded ? -t.amount : t.amount,
      status: refunded ? 'refunded' : rng() < 0.9 ? 'settled' : 'pending',
      dayIndex: day,
    });
  });
  // Hotel payments — congress-block receipts per property.
  HOTELS.forEach((h) => {
    for (let i = 0; i < int(4, 8); i++) {
      const day = int(0, 13);
      push({
        date: `${String(day + 4).padStart(2, '0')} Jan 2027`,
        source: 'Hotels',
        ref: `HTL-2027-${String(int(100, 999)).padStart(4, '0')}`,
        party: h.name,
        description: `Room block receipt · ${pick(h.roomTypes).name}`,
        amount: int(400, 2600),
        status: rng() < 0.8 ? 'settled' : 'pending',
        dayIndex: day,
      });
    }
  });
  // Sponsor commitments — instalments against contract value.
  SPONSORS.forEach((sp) => {
    const instalments = int(1, 3);
    for (let i = 0; i < instalments; i++) {
      const day = int(0, 13);
      const amt = Math.round(sp.committed / (instalments + 1));
      push({
        date: `${String(day + 4).padStart(2, '0')} Jan 2027`,
        source: 'Sponsors',
        ref: sp.id,
        party: sp.company,
        description: `${sp.tier} sponsorship instalment ${i + 1}`,
        amount: amt,
        status: sp.paid >= amt * (i + 1) ? 'settled' : 'pending',
        dayIndex: day,
      });
    }
  });
  return rows.sort((a, b) => b.dayIndex - a.dayIndex);
})();
