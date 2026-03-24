import formPeatonalImg from '../../../assets/cutlist/forms/form-peatonal.jpg';
import formVallasImg from '../../../assets/cutlist/forms/form-vallas.jpg';
import formAbatibleUnaImg from '../../../assets/cutlist/forms/form-abatible-una.jpg';
import formAbatibleDosImg from '../../../assets/cutlist/forms/form-abatible-dos.jpg';
import formCorrederaImg from '../../../assets/cutlist/forms/form-corredera.jpg';
import type { BudgetData, CutlistDoorType, WorkOrderData } from '../models';

type CutlistFormData = {
  doorType: CutlistDoorType;
  doorModelLabel: string;
  doorTypeLabel: string;
  distributor: string;
  budgetNumber: string;
  budgetDate: string;
  color: string;
  installerName: string;
  notes: string;
  porterAutomatic: boolean;
  hingesSide: 'LEFT' | 'RIGHT';
  heightMm: number;
  widthMm: number;
  groundClearanceMm: number;
  automationIncluded: boolean;
  openingSide: 'LEFT' | 'RIGHT';
  heightLeftMm: number | null;
  heightRightMm: number | null;
  widthLeftMm: number | null;
  widthRightMm: number | null;
  railType: 'CARRIL_16' | 'CARRIL_20';
  mountingType: 'A' | 'B';
};

export const buildBudgetPrintHtml = (budgetData: BudgetData) => `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Presupuesto ${budgetData.budgetNumber}</title>
  <style>
    body { font-family: Arial, sans-serif; color: #111827; margin: 24px; }
    .row { display: flex; justify-content: space-between; gap: 24px; }
    .small { font-size: 12px; color: #6b7280; }
    .title { font-weight: 800; letter-spacing: 0.15em; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 12px; }
    th, td { border: 1px solid #e5e7eb; padding: 8px; vertical-align: top; }
    th { background: #f9fafb; text-align: left; color: #6b7280; }
    .right { text-align: right; }
    .signature { margin-top: 32px; display: flex; justify-content: space-between; }
  </style>
</head>
<body>
  <div class="row">
    <div>
      <div class="title">ALUON</div>
      <div class="small">ALUMINIO SOLDADO, S.L.</div>
      <div class="small">Telf. 925 55 40 14</div>
      <div class="small">Ctra. 4004 Km 29,200 · 45290 Pantoja (Toledo)</div>
      <div class="small">info@aluon.es</div>
    </div>
    <div>
      <div class="title" style="background:#111827;color:#fff;padding:8px 12px;display:inline-block;">ALUON</div>
      <div class="small">${budgetData.customerName}</div>
      <div class="small">${budgetData.customerAddress}</div>
      <div class="small">Telf. ${budgetData.customerPhone}</div>
      <div class="small">Email ${budgetData.customerEmail || '—'}</div>
    </div>
  </div>
  <div class="row" style="margin-top:16px;">
    <div class="small">${budgetData.budgetDate}</div>
    <div><strong>Presupuesto Nº ${budgetData.budgetNumber}</strong></div>
  </div>
  <table>
    <thead>
      <tr>
        <th>Cantidad</th>
        <th>Descripción</th>
        <th class="right">Precio Ud.</th>
        <th class="right">Total</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>${budgetData.m2.toFixed(2)}</td>
        <td>
          <strong>${budgetData.modelLabel}</strong><br />
          <span class="small">Referencia: ${budgetData.reference || '—'}</span><br />
          <span class="small">m²: ${budgetData.m2.toFixed(2)}</span><br />
          ${budgetData.notes ? `<span class="small">Notas: ${budgetData.notes}</span>` : ''}
        </td>
        <td class="right">${budgetData.pricePerM2.toFixed(2)}</td>
        <td class="right"><strong>${budgetData.total.toFixed(2)}</strong></td>
      </tr>
    </tbody>
  </table>
  <div class="small" style="margin-top:16px;">
    <strong style="color:#111827;">Condiciones generales</strong><br />
    Forma de pago: a la aceptación del presupuesto 50%, resto el día anterior del suministro del material.<br />
    Validez del presupuesto: 15 días.<br />
    Cualquier modificación de la presente oferta llevará consigo un nuevo estudio.
  </div>
  <div class="signature">
    <div class="small">Conforme el cliente</div>
    <div class="small">Conforme la empresa</div>
  </div>
</body>
</html>`;

