import type { ProjectDocumentRow } from '../ProjectManagement.types';
import type {
  DocumentManagementCreateRequest,
  DocumentManagementCreatableType,
} from '../services/documentManagementApi';

export type NewDocumentModalProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: DocumentManagementCreateRequest) => Promise<ProjectDocumentRow>;
  onCreated: (row: ProjectDocumentRow) => void;
};

export type NewDocumentModalState = {
  submitting: boolean;
  error: string;
  customerName: string;
  selectedType: DocumentManagementCreatableType | '';
  number: string;
};
