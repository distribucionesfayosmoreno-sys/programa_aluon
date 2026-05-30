import { BudgetWizardColorStep } from './steps/BudgetWizardColorStep';
import { BudgetWizardCustomerStep } from './steps/BudgetWizardCustomerStep';
import { BudgetWizardDoneStep } from './steps/BudgetWizardDoneStep';
import { BudgetWizardMeasurementsStep } from './steps/BudgetWizardMeasurementsStep';
import { BudgetWizardModelStep } from './steps/BudgetWizardModelStep';
import { BudgetWizardProductStep } from './steps/BudgetWizardProductStep';
import { BudgetWizardSummaryStep } from './steps/BudgetWizardSummaryStep';
import { BudgetWizardVariantStep } from './steps/BudgetWizardVariantStep';
import { BudgetWizardOptionsStep } from './steps/BudgetWizardOptionsStep';
import { useBudgetWizard } from './useBudgetWizard';


export const BudgetWizard = () => {
  const wizard = useBudgetWizard();

  return (
    <div className="bg-slate-50 min-h-full p-4 md:p-8 flex flex-col">
      <div className="w-full flex-1 mx-auto space-y-6">
        {/* Page Header */}
        <header className="flex items-center justify-between bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Presupuestos</div>
            <h1 className="text-3xl font-black text-slate-900 mt-1">Wizard de Puertas</h1>
          </div>
          <button
            type="button"
            onClick={wizard.reset}
            className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest active:scale-95 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">refresh</span>
            Reiniciar
          </button>
        </header>

        {wizard.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs font-bold shadow-sm">
            {wizard.error}
          </div>
        )}

        <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200 shadow-md">
          {wizard.step === 'MODELO' && (
            <BudgetWizardModelStep
              models={wizard.models}
              loading={wizard.loading}
              onSelect={wizard.selectModel}
            />
          )}

          {wizard.step === 'PRODUCTO' && wizard.selectedModel && (
            <BudgetWizardProductStep
              model={wizard.selectedModel}
              loading={wizard.loading}
              onBack={() => wizard.setStep('MODELO')}
              onSelect={wizard.selectStructure}
            />
          )}

          {wizard.step === 'COLOR' && wizard.selectedModel && wizard.selectedProduct && (
            <BudgetWizardColorStep
              color={wizard.color}
              primerRequired={wizard.primerRequired}
              onColorChange={wizard.setColor}
              onPrimerChange={wizard.setPrimerRequired}
              onBack={() => wizard.setStep('PRODUCTO')}
              onNext={() => {
                if (wizard.selectedProduct?.producto === 'VALLA') {
                  wizard.setStep('MEDIDAS');
                } else {
                  wizard.setStep('APERTURA');
                }
              }}
            />
          )}

          {wizard.step === 'APERTURA' && wizard.selectedModel && wizard.selectedVariant && (
            <BudgetWizardVariantStep
              model={wizard.selectedModel}
              doorType={wizard.selectedVariant.variante}
              bisagras={wizard.bisagras}
              onSelect={(val: boolean) => {
                wizard.setBisagras(val);
                wizard.setStep('MEDIDAS');
              }}
              onBack={() => wizard.setStep('COLOR')}
            />
          )}

          {wizard.step === 'MEDIDAS' && wizard.selectedModel && wizard.selectedVariant && (
            <BudgetWizardMeasurementsStep
              widthMm={wizard.widthMm}
              heightMm={wizard.heightMm}
              floorClearanceMm={wizard.floorClearanceMm}
              larguero={wizard.larguero}
              marcoSuperior={wizard.marcoSuperior}
              porteroAutomatico={wizard.porteroAutomatico}
              onWidthChange={wizard.setWidthMm}
              onHeightChange={wizard.setHeightMm}
              onFloorClearanceChange={wizard.setFloorClearanceMm}
              onLargueroChange={wizard.setLarguero}
              onMarcoSuperiorChange={wizard.setMarcoSuperior}
              onPorteroAutomaticoChange={wizard.setPorteroAutomatico}
              onBack={() => {
                if (wizard.selectedProduct?.producto === 'VALLA') {
                  wizard.setStep('COLOR');
                } else {
                  wizard.setStep('APERTURA');
                }
              }}
              onNext={() => wizard.goToCustomerStep()}
            />
          )}

          {wizard.step === 'CLIENTE' && (
            <BudgetWizardCustomerStep
              customers={wizard.customers}
              loading={wizard.loading}
              selectedCustomerId={wizard.selectedCustomerId}
              selectedDeliveryAddressId={wizard.selectedDeliveryAddressId}
              deliveryAddresses={wizard.deliveryAddresses}
              onCustomerChange={value => {
                wizard.setSelectedCustomerId(value);
                wizard.setSelectedDeliveryAddressId('');
              }}
              onDeliveryAddressChange={wizard.setSelectedDeliveryAddressId}
              onBack={() => wizard.setStep('MEDIDAS')}
              onNext={() => wizard.setStep('RESUMEN')}
            />
          )}

          {wizard.step === 'RESUMEN' && wizard.selectedModel && wizard.selectedProduct && wizard.selectedVariant && (
            <BudgetWizardSummaryStep
              model={wizard.selectedModel}
              product={wizard.selectedProduct}
              variant={wizard.selectedVariant}
              color={wizard.color}
              primerRequired={wizard.primerRequired}
              widthMm={wizard.widthMm}
              heightMm={wizard.heightMm}
              floorClearanceMm={wizard.floorClearanceMm}
              larguero={wizard.larguero}
              marcoSuperior={wizard.marcoSuperior}
              bisagras={wizard.bisagras}
              porteroAutomatico={wizard.porteroAutomatico}
              submitting={wizard.submitting}
              onBack={() => wizard.setStep('CLIENTE')}
              onFinalize={wizard.addCurrentItem}
            />
          )}

          {wizard.step === 'ACCIONES' && (
            <BudgetWizardOptionsStep
              savedItems={wizard.savedItems}
              itemDraft={wizard.itemDraft}
              onAddDoor={wizard.addCurrentItem}
              onRemoveDoor={wizard.removeItem}
              onEditDoor={wizard.editItem}
              onReset={wizard.reset}
              onFinalize={wizard.finalize}
              onFinalizeAction={(action) => wizard.finalize(action)}
              submitting={wizard.submitting}
            />
          )}

          {wizard.step === 'FINALIZADO' && wizard.quote && (
            <BudgetWizardDoneStep
              quote={wizard.quote}
              postFinalizeAction={wizard.postFinalizeAction}
              onNew={wizard.reset}
              onSendChannel={wizard.sendQuoteChannel}
              submitting={wizard.submitting}
            />
          )}
        </div>
      </div>
    </div>
  );
};
