import { D, type IconName } from './icons';

export type NotifType = 'award' | 'event' | 'success' | 'payment' | 'announce' | 'info';

export interface Notification {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  time: string;
  unread: boolean;
}

export const NOTIFS: Notification[] = [
  { id: 'n1', type: 'award', title: 'E-Poster Shortlisted!', body: 'Your submission "Progression Biomarkers of CKD…" has been shortlisted for Best E-Poster.', time: '2 min ago', unread: true },
  { id: 'n2', type: 'event', title: 'Opening Ceremony in 2 Hours', body: 'The Opening Ceremony begins at 09:00 in the Plenary Hall.', time: '1 hr ago', unread: true },
  { id: 'n3', type: 'success', title: 'Submission Confirmed', body: 'Your e-poster for CKD & Progression has been received. ID: APCN-EP-2027-00423.', time: '3 hrs ago', unread: true },
  { id: 'n4', type: 'payment', title: 'Payment Confirmed', body: 'Your ticket purchase was successful. Order APCN-ORD-2027-08421 · USD 360.', time: 'Yesterday', unread: false },
  { id: 'n5', type: 'announce', title: 'Early Bird Closing in 3 Days', body: 'Early bird registration discount ends 31 January 2027. Secure your pass now.', time: '2 days ago', unread: false },
  { id: 'n6', type: 'event', title: 'New Session Added', body: 'A new symposium "AI in Kidney Disease Diagnosis" added — Fri 14 May, 14:00.', time: '3 days ago', unread: false },
  { id: 'n7', type: 'info', title: 'E-Certificate Notice', body: 'E-certificates for CME credit will be issued within 30 days after the congress.', time: '5 days ago', unread: false },
];

export const NTYPE: Record<NotifType, { icon: (typeof D)[IconName]; bg: string; color: string }> = {
  award: { icon: D.star, bg: '#fff7e6', color: '#2b2b2b' },
  event: { icon: D.cal, bg: '#fdece0', color: '#f15a24' },
  success: { icon: D.check, bg: '#e4f3ec', color: '#3f9a78' },
  payment: { icon: D.card, bg: '#fdece0', color: '#f15a24' },
  announce: { icon: D.announce, bg: '#ececec', color: '#1a1a1a' },
  info: { icon: D.info, bg: '#f5f3f1', color: '#8a8580' },
};
