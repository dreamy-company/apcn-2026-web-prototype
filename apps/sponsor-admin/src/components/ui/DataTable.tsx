import { useMemo, useState, type ReactNode } from 'react';
import Icon from './Icon';
import { D } from '../../data/icons';

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number; // presence makes the column sortable
  className?: string;                       // e.g. hide on small screens
}

/**
 * Client-side table state: free-text search across given fields, single-column
 * sort, and pagination. Page-specific filters (status, role, …) are applied by
 * the caller *before* passing rows in — `resetPage` lets filter changes snap
 * back to page 1.
 */
export function useTableState<T>(
  rows: T[],
  searchFields: (row: T) => string[],
  pageSize = 10,
) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<{ key: string; dir: 1 | -1; value: (row: T) => string | number } | null>(null);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = q ? rows.filter((r) => searchFields(r).some((f) => f.toLowerCase().includes(q))) : rows;
    if (sort) {
      out = [...out].sort((a, b) => {
        const va = sort.value(a);
        const vb = sort.value(b);
        return (va < vb ? -1 : va > vb ? 1 : 0) * sort.dir;
      });
    }
    return out;
  }, [rows, query, sort, searchFields]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const clampedPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((clampedPage - 1) * pageSize, clampedPage * pageSize);

  return {
    query,
    setQuery: (v: string) => {
      setQuery(v);
      setPage(1);
    },
    resetPage: () => setPage(1),
    sort,
    toggleSort: (key: string, value: (row: T) => string | number) =>
      setSort((prev) => (prev?.key === key ? { key, value, dir: prev.dir === 1 ? -1 : 1 } : { key, value, dir: 1 })),
    page: clampedPage,
    setPage,
    totalPages,
    pageRows,
    total: filtered.length,
    pageSize,
  };
}

export function Pagination({
  page,
  totalPages,
  total,
  pageSize,
  onPage,
}: {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPage: (p: number) => void;
}) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  return (
    <div className="flex items-center justify-between border-t border-line px-4 py-3 md:px-5">
      <span className="text-[12px] font-semibold text-ink-soft">
        {from}–{to} of {total}
      </span>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-line disabled:opacity-40 enabled:hover:bg-field"
          aria-label="Previous page"
        >
          <Icon d={D.back} s={15} sw={2.2} />
        </button>
        <span className="min-w-16 text-center text-[12.5px] font-bold text-ink">
          {page} / {totalPages}
        </span>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPage(page + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-line disabled:opacity-40 enabled:hover:bg-field"
          aria-label="Next page"
        >
          <Icon d={D.chev} s={15} sw={2.2} />
        </button>
      </div>
    </div>
  );
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  sortKey,
  sortDir,
  onSort,
  emptyLabel = 'No results match your filters.',
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  sortKey?: string;
  sortDir?: 1 | -1;
  onSort?: (key: string, value: (row: T) => string | number) => void;
  emptyLabel?: string;
}) {
  return (
    // Horizontal scroll keeps dense tables usable on small screens.
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left">
        <thead>
          <tr className="border-b border-line">
            {columns.map((c) => (
              <th key={c.key} className={`px-4 py-3 md:px-5 ${c.className ?? ''}`}>
                {c.sortValue && onSort ? (
                  <button
                    type="button"
                    onClick={() => onSort(c.key, c.sortValue!)}
                    className={`flex items-center gap-1 text-[11px] font-extrabold tracking-[0.6px] uppercase ${
                      sortKey === c.key ? 'text-brand' : 'text-ink-soft hover:text-ink'
                    }`}
                  >
                    {c.header}
                    {sortKey === c.key && (
                      <Icon d={D.sortAsc} s={11} sw={2.4} className={sortDir === -1 ? 'rotate-180' : ''} />
                    )}
                  </button>
                ) : (
                  <span className="text-[11px] font-extrabold tracking-[0.6px] uppercase text-ink-soft">
                    {c.header}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={rowKey(r)}
              onClick={() => onRowClick?.(r)}
              className={`border-b border-line last:border-b-0 ${
                onRowClick ? 'cursor-pointer transition-colors hover:bg-brand-soft/30' : ''
              }`}
            >
              {columns.map((c) => (
                <td key={c.key} className={`px-4 py-3 text-[13px] md:px-5 ${c.className ?? ''}`}>
                  {c.render(r)}
                </td>
              ))}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-5 py-10 text-center text-[13px] font-semibold text-ink-faint">
                {emptyLabel}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
