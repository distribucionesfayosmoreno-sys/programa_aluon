import type { ProjectDocumentKind } from '../ProjectManagement.types';

export type ProjectsTableFilters = {
  query: string;
  type: ProjectDocumentKind | 'ALL';
  status: string | 'ALL';
  dateFrom: string;
  dateTo: string;
};

export const defaultProjectsTableFilters: ProjectsTableFilters = {
  query: '',
  type: 'ALL',
  status: 'ALL',
  dateFrom: '',
  dateTo: '',
};

