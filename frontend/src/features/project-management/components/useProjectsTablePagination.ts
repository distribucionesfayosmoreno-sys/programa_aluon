import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { RefObject } from 'react';
import type { ProjectDocumentRow } from '../ProjectManagement.types';

const DEFAULT_ROW_HEIGHT = 44;
const HEIGHT_BUFFER_PX = 16;

type UseProjectsTablePaginationResult = {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  pageRows: ProjectDocumentRow[];
  pageStartIndex: number;
  pageEndIndex: number;
  setCurrentPage: (next: number) => void;
  tableBodyRef: RefObject<HTMLDivElement>;
  tableHeadRef: RefObject<HTMLTableSectionElement>;
  footerRef: RefObject<HTMLDivElement>;
  firstRowRef: RefObject<HTMLTableRowElement>;
};

const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);

export const useProjectsTablePagination = (rows: ProjectDocumentRow[]): UseProjectsTablePaginationResult => {
  const [currentPage, setCurrentPageState] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const tableBodyRef = useRef<HTMLDivElement>(null);
  const tableHeadRef = useRef<HTMLTableSectionElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const firstRowRef = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    setCurrentPageState(1);
  }, [rows]);

  useLayoutEffect(() => {
    const recompute = () => {
      const viewportHeight = tableBodyRef.current?.clientHeight ?? 0;
      const headHeight = tableHeadRef.current?.getBoundingClientRect().height ?? 0;
      const footerHeight = footerRef.current?.getBoundingClientRect().height ?? 0;
      const rowHeight = firstRowRef.current?.getBoundingClientRect().height ?? DEFAULT_ROW_HEIGHT;
      const availableHeight = Math.max(0, viewportHeight - headHeight - footerHeight - HEIGHT_BUFFER_PX);
      const nextPageSize = Math.max(1, Math.floor(availableHeight / rowHeight));
      setPageSize(prev => (prev === nextPageSize ? prev : nextPageSize));
    };

    recompute();

    const observedNodes = [tableBodyRef.current, tableHeadRef.current, footerRef.current, firstRowRef.current]
      .filter(Boolean) as HTMLElement[];
    const observer = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => window.requestAnimationFrame(recompute))
      : null;

    observedNodes.forEach(node => observer?.observe(node));

    return () => {
      observer?.disconnect();
    };
  }, [rows.length]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(rows.length / pageSize)), [pageSize, rows.length]);

  useEffect(() => {
    setCurrentPageState(prev => clamp(prev, 1, totalPages));
  }, [totalPages]);

  const pageStartIndex = rows.length === 0 ? 0 : ((currentPage - 1) * pageSize) + 1;
  const pageRows = rows.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const pageEndIndex = rows.length === 0 ? 0 : pageStartIndex + pageRows.length - 1;

  const setCurrentPage = (next: number): void => {
    setCurrentPageState(clamp(next, 1, totalPages));
  };

  return {
    currentPage,
    pageSize,
    totalPages,
    pageRows,
    pageStartIndex,
    pageEndIndex,
    setCurrentPage,
    tableBodyRef,
    tableHeadRef,
    footerRef,
    firstRowRef,
  } as const;
};
