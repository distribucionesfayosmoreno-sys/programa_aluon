import { useEffect, useMemo, useState } from 'react';
import type { QuoteResponse } from '../customer-onboarding/models';
import type {
  CatalogFamily,
  CatalogFamilyChild,
  ColorHex,
  QuoteItemDraft,
} from './BudgetWizard.types';
import { getCatalogChildrenByFamily, getCatalogFamilies } from './services/catalogApi';
import { consumeBudgetWizardPrefillCustomerId } from './services/budgetWizardPrefill';
import { listCustomers, type CustomerResponse, type DeliveryAddressResponse } from './services/customersApi';
import { projectStore } from '../project-management/services/projectStore';
import { createQuote, sendQuote } from './services/quotesApi';
import { useBudgetWizardStepHistory } from './useBudgetWizardStepHistory';
import { resolveDoorModelForQuote } from './budgetWizardDoorModel';

const defaultBooleans = {
  primerRequired: false,
  larguero: false,
  marcoSuperior: false,
  bisagras: false,
  porteroAutomatico: false,
};

const isHexColor = (value: string): value is ColorHex => /^#[0-9a-fA-F]{6}$/.test(value);

export const useBudgetWizard = () => {
  const { step, setStep } = useBudgetWizardStepHistory();
  const [families, setFamilies] = useState<CatalogFamily[]>([]);
  const [children, setChildren] = useState<CatalogFamilyChild[]>([]);
  const [selectedFamily, setSelectedFamily] = useState<CatalogFamily | null>(null);
  const [selectedChild, setSelectedChild] = useState<CatalogFamilyChild | null>(null);

  const [color, setColorState] = useState<ColorHex>('#ffffff');
  const [primerRequired, setPrimerRequired] = useState(defaultBooleans.primerRequired);
  const [widthMm, setWidthMm] = useState(0);
  const [heightMm, setHeightMm] = useState(0);
  const [floorClearanceMm, setFloorClearanceMm] = useState(0);
  const [larguero, setLarguero] = useState(defaultBooleans.larguero);
  const [marcoSuperior, setMarcoSuperior] = useState(defaultBooleans.marcoSuperior);
  const [bisagras, setBisagras] = useState(defaultBooleans.bisagras);
  const [porteroAutomatico, setPorteroAutomatico] = useState(defaultBooleans.porteroAutomatico);

  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedDeliveryAddressId, setSelectedDeliveryAddressId] = useState('');
  const [savedItems, setSavedItems] = useState<QuoteItemDraft[]>([]);
  const [submittedItems, setSubmittedItems] = useState<QuoteItemDraft[]>([]);

  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [postFinalizeAction, setPostFinalizeAction] = useState<'EMAIL' | 'WHATSAPP' | 'VIEW' | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const selectedFamilyQuoteDoorModel = useMemo(
    () => (selectedFamily ? resolveDoorModelForQuote(selectedFamily.technicalModel) : null),
    [selectedFamily],
  );

  const selectedCustomer = useMemo(
    () => customers.find(customer => customer.id === selectedCustomerId) ?? null,
    [customers, selectedCustomerId],
  );

  const deliveryAddresses = useMemo<DeliveryAddressResponse[]>(
    () => selectedCustomer?.direccionesEntrega ?? [],
    [selectedCustomer],
  );

  const selectedDeliveryAddress = useMemo(
    () => deliveryAddresses.find(address => address.id === selectedDeliveryAddressId) ?? null,
    [deliveryAddresses, selectedDeliveryAddressId],
  );

  const itemDraft = useMemo<QuoteItemDraft | null>(() => {
    if (!selectedFamily || !selectedChild || !selectedFamilyQuoteDoorModel) {
      return null;
    }
    return {
      catalogFamilyId: selectedFamily.id,
      catalogChildId: selectedChild.id,
      familyName: selectedFamily.name,
      childName: selectedChild.name,
      doorModel: selectedFamilyQuoteDoorModel,
      doorType: selectedChild.doorType,
      productCategory: selectedChild.productCategory,
      colorCode: color,
      primerRequired,
      widthMm,
      heightMm,
      floorClearanceMm,
      larguero,
      marcoSuperior,
      bisagras,
      porteroAutomatico,
    };
  }, [
    bisagras,
    color,
    floorClearanceMm,
    heightMm,
    larguero,
    marcoSuperior,
    porteroAutomatico,
    primerRequired,
    selectedChild,
    selectedFamily,
    selectedFamilyQuoteDoorModel,
    widthMm,
  ]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getCatalogFamilies()
      .then(data => {
        if (!cancelled) {
          setFamilies(data);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Error al cargar el catálogo');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const loadChildren = async (familyId: string): Promise<CatalogFamilyChild[]> => {
    setLoading(true);
    setError('');
    try {
      const data = await getCatalogChildrenByFamily(familyId);
      setChildren(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los hijos de la familia');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const loadCustomers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listCustomers();
      setCustomers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar clientes');
    } finally {
      setLoading(false);
    }
  };

  const resetCurrentDoor = () => {
    setChildren([]);
    setSelectedFamily(null);
    setSelectedChild(null);
    setColorState('#ffffff');
    setPrimerRequired(defaultBooleans.primerRequired);
    setWidthMm(0);
    setHeightMm(0);
    setFloorClearanceMm(0);
    setLarguero(defaultBooleans.larguero);
    setMarcoSuperior(defaultBooleans.marcoSuperior);
    setBisagras(defaultBooleans.bisagras);
    setPorteroAutomatico(defaultBooleans.porteroAutomatico);
    setPostFinalizeAction(null);
  };

  const restoreItemState = (item: QuoteItemDraft) => {
    setColorState(item.colorCode);
    setPrimerRequired(item.primerRequired);
    setWidthMm(item.widthMm);
    setHeightMm(item.heightMm);
    setFloorClearanceMm(item.floorClearanceMm);
    setLarguero(item.larguero);
    setMarcoSuperior(item.marcoSuperior);
    setBisagras(item.bisagras);
    setPorteroAutomatico(item.porteroAutomatico);
  };

  const selectFamily = async (family: CatalogFamily) => {
    setSelectedFamily(family);
    setSelectedChild(null);
    resetCurrentDoor();
    setSelectedFamily(family);
    await loadChildren(family.id);
    setStep('PRODUCTO');
  };

  const selectChild = (child: CatalogFamilyChild) => {
    setSelectedChild(child);
    setBisagras(defaultBooleans.bisagras);
    setStep('COLOR');
  };

  const goToCustomerStep = async () => {
    if (!customers.length) {
      await loadCustomers();
    }
    const prefillCustomerId = consumeBudgetWizardPrefillCustomerId();
    if (prefillCustomerId && !selectedCustomerId) {
      setSelectedCustomerId(prefillCustomerId);
    }
    setStep('CLIENTE');
  };

  const addCurrentItem = () => {
    if (!itemDraft) {
      if (selectedFamily && selectedChild && !selectedFamilyQuoteDoorModel) {
        setError(`El modelo técnico "${selectedFamily.technicalModel}" no está soportado para presupuestos.`);
      }
      return;
    }
    setSavedItems(prev => [...prev, itemDraft]);
    resetCurrentDoor();
    setStep('ACCIONES');
  };

  const startNewDoor = () => {
    setError('');
    resetCurrentDoor();
    setStep('MODELO');
  };

  const removeItem = (index: number) => {
    setSavedItems(prev => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  const editItem = async (index: number) => {
    const item = savedItems[index];
    if (!item) {
      return;
    }

    setSavedItems(prev => prev.filter((_, itemIndex) => itemIndex !== index));

    const family = families.find(entry => entry.id === item.catalogFamilyId)
      ?? families.find(entry => entry.technicalModel === item.doorModel);
    if (!family) {
      return;
    }

    setSelectedFamily(family);
    const familyChildren = await loadChildren(family.id);
    const child = familyChildren.find(entry => entry.id === item.catalogChildId)
      ?? familyChildren.find(entry => entry.productCategory === item.productCategory && entry.doorType === item.doorType);
    if (!child) {
      return;
    }

    setSelectedChild(child);
    restoreItemState(item);
    setStep('MEDIDAS');
  };

  const finalize = async (action?: 'EMAIL' | 'WHATSAPP' | 'VIEW') => {
    if (action) {
      setPostFinalizeAction(action);
    } else {
      setPostFinalizeAction(null);
    }

    const itemsToSubmit = savedItems.length > 0
      ? [...savedItems]
      : itemDraft
        ? [itemDraft]
        : [];

    if (!itemsToSubmit.length) {
      if (selectedFamily && selectedChild && !selectedFamilyQuoteDoorModel) {
        setError(`El modelo técnico "${selectedFamily.technicalModel}" no está soportado para presupuestos.`);
        return;
      }
      setError('Completa el flujo antes de finalizar.');
      return;
    }
    if (!selectedCustomerId) {
      setError('Selecciona un cliente.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSubmittedItems(itemsToSubmit);

    try {
      const response = await createQuote({
        customerId: selectedCustomerId,
        channel: 'BOTH',
        items: itemsToSubmit,
      });
      setQuote(response);
      projectStore.upsertFromQuote(response);
      setStep('FINALIZADO');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar el presupuesto');
    } finally {
      setSubmitting(false);
    }
  };

  const sendQuoteChannel = async (channel: 'EMAIL' | 'WHATSAPP' | 'BOTH') => {
    if (!quote) {
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const updated = await sendQuote(quote.id, channel);
      setQuote(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar el presupuesto');
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setStep('MODELO');
    resetCurrentDoor();
    setSavedItems([]);
    setSubmittedItems([]);
    setSelectedCustomerId('');
    setSelectedDeliveryAddressId('');
    setQuote(null);
    setError('');
  };

  return {
    step,
    loading,
    submitting,
    error,
    quote,
    postFinalizeAction,
    families,
    children,
    selectedFamily,
    selectedChild,
    color,
    primerRequired,
    widthMm,
    heightMm,
    floorClearanceMm,
    larguero,
    marcoSuperior,
    bisagras,
    porteroAutomatico,
    customers,
    selectedCustomerId,
    selectedDeliveryAddressId,
    selectedCustomer,
    selectedDeliveryAddress,
    deliveryAddresses,
    savedItems,
    submittedItems,
    itemDraft,
    setColor: (value: ColorHex) => {
      if (isHexColor(value)) {
        setColorState(value);
      }
    },
    setPrimerRequired,
    setWidthMm,
    setHeightMm,
    setFloorClearanceMm,
    setLarguero,
    setMarcoSuperior,
    setBisagras,
    setPorteroAutomatico,
    setSelectedCustomerId,
    setSelectedDeliveryAddressId,
    setStep,
    selectFamily,
    selectChild,
    goToCustomerStep,
    addCurrentItem,
    startNewDoor,
    removeItem,
    editItem,
    finalize,
    sendQuoteChannel,
    reset,
  };
};
