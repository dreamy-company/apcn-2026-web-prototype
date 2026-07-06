// Aggregates derived from the mock dataset — computed once at module load.
import { ATTENDEES, ORDERS, SCANS, TICKET_TYPES, CONGRESS_DAYS } from './mock';

const paidOrders = ORDERS.filter((o) => o.status === 'paid');

export const totals = {
  ticketsSold: paidOrders.length,
  revenue: paidOrders.reduce((s, o) => s + o.amount, 0),
  attendees: ATTENDEES.length,
  checkedIn: ATTENDEES.filter((a) => a.status === 'checked-in').length,
  pendingOrders: ORDERS.filter((o) => o.status === 'pending').length,
  refunded: ORDERS.filter((o) => o.status === 'refunded').length,
  scans: SCANS.length,
  eposterSubmissions: 43, // matches the attendee app's E-Poster stats strip
};

/** Check-in conversion: unique checked-in attendees ÷ registered attendees. */
export const conversionRate = Math.round((totals.checkedIn / totals.attendees) * 100);

/** 14-day revenue trend (USD per day) for the Overview line chart. */
export const revenueTrend: number[] = Array.from({ length: 14 }, (_, day) =>
  paidOrders.filter((o) => o.dayIndex === day).reduce((s, o) => s + o.amount, 0),
);

/** Paid sales split by ticket type, for the donut + summary strip. */
export const salesByType = TICKET_TYPES.map((t) => {
  const orders = paidOrders.filter((o) => o.ticketType === t.id);
  return {
    ...t,
    count: orders.length,
    revenue: orders.reduce((s, o) => s + o.amount, 0),
  };
});

/** Scans per congress day, for the check-in bar chart. */
export const scansPerDay = CONGRESS_DAYS.map((label, day) => ({
  label,
  count: SCANS.filter((s) => s.day === day).length,
}));

export const fmtUSD = (n: number) => `USD ${n.toLocaleString('en-US')}`;
