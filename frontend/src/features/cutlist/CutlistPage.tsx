import { CutlistGeneralSection } from './CutlistGeneralSection';
import { CutlistHero } from './CutlistHero';
import { CutlistOptionsSection } from './CutlistOptionsSection';
import { CutlistPrintSection } from './CutlistPrintSection';
import { CutlistTableSection } from './CutlistTableSection';
import { useCutlistPage } from './useCutlistPage';

const CutlistPage = () => {
  const {
    form,
    customers,
    customersLoading,
    customersError,
    cutlist,
    error,
    submitting,
    locked,
    selectedCustomer,
    selectedModel,
    selectedDoorType,
    previewImage,
    automationReinforcementLocked,
    automationIncludedValue,
    automationReinforcementValue,
    porterAutomaticValue,
    topFrameValue,
    tailValue,
    formOverlays,
    updateField,
    onSubmit,
    onPrint,
    onExportPdf,
    onExportCsv,
    onReset,
    onUnlock,
  } = useCutlistPage();

  return (
    <div className="space-y-6">
      <CutlistHero
        selectedDoorType={selectedDoorType}
        selectedModel={selectedModel}
        previewImage={previewImage}
      />

      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
        <CutlistGeneralSection
          form={form}
          updateField={updateField}
          locked={locked}
          customers={customers}
          customersLoading={customersLoading}
          customersError={customersError}
          error={error}
          submitting={submitting}
          cutlist={cutlist}
          onSubmit={onSubmit}
          onPrint={onPrint}
          onExportPdf={onExportPdf}
          onExportCsv={onExportCsv}
          onUnlock={onUnlock}
          onReset={onReset}
        />

        <aside className="space-y-6">
          <CutlistOptionsSection
            form={form}
            updateField={updateField}
            locked={locked}
            selectedDoorType={selectedDoorType}
            automationReinforcementLocked={automationReinforcementLocked}
          />
        </aside>
      </div>

      <CutlistTableSection
        cutlist={cutlist}
        selectedDoorType={selectedDoorType}
        formOverlays={formOverlays}
      />

      <CutlistPrintSection
        selectedCustomerName={selectedCustomer?.nombreComercial ?? null}
        selectedDoorType={selectedDoorType}
        selectedModel={selectedModel}
        cutlist={cutlist}
        form={form}
        porterAutomaticValue={porterAutomaticValue}
        automationIncludedValue={automationIncludedValue}
        automationReinforcementValue={automationReinforcementValue}
        topFrameValue={topFrameValue}
        tailValue={tailValue}
      />
    </div>
  );
};

export default CutlistPage;
