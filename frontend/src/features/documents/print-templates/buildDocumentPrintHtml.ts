import type { DocumentLineItem, DocumentPrintData, DocumentTotals } from '../models/documentPrintModels';
import { safeText } from '../../../shared/utils/escapeHtml';
import { publicPath } from '../../../shared/utils/publicPath';
import { documentPrintBaseCss } from './documentPrintBaseCss';

const formatEur = (value: number): string =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);

const formatQty = (value: number): string =>
  new Intl.NumberFormat('es-ES', { maximumFractionDigits: 3 }).format(value);

const buildLinesHtml = (lines: DocumentLineItem[], showPrices: boolean): string => {
  const headerCells = [
    '<th style="width:38px;">#</th>',
    '<th>Descripción</th>',
    '<th class="right" style="width:70px;">Cant.</th>',
    '<th style="width:56px;">Ud.</th>',
    ...(showPrices ? ['<th class="right" style="width:84px;">Precio</th>', '<th class="right" style="width:90px;">Importe</th>'] : []),
  ].join('');

  const rows = lines
    .map(line => {
      const base = [
        `<td class="right">${safeText(String(line.position), '')}</td>`,
        `<td>${safeText(line.description)}</td>`,
        `<td class="right">${safeText(formatQty(line.quantity), '')}</td>`,
        `<td>${safeText(line.unitLabel ?? 'ud.', '')}</td>`,
      ];

      if (showPrices) {
        const unitPrice = line.unitPriceEur == null ? '—' : safeText(formatEur(line.unitPriceEur), '');
        const total = line.totalEur == null ? '—' : safeText(formatEur(line.totalEur), '');
        base.push(`<td class="right">${unitPrice}</td>`, `<td class="right"><strong>${total}</strong></td>`);
      }

      return `<tr>${base.join('')}</tr>`;
    })
    .join('');

  return `
    <table class="table">
      <thead><tr>${headerCells}</tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;
};

const buildTotalsHtml = (totals: DocumentTotals): string => {
  const rows: Array<{ label: string; value: string }> = [];
  if (totals.subtotalEur != null) rows.push({ label: 'Base imponible', value: formatEur(totals.subtotalEur) });
  if (totals.vatPercent != null && totals.vatAmountEur != null) {
    rows.push({ label: `IVA (${totals.vatPercent}%)`, value: formatEur(totals.vatAmountEur) });
  }
  rows.push({ label: 'Total', value: formatEur(totals.totalEur) });

  return `
    <div class="totals">
      <table>
        <tr><td colspan="2">Totales</td></tr>
        ${rows
          .map(r => `<tr><td>${safeText(r.label)}</td><td class="right"><strong>${safeText(r.value, '')}</strong></td></tr>`)
          .join('')}
      </table>
    </div>
  `;
};

const kindLabel: Readonly<Record<DocumentPrintData['kind'], string>> = {
  PRESUPUESTO: 'Presupuesto',
  PEDIDO: 'Pedido',
  ALBARAN: 'Albarán',
  FACTURA: 'Factura',
};

export const buildDocumentPrintHtml = (data: DocumentPrintData): string => {
  const watermarkUrl = publicPath('assets/template.png');
  const showPrices = data.kind !== 'ALBARAN';
  const lines = data.lines.length
    ? data.lines
    : [{ position: 1, description: '', quantity: 1, unitLabel: 'ud.', unitPriceEur: null, totalEur: null }];

  const companyAddress = data.company.addressLines.filter(Boolean).map(line => `<div class="small">${safeText(line)}</div>`).join('');
  const customerAddress = data.customer.addressLines.filter(Boolean).map(line => `<div class="small">${safeText(line)}</div>`).join('');
  const footerLines = (data.footerLines ?? []).filter(Boolean).map(line => `<div class="small">${safeText(line)}</div>`).join('');

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${kindLabel[data.kind]} ${safeText(data.documentNumber)}</title>
  <style>${documentPrintBaseCss}</style>
</head>
<body>
  <div class="page">
    <div class="watermark" style="background-image:url('${watermarkUrl}');"></div>
    <div class="content">
      <div class="row">
        <div class="box" style="flex:1;">
          <div class="title">${safeText(data.company.name, '')}</div>
          ${data.company.legalName ? `<div class="small">${safeText(data.company.legalName)}</div>` : ''}
          ${data.company.taxId ? `<div class="small">CIF: ${safeText(data.company.taxId)}</div>` : ''}
          ${companyAddress}
          ${data.company.phone ? `<div class="small">Telf. ${safeText(data.company.phone)}</div>` : ''}
          ${data.company.email ? `<div class="small">${safeText(data.company.email)}</div>` : ''}
          ${data.company.website ? `<div class="small">${safeText(data.company.website)}</div>` : ''}
        </div>
        <div class="box" style="flex:1;">
          <div class="doc-pill">${safeText(kindLabel[data.kind], '')}</div>
          <div class="meta">
            <div class="small">
              <div><strong>${safeText(data.documentNumber)}</strong></div>
              <div>${safeText(data.documentDate)}</div>
            </div>
          </div>
          <div style="margin-top:10px;">
            <div class="small" style="font-weight:900; letter-spacing:0.08em; text-transform:uppercase; color:var(--muted);">Cliente</div>
            <div style="margin-top:4px; font-weight:700;">${safeText(data.customer.name)}</div>
            ${data.customer.taxId ? `<div class="small">CIF/NIF: ${safeText(data.customer.taxId)}</div>` : ''}
            ${customerAddress}
            ${data.customer.phone ? `<div class="small">Telf. ${safeText(data.customer.phone)}</div>` : ''}
            ${data.customer.email ? `<div class="small">Email ${safeText(data.customer.email)}</div>` : ''}
          </div>
        </div>
      </div>

      ${buildLinesHtml(lines, showPrices)}

      ${data.totals ? buildTotalsHtml(data.totals) : ''}

      ${data.notes ? `<div class="note box"><div class="small" style="font-weight:900; letter-spacing:0.08em; text-transform:uppercase;">Notas</div><div style="margin-top:6px; font-size:11px;">${safeText(data.notes, '')}</div></div>` : ''}

      ${footerLines ? `<div class="note box">${footerLines}</div>` : ''}

      <div class="footer">
        <div style="flex:1;">
          <div class="small" style="font-weight:900; letter-spacing:0.08em; text-transform:uppercase;">Conforme el cliente</div>
          <div class="sig"></div>
        </div>
        <div style="flex:1;">
          <div class="small" style="font-weight:900; letter-spacing:0.08em; text-transform:uppercase;">Conforme la empresa</div>
          <div class="sig"></div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
};

