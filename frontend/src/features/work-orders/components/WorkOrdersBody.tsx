import type { UseWorkOrdersResult } from '../hooks/useWorkOrders';
import type { UseProductionStationsResult } from '../hooks/useProductionStations';
import type { DevelopmentViewModel } from '../hooks/useWorkOrdersViewModel';
import { BudgetModal } from './BudgetModal';
import { NewRequestModal } from './NewRequestModal';
import { WorkOrderModal } from './WorkOrderModal';
import { InboxSection } from '../sections/InboxSection';
import { RequestSection } from '../sections/RequestSection';
import { BudgetSection } from '../sections/BudgetSection';
import { ValidationSection } from '../sections/ValidationSection';
import { DevelopmentSection } from '../sections/DevelopmentSection';
import { ProductionSection } from '../sections/ProductionSection';
import { FinalSection } from '../sections/FinalSection';
import { SidebarSummary } from '../sections/SidebarSummary';
import ErrorDialog from '../../../components/feedback/ErrorDialog';

type WorkOrdersBodyProps = {
  ctx: UseWorkOrdersResult;
  dev: DevelopmentViewModel;
  production: UseProductionStationsResult;
  advance: {
    onAdvanceStep: () => void;
    canAdvanceStep: boolean;
    nextStepLabel?: string;
    advanceHint?: string;
  };
  onFinalizeOrder: () => void;
};

