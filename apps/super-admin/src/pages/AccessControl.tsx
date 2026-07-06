import { useMemo, useState } from 'react';
import { Panel, Badge, SearchInput, FilterSelect } from '../components/ui/bits';
import { ActionButton, Field } from '../components/ui/superBits';
import { DataTable, Pagination, useTableState, type Column } from '../components/ui/DataTable';
import Drawer from '../components/ui/Drawer';
import Icon from '../components/ui/Icon';
import { D } from '../data/icons';
import { useStore } from '../state/StoreContext';
import { HOTELS, SPONSORS, type SubAdmin, type AdminRole, type AuditEntry } from '../data/mock';

const ROLE_OPTIONS: AdminRole[] = ['Event Admin', 'Hotel Admin', 'Sponsor Admin', 'Finance Admin'];
const ROLE_TONE: Record<AdminRole, 'brand' | 'warm' | 'good' | 'neutral'> = {
  'Super Admin': 'brand',
  'Event Admin': 'warm',
  'Hotel Admin': 'good',
  'Sponsor Admin': 'good',
  'Finance Admin': 'neutral',
};
const SEVERITY_TONE = { info: 'neutral', override: 'brand', critical: 'alert' } as const;

/** Scope choices depend on the selected role (property vs sponsor vs module). */
function scopesFor(role: AdminRole): string[] {
  if (role === 'Hotel Admin') return HOTELS.map((h) => h.name);
  if (role === 'Sponsor Admin') return SPONSORS.map((s) => s.company);
  if (role === 'Finance Admin') return ['Global ledger'];
  return ['Ticketing & check-ins'];
}

