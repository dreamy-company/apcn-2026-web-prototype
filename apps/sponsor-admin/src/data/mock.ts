// Mock data for the Sponsor Admin console — the delegate-sponsorship desk of
// ONE corporate sponsor (Kidneya Therapeutics, SPN-02 in the super-admin's
// dataset). Seeded PRNG keeps rows deterministic; ID formats match the
// sibling consoles so the ecosystem reads like one backend.

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
const rng = mulberry32(20270502);
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rng() * arr.length)];
const int = (min: number, max: number) => min + Math.floor(rng() * (max - min + 1));

export const fmtUSD = (n: number) => `USD ${n.toLocaleString('en-US')}`;

// ── The signed-in sponsor ────────────────────────────────────────────────────
export const SPONSOR = {
  id: 'SPN-02',
  company: 'Kidneya Therapeutics',
  tier: 'Platinum' as const,
  pic: 'events@kidneya.co',
  committed: 100_000,
  paid: 75_000,
  seats: 35,
};

export const TIER_BENEFITS = [
  'Exhibition booth · 36 m² prime location',
  '35 sponsored delegate seats',
  'Lunch symposium slot (60 min)',
  'Logo on main stage & all breaks',
  'Full attendee list post-congress',
];

// ── Sponsorship packages ─────────────────────────────────────────────────────
export const PACKAGES = [
  { id: 'ticket', name: 'Ticket only', cost: 720, desc: 'Full Congress Pass' },
  { id: 'hotel', name: 'Ticket + Hotel', cost: 1_560, desc: 'Pass + 4 nights partner hotel' },
  { id: 'full', name: 'Full package', cost: 2_400, desc: 'Pass + hotel + flights & transfers' },
] as const;
export type PackageId = (typeof PACKAGES)[number]['id'];
export const packageById = (id: PackageId) => PACKAGES.find((p) => p.id === id)!;

export const PARTNER_HOTELS = [
  { id: 'mulia', name: 'The Mulia Nusa Dua' },
  { id: 'grandhyatt', name: 'Grand Hyatt Bali' },
  { id: 'conrad', name: 'Conrad Bali' },
  { id: 'padma', name: 'Padma Resort Legian' },
  { id: 'aston', name: 'Aston Denpasar' },
] as const;

// ── Sponsored doctors ────────────────────────────────────────────────────────
// draft      → editable, not yet sent to the congress
// submitted  → awaiting congress-side verification (clash check)
// confirmed  → seat locked, badge issued
// clash      → another sponsor claimed the same doctor; super admin resolves
export type DoctorStatus = 'draft' | 'submitted' | 'confirmed' | 'clash';

export interface SponsoredDoctor {
  id: string;             // SPD-XXXX (matches super-admin sponsorship ids)
  name: string;
  institution: string;
  country: string;
  badgeId?: string;       // assigned on confirmation
  pkg: PackageId;
  hotelId?: string;       // for hotel/full packages
  status: DoctorStatus;
  addedAt: string;
}

const FIRST = ['Rina', 'Jin-Ho', 'Sara', 'Arvind', 'Mai-Szu', 'Akihiko', 'Hana', 'Budi', 'Mei Ling', 'Ravi', 'Siti', 'Takeshi', 'Dewi', 'Kenji', 'Li Wei', 'Priya', 'Nadia', 'Farah', 'Victor', 'Tomo'];
const LAST = ['Tanaka', 'Kim', 'Putri', 'Bagga', 'Wu', 'Koshino', 'Sato', 'Wijaya', 'Lim', 'Patel', 'Rahayu', 'Yamada', 'Lestari', 'Nakamura', 'Zhang', 'Sharma', 'Rahman', 'Idris', 'Huang', 'Aoki'];
const INSTITUTIONS = [
  'RSUPN Cipto Mangunkusumo', 'Seoul National University', 'Taipei Medical University',
  'AIIMS New Delhi', 'Osaka University', 'Juntendo University', 'University of Malaya',
  'Chulalongkorn University', 'National University Hospital SG', 'Peking University First Hospital',
];
const COUNTRIES = ['Indonesia', 'Korea', 'Taiwan', 'India', 'Japan', 'Malaysia', 'Thailand', 'Singapore', 'China', 'Philippines'];

export const INITIAL_DOCTORS: SponsoredDoctor[] = Array.from({ length: 29 }, (_, i) => {
  const status: DoctorStatus =
    i < 2 ? 'clash' : rng() < 0.14 ? 'draft' : rng() < 0.3 ? 'submitted' : 'confirmed';
  const pkg = pick(PACKAGES).id;
  return {
    id: `SPD-${String(2101 + i).padStart(4, '0')}`,
    name: `Dr. ${pick(FIRST)} ${pick(LAST)}`,
    institution: pick(INSTITUTIONS),
    country: pick(COUNTRIES),
    badgeId: status === 'confirmed' ? `APCN-2027-${String(int(4801, 4948)).padStart(5, '0')}` : undefined,
    pkg,
    hotelId: pkg !== 'ticket' ? pick(PARTNER_HOTELS).id : undefined,
    status,
    addedAt: `${String(int(1, 28)).padStart(2, '0')} ${pick(['Feb', 'Mar', 'Apr'])} 2027`,
  };
});

// ── Contract instalments ─────────────────────────────────────────────────────
export interface Instalment {
  no: number;
  amount: number;
  due: string;
  status: 'settled' | 'due' | 'upcoming';
  paidAt?: string;
  ref?: string;
}

export const INSTALMENTS: Instalment[] = [
  { no: 1, amount: 25_000, due: '15 Dec 2026', status: 'settled', paidAt: '12 Dec 2026', ref: 'TRX-88410' },
  { no: 2, amount: 25_000, due: '15 Feb 2027', status: 'settled', paidAt: '14 Feb 2027', ref: 'TRX-90233' },
  { no: 3, amount: 25_000, due: '15 Mar 2027', status: 'settled', paidAt: '18 Mar 2027', ref: 'TRX-91108' },
  { no: 4, amount: 25_000, due: '15 Apr 2027', status: 'due' },
];
