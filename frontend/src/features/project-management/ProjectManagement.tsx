import { ProjectsTable } from './components/ProjectsTable';
import { useProjectManagement } from './useProjectManagement';
import { useEffect, useMemo, useState } from 'react';
import type { ProjectDocumentRow } from './ProjectManagement.types';
import { DocumentDrawer } from './components/DocumentDrawer';
import { documentManagementTheme } from './documentManagementTheme';
import { NewDocumentModal } from './components/NewDocumentModal';

type Props = {
  openRowId: string | null;
  onOpenRowHandled: () => void;
};

export const ProjectManagement = ({ openRowId, onOpenRowHandled }: Props) => {
  const vm = useProjectManagement();
  const [drawerRow, setDrawerRow] = useState<ProjectDocumentRow | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const drawerOpen = useMemo(() => drawerRow !== null, [drawerRow]);

  useEffect(() => {
    if (!openRowId) return;
    const match = vm.rows.find(row => row.rowId === openRowId);
    if (match) {
      setDrawerRow(match);
    }
    onOpenRowHandled();
  }, [openRowId, onOpenRowHandled, vm.rows]);

  return (
    <div
      className="relative flex-1 flex flex-col min-h-0 gap-4 overflow-hidden rounded-[28px] border"
      style={{
        background: documentManagementTheme.pageBg,
        borderColor: documentManagementTheme.border,
        boxShadow: documentManagementTheme.shadow,
      }}
    >
      {vm.error && (
        <div
          className="rounded-2xl border px-4 py-3 text-sm"
          style={{
            borderColor: '#fecaca',
            background: '#fff1f2',
            color: '#9f1239',
            boxShadow: documentManagementTheme.shadowSoft,
          }}
        >
          {vm.error}
        </div>
      )}

      <div className="flex-1 min-h-0">
        <ProjectsTable
          rows={vm.rows}
          busyProjectId={vm.busyProjectId}
          onOpenDetails={row => setDrawerRow(row)}
          onCreateDocument={() => setCreateModalOpen(true)}
        />
      </div>

      <DocumentDrawer
        open={drawerOpen}
        row={drawerRow}
        onClose={() => setDrawerRow(null)}
        onOpenPdf={(row) => void vm.actions.openPdf(row)}
        onRowUpdated={(updatedRow) => {
          setDrawerRow(updatedRow);
          vm.actions.updateDocumentRow(updatedRow);
        }}
      />

      <NewDocumentModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={vm.actions.createDocument}
        onCreated={(row) => {
          setCreateModalOpen(false);
          if (row.quoteId) {
            setDrawerRow(row);
          }
        }}
      />
    </div>
  );
};
