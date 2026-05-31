import { ProjectsTable } from './components/ProjectsTable';
import { useProjectManagement } from './useProjectManagement';

export const ProjectManagement = () => {
  const vm = useProjectManagement();

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
        onView={row => void vm.actions.view(row)}
        onEdit={projectId => vm.actions.edit(projectId)}
        onApproveBudget={projectId => void vm.actions.approveBudget(projectId)}
        onSetWorkOrderStep={vm.actions.markWorkOrderStep}
        onFinalizeToDeliveryNote={vm.actions.finalizeToDeliveryNote}
        onInvoice={vm.actions.invoice}
        onCreditNote={vm.actions.creditNote}
      />
    </div>
  );
};
