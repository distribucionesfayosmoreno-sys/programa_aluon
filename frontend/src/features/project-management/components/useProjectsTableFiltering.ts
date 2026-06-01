import { useMemo, useState } from 'react';
import type { ProjectDocumentKind, ProjectDocumentRow } from '../ProjectManagement.types';
import { defaultProjectsTableFilters } from './ProjectsTableFilters.types';
import type { ProjectsTableFilters } from './ProjectsTableFilters.types';

type DateRange = { fromMs: number | null; toMs: number | null };

const normalizeText = (value: string): string => value.trim().toLowerCase();

const safeParseMs = (isoLike: string): number | null => {
  const ms = Date.parse(isoLike);
  return Number.isNaN(ms) ? null : ms;
};

const parseDateRange = (dateFrom: string, dateTo: string): DateRange => {
  const fromMs = dateFrom.length > 0 ? safeParseMs(`${dateFrom}T00:00:00`) : null;
  const toMs = dateTo.length > 0 ? safeParseMs(`${dateTo}T23:59:59.999`) : null;
  return { fromMs, toMs };
};

const withinRange = (valueMs: number, range: DateRange): boolean => {
  if (range.fromMs !== null && valueMs < range.fromMs) return false;
  if (range.toMs !== null && valueMs > range.toMs) return false;
  return true;
};

type FilteringResult = {
  filters: ProjectsTableFilters;
  setFilters: (next: ProjectsTableFilters) => void;
  resetFilters: () => void;
  filteredRows: ProjectDocumentRow[];
  typeOptions: ProjectDocumentKind[];
  statusOptions: string[];
  matchCount: number;
};

const compareKinds = (a: ProjectDocumentKind, b: ProjectDocumentKind): number => a.localeCompare(b);
const compareText = (a: string, b: string): number => a.localeCompare(b);

export const useProjectsTableFiltering = (rows: ProjectDocumentRow[]): FilteringResult => {
  const [filters, setFilters] = useState<ProjectsTableFilters>(defaultProjectsTableFilters);

  const typeOptions = useMemo(() => {
    const set = new Set<ProjectDocumentKind>();
    for (const r of rows) set.add(r.type);
    return [...set].sort(compareKinds);
  }, [rows]);

  const statusOptions = useMemo(() => {
    const set = new Set<string>();
    for (const r of rows) set.add(r.statusLabel);
    return [...set].sort(compareText);
  }, [rows]);

  const filteredRows = useMemo(() => {
    const q = normalizeText(filters.query);
    const range = parseDateRange(filters.dateFrom, filters.dateTo);

    return rows.filter(r => {
      if (filters.type !== 'ALL' && r.type !== filters.type) return false;
      if (filters.status !== 'ALL' && r.statusLabel !== filters.status) return false;

      if (range.fromMs !== null || range.toMs !== null) {
        const createdAtMs = safeParseMs(r.createdAt);
        if (createdAtMs === null) return false;
        if (!withinRange(createdAtMs, range)) return false;
      }

      if (q.length === 0) return true;
      const haystack = normalizeText([r.customerName, r.type, r.number, r.statusLabel].filter(Boolean).join(' '));
      return haystack.includes(q);
    });
  }, [filters.dateFrom, filters.dateTo, filters.query, filters.status, filters.type, rows]);

  const resetFilters = (): void => setFilters(defaultProjectsTableFilters);

  return {
    filters,
    setFilters,
    resetFilters,
    filteredRows,
    typeOptions,
    statusOptions,
    matchCount: filteredRows.length,
  };
};

