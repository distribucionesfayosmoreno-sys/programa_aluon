import { useEffect, useMemo, useState } from 'react';
import type { CutlistRequest, CutlistResponse, DoorModel, DoorType } from './models';
import { generateCutlist } from '../../services/cutlistApi';
import { getCustomers } from '../../services/customersApi';
import type { CustomerSummary } from '../../services/customersApi';
import type { FormOverlays, FormState, UpdateField } from './CutlistPage.types';
import { MODEL_OPTIONS } from './cutlistConstants';
import { exportCutlistCsv, exportCutlistPdf } from './cutlistExports';
import { buildFormOverlays } from './cutlistOverlays';
import { parseBoolean, toNumber } from './cutlistUtils';

const emptyForm: FormState = {
  customerId: '',
  budgetDate: '',
  model: '',
  doorType: '',
  color: '',
  installerName: '',
  notes: '',
  widthMm: '',
  heightMm: '',
  groundClearanceMm: '',
  largueroMm: '',
  topFrame: '',
  hingesSide: '',
  porterAutomatic: '',
  automationIncluded: '',
  automationReinforcement: '',
  openingSide: '',
  railType: '',
  mountingType: '',
  tail: '',
};

type UseCutlistPageState = {
  form: FormState;
  customers: CustomerSummary[];
  customersLoading: boolean;
  customersError: string;
  cutlist: CutlistResponse | null;
  error: string;
  submitting: boolean;
  locked: boolean;
  selectedCustomer: CustomerSummary | null;
  selectedModel: DoorModel | null;
  selectedDoorType: DoorType | null;
  previewImage: string;
  automationReinforcementLocked: boolean;
  automationIncludedValue: boolean | null;
  automationReinforcementValue: boolean | null;
  porterAutomaticValue: boolean | null;
  topFrameValue: boolean | null;
  tailValue: boolean | null;
  formOverlays: FormOverlays;
  updateField: UpdateField;
  onSubmit: () => Promise<void>;
  onPrint: () => void;
  onExportPdf: () => Promise<void>;
  onExportCsv: () => void;
  onReset: () => void;
  onUnlock: () => void;
};

