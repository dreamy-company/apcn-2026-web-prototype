// Single client-side store for everything the Super Admin can mutate.
// Every override dispatched here appends an audit entry inside the reducer,
// so the Audit Log page is a guaranteed-complete trail of console activity.
import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from 'react';
import {
  INITIAL_TICKETS, INITIAL_QUOTAS, INITIAL_SPONSORSHIPS, INITIAL_ADMINS, INITIAL_AUDIT,
  hotelById, sponsorById,
  type Ticket, type TicketStatus, type Quota, type Sponsorship,
  type SubAdmin, type AuditEntry, type AuditSeverity,
} from '../data/mock';

export interface State {
  tickets: Ticket[];
  quotas: Quota[];
  sponsorships: Sponsorship[];
  admins: SubAdmin[];
  audit: AuditEntry[];
}

export type Action =
  // Ticket Control — single or bulk status override
  | { type: 'SET_TICKET_STATUS'; ids: string[]; status: TicketStatus }
  // Hotel Quotas — force-edit the allocated block, even below booked+held
  | { type: 'OVERRIDE_QUOTA'; hotelId: string; roomTypeId: string; allocated: number }
  // Sponsor clash — bypass keeps both sponsors; reassign moves the doctor
  | { type: 'RESOLVE_CLASH'; id: string; mode: 'bypass' | 'reassign' }
  | { type: 'CONFIRM_SPONSORSHIP'; ids: string[] }
  // RBAC
  | { type: 'ADD_ADMIN'; admin: Omit<SubAdmin, 'id' | 'status' | 'lastActive'> }
  | { type: 'SET_ADMIN_STATUS'; id: string; status: 'active' | 'suspended' };

const ACTOR = 'zarrinnadhira@gmail.com'; // signed-in super admin (prototype)
let auditSeq = 1001;

/** Stamp an audit entry with "now" in the dataset's display format. */
function entry(action: string, target: string, detail: string, severity: AuditSeverity): AuditEntry {
  const now = new Date();
  const at = `${String(now.getDate()).padStart(2, '0')} ${now.toLocaleString('en', { month: 'short' })} 2027 · ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  return { id: `AUD-${auditSeq++}`, at, actor: ACTOR, role: 'Super Admin', action, target, detail, severity };
}

function reducer(state: State, a: Action): State {
  switch (a.type) {
    case 'SET_TICKET_STATUS': {
      const set = new Set(a.ids);
      return {
        ...state,
        tickets: state.tickets.map((t) => (set.has(t.id) ? { ...t, status: a.status } : t)),
        audit: [
          entry(
            'Ticket status override',
            a.ids.length === 1 ? a.ids[0] : `${a.ids.length} attendees`,
            `Status manually set to "${a.status}"${a.ids.length > 1 ? ' (bulk action)' : ''}.`,
            'override',
          ),
          ...state.audit,
        ],
      };
    }
    case 'OVERRIDE_QUOTA': {
      const q = state.quotas.find((x) => x.hotelId === a.hotelId && x.roomTypeId === a.roomTypeId)!;
      const hotel = hotelById(a.hotelId)!;
      const room = hotel.roomTypes.find((rt) => rt.id === a.roomTypeId)!;
      // Shrinking below committed rooms is allowed but flagged critical.
      const forced = a.allocated < q.booked + q.held;
      return {
        ...state,
        quotas: state.quotas.map((x) =>
          x === q ? { ...x, allocated: a.allocated, overridden: true } : x,
        ),
        audit: [
          entry(
            forced ? 'Forced quota override' : 'Quota override',
            `${hotel.name} · ${room.name}`,
            `Allocated ${q.allocated} → ${a.allocated}${forced ? ` (below ${q.booked + q.held} committed rooms)` : ''}.`,
            forced ? 'critical' : 'override',
          ),
          ...state.audit,
        ],
      };
    }
    case 'RESOLVE_CLASH': {
      const s = state.sponsorships.find((x) => x.id === a.id)!;
      const from = sponsorById(s.sponsorId)?.company ?? s.sponsorId;
      const to = sponsorById(s.clashWith ?? '')?.company ?? s.clashWith ?? '—';
      return {
        ...state,
        sponsorships: state.sponsorships.map((x) =>
          x.id !== a.id
            ? x
            : a.mode === 'bypass'
              ? { ...x, status: 'bypassed' } // both sponsors kept, flag cleared
              : { ...x, status: 'confirmed', sponsorId: x.clashWith!, clashWith: undefined },
        ),
        audit: [
          entry(
            a.mode === 'bypass' ? 'Sponsor clash bypassed' : 'Sponsorship reassigned',
            `${s.doctor} (${s.badgeId})`,
            a.mode === 'bypass'
              ? `Duplicate claim by ${from} and ${to} approved to coexist.`
              : `Moved from ${from} to ${to}; original claim released.`,
            'critical',
          ),
          ...state.audit,
        ],
      };
    }
    case 'CONFIRM_SPONSORSHIP': {
      const set = new Set(a.ids);
      return {
        ...state,
        sponsorships: state.sponsorships.map((x) =>
          set.has(x.id) && x.status === 'pending' ? { ...x, status: 'confirmed' } : x,
        ),
        audit: [
          entry('Sponsorships confirmed', `${a.ids.length} record(s)`, 'Pending doctor sponsorships approved in bulk.', 'override'),
          ...state.audit,
        ],
      };
    }
    case 'ADD_ADMIN': {
      const admin: SubAdmin = {
        ...a.admin,
        id: `ADM-${String(state.admins.length + 1).padStart(3, '0')}`,
        status: 'active',
        lastActive: 'Never',
      };
      return {
        ...state,
        admins: [...state.admins, admin],
        audit: [
          entry('Sub-admin created', admin.email, `${admin.role} · scope: ${admin.scope}.`, 'override'),
          ...state.audit,
        ],
      };
    }
    case 'SET_ADMIN_STATUS': {
      const adm = state.admins.find((x) => x.id === a.id)!;
      return {
        ...state,
        admins: state.admins.map((x) => (x.id === a.id ? { ...x, status: a.status } : x)),
        audit: [
          entry(
            a.status === 'suspended' ? 'Sub-admin suspended' : 'Sub-admin reactivated',
            adm.email,
            `${adm.role} account for "${adm.scope}" ${a.status === 'suspended' ? 'locked' : 'restored'}.`,
            a.status === 'suspended' ? 'critical' : 'override',
          ),
          ...state.audit,
        ],
      };
    }
  }
}

const INITIAL: State = {
  tickets: INITIAL_TICKETS,
  quotas: INITIAL_QUOTAS,
  sponsorships: INITIAL_SPONSORSHIPS,
  admins: INITIAL_ADMINS,
  audit: INITIAL_AUDIT,
};

const StoreCtx = createContext<{ state: State; dispatch: Dispatch<Action> } | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL);
  return <StoreCtx.Provider value={{ state, dispatch }}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