export const WorkOrdersBody = ({ ctx, dev, production, advance, onFinalizeOrder }: WorkOrdersBodyProps) => {
  const {
    customers,
    requests,
    customerId,
    modelId,
    modelReference,
    catalogModelOptions,
    m2,
    googleView,
    notes,
    budgetGenerated,
    accountingApproved,
    adminApproved,
    developmentGenerated,
    cutlistGenerated,

    finalized,
    ready,
    selectedRequestId,
    tab,
    showBudgetModal,
    showRequestModal,
    showWorkOrderModal,
    selectedModel,
    hasModelRef,
    canGenerateBudget,
    budget,

    pendingBudgets,
    budgetValidationError,
    setBudgetValidationError,
    approverUserId,
    canStartProduction,
    budgetData,
    workOrderData,
    setCustomerId,
    setModelId,
    setModelReference,
    setModelImage,
    setM2,
    setGoogleView,
    setNotes,

    setFinalized,
    setReady,
    setSelectedRequestId,
    setShowBudgetModal,
    setShowRequestModal,
    setShowWorkOrderModal,
    resetDownstream,
    handleGenerateBudget,
    handleToggleAccounting,
    handleApproverUserIdChange,
    handleApproveBudget,
    applyRequest,
    createRequest,
    deleteRequest,
    handlePrint,
    handleEmail,
    handleWorkOrderPrint,
  } = ctx;
  const isInbox = tab === 'INBOX';
  const showSummary = !isInbox;

  const highlightRequestCustomer = tab === 'REQUEST' && !customerId;
  const highlightRequestM2 = tab === 'REQUEST' && m2 <= 0;
  const highlightRequestModelRef = tab === 'REQUEST' && !hasModelRef;

  const highlightBudgetGenerate = tab === 'BUDGET' && !budgetGenerated;
  const highlightBudgetAccounting = tab === 'BUDGET' && budgetGenerated && !accountingApproved;

  const highlightValidationApprove = tab === 'VALIDATION' && !adminApproved;

  const highlightDevelopment = tab === 'DEV' && !developmentGenerated;
  const highlightCutlist = tab === 'DEV' && developmentGenerated && !cutlistGenerated;


  const effectiveCanFinalize = canStartProduction && production.allCompleted;
  const canPersistFinal = effectiveCanFinalize && ready !== '';
  const visiblePendingBudgets = selectedRequestId
    ? pendingBudgets.filter(budget => budget.requestId === selectedRequestId)
    : pendingBudgets;

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`${isInbox ? 'lg:col-span-3' : 'lg:col-span-2'} space-y-8`}>
          {tab === 'INBOX' && (
            <InboxSection
              requests={requests}
              selectedRequestId={selectedRequestId}
              customerId={customerId}
              modelOptions={catalogModelOptions}
              onApplyRequest={applyRequest}
              onDeleteRequest={deleteRequest}
              onSelectRequest={setSelectedRequestId}
            />
          )}

          {tab === 'REQUEST' && (
            <RequestSection
              customers={customers}
              customerId={customerId}
              modelId={modelId}
              modelOptions={catalogModelOptions}
              m2={m2}
              modelReference={modelReference}
              googleView={googleView}
              notes={notes}
              hasModelRef={hasModelRef}
              onCustomerChange={value => { setCustomerId(value); resetDownstream(); }}
              onModelChange={value => { setModelId(value); resetDownstream(); }}
              onM2Change={value => { setM2(value); resetDownstream(); }}
              onModelReferenceChange={value => { setModelReference(value); resetDownstream(); }}
              onModelImageChange={file => { setModelImage(file); resetDownstream(); }}
              onGoogleViewChange={value => setGoogleView(value)}
              onNotesChange={value => setNotes(value)}
              highlightCustomer={highlightRequestCustomer}
              highlightM2={highlightRequestM2}
              highlightModelRef={highlightRequestModelRef}
              onAdvanceStep={advance.onAdvanceStep}
              canAdvanceStep={advance.canAdvanceStep}
              nextStepLabel={advance.nextStepLabel}
              advanceHint={advance.advanceHint}
            />
          )}

          {tab === 'BUDGET' && (
            <BudgetSection
              pricePerM2={selectedModel.pricePerM2}
              total={budget.total}
              canGenerateBudget={canGenerateBudget}
              budgetGenerated={budgetGenerated}
              accountingApproved={accountingApproved}
              adminApproved={adminApproved}
              validationError={budgetValidationError}
              onGenerateBudget={handleGenerateBudget}
              onToggleAccounting={handleToggleAccounting}
              highlightGenerate={highlightBudgetGenerate}
              highlightAccounting={highlightBudgetAccounting}
              onAdvanceStep={advance.onAdvanceStep}
              canAdvanceStep={advance.canAdvanceStep}
              nextStepLabel={advance.nextStepLabel}
              advanceHint={advance.advanceHint}
            />
          )}

          {tab === 'VALIDATION' && (
            <ValidationSection
              pendingBudgets={visiblePendingBudgets}
              approverUserId={approverUserId}
              onApproverUserIdChange={handleApproverUserIdChange}
              onApproveBudget={handleApproveBudget}
              highlightApprove={highlightValidationApprove}
              onAdvanceStep={advance.onAdvanceStep}
              canAdvanceStep={advance.canAdvanceStep}
              nextStepLabel={advance.nextStepLabel}
              advanceHint={advance.advanceHint}
            />
          )}

          {tab === 'DEV' && (
            <DevelopmentSection
              {...dev}
              catalogModelOptions={catalogModelOptions}
              highlightDevelopment={highlightDevelopment}
              highlightCutlist={highlightCutlist}
              onAdvanceStep={advance.onAdvanceStep}
              canAdvanceStep={advance.canAdvanceStep}
              nextStepLabel={advance.nextStepLabel}
              advanceHint={advance.advanceHint}
            />
          )}

          {tab === 'PROD' && (
            <ProductionSection
              production={production}
              canStartProduction={canStartProduction}
              cutlistGenerated={cutlistGenerated}
              cutlistResult={Boolean(dev.cutlist.cutlistResult)}
              onOpenWorkOrderModal={() => setShowWorkOrderModal(true)}
              onAdvanceStep={advance.onAdvanceStep}
              canAdvanceStep={advance.canAdvanceStep}
              nextStepLabel={advance.nextStepLabel}
              advanceHint={advance.advanceHint}
            />
          )}

          {tab === 'FINAL' && (
            <FinalSection
              finalized={finalized}
              ready={ready}
              canFinalize={effectiveCanFinalize}
              onFinalizedChange={value => setFinalized(value)}
              onReadyChange={value => setReady(value)}
              onAdvanceStep={advance.onAdvanceStep}
              canAdvanceStep={advance.canAdvanceStep}
              nextStepLabel={advance.nextStepLabel}
              advanceHint={advance.advanceHint}
              onFinalizeOrder={onFinalizeOrder}
              canPersistFinal={canPersistFinal}
            />
          )}
        </div>

        {showSummary && (
          <aside className="space-y-6">
            <SidebarSummary
              customerName={customers.find(c => c.id === customerId)?.nombreComercial || '—'}
              modelLabel={selectedModel.label}
              m2={m2}
              total={budget.total}
              budgetGenerated={budgetGenerated}
              accountingApproved={accountingApproved}
              adminApproved={adminApproved}
              googleView={googleView}
            />
          </aside>
        )}
      </div>

      <BudgetModal
        open={showBudgetModal}
        onClose={() => setShowBudgetModal(false)}
        data={budgetData}
        canPrint={budgetGenerated}
        canEmail={adminApproved}
        onPrint={handlePrint}
        onEmail={handleEmail}
      />

      <WorkOrderModal
        open={showWorkOrderModal}
        onClose={() => setShowWorkOrderModal(false)}
        data={workOrderData}
        canPrint={cutlistGenerated && Boolean(dev.cutlist.cutlistResult)}
        onPrint={handleWorkOrderPrint}
      />

      <NewRequestModal
        open={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        onCreate={createRequest}
        customers={customers}
        modelOptions={catalogModelOptions}
      />

      <ErrorDialog
        open={Boolean(budgetValidationError)}
        title="No pudimos aprobar el presupuesto"
        description="Revisa el ID del aprobador y vuelve a intentarlo. El ID del usuario debe ser numérico."
        detail={budgetValidationError || undefined}
        onClose={() => setBudgetValidationError('')}
      />
    </>
  );
};
