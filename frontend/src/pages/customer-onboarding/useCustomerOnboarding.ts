import { useMemo, useState } from 'react';
import { CATALOG_MODELS, PRODUCT_TYPES } from './constants';
import type {
  CatalogCard,
  DoorModel,
  DoorType,
  ErpBudgetStatusResponse,
  ProductTypeCard,
  QuoteChannel,
  QuoteItemDraft,
  QuoteResponse,
  RegistrationRequest,
  RegistrationResponse,
} from './models';
import { getErpBudgetStatus, syncErpBudgetStatus } from '../../services/erpBudgetApi';
import { createRegistration, getRegistrationStatus } from '../../services/registrationsApi';
import { createQuote } from '../../services/quotesApi';
import type { Step } from './CustomerOnboarding.types';

const emptyRegistration: RegistrationRequest = {
  nombreComercial: '',
  razonSocial: '',
  personaContacto: '',
  email: '',
  telefonoWhatsapp: '',
  direccion: '',
  cp: '',
  poblacion: '',
  provincia: '',
  pais: '',
};

type UseCustomerOnboardingState = {
  step: Step;
  registration: RegistrationRequest;
  registrationResponse: RegistrationResponse | null;
  selectedModel: DoorModel | null;
  selectedType: DoorType | null;
  widthMm: number;
  heightMm: number;
  items: QuoteItemDraft[];
  channel: QuoteChannel;
  quote: QuoteResponse | null;
  error: string;
  submitting: boolean;
  statusLoading: boolean;
  selectedModelCard: CatalogCard | null;
  selectedTypeCard: ProductTypeCard | null;
  m2: number;
  handleRegistrationChange: (field: keyof RegistrationRequest, value: string) => void;
  registerCustomer: () => Promise<void>;
  refreshRegistrationStatus: () => Promise<void>;
  addItem: () => void;
  finalizeQuote: () => Promise<void>;
  refreshQuoteStatus: () => Promise<void>;
  syncQuoteStatus: () => Promise<void>;
  handleNewProduct: () => void;
  handleModelSelection: (card: CatalogCard) => void;
  handleTypeSelection: (card: ProductTypeCard) => void;
  setWidthMm: (value: number) => void;
  setHeightMm: (value: number) => void;
  setChannel: (value: QuoteChannel) => void;
  setStep: (value: Step) => void;
  resetQuoteFlow: () => void;
  setError: (value: string) => void;
};

export const useCustomerOnboarding = (): UseCustomerOnboardingState => {
  const [step, setStep] = useState<Step>('REGISTRO');
  const [registration, setRegistration] = useState<RegistrationRequest>(emptyRegistration);
  const [registrationResponse, setRegistrationResponse] = useState<RegistrationResponse | null>(null);
  const [selectedModel, setSelectedModel] = useState<DoorModel | null>(null);
  const [selectedType, setSelectedType] = useState<DoorType | null>(null);
  const [widthMm, setWidthMm] = useState(0);
  const [heightMm, setHeightMm] = useState(0);
  const [items, setItems] = useState<QuoteItemDraft[]>([]);
  const [channel, setChannel] = useState<QuoteChannel>('BOTH');
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  const selectedModelCard = useMemo(
    () => CATALOG_MODELS.find(model => model.id === selectedModel) ?? null,
    [selectedModel]
  );

  const selectedTypeCard = useMemo(
    () => PRODUCT_TYPES.find(type => type.id === selectedType) ?? null,
    [selectedType]
  );

  const m2 = useMemo(() => {
    if (!widthMm || !heightMm) return 0;
    return Math.round((widthMm * heightMm) / 100) / 10000;
  }, [widthMm, heightMm]);

  const handleRegistrationChange = (field: keyof RegistrationRequest, value: string) => {
    setRegistration(prev => ({ ...prev, [field]: value }));
  };

  const registerCustomer = async () => {
    setSubmitting(true);
    setError('');
    try {
      const data = await createRegistration(registration);
      setRegistrationResponse(data);
      setStep('CONFIRMADO');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al registrar el cliente';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const refreshRegistrationStatus = async () => {
    if (!registrationResponse) return;
    setSubmitting(true);
    setError('');
    try {
      const data = await getRegistrationStatus(registrationResponse.registrationId);
      setRegistrationResponse(data);
      if (data.status === 'APROBADO') {
        setStep('CONFIRMADO');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al consultar el estado';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const addItem = () => {
    if (!selectedModel || !selectedType) {
      setError('Selecciona un modelo y tipo de producto.');
      return;
    }
    if (widthMm <= 0 || heightMm <= 0) {
      setError('Introduce medidas válidas en milímetros.');
      return;
    }
    setItems(prev => ([
      ...prev,
      { doorModel: selectedModel, doorType: selectedType, widthMm, heightMm },
    ]));
    setWidthMm(0);
    setHeightMm(0);
    setError('');
    setStep('RESUMEN');
  };

  const finalizeQuote = async () => {
    if (!registrationResponse?.customerId) {
      setError('Tu registro aún no está aprobado.');
      return;
    }
    if (items.length === 0) {
      setError('Añade al menos un producto antes de finalizar.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const data = await createQuote({
        customerId: registrationResponse.customerId,
        channel,
        items,
      });
      setQuote(data);
      setStep('ENVIADO');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al generar el presupuesto';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const applyBudgetStatus = (payload: ErpBudgetStatusResponse) => {
    setQuote(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        status: payload.status,
        validatedAt: payload.validatedAt ?? prev.validatedAt,
        sentAt: payload.sentAt ?? prev.sentAt,
      };
    });
  };

  const refreshQuoteStatus = async () => {
    if (!quote) return;
    setStatusLoading(true);
    setError('');
    try {
      const data = await getErpBudgetStatus(quote.quoteNumber);
      applyBudgetStatus(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al consultar el estado del presupuesto';
      setError(message);
    } finally {
      setStatusLoading(false);
    }
  };

  const syncQuoteStatus = async () => {
    if (!quote) return;
    setStatusLoading(true);
    setError('');
    try {
      const data = await syncErpBudgetStatus({ quoteNumber: quote.quoteNumber, status: quote.status });
      applyBudgetStatus(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al sincronizar el presupuesto';
      setError(message);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleNewProduct = () => {
    setSelectedType(null);
    setWidthMm(0);
    setHeightMm(0);
    setError('');
    setStep('TIPO');
  };

  const handleModelSelection = (card: CatalogCard) => {
    setSelectedModel(card.id);
    setSelectedType(null);
    setWidthMm(0);
    setHeightMm(0);
    setStep('TIPO');
  };

  const handleTypeSelection = (card: ProductTypeCard) => {
    setSelectedType(card.id);
    setWidthMm(0);
    setHeightMm(0);
    setStep('MEDIDAS');
  };

  const resetQuoteFlow = () => {
    setItems([]);
    setQuote(null);
    setSelectedModel(null);
    setSelectedType(null);
    setStep('CATALOGO');
  };

  return {
    step,
    registration,
    registrationResponse,
    selectedModel,
    selectedType,
    widthMm,
    heightMm,
    items,
    channel,
    quote,
    error,
    submitting,
    statusLoading,
    selectedModelCard,
    selectedTypeCard,
    m2,
    handleRegistrationChange,
    registerCustomer,
    refreshRegistrationStatus,
    addItem,
    finalizeQuote,
    refreshQuoteStatus,
    syncQuoteStatus,
    handleNewProduct,
    handleModelSelection,
    handleTypeSelection,
    setWidthMm,
    setHeightMm,
    setChannel,
    setStep,
    resetQuoteFlow,
    setError,
  };
};