// ── Tab 1: sub-admin accounts ────────────────────────────────────────────────
function AdminsTab() {
  const { state, dispatch } = useStore();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<AdminRole>('Hotel Admin');
  const [scope, setScope] = useState(scopesFor('Hotel Admin')[0]);

  const canCreate = name.trim() && /\S+@\S+\.\S+/.test(email);

  const create = () => {
    dispatch({ type: 'ADD_ADMIN', admin: { name: name.trim(), email: email.trim(), role, scope } });
    setCreating(false);
    setName('');
    setEmail('');
  };

  const columns: Column<SubAdmin>[] = [
    {
      key: 'name',
      header: 'Account',
      sortValue: (a) => a.name,
      render: (a) => (
        <div>
          <div className="text-[12.5px] font-extrabold text-ink">{a.name}</div>
          <div className="mt-0.5 text-[11px] font-medium text-ink-soft">{a.email}</div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      sortValue: (a) => a.role,
      render: (a) => <Badge tone={ROLE_TONE[a.role]}>{a.role}</Badge>,
    },
    {
      key: 'scope',
      header: 'Scope',
      render: (a) => <span className="text-[12px] font-bold text-ink">{a.scope}</span>,
      className: 'hidden md:table-cell',
    },
    {
      key: 'last',
      header: 'Last Active',
      render: (a) => <span className="text-[12px] font-semibold text-ink-soft">{a.lastActive}</span>,
      className: 'hidden lg:table-cell',
    },
    {
      key: 'status',
      header: 'Status',
      sortValue: (a) => a.status,
      render: (a) => <Badge tone={a.status === 'active' ? 'good' : 'alert'}>{a.status}</Badge>,
    },
    {
      key: 'actions',
      header: '',
      render: (a) =>
        // The root account can never lock itself out.
        a.role === 'Super Admin' ? (
          <span className="flex items-center gap-1 text-[11px] font-bold text-ink-faint">
            <Icon d={D.lock} s={12} sw={2.2} /> root
          </span>
        ) : a.status === 'active' ? (
          <ActionButton label="Suspend" icon={D.ban} tone="alert" onClick={() => dispatch({ type: 'SET_ADMIN_STATUS', id: a.id, status: 'suspended' })} />
        ) : (
          <ActionButton label="Reactivate" icon={D.refresh} tone="good" onClick={() => dispatch({ type: 'SET_ADMIN_STATUS', id: a.id, status: 'active' })} />
        ),
    },
  ];

  return (
    <>
      <Panel
        title={`Sub-Admin Accounts · ${state.admins.length}`}
        action={<ActionButton label="New sub-admin" icon={D.plus} tone="brand" onClick={() => setCreating(true)} />}
      >
        <DataTable columns={columns} rows={state.admins} rowKey={(a) => a.id} />
      </Panel>

      {/* Create-account drawer */}
      {creating && (
        <Drawer title="Create sub-admin" onClose={() => setCreating(false)}>
          <div className="space-y-4">
            <label className="block">
              <span className="text-[11px] font-extrabold tracking-[0.6px] uppercase text-ink-faint">Full name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Putu Ariani"
                className="mt-1.5 h-10 w-full rounded-lg border border-line bg-field px-3 text-[13px] font-medium outline-none focus:border-brand"
              />
            </label>
            <label className="block">
              <span className="text-[11px] font-extrabold tracking-[0.6px] uppercase text-ink-faint">Email</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@apcn2027.org"
                className="mt-1.5 h-10 w-full rounded-lg border border-line bg-field px-3 text-[13px] font-medium outline-none focus:border-brand"
              />
            </label>
            <label className="block">
              <span className="text-[11px] font-extrabold tracking-[0.6px] uppercase text-ink-faint">Role</span>
              <select
                value={role}
                onChange={(e) => {
                  const r = e.target.value as AdminRole;
                  setRole(r);
                  setScope(scopesFor(r)[0]); // keep scope valid for the new role
                }}
                className="mt-1.5 h-10 w-full rounded-lg border border-line bg-white px-2.5 text-[13px] font-bold outline-none"
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-[11px] font-extrabold tracking-[0.6px] uppercase text-ink-faint">Scope</span>
              <select
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                className="mt-1.5 h-10 w-full rounded-lg border border-line bg-white px-2.5 text-[13px] font-bold outline-none"
              >
                {scopesFor(role).map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>

            <Field label="Permissions preview">
              {role === 'Hotel Admin' && 'Manage quotas, verify bookings and view finance for the selected property only.'}
              {role === 'Sponsor Admin' && 'Submit and track doctor sponsorships for the selected company only.'}
              {role === 'Event Admin' && 'Manage ticket sales, attendees and check-in gates. No hotel or sponsor access.'}
              {role === 'Finance Admin' && 'Read the global ledger and reconcile payouts. No data overrides.'}
            </Field>

            <div className="flex gap-2 pt-1">
              <ActionButton label="Create account" icon={D.key} tone="brand" disabled={!canCreate} onClick={create} />
              <ActionButton label="Cancel" onClick={() => setCreating(false)} />
            </div>
          </div>
        </Drawer>
      )}
    </>
  );
}

// ── Tab 2: system-wide audit log ─────────────────────────────────────────────
function AuditTab() {
  const { state } = useStore();
  const [severity, setSeverity] = useState('');

  const rows = useMemo(
    () => state.audit.filter((e) => !severity || e.severity === severity),
    [state.audit, severity],
  );
  const table = useTableState(rows, (e) => [e.actor, e.action, e.target, e.detail], 12);

  const columns: Column<AuditEntry>[] = [
    {
      key: 'at',
      header: 'When',
      render: (e) => <span className="whitespace-nowrap text-[12px] font-bold text-ink-soft">{e.at}</span>,
    },
    {
      key: 'actor',
      header: 'Actor',
      sortValue: (e) => e.actor,
      render: (e) => (
        <div>
          <div className="text-[12px] font-extrabold text-ink">{e.actor}</div>
          <div className="mt-0.5 text-[10.5px] font-semibold text-ink-faint">{e.role}</div>
        </div>
      ),
    },
    {
      key: 'action',
      header: 'Action → Target',
      render: (e) => (
        <div>
          <div className="text-[12.5px] font-bold text-ink">{e.action} · <span className="text-brand">{e.target}</span></div>
          <div className="mt-0.5 text-[11.5px] font-medium text-ink-soft">{e.detail}</div>
        </div>
      ),
    },
    {
      key: 'severity',
      header: 'Severity',
      sortValue: (e) => e.severity,
      render: (e) => <Badge tone={SEVERITY_TONE[e.severity]}>{e.severity}</Badge>,
    },
  ];

  return (
    <Panel title={`Audit Log · ${rows.length} events`}>
      <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-3 md:px-5">
        <SearchInput value={table.query} onChange={table.setQuery} placeholder="Search actor, action, target…" />
        <FilterSelect value={severity} onChange={(v) => { setSeverity(v); table.resetPage(); }} options={['info', 'override', 'critical']} allLabel="All severities" />
      </div>
      <DataTable
        columns={columns}
        rows={table.pageRows}
        rowKey={(e) => e.id}
        sortKey={table.sort?.key}
        sortDir={table.sort?.dir}
        onSort={table.toggleSort}
      />
      <Pagination page={table.page} totalPages={table.totalPages} total={table.total} pageSize={table.pageSize} onPage={table.setPage} />
    </Panel>
  );
}

export default function AccessControl() {
  const [tab, setTab] = useState<'admins' | 'audit'>('admins');

  return (
    <div className="animate-fade-in space-y-4">
      {/* Segmented tab switch */}
      <div className="inline-flex rounded-xl border border-line bg-white p-1">
        {(
          [
            { id: 'admins', label: 'Sub-Admins', icon: D.users },
            { id: 'audit', label: 'Audit Logs', icon: D.history },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-[13px] font-extrabold transition-colors ${
              tab === t.id ? 'bg-brand text-white' : 'text-ink-soft hover:text-ink'
            }`}
          >
            <Icon d={t.icon} s={15} sw={2.2} />
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'admins' ? <AdminsTab /> : <AuditTab />}
    </div>
  );
}
