import type { Customer } from '../../../hooks/useCustomers';
import type { WorkOrderData } from '../models';

type ModelSnapshot = {
  label: string;
};

type CutlistSnapshot = {
  doorType: 'PEATONAL' | 'ABATIBLE_UNA' | 'ABATIBLE_DOS' | 'CORREDERA' | 'VALLA';
  cutlistDistributor: string;
  cutlistBudgetNumber: string;
  cutlistBudgetDate: string;
  cutlistColor: string;
  installerName: string;
  doorModelLabel: string;
  doorTypeLabel: string;
  widthMm: number;
  heightMm: number;
  heightLeftMm: number | null;
  heightRightMm: number | null;
  widthLeftMm: number | null;
  widthRightMm: number | null;
  groundClearanceMm: number;
  largueroMm: number;
  topFrame: boolean;
  hingesSide: 'LEFT' | 'RIGHT';
  porterAutomatic: boolean;
  automationIncluded: boolean;
  automationReinforcement: boolean;
  openingSide: 'LEFT' | 'RIGHT';
  railType: 'CARRIL_16' | 'CARRIL_20';
  mountingType: 'A' | 'B';
  tail: boolean;
  cutlistResult: { items: WorkOrderData['items'] } | null;
};

export const buildWorkOrderData = ({
  customer,
  model,
  modelReference,
  notes,
  workOrderNumber,
  workOrderDate,
  cutlist,
}: {
  customer?: Customer;
  model: ModelSnapshot;
  modelReference: string;
  notes: string;
  workOrderNumber: string;
  workOrderDate: string;
  cutlist: CutlistSnapshot;
}): WorkOrderData => ({
  workOrderNumber,
  workOrderDate,
  customerName: customer?.nombreComercial || customer?.razonSocial || '—',
  customerAddress: [customer?.direccion, customer?.cp, customer?.poblacion, customer?.provincia]
    .filter(Boolean)
    .join(' · '),
  customerPhone: customer?.telefono || '—',
  modelLabel: model.label,
  modelReference,
  distributor: cutlist.cutlistDistributor,
  budgetNumber: cutlist.cutlistBudgetNumber,
  budgetDate: cutlist.cutlistBudgetDate,
  color: cutlist.cutlistColor,
  installerName: cutlist.installerName,
  doorModelLabel: cutlist.doorModelLabel,
  doorTypeLabel: cutlist.doorTypeLabel,
  widthMm: cutlist.widthMm,
  heightMm: cutlist.heightMm,
  heightLeftMm: cutlist.heightLeftMm,
  heightRightMm: cutlist.heightRightMm,
  widthLeftMm: cutlist.widthLeftMm,
  widthRightMm: cutlist.widthRightMm,
  groundClearanceMm: cutlist.groundClearanceMm,
  largueroMm: cutlist.largueroMm,
  topFrame: cutlist.topFrame,
  hingesSide: cutlist.hingesSide,
  porterAutomatic: cutlist.porterAutomatic,
  automationIncluded: cutlist.automationIncluded,
  automationReinforcement: cutlist.automationReinforcement,
  openingSide: cutlist.openingSide,
  railType: cutlist.railType,
  mountingType: cutlist.mountingType,
  tail: cutlist.tail,
  notes,
  items: cutlist.cutlistResult?.items ?? [],
});

export const buildCutlistFormPayload = ({
  cutlist,
  notes,
}: {
  cutlist: CutlistSnapshot;
  notes: string;
}) => ({
  doorType: cutlist.doorType,
  doorModelLabel: cutlist.doorModelLabel,
  doorTypeLabel: cutlist.doorTypeLabel,
  distributor: cutlist.cutlistDistributor,
  budgetNumber: cutlist.cutlistBudgetNumber,
  budgetDate: cutlist.cutlistBudgetDate,
  color: cutlist.cutlistColor,
  installerName: cutlist.installerName,
  notes,
  porterAutomatic: cutlist.porterAutomatic,
  hingesSide: cutlist.hingesSide,
  heightMm: cutlist.heightMm,
  widthMm: cutlist.widthMm,
  groundClearanceMm: cutlist.groundClearanceMm,
  automationIncluded: cutlist.automationIncluded,
  openingSide: cutlist.openingSide,
  heightLeftMm: cutlist.heightLeftMm,
  heightRightMm: cutlist.heightRightMm,
  widthLeftMm: cutlist.widthLeftMm,
  widthRightMm: cutlist.widthRightMm,
  railType: cutlist.railType,
  mountingType: cutlist.mountingType,
});
