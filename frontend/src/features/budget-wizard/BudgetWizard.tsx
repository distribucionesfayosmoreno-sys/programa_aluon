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
    <div className="flex-1 min-h-0 flex flex-col gap-6">
        {wizard.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs font-bold shadow-sm">
            {wizard.error}
          </div>
        )}

        <div className="bg-white rounded-3xl p-5 md:p-6 border border-slate-200 shadow-md">
          {wizard.step === 'MODELO' && (
            <BudgetWizardModelStep
              families={wizard.families}
              loading={wizard.loading}
              onSelect={wizard.selectFamily}
            />
          )}

          {wizard.step === 'PRODUCTO' && wizard.selectedFamily && (
            <BudgetWizardProductStep
              family={wizard.selectedFamily}
              children={wizard.children}
              loading={wizard.loading}
              onBack={() => wizard.setStep('MODELO')}
              onSelect={wizard.selectChild}
            />
          )}

          {wizard.step === 'COLOR' && wizard.selectedFamily && wizard.selectedChild && (
            <BudgetWizardColorStep
              color={wizard.color}
              primerRequired={wizard.primerRequired}
              onColorChange={wizard.setColor}
              onPrimerChange={wizard.setPrimerRequired}
              onBack={() => wizard.setStep('PRODUCTO')}
              onNext={() => {
                if (wizard.selectedChild?.doorType === 'VALLA') {
                  wizard.setStep('MEDIDAS');
                } else {
                  wizard.setStep('APERTURA');
                }
              }}
            />
          )}

          {wizard.step === 'APERTURA' && wizard.selectedFamily && wizard.selectedChild && (
            <BudgetWizardVariantStep
              family={wizard.selectedFamily}
              doorType={wizard.selectedChild.doorType}
              bisagras={wizard.bisagras}
              onSelect={(val: boolean) => {
                wizard.setBisagras(val);
                wizard.setStep('MEDIDAS');
              }}
              onBack={() => wizard.setStep('COLOR')}
            />
          )}

          {wizard.step === 'MEDIDAS' && wizard.selectedFamily && wizard.selectedChild && (
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
                if (wizard.selectedChild?.doorType === 'VALLA') {
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

          {wizard.step === 'RESUMEN' && wizard.selectedFamily && wizard.selectedChild && (
            <BudgetWizardSummaryStep
              family={wizard.selectedFamily}
              child={wizard.selectedChild}
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
              onAddDoor={wizard.startNewDoor}
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
              submittedItems={wizard.submittedItems}
              postFinalizeAction={wizard.postFinalizeAction}
              onNew={wizard.reset}
              onSendChannel={wizard.sendQuoteChannel}
              submitting={wizard.submitting}
            />
          )}
        </div>
    </div>
  );
};
