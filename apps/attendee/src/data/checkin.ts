export type CheckInType =
  | 'Opening'
  | 'Closing'
  | 'Keynote'
  | 'Plenary'
  | 'Workshop'
  | 'Symposium'
  | 'E-Poster';

export const TYPE_META: Record<CheckInType, { color: string; soft: string }> = {
  Opening: { color: '#f15a24', soft: '#fdece0' },
  Closing: { color: '#f15a24', soft: '#fdece0' },
  Keynote: { color: '#171717', soft: '#fdece0' },
  Plenary: { color: '#f7931e', soft: '#fdece0' },
  Workshop: { color: '#1f1f1f', soft: '#ececec' },
  Symposium: { color: '#ff8f4d', soft: '#fdf0e6' },
  'E-Poster': { color: '#3f9a78', soft: '#e4f3ec' },
};

export interface CheckInEntry {
  id: string;
  type: CheckInType;
  title: string;
  room: string;
  checkinTime: string;
  sessionTime: string;
}

export interface CheckInDay {
  day: string;
  date: string;
  short: string;
  entries: CheckInEntry[];
}

export const CHECKIN_DAYS: CheckInDay[] = [
  {
    day: 'Wednesday', date: '12 May', short: 'WED 12',
    entries: [
      { id: 'c1', type: 'Opening', title: 'Opening Ceremony & APSN Presidential Address', room: 'Plenary Hall', checkinTime: '08:52', sessionTime: '09:00–09:45' },
      { id: 'c2', type: 'Plenary', title: 'Epidemiology of CKD in Asia-Pacific: Registry Data', room: 'Room 1 · 701A', checkinTime: '10:15', sessionTime: '10:30–11:30' },
      { id: 'c3', type: 'Workshop', title: 'PD Access: Hands-on Catheter Insertion Workshop', room: 'Room 3 · 701C', checkinTime: '14:08', sessionTime: '14:15–16:00' },
    ],
  },
  {
    day: 'Thursday', date: '13 May', short: 'THU 13',
    entries: [
      { id: 'c4', type: 'Plenary', title: 'Glomerular Disease: New Treatment Paradigms', room: 'Plenary Hall', checkinTime: '08:44', sessionTime: '09:00–09:50' },
      { id: 'c5', type: 'Symposium', title: 'Biomarkers in AKI: From Bench to Bedside', room: 'Room 2 · 701B', checkinTime: '11:01', sessionTime: '11:00–12:30' },
    ],
  },
  {
    day: 'Friday', date: '14 May', short: 'FRI 14',
    entries: [
      { id: 'c7', type: 'Keynote', title: 'Innovation in Kidney Replacement Therapy', room: 'Plenary Hall', checkinTime: '09:03', sessionTime: '09:00–09:50' },
      { id: 'c8', type: 'E-Poster', title: 'E-Poster Viewing & Interactive Discussion', room: 'Gallery Hall', checkinTime: '13:12', sessionTime: '13:00–14:30' },
    ],
  },
  {
    day: 'Saturday', date: '15 May', short: 'SAT 15',
    entries: [
      { id: 'c9', type: 'Closing', title: 'Closing Ceremony & Best Poster Award Presentation', room: 'Plenary Hall', checkinTime: '09:25', sessionTime: '09:30–11:00' },
    ],
  },
];

export const TOTAL_CHECKINS = CHECKIN_DAYS.reduce((s, d) => s + d.entries.length, 0);
