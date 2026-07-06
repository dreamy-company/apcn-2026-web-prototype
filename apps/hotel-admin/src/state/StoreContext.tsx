import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  type ReactNode,
} from 'react';
import { INITIAL_BOOKINGS, INITIAL_QUOTAS, type Booking, type Quota } from '../data/mock';
import { HOTELS } from '../data/hotels';

export const quotaKey = (hotelId: string, roomTypeId: string) => `${hotelId}:${roomTypeId}`;

interface StoreState {
  quotas: Quota[];
  bookings: Booking[];
  /** Keys (quota key or booking id) with an optimistic write awaiting mock-server ack. */
  syncing: Record<string, boolean>;
  /** Keys recently touched by a live event or ack — drives the pulse/flash styling. */
  flash: Record<string, number>;
  lastSyncAt: number; // epoch ms of the latest ack/live event
  connected: boolean;
}

type Action =
  | { type: 'APPROVE'; id: string }
  | { type: 'REJECT'; id: string }
  | { type: 'ADJUST_QUOTA'; hotelId: string; roomTypeId: string; delta: number }
  | { type: 'ACK'; key: string }
  | { type: 'LIVE_BOOKED'; hotelId: string; roomTypeId: string }
  | { type: 'LIVE_REQUEST'; booking: Booking }
  | { type: 'CLEAR_FLASH'; key: string };

function mutateQuota(
  quotas: Quota[],
  hotelId: string,
  roomTypeId: string,
  fn: (q: Quota) => Quota,
): Quota[] {
  return quotas.map((q) => (q.hotelId === hotelId && q.roomTypeId === roomTypeId ? fn(q) : q));
}

function reducer(state: StoreState, a: Action): StoreState {
  switch (a.type) {
    case 'APPROVE': {
      const b = state.bookings.find((x) => x.id === a.id);
      if (!b || b.status !== 'pending') return state;
      return {
        ...state,
        bookings: state.bookings.map((x) =>
          x.id === a.id ? { ...x, status: 'approved', payment: x.payment === 'unpaid' ? 'pending' : x.payment } : x,
        ),
        // Verification converts the hold into a confirmed booking.
        quotas: mutateQuota(state.quotas, b.hotelId, b.roomTypeId, (q) => ({
          ...q,
          held: Math.max(0, q.held - 1),
          booked: q.booked + 1,
        })),
        syncing: { ...state.syncing, [a.id]: true },
      };
    }
    case 'REJECT': {
      const b = state.bookings.find((x) => x.id === a.id);
      if (!b || b.status !== 'pending') return state;
      return {
        ...state,
        bookings: state.bookings.map((x) => (x.id === a.id ? { ...x, status: 'rejected' } : x)),
        // Rejection releases the held room back to the block.
        quotas: mutateQuota(state.quotas, b.hotelId, b.roomTypeId, (q) => ({
          ...q,
          held: Math.max(0, q.held - 1),
        })),
        syncing: { ...state.syncing, [a.id]: true },
      };
    }
    case 'ADJUST_QUOTA': {
      const key = quotaKey(a.hotelId, a.roomTypeId);
      return {
        ...state,
        quotas: mutateQuota(state.quotas, a.hotelId, a.roomTypeId, (q) => ({
          ...q,
          // Allocation can never drop below what is already booked + held.
          allocated: Math.max(q.booked + q.held, q.allocated + a.delta),
        })),
        syncing: { ...state.syncing, [key]: true },
      };
    }
    case 'ACK': {
      const { [a.key]: _, ...rest } = state.syncing;
      return {
        ...state,
        syncing: rest,
        flash: { ...state.flash, [a.key]: Date.now() },
        lastSyncAt: Date.now(),
      };
    }
    case 'LIVE_BOOKED': {
      const key = quotaKey(a.hotelId, a.roomTypeId);
      return {
        ...state,
        quotas: mutateQuota(state.quotas, a.hotelId, a.roomTypeId, (q) =>
          q.booked + q.held < q.allocated ? { ...q, booked: q.booked + 1 } : q,
        ),
        flash: { ...state.flash, [key]: Date.now() },
        lastSyncAt: Date.now(),
      };
    }
    case 'LIVE_REQUEST':
      return {
        ...state,
        bookings: [a.booking, ...state.bookings],
        quotas: mutateQuota(state.quotas, a.booking.hotelId, a.booking.roomTypeId, (q) =>
          q.booked + q.held < q.allocated ? { ...q, held: q.held + 1 } : q,
        ),
        flash: { ...state.flash, [a.booking.id]: Date.now(), [quotaKey(a.booking.hotelId, a.booking.roomTypeId)]: Date.now() },
        lastSyncAt: Date.now(),
      };
    case 'CLEAR_FLASH': {
      const { [a.key]: _, ...rest } = state.flash;
      return { ...state, flash: rest };
    }
    default:
      return state;
  }
}