export const useCutlistPage = (): UseCutlistPageState => {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [customersLoading, setCustomersLoading] = useState(true);
  const [customersError, setCustomersError] = useState('');
  const [cutlist, setCutlist] = useState<CutlistResponse | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [locked, setLocked] = useState(false);

  const selectedCustomer = useMemo(
    () => customers.find(customer => customer.id === form.customerId) ?? null,
    [customers, form.customerId]
  );

  const selectedModel = form.model || null;
  const selectedDoorType = form.doorType || null;

  const previewImage = useMemo(() => {
    const match = MODEL_OPTIONS.find(option => option.value === selectedModel);
    return match?.image ?? '/legacy/aluon/images/banner.jpg';
  }, [selectedModel]);

  const automationReinforcementLocked = form.automationIncluded === 'true';
  const automationIncludedValue = parseBoolean(form.automationIncluded);
  const automationReinforcementValue = parseBoolean(form.automationReinforcement);
  const porterAutomaticValue = parseBoolean(form.porterAutomatic);
  const topFrameValue = parseBoolean(form.topFrame);
  const tailValue = parseBoolean(form.tail);

  const formOverlays = useMemo(
    () =>
      buildFormOverlays({
        form,
        selectedDoorType,
        selectedModel,
        selectedCustomerName: selectedCustomer?.nombreComercial ?? null,
        cutlist,
      }),
    [form, selectedDoorType, selectedModel, selectedCustomer, cutlist]
  );

  useEffect(() => {
    if (automationReinforcementLocked) {
      setForm(prev => ({ ...prev, automationReinforcement: 'true' }));
    }
  }, [automationReinforcementLocked]);

  useEffect(() => {
    let active = true;
    const loadCustomers = async () => {
      try {
        setCustomersLoading(true);
        const data = await getCustomers();
        if (!active) return;
        setCustomers(data);
        setCustomersError('');
      } catch (err) {
        if (!active) return;
        const message = err instanceof Error ? err.message : 'No se pudieron cargar los clientes.';
        setCustomersError(message);
      } finally {
        if (active) {
          setCustomersLoading(false);
        }
      }
    };
    loadCustomers();
    return () => {
      active = false;
    };
  }, []);

  const updateField: UpdateField = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    const requiredString = (value: string, label: string) => {
      if (!value.trim()) throw new Error(`El campo "${label}" es obligatorio.`);
    };

    const requiredSelect = (value: string, label: string) => {
      if (!value) throw new Error(`Selecciona una opción para "${label}".`);
    };

    const requiredNumber = (value: string, label: string, allowZero = false) => {
      const parsed = toNumber(value);
      if (parsed === null) throw new Error(`Introduce un valor válido para "${label}".`);
      if (!allowZero && parsed <= 0) throw new Error(`"${label}" debe ser mayor que 0.`);
      if (allowZero && parsed < 0) throw new Error(`"${label}" no puede ser negativo.`);
    };

    if (!form.customerId) {
      throw new Error('Selecciona un distribuidor (cliente).');
    }
    requiredString(form.budgetDate, 'Fecha');
    requiredSelect(form.model, 'Modelo');
    requiredSelect(form.doorType, 'Tipo de puerta');
    requiredString(form.color, 'Color');

    if (selectedDoorType === 'PEATONAL') {
      requiredNumber(form.heightMm, 'Altura total');
      requiredNumber(form.widthMm, 'Anchura total');
      requiredNumber(form.groundClearanceMm, 'Holgura con el suelo', true);
      requiredSelect(form.hingesSide, 'Bisagras');
      requiredSelect(form.porterAutomatic, 'Portero automático');
      requiredSelect(form.largueroMm, 'Larguero');
      requiredSelect(form.topFrame, 'Marco superior');
    }

    if (selectedDoorType === 'ABATIBLE_UNA' || selectedDoorType === 'ABATIBLE_DOS') {
      requiredNumber(form.heightMm, 'Altura total');
      requiredNumber(form.widthMm, 'Anchura total');
      requiredNumber(form.groundClearanceMm, 'Holgura con el suelo', true);
      requiredSelect(form.hingesSide, 'Bisagras');
      requiredSelect(form.automationIncluded, 'Automatización');
      requiredSelect(form.automationReinforcement, 'Refuerzo automatización');
      requiredSelect(form.largueroMm, 'Larguero');
      requiredSelect(form.topFrame, 'Marco superior');
    }

    if (selectedDoorType === 'CORREDERA') {
      requiredNumber(form.heightMm, 'Altura total');
      requiredNumber(form.widthMm, 'Anchura total');
      requiredSelect(form.openingSide, 'Apertura');
      requiredSelect(form.railType, 'Carril');
      requiredSelect(form.automationIncluded, 'Automatización');
      requiredSelect(form.automationReinforcement, 'Refuerzo automatización');
      requiredSelect(form.mountingType, 'Montaje');
      requiredSelect(form.tail, 'Cola');
    }

    if (selectedDoorType === 'VALLA') {
      requiredNumber(form.heightMm, 'Altura total');
      requiredNumber(form.widthMm, 'Anchura total');
    }
  };

  const buildRequest = (): CutlistRequest => {
    const width = toNumber(form.widthMm);
    const height = toNumber(form.heightMm);
    if (width === null || height === null) {
      throw new Error('Medidas incompletas.');
    }

    return {
      distributor: selectedCustomer?.nombreComercial ?? '',
      budgetNumber: null,
      budgetDate: form.budgetDate,
      color: form.color.trim(),
      installerName: form.installerName.trim() || undefined,
      doorType: form.doorType as DoorType,
      model: form.model as DoorModel,
      widthMm: Math.round(width),
      heightMm: Math.round(height),
      groundClearanceMm: toNumber(form.groundClearanceMm),
      largueroMm: form.largueroMm ? Number(form.largueroMm) : null,
      topFrame: parseBoolean(form.topFrame),
      hingesSide: form.hingesSide || null,
      porterAutomatic: parseBoolean(form.porterAutomatic),
      automationIncluded: parseBoolean(form.automationIncluded),
      automationReinforcement: parseBoolean(form.automationReinforcement),
      openingSide: form.openingSide || null,
      railType: form.railType || null,
      mountingType: form.mountingType || null,
      tail: parseBoolean(form.tail),
      notes: form.notes.trim() || null,
    };
  };

  const onSubmit = async () => {
    setError('');
    try {
      validate();
      const payload = buildRequest();
      setSubmitting(true);
      const response = await generateCutlist(payload);
      setCutlist(response);
      setLocked(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Revisa los datos del formulario.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const onReset = () => {
    setForm(emptyForm);
    setCutlist(null);
    setLocked(false);
    setError('');
  };

  const onPrint = () => {
    if (!cutlist) {
      setError('Genera el despiece antes de imprimir.');
      return;
    }
    window.print();
  };

  const onExportPdf = async () => {
    if (!cutlist) {
      setError('Genera el despiece antes de exportar.');
      return;
    }
    try {
      await exportCutlistPdf({
        cutlist,
        selectedDoorType,
        selectedModel,
        selectedCustomerName: selectedCustomer?.nombreComercial ?? null,
        form,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo exportar el PDF.';
      setError(message);
    }
  };

  const onExportCsv = () => {
    if (!cutlist) {
      setError('Genera el despiece antes de exportar.');
      return;
    }
    exportCutlistCsv(cutlist);
  };

  const onUnlock = () => setLocked(false);

  return {
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
  };
};
