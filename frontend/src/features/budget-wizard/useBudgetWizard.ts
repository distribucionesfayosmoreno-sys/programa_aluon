import { useEffect, useMemo, useState } from 'react';
import type { QuoteResponse } from '../customer-onboarding/models';
import type {
  CatalogDoorProduct,
  CatalogModel,
  CatalogVariant,
  ColorHex,
  QuoteItemDraft,
  Step,
} from './BudgetWizard.types';
import { getCatalogModels, getDoorProductsByModel, getVariantsByDoorProduct } from './services/catalogApi';
import { listCustomers, type CustomerResponse, type DeliveryAddressResponse } from './services/customersApi';
import { createQuote, sendQuote } from './services/quotesApi';

const defaultBooleans = {
  primerRequired: false,
  larguero: false,
  marcoSuperior: false,
  bisagras: false,
  porteroAutomatico: false,
};

const isHexColor = (value: string): value is ColorHex => /^#[0-9a-fA-F]{6}$/.test(value);

export const useBudgetWizard = () => {
  const [step, setStep] = useState<Step>('MODELO');

  const [models, setModels] = useState<CatalogModel[]>([]);
  const [doorProducts, setDoorProducts] = useState<CatalogDoorProduct[]>([]);
  const [variants, setVariants] = useState<CatalogVariant[]>([]);

  const [selectedModel, setSelectedModel] = useState<CatalogModel | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<CatalogDoorProduct | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<CatalogVariant | null>(null);

  const [color, setColor] = useState<ColorHex>('#ffffff');
  const [primerRequired, setPrimerRequired] = useState(defaultBooleans.primerRequired);

  const [widthMm, setWidthMm] = useState(0);
  const [heightMm, setHeightMm] = useState(0);
  const [floorClearanceMm, setFloorClearanceMm] = useState(0);
  const [larguero, setLarguero] = useState(defaultBooleans.larguero);
  const [marcoSuperior, setMarcoSuperior] = useState(defaultBooleans.marcoSuperior);
  const [bisagras, setBisagras] = useState(defaultBooleans.bisagras);
  const [porteroAutomatico, setPorteroAutomatico] = useState(defaultBooleans.porteroAutomatico);

  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [selectedDeliveryAddressId, setSelectedDeliveryAddressId] = useState<string>('');

  const [savedItems, setSavedItems] = useState<QuoteItemDraft[]>([]);

  const selectedCustomer = useMemo(
    () => customers.find(c => c.id === selectedCustomerId) ?? null,
    [customers, selectedCustomerId],
  );

  const deliveryAddresses = useMemo<DeliveryAddressResponse[]>(
    () => selectedCustomer?.direccionesEntrega ?? [],
    [selectedCustomer],
  );

  const selectedDeliveryAddress = useMemo(
    () => deliveryAddresses.find(a => a.id === selectedDeliveryAddressId) ?? null,
    [deliveryAddresses, selectedDeliveryAddressId],
  );

  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getCatalogModels()
      .then(data => {
        if (cancelled) return;
        setModels(data);
      })
      .catch(err => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Error al cargar catálogo');
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const loadDoorProducts = async (modeloId: string) => {
    setLoading(true);
    setError('');
    try {
      const data = await getDoorProductsByModel(modeloId);
      setDoorProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const loadVariants = async (puertaId: string) => {
    setLoading(true);
    setError('');
    try {
      const data = await getVariantsByDoorProduct(puertaId);
      setVariants(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar variantes');
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

  const modelLabel = useMemo(() => {
    const fallback = selectedModel?.modelo ?? null;
    if (!fallback) return '';
    return `Modelo ${fallback}`;
  }, [selectedModel]);

  const productLabel = useMemo(() => {
    switch (selectedProduct?.producto) {
      case 'PUERTA_PASO':
        return 'Puerta paso';
      case 'PUERTA_GARAJE':
        return 'Puerta garaje';
      case 'VALLA':
        return 'Valla';
      case 'REJA':
        return 'Reja';
      default:
        return '';
    }
  }, [selectedProduct]);

  const variantLabel = useMemo(() => {
    switch (selectedVariant?.variante) {
      case 'PEATONAL':
        return 'Peatonal';
      case 'ABATIBLE_UNA':
        return 'Abatible (1 hoja)';
      case 'ABATIBLE_DOS':
        return 'Abatible (2 hojas)';
      case 'CORREDERA':
        return 'Corredera';
      case 'VALLA':
        return 'Valla';
      default:
        return '';
    }
  }, [selectedVariant]);

  const itemDraft = useMemo<QuoteItemDraft | null>(() => {
    if (!selectedModel || !selectedProduct || !selectedVariant) return null;
    return {
      doorModel: selectedModel.modelo,
      doorType: selectedVariant.variante,
      productCategory: selectedProduct.producto,
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
    selectedModel,
    selectedProduct,
    selectedVariant,
    color,
    primerRequired,
    widthMm,
    heightMm,
    floorClearanceMm,
    larguero,
    marcoSuperior,
    bisagras,
    porteroAutomatico,
  ]);

  const selectModel = async (model: CatalogModel) => {
    setSelectedModel(model);
    setSelectedProduct(null);
    setSelectedVariant(null);
    setDoorProducts([]);
    setVariants([]);
    await loadDoorProducts(model.id);
    setStep('PRODUCTO');
  };

  const selectProduct = async (product: CatalogDoorProduct) => {
    setSelectedProduct(product);
    setSelectedVariant(null);
    setVariants([]);
    await loadVariants(product.id);
    setStep('COLOR');
  };

  const selectVariant = (variant: CatalogVariant) => {
    setSelectedVariant(variant);
    setStep('MEDIDAS');
  };

  const goToCustomerStep = async () => {
    if (!customers.length) {
      await loadCustomers();
    }
    setStep('CLIENTE');
  };

  const resetCurrentDoor = () => {
    setDoorProducts([]);
    setVariants([]);
    setSelectedModel(null);
    setSelectedProduct(null);
    setSelectedVariant(null);
    setColor('#ffffff');
    setPrimerRequired(defaultBooleans.primerRequired);
    setWidthMm(0);
    setHeightMm(0);
    setFloorClearanceMm(0);
    setLarguero(defaultBooleans.larguero);
    setMarcoSuperior(defaultBooleans.marcoSuperior);
    setBisagras(defaultBooleans.bisagras);
    setPorteroAutomatico(defaultBooleans.porteroAutomatico);
  };

  const addCurrentItem = () => {
    if (!itemDraft) return;
    setSavedItems(prev => [...prev, itemDraft]);
    resetCurrentDoor();
    setStep('ACCIONES');
  };

  const removeItem = (index: number) => {
    setSavedItems(prev => prev.filter((_, i) => i !== index));
  };

  const editItem = async (index: number) => {
    const item = savedItems[index];
    if (!item) return;

    setSavedItems(prev => prev.filter((_, i) => i !== index));

    // Cargar modelo
    const model = models.find(m => m.modelo === item.doorModel);
    if (model) {
      setSelectedModel(model);
      const productsData = await getDoorProductsByModel(model.id);
      setDoorProducts(productsData);
      const prod = productsData.find(p => p.producto === item.productCategory);
      if (prod) {
        setSelectedProduct(prod);
        const variantsData = await getVariantsByDoorProduct(prod.id);
        setVariants(variantsData);
        const vrnt = variantsData.find(v => v.variante === item.doorType);
        if (vrnt) {
          setSelectedVariant(vrnt);
        }
      }
    }

    setColor(item.colorCode);
    setPrimerRequired(item.primerRequired);
    setWidthMm(item.widthMm);
    setHeightMm(item.heightMm);
    setFloorClearanceMm(item.floorClearanceMm);
    setLarguero(item.larguero);
    setMarcoSuperior(item.marcoSuperior);
    setBisagras(item.bisagras);
    setPorteroAutomatico(item.porteroAutomatico);

    setStep('MEDIDAS');
  };

  const finalize = async () => {
    const itemsToSubmit = [...savedItems];
    if (itemsToSubmit.length === 0) {
      if (!itemDraft) {
        setError('Completa el flujo antes de finalizar.');
        return;
      }
      if (widthMm <= 0 || heightMm <= 0) {
        setError('Introduce medidas válidas (mm).');
        return;
      }
      itemsToSubmit.push(itemDraft);
    }
    if (!selectedCustomerId) {
      setError('Selecciona un cliente.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const response = await createQuote({
        customerId: selectedCustomerId,
        channel: 'BOTH',
        items: itemsToSubmit,
      });
      setQuote(response);
      setStep('FINALIZADO');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar el presupuesto');
    } finally {
      setSubmitting(false);
    }
  };

  const sendQuoteChannel = async (channel: 'EMAIL' | 'WHATSAPP' | 'BOTH') => {
    if (!quote) return;
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
    models,
    doorProducts,
    variants,
    selectedModel,
    selectedProduct,
    selectedVariant,
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
    modelLabel,
    productLabel,
    variantLabel,
    savedItems,
    itemDraft,
    setColor: (value: ColorHex) => {
      if (isHexColor(value)) setColor(value);
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
    selectModel,
    selectProduct,
    selectVariant,
    goToCustomerStep,
    addCurrentItem,
    removeItem,
    editItem,
    finalize,
    sendQuoteChannel,
    reset,
  };
};
