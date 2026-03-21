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

type WorkOrdersBodyProps = {
  ctx: UseWorkOrdersResult;
  dev: DevelopmentSectionProps;
};

export const WorkOrdersBody = ({ ctx, dev }: WorkOrdersBodyProps) => {
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
    handlePrint,
    handleEmail,
    handleWorkOrderPrint,
  } = ctx;

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-8">
          {tab === 'INBOX' && (
            <InboxSection
              requests={requests}
              selectedRequestId={selectedRequestId}
              customerId={customerId}
              onApplyRequest={applyRequest}
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
            />
          )}

          {tab === 'VALIDATION' && (
            <ValidationSection
              pendingBudgets={pendingBudgets}
              approverUserId={approverUserId}
              onApproverUserIdChange={handleApproverUserIdChange}
              onApproveBudget={handleApproveBudget}
              error={budgetValidationError}
            />
          )}

          {tab === 'DEV' && (
            <DevelopmentSection {...dev} />
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
            />
          )}

          {tab === 'FINAL' && (
            <FinalSection
              finalized={finalized}
              ready={ready}
              canFinalize={canFinalize}
              onFinalizedChange={value => setFinalized(value)}
              onReadyChange={value => setReady(value)}
            />
          )}
        </div>

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
      </div>

      <BudgetModal
        open={showBudgetModal}
        onClose={() => setShowBudgetModal(false)}
        data={budgetData}
        canExport={accountingApproved && adminApproved}
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
    </>
  );
};
