import type { CutlistResponse, DoorModel, DoorType } from './models';
import type { FormOverlays, FormState } from './CutlistPage.types';
import { formatDate, formatDoorType, formatModel, parseBoolean } from './cutlistUtils';

type BuildFormOverlaysInput = {
  form: FormState;
  selectedDoorType: DoorType | null;
  selectedModel: DoorModel | null;
  selectedCustomerName: string | null;
  cutlist: CutlistResponse | null;
};

export const buildFormOverlays = ({
  form,
  selectedDoorType,
  selectedModel,
  selectedCustomerName,
  cutlist,
}: BuildFormOverlaysInput): FormOverlays => {
  if (!selectedDoorType) return { overlays: [], checks: [] };

  const automationIncludedValue = parseBoolean(form.automationIncluded);
  const porterAutomaticValue = parseBoolean(form.porterAutomatic);
  const heightCm = form.heightMm ? (Number(form.heightMm) / 10).toString() : '';
  const widthCm = form.widthMm ? (Number(form.widthMm) / 10).toString() : '';

  const overlays = [
    { text: selectedCustomerName ?? '', x: 12, y: 20 },
    { text: String(cutlist?.budgetNumber ?? ''), x: 56, y: 20 },
    { text: formatDate(cutlist?.budgetDate ?? form.budgetDate), x: 78, y: 20 },
    { text: formatModel(cutlist?.model ?? selectedModel), x: 12, y: 26 },
    { text: cutlist?.color ?? form.color, x: 56, y: 26 },
    { text: formatDoorType(cutlist?.doorType ?? selectedDoorType), x: 78, y: 26 },
    { text: form.notes || '', x: 12, y: 90, size: 8 },
    { text: form.installerName || '', x: 68, y: 90, size: 8 },
  ];

  const checks: FormOverlays['checks'] = [];

  if (selectedDoorType === 'PEATONAL') {
    overlays.push(
      { text: heightCm, x: 19, y: 58, size: 8 },
      { text: widthCm, x: 50, y: 80, size: 8 },
      { text: form.groundClearanceMm || '', x: 81, y: 69, size: 8 }
    );
    checks.push(
      { checked: form.hingesSide === 'LEFT', x: 49, y: 41.5 },
      { checked: form.hingesSide === 'RIGHT', x: 70.5, y: 41.5 },
      { checked: porterAutomaticValue === true, x: 80.5, y: 32.5 },
      { checked: porterAutomaticValue === false, x: 86.5, y: 32.5 }
    );
  }

  if (selectedDoorType === 'ABATIBLE_UNA') {
    overlays.push(
      { text: heightCm, x: 17.5, y: 62, size: 8 },
      { text: heightCm, x: 82, y: 62, size: 8 },
      { text: widthCm, x: 52, y: 79, size: 8 },
      { text: form.groundClearanceMm || '', x: 50, y: 70, size: 8 }
    );
    checks.push(
      { checked: automationIncludedValue === true, x: 38.5, y: 38.5 },
      { checked: automationIncludedValue === false, x: 44.5, y: 38.5 },
      { checked: form.hingesSide === 'LEFT', x: 42.5, y: 51.5 },
      { checked: form.hingesSide === 'RIGHT', x: 67.5, y: 51.5 }
    );
  }

  if (selectedDoorType === 'ABATIBLE_DOS') {
    overlays.push(
      { text: heightCm, x: 17.5, y: 62, size: 8 },
      { text: heightCm, x: 82, y: 62, size: 8 },
      { text: widthCm, x: 52, y: 79, size: 8 },
      { text: form.groundClearanceMm || '', x: 50, y: 70, size: 8 }
    );
    checks.push(
      { checked: automationIncludedValue === true, x: 38.5, y: 38.5 },
      { checked: automationIncludedValue === false, x: 44.5, y: 38.5 },
      { checked: form.openingSide === 'LEFT', x: 44, y: 51.5 },
      { checked: form.openingSide === 'RIGHT', x: 66.5, y: 51.5 }
    );
  }

  if (selectedDoorType === 'CORREDERA') {
    overlays.push(
      { text: heightCm, x: 52, y: 38.5, size: 8 },
      { text: widthCm, x: 34, y: 54, size: 8 },
      { text: widthCm, x: 73, y: 54, size: 8 }
    );
    checks.push(
      { checked: automationIncludedValue === true, x: 38.5, y: 34.5 },
      { checked: automationIncludedValue === false, x: 44.5, y: 34.5 },
      { checked: form.openingSide === 'LEFT', x: 28, y: 45.5 },
      { checked: form.openingSide === 'RIGHT', x: 78, y: 45.5 },
      { checked: form.railType === 'CARRIL_16', x: 78, y: 66.5 },
      { checked: form.railType === 'CARRIL_20', x: 86, y: 66.5 },
      { checked: form.mountingType === 'A', x: 22, y: 73.5 },
      { checked: form.mountingType === 'B', x: 78, y: 73.5 }
    );
  }

  if (selectedDoorType === 'VALLA') {
    overlays.push(
      { text: heightCm, x: 84, y: 44.5, size: 8 },
      { text: widthCm, x: 50, y: 62, size: 8 }
    );
  }

  return { overlays, checks };
};
