import { ProjectsTable } from './components/ProjectsTable';
import { useProjectManagement } from './useProjectManagement';
import { useMemo, useState } from 'react';
import type { ProjectDocumentRow } from './ProjectManagement.types';
import { DocumentDrawer } from './components/DocumentDrawer';
import { documentManagementTheme } from './documentManagementTheme';

export const ProjectManagement = () => {
  const vm = useProjectManagement();
  const [drawerRow, setDrawerRow] = useState<ProjectDocumentRow | null>(null);

  const drawerOpen = useMemo(() => drawerRow !== null, [drawerRow]);

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
        />
      </div>

      <DocumentDrawer
        open={drawerOpen}
        row={drawerRow}
        onClose={() => setDrawerRow(null)}
        onOpenPdf={(row) => void vm.actions.openPdf(row)}
      />
    </div>
  );
};
