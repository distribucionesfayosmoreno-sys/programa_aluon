import type { UseWorkOrdersResult } from './hooks/useWorkOrders';
import { BudgetModal } from './components/BudgetModal';
import { NewRequestModal } from './components/NewRequestModal';
import { WorkOrderModal } from './components/WorkOrderModal';
import { InboxSection } from './sections/InboxSection';
import { RequestSection } from './sections/RequestSection';
import { BudgetSection } from './sections/BudgetSection';
import { ValidationSection } from './sections/ValidationSection';
import { DevelopmentSection } from './sections/DevelopmentSection';
import { ProductionSection } from './sections/ProductionSection';
import { FinalSection } from './sections/FinalSection';
import { SidebarSummary } from './sections/SidebarSummary';
import { SidebarWorkflow } from './sections/SidebarWorkflow';

export const WorkOrdersView = ({ ctx }: { ctx: UseWorkOrdersResult }) => {
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
    doorType,
    doorModel,
    widthMm,
    heightMm,
    groundClearanceMm,
    largueroMm,
    topFrame,
    automationReinforcement,
    railType,
    mountingType,
    tail,
    cutlistResult,
    cutlistError,
    cutlistLoading,
    cutlistImageIndex,
    cutlistPinnedIndex,
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
    overallPct,
    canGenerateDevelopment,
    pendingBudgets,
    budgetValidationError,
    approverUserId,
    needsGroundClearance,
    needsLarguero,
    needsTopFrame,
    needsAutomation,
    needsRail,
    needsMounting,
    needsTail,
    cutlistImages,
    activeCutlistIndex,
    canGenerateCutlist,
    canStartProduction,
    canFinalize,
    pipelineSteps,
    budgetData,
    workOrderData,
    setCustomerId,
    setModelId,
    setModelReference,
    setModelImage,
    setM2,
    setGoogleView,
    setNotes,
    setDevelopmentGenerated,
    setDoorType,
    setDoorModel,
    setWidthMm,
    setHeightMm,
    setGroundClearanceMm,
    setLargueroMm,
    setTopFrame,
    setAutomationReinforcement,
    setRailType,
    setMountingType,
    setTail,
    setCutlistImageIndex,
    setCutlistHoverIndex,
    setCutlistPinnedIndex,
    setProdCut,
    setProdFab,
    setProdLac,
    setProdLacControl,
    setFinalized,
    setReady,
    setTab,
    setShowBudgetModal,
    setShowRequestModal,
    setShowWorkOrderModal,
    resetDownstream,
    handleGenerateBudget,
    handleToggleAccounting,
    handleApproverUserIdChange,
    handleApproveBudget,
    handleGenerateCutlist,
    clearCutlist,
    applyRequest,
    createRequest,
    handlePrint,
    handleEmail,
    handleWorkOrderPrint,
  } = ctx;

  return (
    <div className="flex flex-col" style={{ minHeight: 600 }}>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-1 h-5 rounded-full bg-brand" />
            <h1 className="text-xl font-black uppercase tracking-tight" style={{ color: '#0d1117' }}>
              Órdenes de trabajo
            </h1>
          </div>
          <p className="text-xs font-semibold uppercase tracking-wide ml-3.5 mt-0.5" style={{ color: '#9ca3af' }}>
            Workflow · Presupuestos · Producción
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: '#f8f9fb', border: '1px solid #e8eaed' }}>
            <div className="h-2 w-24 rounded-full" style={{ background: '#e8eaed', overflow: 'hidden' }}>
              <div className="h-full" style={{ width: `${overallPct}%`, background: '#e5534b' }} />
            </div>
            <span className="text-xs font-bold" style={{ color: '#8b949e' }}>{overallPct}%</span>
          </div>
          <button className="btn-primary" onClick={() => setShowRequestModal(true)}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nueva orden
          </button>
          <button className="btn-ghost" onClick={() => resetDownstream()}>Reiniciar flujo</button>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6 overflow-x-auto">
        {pipelineSteps.map((step, idx) => (
          <button
            key={step.key}
            type="button"
            onClick={() => setTab(step.key)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl whitespace-nowrap"
            style={{
              border: `1px solid ${tab === step.key ? '#e5534b' : '#e8eaed'}`,
              background: tab === step.key ? '#fff7f7' : '#ffffff',
            }}
          >
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black"
              style={{
                background: step.done ? '#e5534b' : '#e8eaed',
                color: step.done ? '#ffffff' : '#6b7280',
              }}
            >
              {idx + 1}
            </span>
            <span className="text-xs font-black uppercase" style={{ color: '#0d1117', letterSpacing: '0.08em' }}>
              {step.label}
            </span>
            {step.done && (
              <span className="text-[10px] font-black" style={{ color: '#15803d' }}>
                ✓
              </span>
            )}
          </button>
        ))}
      </div>

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
            <DevelopmentSection
              developmentGenerated={developmentGenerated}
              cutlistGenerated={cutlistGenerated}
              canGenerateDevelopment={canGenerateDevelopment}
              canGenerateCutlist={canGenerateCutlist}
              cutlistLoading={cutlistLoading}
              cutlistError={cutlistError}
              doorType={doorType}
              doorModel={doorModel}
              widthMm={widthMm}
              heightMm={heightMm}
              groundClearanceMm={groundClearanceMm}
              largueroMm={largueroMm}
              topFrame={topFrame}
              automationReinforcement={automationReinforcement}
              railType={railType}
              mountingType={mountingType}
              tail={tail}
              needsGroundClearance={needsGroundClearance}
              needsLarguero={needsLarguero}
              needsTopFrame={needsTopFrame}
              needsAutomation={needsAutomation}
              needsRail={needsRail}
              needsMounting={needsMounting}
              needsTail={needsTail}
              cutlistResult={cutlistResult}
              cutlistImages={cutlistImages}
              cutlistImageIndex={cutlistImageIndex}
              activeCutlistIndex={activeCutlistIndex}
              cutlistPinnedIndex={cutlistPinnedIndex}
              onGenerateDevelopment={() => setDevelopmentGenerated(true)}
              onGenerateCutlist={handleGenerateCutlist}
              onDoorTypeChange={value => { setDoorType(value); clearCutlist(); }}
              onDoorModelChange={value => { setDoorModel(value); clearCutlist(); }}
              onWidthChange={value => { setWidthMm(value); clearCutlist(); }}
              onHeightChange={value => { setHeightMm(value); clearCutlist(); }}
              onGroundClearanceChange={value => { setGroundClearanceMm(value); clearCutlist(); }}
              onLargueroChange={value => { setLargueroMm(value); clearCutlist(); }}
              onTopFrameChange={value => { setTopFrame(value); clearCutlist(); }}
              onAutomationChange={value => { setAutomationReinforcement(value); clearCutlist(); }}
              onRailTypeChange={value => { setRailType(value); clearCutlist(); }}
              onMountingTypeChange={value => { setMountingType(value); clearCutlist(); }}
              onTailChange={value => { setTail(value); clearCutlist(); }}
              onCutlistImageChange={index => setCutlistImageIndex(index)}
              onCutlistHoverChange={index => setCutlistHoverIndex(index)}
              onCutlistPinnedChange={index => setCutlistPinnedIndex(index)}
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
              cutlistResult={Boolean(cutlistResult)}
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

          <SidebarWorkflow
            customerReady={Boolean(customerId) && m2 > 0 && hasModelRef}
            budgetGenerated={budgetGenerated}
            accountingApproved={accountingApproved}
            adminApproved={adminApproved}
            developmentGenerated={developmentGenerated}
            cutlistGenerated={cutlistGenerated}
            productionReady={prodCut && prodFab && prodLac && prodLacControl}
            finalized={finalized}
            ready={ready !== ''}
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
        canPrint={cutlistGenerated && Boolean(cutlistResult)}
        onPrint={handleWorkOrderPrint}
      />

      <NewRequestModal
        open={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        onCreate={createRequest}
        customers={customers}
      />
    </div>
  );
};