interface Store extends StoreState {
  approve: (id: string) => void;
  reject: (id: string) => void;
  adjustQuota: (hotelId: string, roomTypeId: string, delta: number) => void;
}

const Ctx = createContext<Store | null>(null);

const LIVE_NAMES = ['Dr. Nadia Rahman', 'Dr. Kwan Lee', 'Dr. Tomo Aoki', 'Dr. Farah Idris', 'Dr. Victor Huang'];
let liveSeq = 2001;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => ({
    quotas: INITIAL_QUOTAS,
    bookings: INITIAL_BOOKINGS,
    syncing: {},
    flash: {},
    lastSyncAt: Date.now(),
    connected: true,
  }));

  // Optimistic write → mock server acks 800ms later, clearing the syncing state.
  const ackTimers = useRef<number[]>([]);
  const withAck = useCallback((key: string, action: Action) => {
    dispatch(action);
    ackTimers.current.push(window.setTimeout(() => dispatch({ type: 'ACK', key }), 800));
  }, []);

  // Live-sync simulator: a stand-in for the WebSocket/SSE feed. Every ~6s a
  // random property gets a walk-in confirmation or a new pending request.
  useEffect(() => {
    const t = window.setInterval(() => {
      const hotel = HOTELS[Math.floor(Math.random() * HOTELS.length)];
      const rt = hotel.roomTypes[Math.floor(Math.random() * hotel.roomTypes.length)];
      if (Math.random() < 0.5) {
        dispatch({ type: 'LIVE_BOOKED', hotelId: hotel.id, roomTypeId: rt.id });
      } else {
        const nights = 2 + Math.floor(Math.random() * 4);
        dispatch({
          type: 'LIVE_REQUEST',
          booking: {
            id: `HTL-2027-${liveSeq++}`,
            participant: LIVE_NAMES[Math.floor(Math.random() * LIVE_NAMES.length)],
            badgeId: `APCN-2027-${String(4801 + Math.floor(Math.random() * 148)).padStart(5, '0')}`,
            hotelId: hotel.id,
            roomTypeId: rt.id,
            checkIn: '11 May',
            checkOut: `${11 + nights} May`,
            nights,
            rooms: 1,
            amount: rt.rate * nights,
            status: 'pending',
            payment: 'unpaid',
            requestedAt: 'Just now',
          },
        });
      }
    }, 6000);
    return () => window.clearInterval(t);
  }, []);

  // Flash marks fade after 2s so rows stop glowing.
  useEffect(() => {
    const keys = Object.keys(state.flash);
    if (!keys.length) return;
    const t = window.setTimeout(() => keys.forEach((k) => dispatch({ type: 'CLEAR_FLASH', key: k })), 2000);
    return () => window.clearTimeout(t);
  }, [state.flash]);

  useEffect(() => () => ackTimers.current.forEach(window.clearTimeout), []);

  const store: Store = {
    ...state,
    approve: (id) => withAck(id, { type: 'APPROVE', id }),
    reject: (id) => withAck(id, { type: 'REJECT', id }),
    adjustQuota: (hotelId, roomTypeId, delta) =>
      withAck(quotaKey(hotelId, roomTypeId), { type: 'ADJUST_QUOTA', hotelId, roomTypeId, delta }),
  };

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useStore outside StoreProvider');
  return ctx;
}