export const buildCutlistFormPrintHtml = (data: CutlistFormData) => {
  const formConfig = {
    PEATONAL: { id: 'peatonal', bg: formPeatonalImg },
    VALLA: { id: 'vallas', bg: formVallasImg },
    ABATIBLE_UNA: { id: 'abatible_una', bg: formAbatibleUnaImg },
    ABATIBLE_DOS: { id: 'abatible_dos', bg: formAbatibleDosImg },
    CORREDERA: { id: 'corredera', bg: formCorrederaImg },
  } as const;

  const config = formConfig[data.doorType];
  const x = (value: boolean) => (value ? 'X' : '');
  const text = (value: string | number | null | undefined) => (value == null || value === '' ? '' : String(value));

  const commonFields = `
      <div class="campo_distribuidor">${text(data.distributor)}</div>
      <div class="campo_num_presupuesto">${text(data.budgetNumber)}</div>
      <div class="campo_fecha">${text(data.budgetDate)}</div>
      <div class="campo_modelo">${text(data.doorModelLabel)}</div>
      <div class="campo_color">${text(data.color)}</div>
      <div class="campo_acabado">${text(data.doorTypeLabel)}</div>
      <div class="campo_nombre_instalador">${text(data.installerName)}</div>
    `;

  const peatonalFields = `
      <div class="campo_portero_si">${x(data.porterAutomatic)}</div>
      <div class="campo_portero_no">${x(!data.porterAutomatic)}</div>
      <div class="campo_bisagra_izq">${x(data.hingesSide === 'LEFT')}</div>
      <div class="campo_bisagra_der">${x(data.hingesSide === 'RIGHT')}</div>
      <div class="campo_altura">${text(data.heightMm)}</div>
      <div class="campo_anchura">${text(data.widthMm)}</div>
      <div class="campo_holgura">${text(data.groundClearanceMm)}</div>
      <div class="campo_observaciones">${text(data.notes)}</div>
    `;

  const vallaFields = `
      <div class="campo_ancho">${text(data.widthMm)}</div>
      <div class="campo_alto">${text(data.heightMm)}</div>
      <div class="campo_observaciones">${text(data.notes)}</div>
    `;

  const heightLeft = data.heightLeftMm ?? data.heightMm;
  const heightRight = data.heightRightMm ?? data.heightMm;
  const widthLeft = data.widthLeftMm ?? Math.round(data.widthMm / 2);
  const widthRight = data.widthRightMm ?? Math.round(data.widthMm / 2);

  const abatibleCommon = `
      <div class="campo_automatizacion_si">${x(data.automationIncluded)}</div>
      <div class="campo_automatizacion_no">${x(!data.automationIncluded)}</div>
      <div class="campo_altura_izq">${text(heightLeft)}</div>
      <div class="campo_altura_der">${text(heightRight)}</div>
      <div class="campo_holgura">${text(data.groundClearanceMm)}</div>
      <div class="campo_anchura">${text(data.widthMm)}</div>
      <div class="campo_observaciones">${text(data.notes)}</div>
    `;

  const abatibleUnaFields = `
      <div class="campo_bisagra_izq">${x(data.hingesSide === 'LEFT')}</div>
      <div class="campo_bisagra_der">${x(data.hingesSide === 'RIGHT')}</div>
      ${abatibleCommon}
    `;

  const abatibleDosFields = `
      <div class="campo_primera_hoja_izq">${x(data.openingSide === 'LEFT')}</div>
      <div class="campo_primera_hoja_der">${x(data.openingSide === 'RIGHT')}</div>
      <div class="campo_observaciones_abatible_dos_hojas">${text(data.notes)}</div>
      ${abatibleCommon}
    `;

  const correderaFields = `
      <div class="campo_automatizacion_si">${x(data.automationIncluded)}</div>
      <div class="campo_automatizacion_no">${x(!data.automationIncluded)}</div>
      <div class="campo_apertura_izq">${x(data.openingSide === 'LEFT')}</div>
      <div class="campo_apertura_der">${x(data.openingSide === 'RIGHT')}</div>
      <div class="campo_anchura_izq">${text(widthLeft)}</div>
      <div class="campo_anchura_der">${text(widthRight)}</div>
      <div class="campo_altura">${text(data.heightMm)}</div>
      <div class="campo_carril_16">${x(data.railType === 'CARRIL_16')}</div>
      <div class="campo_carril_20">${x(data.railType === 'CARRIL_20')}</div>
      <div class="campo_montaje_A">${x(data.mountingType === 'A')}</div>
      <div class="campo_montaje_B">${x(data.mountingType === 'B')}</div>
      <div class="campo_observaciones">${text(data.notes)}</div>
    `;

  const fieldsByType: Record<CutlistDoorType, string> = {
    PEATONAL: peatonalFields,
    VALLA: vallaFields,
    ABATIBLE_UNA: abatibleUnaFields,
    ABATIBLE_DOS: abatibleDosFields,
    CORREDERA: correderaFields,
  };

  const css = `
      body { margin: 0; font-family: Arial, sans-serif; }
      .printable_form {
        position: relative;
        height: 1250px;
        width: 1140px;
        max-width: 1140px;
        background-position: center;
        background-size: contain;
        background-repeat: no-repeat;
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
      .printable_form div[class*="campo"] { position: absolute; font-size: 14px; font-weight: 600; }
      .printable_form#peatonal { background-image: url('${config.bg}'); }
      .printable_form#vallas { background-image: url('${config.bg}'); }
      .printable_form#abatible_una { background-image: url('${config.bg}'); }
      .printable_form#abatible_dos { background-image: url('${config.bg}'); }
      .printable_form#corredera { background-image: url('${config.bg}'); }
      .printable_form .campo_distribuidor { top: 112px; left: 165px; }
      .printable_form .campo_num_presupuesto { top: 112px; left: 605px; }
      .printable_form .campo_fecha { top: 112px; left: 805px; }
      .printable_form .campo_modelo { top: 170px; left: 165px; }
      .printable_form .campo_color { top: 170px; left: 605px; }
      .printable_form .campo_acabado { top: 170px; left: 805px; }
      .printable_form .campo_automatizacion_si { top: 308px; left: 334px; }
      .printable_form .campo_automatizacion_no { top: 308px; left: 433px; }
      .printable_form#peatonal .campo_portero_si { top: 258px; left: 868px; }
      .printable_form#peatonal .campo_portero_no { top: 258px; left: 965px; }
      .printable_form#peatonal .campo_bisagra_izq { top: 372px; left: 439px; }
      .printable_form#peatonal .campo_bisagra_der { top: 372px; left: 698px; }
      .printable_form#peatonal .campo_altura { top: 626px; left: 290px; }
      .printable_form#peatonal .campo_anchura { top: 988px; left: 580px; }
      .printable_form#peatonal .campo_holgura { top: 866px; left: 835px; }
      .printable_form#vallas .campo_ancho { top: 425px; left: 923px; }
      .printable_form#vallas .campo_alto { top: 622px; left: 530px; }
      .printable_form#abatible_una .campo_bisagra_izq,
      .printable_form#abatible_dos .campo_primera_hoja_izq { top: 435px; left: 383px; }
      .printable_form#abatible_una .campo_bisagra_der,
      .printable_form#abatible_dos .campo_primera_hoja_der { top: 435px; left: 742px; }
      .printable_form[id*="abatible"] .campo_altura_izq { top: 652px; left: 175px; }
      .printable_form[id*="abatible"] .campo_altura_der { top: 652px; left: 860px; }
      .printable_form[id*="abatible"] .campo_holgura { top: 854px; left: 580px; }
      .printable_form[id*="abatible"] .campo_anchura { top: 982px; left: 580px; }
      .printable_form#corredera .campo_altura { top: 406px; left: 595px; }
      .printable_form#corredera .campo_apertura_izq { top: 404px; left: 302px; }
      .printable_form#corredera .campo_apertura_der { top: 404px; left: 831px; }
      .printable_form#corredera .campo_anchura_izq { top: 595px; left: 370px; }
      .printable_form#corredera .campo_anchura_der { top: 595px; left: 815px; }
      .printable_form#corredera .campo_carril_16 { top: 830px; left: 779px; }
      .printable_form#corredera .campo_carril_20 { top: 830px; left: 964px; }
      .printable_form#corredera .campo_montaje_A { top: 916px; left: 252px; }
      .printable_form#corredera .campo_montaje_B { top: 916px; left: 875px; }
      .printable_form .campo_nombre_instalador { top: 1067px; left: 810px; }
      .printable_form .campo_observaciones { top: 1100px; left: 167px; max-width: 760px; }
      .printable_form[id*="abatible"] .campo_nombre_instalador,
      .printable_form#corredera .campo_nombre_instalador { top: 1144px; }
      .printable_form[id*="abatible"] .campo_observaciones,
      .printable_form#corredera .campo_observaciones { top: 1178px; }
      @media print {
        body { -webkit-print-color-adjust: exact; }
      }
    `;

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Formulario pedido ${data.doorTypeLabel}</title>
  <style>${css}</style>
</head>
<body>
  <div class="printable_form" id="${config.id}">
    ${commonFields}
    ${fieldsByType[data.doorType]}
  </div>
</body>
</html>`;
};

export const buildWorkOrderPrintHtml = (workOrderData: WorkOrderData) => {
  const rows = workOrderData.items.map(item => `
      <tr>
        <td>${item.description}</td>
        <td>${item.units}x</td>
        <td>${item.cutMeasure}</td>
      </tr>
    `).join('');

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Orden de trabajo ${workOrderData.workOrderNumber}</title>
  <style>
    body { font-family: Arial, sans-serif; color: #111827; margin: 24px; }
    .row { display: flex; justify-content: space-between; gap: 24px; }
    .small { font-size: 12px; color: #6b7280; }
    .title { font-weight: 800; letter-spacing: 0.15em; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 12px; }
    th, td { border: 1px solid #e5e7eb; padding: 8px; vertical-align: top; }
    th { background: #f9fafb; text-align: left; color: #6b7280; }
    .block { margin-top: 16px; }
  </style>
</head>
<body>
  <div class="row">
    <div>
      <div class="title">ALUON</div>
      <div class="small">ALUMINIO SOLDADO, S.L.</div>
      <div class="small">Orden de trabajo</div>
      <div class="small">${workOrderData.workOrderDate}</div>
      <div class="small"><strong>${workOrderData.workOrderNumber}</strong></div>
    </div>
    <div>
      <div class="title" style="background:#111827;color:#fff;padding:8px 12px;display:inline-block;">ALUON</div>
      <div class="small">${workOrderData.customerName}</div>
      <div class="small">${workOrderData.customerAddress}</div>
      <div class="small">Telf. ${workOrderData.customerPhone}</div>
    </div>
  </div>
  <div class="block small">
    <strong>${workOrderData.modelLabel}</strong><br />
    Referencia: ${workOrderData.modelReference || '—'}<br />
    ${workOrderData.doorModelLabel} · ${workOrderData.doorTypeLabel}<br />
    Medidas: ${workOrderData.widthMm} × ${workOrderData.heightMm} mm
  </div>
  <div class="block small">
    Distribuidor: ${workOrderData.distributor || '—'} ·
    Nº Presupuesto: ${workOrderData.budgetNumber || '—'} ·
    Fecha: ${workOrderData.budgetDate || '—'} ·
    Color: ${workOrderData.color || '—'} ·
    Instalador: ${workOrderData.installerName || '—'}
  </div>
  <div class="block small">
    Holgura suelo: ${workOrderData.groundClearanceMm ?? '—'} mm ·
    Larguero: ${workOrderData.largueroMm ?? '—'} mm ·
    Marco superior: ${workOrderData.topFrame ? 'Sí' : 'No'} ·
    Bisagras: ${workOrderData.hingesSide === 'LEFT' ? 'Izquierda' : workOrderData.hingesSide === 'RIGHT' ? 'Derecha' : '—'} ·
    Portero automático: ${workOrderData.porterAutomatic ? 'Sí' : 'No'} ·
    Automatización: ${workOrderData.automationIncluded ? 'Sí' : 'No'} ·
    Refuerzo automatización: ${workOrderData.automationReinforcement ? 'Sí' : 'No'}<br />
    Primera hoja: ${workOrderData.openingSide === 'LEFT' ? 'Izquierda' : workOrderData.openingSide === 'RIGHT' ? 'Derecha' : '—'} ·
    Altura izq: ${workOrderData.heightLeftMm ?? '—'} ·
    Altura der: ${workOrderData.heightRightMm ?? '—'} ·
    Anchura izq: ${workOrderData.widthLeftMm ?? '—'} ·
    Anchura der: ${workOrderData.widthRightMm ?? '—'} ·
    Carril: ${workOrderData.railType ?? '—'} ·
    Montaje: ${workOrderData.mountingType ?? '—'} ·
    Cola: ${workOrderData.tail ? 'Sí' : 'No'}
  </div>
  ${workOrderData.notes ? `<div class="block small">Notas: ${workOrderData.notes}</div>` : ''}
  <table>
    <thead>
      <tr>
        <th>Descripción</th>
        <th>Unidades</th>
        <th>Medida corte</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>
</body>
</html>`;
};
