import type { CutlistResponse, DoorModel, DoorType } from './models';
import type { FormState } from './CutlistPage.types';
import { IMAGE_CATALOG } from './cutlistConstants';
import { formatDate, formatDoorType, formatMm, formatModel, formatSide, formatYesNo, resolveLateralImage, resolveSectionalImage } from './cutlistUtils';

type CutlistPrintSectionProps = {
  selectedCustomerName: string | null;
  selectedDoorType: DoorType | null;
  selectedModel: DoorModel | null;
  cutlist: CutlistResponse | null;
  form: FormState;
  porterAutomaticValue: boolean | null;
  automationIncludedValue: boolean | null;
  automationReinforcementValue: boolean | null;
  topFrameValue: boolean | null;
  tailValue: boolean | null;
};

export const CutlistPrintSection = ({
  selectedCustomerName,
  selectedDoorType,
  selectedModel,
  cutlist,
  form,
  porterAutomaticValue,
  automationIncludedValue,
  automationReinforcementValue,
  topFrameValue,
  tailValue,
}: CutlistPrintSectionProps) => (
  <section className="print-only">
    <div className="print-header">
      <div className="print-title">Despiece ALUON</div>
      <div className="print-meta">
        <div><strong>Distribuidor:</strong> {selectedCustomerName ?? '-'}</div>
        <div><strong>Presupuesto:</strong> {cutlist?.budgetNumber ?? '-'}</div>
        <div><strong>Fecha:</strong> {formatDate(cutlist?.budgetDate ?? form.budgetDate)}</div>
        <div><strong>Modelo:</strong> {formatModel(cutlist?.model ?? selectedModel)}</div>
        <div><strong>Tipo:</strong> {formatDoorType(cutlist?.doorType ?? selectedDoorType)}</div>
        <div><strong>Color:</strong> {cutlist?.color ?? form.color}</div>
        <div><strong>Acabado:</strong> {formatDoorType(cutlist?.doorType ?? selectedDoorType)}</div>
        <div><strong>Instalador:</strong> {form.installerName || '-'}</div>
        <div><strong>Observaciones:</strong> {form.notes || '-'}</div>
        {selectedDoorType === 'PEATONAL' && (
          <>
            <div><strong>Altura:</strong> {formatMm(form.heightMm)}</div>
            <div><strong>Anchura:</strong> {formatMm(form.widthMm)}</div>
            <div><strong>Holgura:</strong> {formatMm(form.groundClearanceMm)}</div>
            <div><strong>Bisagras:</strong> {formatSide(form.hingesSide || null)}</div>
            <div><strong>Portero automático:</strong> {formatYesNo(porterAutomaticValue)}</div>
            <div><strong>Larguero:</strong> {form.largueroMm ? `${form.largueroMm} mm` : '-'}</div>
            <div><strong>Marco superior:</strong> {formatYesNo(topFrameValue)}</div>
          </>
        )}
        {(selectedDoorType === 'ABATIBLE_UNA' || selectedDoorType === 'ABATIBLE_DOS') && (
          <>
            <div><strong>Altura izq:</strong> {formatMm(form.heightMm)}</div>
            <div><strong>Altura der:</strong> {formatMm(form.heightMm)}</div>
            <div><strong>Anchura:</strong> {formatMm(form.widthMm)}</div>
            <div><strong>Holgura:</strong> {formatMm(form.groundClearanceMm)}</div>
            <div><strong>Bisagras:</strong> {formatSide(form.hingesSide || null)}</div>
            <div><strong>Automatización:</strong> {formatYesNo(automationIncludedValue)}</div>
            <div><strong>Refuerzo automatización:</strong> {formatYesNo(automationReinforcementValue)}</div>
            <div><strong>Larguero:</strong> {form.largueroMm ? `${form.largueroMm} mm` : '-'}</div>
            <div><strong>Marco superior:</strong> {formatYesNo(topFrameValue)}</div>
          </>
        )}
        {selectedDoorType === 'CORREDERA' && (
          <>
            <div><strong>Altura:</strong> {formatMm(form.heightMm)}</div>
            <div><strong>Anchura izq:</strong> {formatMm(form.widthMm)}</div>
            <div><strong>Anchura der:</strong> {formatMm(form.widthMm)}</div>
            <div><strong>Apertura:</strong> {formatSide(form.openingSide || null)}</div>
            <div><strong>Carril:</strong> 16 [{form.railType === 'CARRIL_16' ? 'X' : ' '}] 20 [{form.railType === 'CARRIL_20' ? 'X' : ' '}]</div>
            <div><strong>Montaje:</strong> A [{form.mountingType === 'A' ? 'X' : ' '}] B [{form.mountingType === 'B' ? 'X' : ' '}]</div>
            <div><strong>Cola:</strong> {formatYesNo(tailValue)}</div>
            <div><strong>Automatización:</strong> {formatYesNo(automationIncludedValue)}</div>
            <div><strong>Refuerzo automatización:</strong> {formatYesNo(automationReinforcementValue)}</div>
          </>
        )}
        {selectedDoorType === 'VALLA' && (
          <>
            <div><strong>Altura:</strong> {formatMm(form.heightMm)}</div>
            <div><strong>Anchura:</strong> {formatMm(form.widthMm)}</div>
          </>
        )}
      </div>
    </div>
    <div className="print-title" style={{ fontSize: 16, fontWeight: 800, marginTop: 16 }}>DESGLOSE</div>
    <div style={{ fontSize: 12, marginBottom: 8 }}>Aluminio soldado</div>
    <table className="print-table">
      <thead>
        <tr>
          <th>Img Seccional</th>
          <th>Descripción</th>
          <th>Img Lateral</th>
          <th>Unidades</th>
          <th>Medida corte</th>
        </tr>
      </thead>
      <tbody>
        {cutlist?.items.map((item, index) => (
          <tr key={`${item.description}-print-${index}`}>
            <td>
              {(() => {
                const key = resolveSectionalImage(item.description);
                return key ? <img src={IMAGE_CATALOG[key]} alt="" style={{ height: 60 }} /> : null;
              })()}
            </td>
            <td>{item.description}</td>
            <td>
              {(() => {
                const key = resolveLateralImage(item.description);
                return key ? <img src={IMAGE_CATALOG[key]} alt="" style={{ height: 36 }} /> : null;
              })()}
            </td>
            <td>{item.units}x</td>
            <td>{item.cutMeasure}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </section>
);
