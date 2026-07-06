import { useMemo, useState } from 'react';
import { Panel, Badge, StatCard, SearchInput, FilterSelect } from '../components/ui/bits';
import { ActionButton } from '../components/ui/superBits';
import { DataTable, Pagination, useTableState, type Column } from '../components/ui/DataTable';
import { LineChart } from '../components/charts/charts';
import { D } from '../data/icons';
import { LEDGER, fmtUSD, type LedgerEntry, type LedgerSource } from '../data/mock';

const SOURCES: LedgerSource[] = ['Tickets', 'Hotels', 'Sponsors'];
const STATUS_TONE = { settled: 'good', pending: 'warm', refunded: 'alert' } as const;
const SOURCE_TONE = { Tickets: 'brand', Hotels: 'good', Sponsors: 'warm' } as const;

// 14-day window labels shared with the Command Center trend (4–17 Jan).
const TREND_LABELS = Array.from({ length: 14 }, (_, i) => `${i + 4} Jan`);

export default function Ledger() {
  const [source, setSource] = useState('');
  const [status, setStatus] = useState('');

  // Reconciliation aggregates over the full (unfiltered) ledger.
  const agg = useMemo(() => {
    const inflow = LEDGER.filter((l) => l.status === 'settled' && l.amount > 0).reduce((s, l) => s + l.amount, 0);
    const pending = LEDGER.filter((l) => l.status === 'pending').reduce((s, l) => s + l.amount, 0);
    const refunds = LEDGER.filter((l) => l.amount < 0).reduce((s, l) => s + l.amount, 0);
    const perSource = SOURCES.map((src) => {
      const rows = LEDGER.filter((l) => l.source === src);
      return {
        src,
        settled: rows.filter((l) => l.status === 'settled').reduce((s, l) => s + l.amount, 0),
        pending: rows.filter((l) => l.status === 'pending').reduce((s, l) => s + l.amount, 0),
        count: rows.length,
      };
    });
    const trend = Array.from({ length: 14 }, (_, day) =>
      LEDGER.filter((l) => l.dayIndex === day && l.status === 'settled' && l.amount > 0).reduce((s, l) => s + l.amount, 0),
    );
    return { inflow, pending, refunds, perSource, trend, net: inflow + refunds };
  }, []);

  const rows = useMemo(
    () => LEDGER.filter((l) => (!source || l.source === source) && (!status || l.status === status)),
    [source, status],
  );
  const table = useTableState(rows, (l) => [l.id, l.ref, l.party, l.description], 14);

  const columns: Column<LedgerEntry>[] = [
    {
      key: 'id',
      header: 'Entry',
      sortValue: (l) => l.id,
      render: (l) => (
        <div>
          <div className="text-[12.5px] font-extrabold text-ink">{l.id}</div>
          <div className="mt-0.5 text-[11px] font-medium text-ink-soft">ref {l.ref}</div>
        </div>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      sortValue: (l) => l.dayIndex,
      render: (l) => <span className="whitespace-nowrap text-[12px] font-semibold text-ink-soft">{l.date}</span>,
    },
    {
      key: 'source',
      header: 'Stream',
      sortValue: (l) => l.source,
      render: (l) => <Badge tone={SOURCE_TONE[l.source]}>{l.source}</Badge>,
    },
    {
      key: 'party',
      header: 'Party · Description',
      render: (l) => (
        <div>
          <div className="text-[12.5px] font-bold text-ink">{l.party}</div>
          <div className="mt-0.5 text-[11px] font-medium text-ink-soft">{l.description}</div>
        </div>
      ),
      className: 'hidden md:table-cell',
    },
    {
      key: 'amount',
      header: 'Amount',
      sortValue: (l) => l.amount,
      // Outflows (refunds) render red with an explicit minus sign.
      render: (l) => (
        <span className={`text-[13px] font-extrabold ${l.amount < 0 ? 'text-alert' : 'text-ink'}`}>
          {l.amount < 0 ? `− ${fmtUSD(-l.amount)}` : fmtUSD(l.amount)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortValue: (l) => l.status,
      render: (l) => <Badge tone={STATUS_TONE[l.status]}>{l.status}</Badge>,
    },
  ];

  return (
    <div className="animate-fade-in space-y-4">
      {/* Reconciliation KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <StatCard label="Settled Inflow" value={fmtUSD(agg.inflow)} delta="+9.6%" icon={D.dollar} />
        <StatCard label="Pending Reconciliation" value={fmtUSD(agg.pending)} delta="-6.2%" deltaLabel="clearing down" icon={D.clock} />
        <StatCard label="Refunds & Outflow" value={fmtUSD(-agg.refunds)} delta="+1.1%" negative icon={D.trendDown} />
        <StatCard label="Net Position" value={fmtUSD(agg.net)} delta="+8.9%" icon={D.ledger} />
      </div>

      {/* Trend + per-stream reconciliation summary */}
      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <Panel title="Settled Inflow · Last 14 Days">
          <div className="px-3 py-3 md:px-4">
            <LineChart data={agg.trend} labels={TREND_LABELS.map((l, i) => (i % 2 === 0 ? l : ''))} />
          </div>
        </Panel>

        <Panel title="Reconciliation by Stream">
          <ul className="px-4 py-3 md:px-5">
            {agg.perSource.map((s) => (
              <li key={s.src} className="border-b border-line py-3 last:border-b-0">
                <div className="flex items-center justify-between">
                  <Badge tone={SOURCE_TONE[s.src]}>{s.src}</Badge>
                  <span className="text-[11px] font-bold text-ink-faint">{s.count} entries</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-[12px] font-bold">
                  <span className="text-good">{fmtUSD(s.settled)} settled</span>
                  <span className="text-ink-soft">{fmtUSD(s.pending)} pending</span>
                </div>
                {/* Settled share of the stream's total */}
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-field">
                  <div className="h-full bg-good" style={{ width: `${Math.round((s.settled / (s.settled + s.pending || 1)) * 100)}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {/* Master ledger table */}
      <Panel
        title="Unified Ledger"
        action={<ActionButton label="Export CSV" icon={D.export} onClick={() => {}} />}
      >
        <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-3 md:px-5">
          <SearchInput value={table.query} onChange={table.setQuery} placeholder="Search entry, reference, party…" />
          <FilterSelect value={source} onChange={(v) => { setSource(v); table.resetPage(); }} options={SOURCES} allLabel="All streams" />
          <FilterSelect value={status} onChange={(v) => { setStatus(v); table.resetPage(); }} options={['settled', 'pending', 'refunded']} allLabel="All statuses" />
        </div>
        <DataTable
          columns={columns}
          rows={table.pageRows}
          rowKey={(l) => l.id}
          sortKey={table.sort?.key}
          sortDir={table.sort?.dir}
          onSort={table.toggleSort}
        />
        <Pagination page={table.page} totalPages={table.totalPages} total={table.total} pageSize={table.pageSize} onPage={table.setPage} />
      </Panel>
    </div>
  );
}
