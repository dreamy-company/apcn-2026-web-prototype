export interface CongressDay {
  d: string;
  n: string;
}

export const DAYS: CongressDay[] = [
  { d: 'Wed', n: '12' },
  { d: 'Thu', n: '13' },
  { d: 'Fri', n: '14' },
  { d: 'Sat', n: '15' },
];

export type SessionKind = 'ceremony' | 'plenary' | 'symposium' | 'workshop';

export const TOPIC: Record<SessionKind, { palette: [string, string]; topic: string }> = {
  ceremony: { palette: ['#f15a24', '#ff8f4d'], topic: 'Ceremony · Plenary' },
  plenary: { palette: ['#171717', '#f7931e'], topic: 'Plenary Lecture' },
  symposium: { palette: ['#f7931e', '#ffb877'], topic: 'Symposium' },
  workshop: { palette: ['#c1440e', '#e8720d'], topic: 'Workshop' },
};

export interface Session {
  id: string;
  kind: SessionKind;
  category: string;
  title: string;
  time: string;
  room: string;
  speakers: { initials: string; color: string }[];
  speakerLabel: string;
  starred?: boolean;
}

export const SESSIONS: Session[] = [
  {
    id: 's1',
    kind: 'ceremony',
    category: 'Opening',
    title: 'Opening Ceremony · Welcome to APCN 2027',
    time: '09:00–09:45',
    room: 'Plenary Hall',
    speakers: [{ initials: 'XY', color: '#f7931e' }],
    speakerLabel: 'Prof. Xueqing Yu · APSN President',
    starred: true,
  },
  {
    id: 's2',
    kind: 'plenary',
    category: 'Plenary',
    title: 'Integrated Kidney Care Programs in the Asia-Pacific',
    time: '10:00–10:40',
    room: 'Room 1 · 701A',
    speakers: [{ initials: 'MW', color: '#ff8f4d' }],
    speakerLabel: 'Dr. Mai-Szu Wu · Taipei Medical University',
  },
  {
    id: 's3',
    kind: 'symposium',
    category: 'Symposium',
    title: 'Advances in Glomerular Disease & Precision Therapy',
    time: '11:00–12:30',
    room: 'Room 1 · 701A',
    speakers: [
      { initials: 'AK', color: '#ffb877' },
      { initials: 'NS', color: '#f7931e' },
    ],
    speakerLabel: '4 speakers · Chaired by Dr. Akihiko Koshino',
  },
];
