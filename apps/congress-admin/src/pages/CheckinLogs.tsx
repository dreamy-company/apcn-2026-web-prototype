import { useEffect, useMemo, useState } from 'react';
import { Panel, SearchInput } from '../components/ui/bits';
import { DataTable, Pagination, useTableState, type Column } from '../components/ui/DataTable';
import { BarChart } from '../components/charts/charts';
import Icon from '../components/ui/Icon';
import { D } from '../data/icons';
import { SCANS, CONGRESS_DAYS, type CheckinScan } from '../data/mock';
import { scansPerDay, totals, conversionRate } from '../data/stats';

export default function CheckinLogs() {
  const [day, setDay] = useState<number | null>(null);

  const filtered = useMemo(() => (day === null ? SCANS : SCANS.filter((s) => s.day === day)), [day]);

  const table = useTableState(filtered, (s) => [s.attendee, s.badgeId, s.session, s.gate]);
  useEffect(() => table.resetPage(), [day]); // eslint-disable-line react-hooks/exhaustive-deps

  const columns: Column<CheckinScan>[] = [
    {
      key: 'attendee',
      header: 'Attendee',
      sortValue: (s) => s.attendee,
      render: (s) => (
        <div>
          <div className="font-extrabold text-ink">{s.attendee}</div>
          <div className="mt-0.5 text-[11.5px] font-medium tracking-wide text-ink-soft">{s.badgeId}</div>
        </div>
      ),
    },
    {
      key: 'session',
      header: 'Session',
      render: (s) => (
        <div className="max-w-[280px]">
          <div className="truncate text-[12.5px] font-bold text-ink">{s.session}</div>
          <div className="mt-0.5 flex items-center gap-1 text-[11.5px] font-medium text-ink-soft">
            <Icon d={D.pin} s={11} c="#b8b3ab" sw={2.2} />
            {s.room}
          </div>
        </div>
      ),
    },
    {
      key: 'day',
      header: 'Day',
      sortValue: (s) => s.day,
      render: (s) => <span className="font-semibold text-ink-soft">{CONGRESS_DAYS[s.day]}</span>,
    },
    {
      key: 'time',
      header: 'Scanned',
      sortValue: (s) => s.time,
      render: (s) => <span className="font-extrabold text-good">{s.time}</span>,
    },
    { key: 'gate', header: 'Gate', render: (s) => <span className="font-semibold text-ink-soft">{s.gate}</span> },
  ];

  return (
    <div className="animate-fade-in">
      <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
        <Panel title="Scans per Day">
          <div className="px-4 py-3">
            <BarChart data={scansPerDay} />
            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-line pt-3">
              <div>
                <div className="text-[10.5px] font-bold tracking-[0.5px] uppercase text-ink-faint">Total scans</div>
                <div className="text-lg font-extrabold text-ink">{totals.scans}</div>
              </div>
              <div>
                <div className="text-[10.5px] font-bold tracking-[0.5px] uppercase text-ink-faint">Conversion</div>
                <div className="text-lg font-extrabold text-good">{conversionRate}%</div>
              </div>
            </div>
          </div>
        </Panel>

        <Panel>
          {/* Toolbar: day chips + search */}
          <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-3 md:px-5">
            <div className="flex gap-1.5">
              {[null, ...CONGRESS_DAYS.keys()].map((d) => (
                <button
                  type="button"
                  key={d === null ? 'all' : d}
                  onClick={() => setDay(d as number | null)}
                  className={`h-9 rounded-lg px-3 text-[12px] font-extrabold transition-colors ${
                    day === d ? 'bg-brand text-white' : 'bg-field text-ink-soft hover:bg-line'
                  }`}
                >
                  {d === null ? 'All days' : CONGRESS_DAYS[d as number]}
                </button>
              ))}
            </div>
            <SearchInput value={table.query} onChange={table.setQuery} placeholder="Search attendee, session, gate…" />
          </div>
          <DataTable
            columns={columns}
            rows={table.pageRows}
            rowKey={(s) => s.id}
            sortKey={table.sort?.key}
            sortDir={table.sort?.dir}
            onSort={table.toggleSort}
          />
          <Pagination
            page={table.page}
            totalPages={table.totalPages}
            total={table.total}
            pageSize={table.pageSize}
            onPage={table.setPage}
          />
        </Panel>
      </div>
    </div>
  );
}
