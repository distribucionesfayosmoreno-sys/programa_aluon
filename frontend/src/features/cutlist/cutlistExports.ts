import type { CutlistResponse, DoorModel, DoorType } from './models';
import type { CellHookData } from 'jspdf-autotable';
import type { FormState } from './CutlistPage.types';
import { IMAGE_CATALOG, FORM_TEMPLATES, type ImageKey } from './cutlistConstants';
import { buildFormOverlays } from './cutlistOverlays';
import { getImageFormat, resolveLateralImage, resolveSectionalImage } from './cutlistUtils';

type ExportPdfParams = {
  cutlist: CutlistResponse;
  selectedDoorType: DoorType | null;
  selectedModel: DoorModel | null;
  selectedCustomerName: string | null;
  form: FormState;
};

type CutlistRow = {
  imgSeccional: string;
  description: string;
  imgLateral: string;
  units: string;
  cutMeasure: string;
};

const loadImageAsDataUrl = async (path: string) => {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`No se pudo cargar la imagen: ${path}`);
  }
  const blob = await response.blob();
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error(`No se pudo leer la imagen: ${path}`));
    reader.readAsDataURL(blob);
  });
};

export const exportCutlistPdf = async ({
  cutlist,
  selectedDoorType,
  selectedModel,
  selectedCustomerName,
  form,
}: ExportPdfParams) => {
  const { jsPDF } = await import('jspdf');
  const autoTableModule = await import('jspdf-autotable');
  const autoTable = autoTableModule.default;

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const marginX = 14;
  let cursorY = 16;

  const imageKeys = new Set<ImageKey>();
  imageKeys.add('logo');

  const rows: CutlistRow[] = cutlist.items.map(item => {
    const seccional = resolveSectionalImage(item.description);
    const lateral = resolveLateralImage(item.description);
    if (seccional) imageKeys.add(seccional);
    if (lateral) imageKeys.add(lateral);
    return {
      imgSeccional: seccional ?? '',
      description: item.description,
      imgLateral: lateral ?? '',
      units: `${item.units}x`,
      cutMeasure: item.cutMeasure,
    };
  });

  const imageData: Partial<Record<ImageKey, string>> = {};
  await Promise.all(
    Array.from(imageKeys).map(async key => {
      const path = IMAGE_CATALOG[key];
      if (!path) return;
      imageData[key] = await loadImageAsDataUrl(path);
    })
  );

  if (selectedDoorType) {
    const templatePath = FORM_TEMPLATES[selectedDoorType];
    const templateDataUrl = await loadImageAsDataUrl(templatePath);
    doc.addImage(templateDataUrl, 'JPEG', 0, 0, 210, 297);
    const { overlays, checks } = buildFormOverlays({
      form,
      selectedDoorType,
      selectedModel,
      selectedCustomerName,
      cutlist,
    });
    const toMmX = (percent: number) => (percent / 100) * 210;
    const toMmY = (percent: number) => (percent / 100) * 297;
    overlays.forEach(overlay => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(overlay.size ?? 8);
      const x = toMmX(overlay.x);
      const y = toMmY(overlay.y);
      doc.text(overlay.text || '-', x, y);
    });
    checks.forEach(check => {
      if (!check.checked) return;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('X', toMmX(check.x), toMmY(check.y));
    });
    doc.addPage();
    cursorY = 16;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('DESGLOSE', marginX, cursorY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Aluminio soldado', marginX, cursorY + 5);
    cursorY += 12;
  }

  autoTable(doc, {
    startY: cursorY,
    columns: [
      { header: 'Img Seccional', dataKey: 'imgSeccional' },
      { header: 'Descripción', dataKey: 'description' },
      { header: 'Img Lateral', dataKey: 'imgLateral' },
      { header: 'Unidades', dataKey: 'units' },
      { header: 'Medida corte', dataKey: 'cutMeasure' },
    ],
    body: rows,
    styles: { fontSize: 9, cellPadding: 2, minCellHeight: 26, lineColor: [140, 140, 140], lineWidth: 0.1 },
    headStyles: { fillColor: [255, 255, 255], textColor: 40, lineColor: [140, 140, 140], lineWidth: 0.1 },
    columnStyles: {
      imgSeccional: { cellWidth: 28 },
      imgLateral: { cellWidth: 28 },
      units: { cellWidth: 16, halign: 'center' },
      cutMeasure: { cellWidth: 26, halign: 'center' },
    },
    margin: { left: marginX, right: marginX },
    didDrawCell: (data: CellHookData) => {
      if (data.section !== 'body') return;
      const dataKey = String(data.column.dataKey);
      if (dataKey !== 'imgSeccional' && dataKey !== 'imgLateral') return;
      const key = String(data.cell.raw || '');
      const img = imageData[key as ImageKey];
      if (!img) return;
      const format = getImageFormat(key as ImageKey);
      const imgWidth = data.cell.width - 6;
      const imgHeight = data.cell.height - 6;
      const x = data.cell.x + 3;
      const y = data.cell.y + 3;
      doc.addImage(img, format, x, y, imgWidth, imgHeight);
    },
  });

  doc.save(`despiece-${cutlist.id.slice(0, 8)}.pdf`);
};

export const exportCutlistCsv = (cutlist: CutlistResponse) => {
  const header = ['Descripcion', 'Unidades', 'Medida corte'];
  const rows = cutlist.items.map(item => [
    item.description.replace(/"/g, '""'),
    String(item.units),
    item.cutMeasure.replace(/"/g, '""'),
  ]);
  const csv = [header, ...rows]
    .map(row => row.map(value => `"${value}"`).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `despiece-${cutlist.id.slice(0, 8)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};
