// Client-side store for the sponsor's delegate roster, in the same optimistic
// live-sync style as the hotel-admin console: writes apply instantly with a
// `syncing` badge, a mock server acks 800ms later, and a simulated feed pushes
// congress-side verification results (submitted → confirmed) in real time.
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  type ReactNode,
} from 'react';
import { INITIAL_DOCTORS, type SponsoredDoctor } from '../data/mock';

interface StoreState {
  doctors: SponsoredDoctor[];
  syncing: Record<string, boolean>;
  flash: Record<string, number>;
  lastSyncAt: number;
  connected: boolean;
}

type Action =
  | { type: 'ADD_DRAFT'; doctor: SponsoredDoctor }
  | { type: 'REMOVE_DRAFT'; id: string }
  | { type: 'SUBMIT_DRAFTS'; ids: string[] }
  | { type: 'ACK'; key: string }
  | { type: 'LIVE_VERDICT'; id: string; status: 'confirmed' | 'clash'; badgeId?: string }
  | { type: 'CLEAR_FLASH'; key: string };

function reducer(state: StoreState, a: Action): StoreState {
  switch (a.type) {
    case 'ADD_DRAFT':
      return {
        ...state,
        doctors: [a.doctor, ...state.doctors],
        syncing: { ...state.syncing, [a.doctor.id]: true },
      };
    case 'REMOVE_DRAFT':
      return { ...state, doctors: state.doctors.filter((d) => d.id !== a.id || d.status !== 'draft') };
    case 'SUBMIT_DRAFTS': {
      const set = new Set(a.ids);
      return {
        ...state,
        doctors: state.doctors.map((d) =>
          set.has(d.id) && d.status === 'draft' ? { ...d, status: 'submitted' } : d,
        ),
        syncing: { ...state.syncing, ...Object.fromEntries(a.ids.map((id) => [id, true])) },
      };
    }
    case 'ACK': {
      const { [a.key]: _, ...rest } = state.syncing;
      return { ...state, syncing: rest, flash: { ...state.flash, [a.key]: Date.now() }, lastSyncAt: Date.now() };
    }
    case 'LIVE_VERDICT':
      return {
        ...state,
        doctors: state.doctors.map((d) =>
          d.id === a.id ? { ...d, status: a.status, badgeId: a.badgeId ?? d.badgeId } : d,
        ),
        flash: { ...state.flash, [a.id]: Date.now() },
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
  addDraft: (doctor: Omit<SponsoredDoctor, 'id' | 'status' | 'addedAt'>) => void;
  removeDraft: (id: string) => void;
  submitDrafts: (ids: string[]) => void;
}

const Ctx = createContext<Store | null>(null);

let draftSeq = 3001;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => ({
    doctors: INITIAL_DOCTORS,
    syncing: {},
    flash: {},
    lastSyncAt: Date.now(),
    connected: true,
  }));

  const ackTimers = useRef<number[]>([]);
  const withAck = useCallback((keys: string[], action: Action) => {
    dispatch(action);
    keys.forEach((key) =>
      ackTimers.current.push(window.setTimeout(() => dispatch({ type: 'ACK', key }), 800)),
    );
  }, []);

  // Live feed: the congress clash-checker returns verdicts on submitted
  // doctors every ~7s — overwhelmingly confirmations, occasionally a clash.
  const stateRef = useRef(state);
  stateRef.current = state;
  useEffect(() => {
    const t = window.setInterval(() => {
      const submitted = stateRef.current.doctors.filter((d) => d.status === 'submitted');
      if (!submitted.length) return;
      const target = submitted[Math.floor(Math.random() * submitted.length)];
      const clash = Math.random() < 0.12;
      dispatch({
        type: 'LIVE_VERDICT',
        id: target.id,
        status: clash ? 'clash' : 'confirmed',
        badgeId: clash ? undefined : `APCN-2027-${String(4801 + Math.floor(Math.random() * 148)).padStart(5, '0')}`,
      });
    }, 7000);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    const keys = Object.keys(state.flash);
    if (!keys.length) return;
    const t = window.setTimeout(() => keys.forEach((k) => dispatch({ type: 'CLEAR_FLASH', key: k })), 2000);
    return () => window.clearTimeout(t);
  }, [state.flash]);

  useEffect(() => () => ackTimers.current.forEach(window.clearTimeout), []);

  const store: Store = {
    ...state,
    addDraft: (doctor) => {
      const id = `SPD-${draftSeq++}`;
      withAck([id], {
        type: 'ADD_DRAFT',
        doctor: { ...doctor, id, status: 'draft', addedAt: 'Just now' },
      });
    },
    removeDraft: (id) => dispatch({ type: 'REMOVE_DRAFT', id }),
    submitDrafts: (ids) => withAck(ids, { type: 'SUBMIT_DRAFTS', ids }),
  };

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useStore outside StoreProvider');
  return ctx;
}
