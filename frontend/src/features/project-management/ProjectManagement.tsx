import { ProjectsTable } from './components/ProjectsTable';
import { useProjectManagement } from './useProjectManagement';
import { useMemo, useState } from 'react';
import type { ProjectDocumentRow } from './ProjectManagement.types';
import { DocumentDrawer } from './components/DocumentDrawer';

export const ProjectManagement = () => {
  const vm = useProjectManagement();
  const [drawerRow, setDrawerRow] = useState<ProjectDocumentRow | null>(null);

  const drawerOpen = useMemo(() => drawerRow !== null, [drawerRow]);

  return (
    <div className="flex-1 flex flex-col min-h-0 gap-4">
      {vm.error && (
        <div className="rounded-xl border px-4 py-3 text-sm" style={{ borderColor: '#fecaca', background: '#fef2f2', color: '#991b1b' }}>
          {vm.error}
        </div>
      )}

      <ProjectsTable
        rows={vm.rows}
        busyProjectId={vm.busyProjectId}
        onOpenDetails={row => setDrawerRow(row)}
      />

      <DocumentDrawer
        open={drawerOpen}
        row={drawerRow}
        onClose={() => setDrawerRow(null)}
        onOpenPdf={(row) => void vm.actions.openPdf(row)}
      />
    </div>
  );
};
