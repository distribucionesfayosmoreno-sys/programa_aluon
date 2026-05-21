import type { UseWorkOrdersResult } from '../hooks/useWorkOrders';
import type { DevelopmentSectionProps } from '../sections/development/DevelopmentSection.types';
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
  dev: DevelopmentSectionProps;
  advance: {
    onAdvanceStep: () => void;
    canAdvanceStep: boolean;
    nextStepLabel?: string;
    advanceHint?: string;
  };
  onFinalizeOrder: () => void;
};

export const WorkOrdersBody = ({ ctx, dev, advance, onFinalizeOrder }: WorkOrdersBodyProps) => {
  const {
    customers,
    requests,
    customerId,
    modelId,
    modelReference,
    m2,
    googleView,
    notes,
    budgetGenerated,
    accountingApproved,
    adminApproved,
    developmentGenerated,
    cutlistGenerated,
    prodCut,
    prodFab,
    prodLac,
    prodLacControl,
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
    productionPct,
    pendingBudgets,
    budgetValidationError,
    setBudgetValidationError,
    approverUserId,
    canStartProduction,
    canFinalize,
    budgetData,
    workOrderData,
    setCustomerId,
    setModelId,
    setModelReference,
    setModelImage,
    setM2,
    setGoogleView,
    setNotes,
    setProdCut,
    setProdFab,
    setProdLac,
    setProdLacControl,
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

  const highlightProdCut = tab === 'PROD' && !prodCut;
  const highlightProdFab = tab === 'PROD' && !prodFab;
  const highlightProdLac = tab === 'PROD' && !prodLac;
  const highlightProdLacControl = tab === 'PROD' && !prodLacControl;
  const canPersistFinal = canFinalize && ready !== '';
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
              productionPct={productionPct}
              prodCut={prodCut}
              prodFab={prodFab}
              prodLac={prodLac}
              prodLacControl={prodLacControl}
              canStartProduction={canStartProduction}
              cutlistGenerated={cutlistGenerated}
              cutlistResult={Boolean(dev.cutlist.cutlistResult)}
              onProdCutChange={value => setProdCut(value)}
              onProdFabChange={value => setProdFab(value)}
              onProdLacChange={value => setProdLac(value)}
              onProdLacControlChange={value => setProdLacControl(value)}
              onOpenWorkOrderModal={() => setShowWorkOrderModal(true)}
              highlightProdCut={highlightProdCut}
              highlightProdFab={highlightProdFab}
              highlightProdLac={highlightProdLac}
              highlightProdLacControl={highlightProdLacControl}
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
              canFinalize={canFinalize}
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
