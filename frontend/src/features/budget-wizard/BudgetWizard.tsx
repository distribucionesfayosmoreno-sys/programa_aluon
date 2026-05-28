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

const customerName = (name?: string | null) => name ?? 'Cliente';

export const BudgetWizard = () => {
  const wizard = useBudgetWizard();

  return (
    <div className="w-full grid gap-4">
      <header className="rounded-2xl p-6" style={{ background: '#ffffff', border: '1px solid #e8eaed' }}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="text-xs font-black uppercase tracking-wide" style={{ color: '#8b949e' }}>Presupuestos</div>
            <div className="text-lg font-black" style={{ color: '#0d1117' }}>Wizard de Puertas</div>
            <div className="text-xs mt-1" style={{ color: '#9ca3af' }}>
              Flujo responsive (web/tablet/móvil) con catálogo en BBDD.
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end select-none bg-gray-50 border border-gray-150 py-1.5 px-3 rounded-xl">
              <span className="text-[10px] font-black tracking-[0.15em] text-gray-800" style={{ color: 'var(--accent)' }}>ALUON</span>
              <span className="text-[7px] font-semibold text-gray-400 uppercase tracking-wider" style={{ fontSize: '7px', lineHeight: '1.1' }}>Aluminio Soldado</span>
            </div>
            <button className="btn-ghost" onClick={wizard.reset}>Reiniciar</button>
          </div>
        </div>

        {wizard.error && (
          <div className="mt-4 text-xs font-semibold rounded-xl p-3" style={{ background: '#fff1f2', border: '1px solid #fecdd3', color: '#9f1239' }}>
            {wizard.error}
          </div>
        )}
      </header>

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
          products={wizard.doorProducts}
          loading={wizard.loading}
          onBack={() => wizard.setStep('MODELO')}
          onSelect={wizard.selectProduct}
        />
      )}

      {wizard.step === 'COLOR' && wizard.selectedModel && wizard.selectedProduct && (
        <BudgetWizardColorStep
          model={wizard.selectedModel}
          product={wizard.selectedProduct}
          color={wizard.color}
          primerRequired={wizard.primerRequired}
          onColorChange={wizard.setColor}
          onPrimerChange={wizard.setPrimerRequired}
          onBack={() => wizard.setStep('PRODUCTO')}
          onNext={() => wizard.setStep('APERTURA')}
        />
      )}

      {wizard.step === 'APERTURA' && wizard.selectedModel && wizard.selectedProduct && (
        <BudgetWizardVariantStep
          model={wizard.selectedModel}
          product={wizard.selectedProduct}
          variants={wizard.variants}
          loading={wizard.loading}
          onBack={() => wizard.setStep('COLOR')}
          onSelect={wizard.selectVariant}
        />
      )}

      {wizard.step === 'MEDIDAS' && wizard.selectedModel && wizard.selectedVariant && (
        <BudgetWizardMeasurementsStep
          model={wizard.selectedModel}
          variant={wizard.selectedVariant}
          widthMm={wizard.widthMm}
          heightMm={wizard.heightMm}
          floorClearanceMm={wizard.floorClearanceMm}
          larguero={wizard.larguero}
          marcoSuperior={wizard.marcoSuperior}
          bisagras={wizard.bisagras}
          porteroAutomatico={wizard.porteroAutomatico}
          onWidthChange={wizard.setWidthMm}
          onHeightChange={wizard.setHeightMm}
          onFloorClearanceChange={wizard.setFloorClearanceMm}
          onLargueroChange={wizard.setLarguero}
          onMarcoSuperiorChange={wizard.setMarcoSuperior}
          onBisagrasChange={wizard.setBisagras}
          onPorteroAutomaticoChange={wizard.setPorteroAutomatico}
          onBack={() => wizard.setStep('APERTURA')}
          onNext={() => {
            wizard.goToCustomerStep().catch(() => {
              // error handled in hook
            });
          }}
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
          customerName={customerName(wizard.selectedCustomer?.nombreComercial || wizard.selectedCustomer?.razonSocial)}
          deliveryAddressLabel={wizard.selectedDeliveryAddress ? wizard.selectedDeliveryAddress.nombreAlias : 'Sin dirección'}
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
          submitting={wizard.submitting}
        />
      )}

      {wizard.step === 'FINALIZADO' && wizard.quote && (
        <BudgetWizardDoneStep
          quote={wizard.quote}
          onNew={wizard.reset}
          onSendChannel={wizard.sendQuoteChannel}
          submitting={wizard.submitting}
        />
      )}
    </div>
  );
};
