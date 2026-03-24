import { useMemo, useState } from 'react';
import { CATALOG_MODELS, PRODUCT_TYPES } from './constants';
import type {
  CatalogCard,
  DoorModel,
  DoorType,
  ProductTypeCard,
  QuoteChannel,
  QuoteItemDraft,
  QuoteResponse,
  RegistrationRequest,
  RegistrationResponse,
} from './models';

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

type Step = 'REGISTRO' | 'CONFIRMADO' | 'CATALOGO' | 'TIPO' | 'MEDIDAS' | 'RESUMEN' | 'ENVIADO';

const formatDoorType = (value: DoorType) => (
  {
    PEATONAL: 'Peatonal',
    ABATIBLE_UNA: 'Abatible 1 hoja',
    ABATIBLE_DOS: 'Abatible 2 hojas',
    CORREDERA: 'Corredera',
    VALLA: 'Valla',
  }[value]
);

const formatDoorModel = (value: DoorModel) => (
  {
    PREMIUM: 'ALUON Premium',
    CLASSIC: 'ALUON Classic',
    INOX: 'ALUON Inox',
    VENECIANA: 'ALUON Veneciana',
  }[value]
);

const CustomerOnboarding = () => {
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
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registration),
      });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'Error al registrar el cliente');
      }
      const data: RegistrationResponse = await response.json();
      setRegistrationResponse(data);
      setStep('CONFIRMADO');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al registrar el cliente';
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
    if (!registrationResponse) return;
    if (items.length === 0) {
      setError('Añade al menos un producto antes de finalizar.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: registrationResponse.customerId,
          channel,
          items,
        }),
      });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'Error al generar el presupuesto');
      }
      const data: QuoteResponse = await response.json();
      setQuote(data);
      setStep('ENVIADO');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al generar el presupuesto';
      setError(message);
    } finally {
      setSubmitting(false);
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <div className="w-1 h-5 rounded-full bg-brand" />
        <div>
          <h1 className="text-xl font-black uppercase tracking-tight" style={{ color: '#0d1117' }}>Registro de Clientes</h1>
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#9ca3af' }}>Onboarding · Presupuestos</p>
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl text-xs font-bold" style={{ background: '#fff7ed', color: '#c2410c', border: '1px solid #fed7aa' }}>
          {error}
        </div>
      )}

      {step === 'REGISTRO' && (
        <div className="grid gap-6" style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)' }}>
          <div className="rounded-2xl p-6" style={{ background: '#ffffff', border: '1px solid #e8eaed' }}>
            <h2 className="text-sm font-black uppercase" style={{ color: '#0d1117' }}>Datos de empresa</h2>
            <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>Completa la información para activar tu acceso.</p>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="col-span-2">
                <label className="field-label">Nombre comercial</label>
                <input
                  className="field"
                  value={registration.nombreComercial}
                  onChange={e => handleRegistrationChange('nombreComercial', e.target.value)}
                  placeholder="ALUON Distribuciones"
                />
              </div>
              <div className="col-span-2">
                <label className="field-label">Razón social</label>
                <input
                  className="field"
                  value={registration.razonSocial ?? ''}
                  onChange={e => handleRegistrationChange('razonSocial', e.target.value)}
                  placeholder="ALUON Distribuciones SL"
                />
              </div>
              <div>
                <label className="field-label">Persona de contacto</label>
                <input
                  className="field"
                  value={registration.personaContacto ?? ''}
                  onChange={e => handleRegistrationChange('personaContacto', e.target.value)}
                  placeholder="María Rojas"
                />
              </div>
              <div>
                <label className="field-label">Teléfono WhatsApp</label>
                <input
                  className="field"
                  value={registration.telefonoWhatsapp}
                  onChange={e => handleRegistrationChange('telefonoWhatsapp', e.target.value)}
                  placeholder="+34 600 123 456"
                />
              </div>
              <div>
                <label className="field-label">Email de ofertas</label>
                <input
                  className="field"
                  value={registration.email}
                  onChange={e => handleRegistrationChange('email', e.target.value)}
                  placeholder="compras@cliente.com"
                />
              </div>
              <div>
                <label className="field-label">Dirección</label>
                <input
                  className="field"
                  value={registration.direccion ?? ''}
                  onChange={e => handleRegistrationChange('direccion', e.target.value)}
                  placeholder="Calle Mayor 24"
                />
              </div>
              <div>
                <label className="field-label">CP</label>
                <input
                  className="field"
                  value={registration.cp ?? ''}
                  onChange={e => handleRegistrationChange('cp', e.target.value)}
                  placeholder="28001"
                />
              </div>
              <div>
                <label className="field-label">Población</label>
                <input
                  className="field"
                  value={registration.poblacion ?? ''}
                  onChange={e => handleRegistrationChange('poblacion', e.target.value)}
                  placeholder="Madrid"
                />
              </div>
              <div>
                <label className="field-label">Provincia</label>
                <input
                  className="field"
                  value={registration.provincia ?? ''}
                  onChange={e => handleRegistrationChange('provincia', e.target.value)}
                  placeholder="Madrid"
                />
              </div>
              <div>
                <label className="field-label">País</label>
                <input
                  className="field"
                  value={registration.pais ?? ''}
                  onChange={e => handleRegistrationChange('pais', e.target.value)}
                  placeholder="España"
                />
              </div>
            </div>

            <div className="mt-6">
              <button className="btn-primary" onClick={registerCustomer} disabled={submitting}>
                {submitting ? 'Registrando...' : 'Confirmar registro'}
              </button>
            </div>
          </div>

          <div className="rounded-2xl p-6" style={{ background: 'linear-gradient(180deg,#0d1117 0%,#161b22 100%)', color: '#ffffff', border: '1px solid #21262d' }}>
            <h3 className="text-sm font-black uppercase">¿Qué ocurre después?</h3>
            <ul className="mt-4 space-y-3 text-xs" style={{ color: '#c9d1d9' }}>
              <li>Asignamos tu tarifa base según la tabla de precios.</li>
              <li>Accedes al catálogo visual de modelos y tipos.</li>
              <li>Generas tu primera oferta y la enviamos al validar.</li>
            </ul>
            <div className="mt-6 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <p className="text-xs">Tu solicitud quedará registrada en nuestra base de datos para seguimiento.</p>
            </div>
          </div>
        </div>
      )}

      {step === 'CONFIRMADO' && registrationResponse && (
        <div className="rounded-2xl p-6" style={{ background: '#ffffff', border: '1px solid #e8eaed' }}>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-sm font-black uppercase" style={{ color: '#0d1117' }}>Registro confirmado</h2>
              <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>
                Tarifa asignada: <strong>{registrationResponse.tarifa || 'BASE'}</strong>
              </p>
              <p className="text-xs" style={{ color: '#9ca3af' }}>Cliente: {registrationResponse.nombreComercial}</p>
            </div>
            <div className="flex gap-2">
              <button className="btn-primary" onClick={() => setStep('CATALOGO')}>Pedir presupuesto</button>
              <button className="btn-ghost" onClick={() => setError('Funcionalidad de gestión en preparación.')}>Gestionar pedido</button>
            </div>
          </div>
        </div>
      )}

      {step === 'CATALOGO' && (
        <section className="grid gap-4">
          <div>
            <h2 className="text-sm font-black uppercase" style={{ color: '#0d1117' }}>Selecciona un modelo</h2>
            <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>Catálogo visual con acabados disponibles.</p>
          </div>
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            {CATALOG_MODELS.map(card => (
              <button
                key={card.id}
                className="text-left rounded-2xl overflow-hidden transition-all"
                style={{ border: '1px solid #e8eaed', background: '#ffffff' }}
                onClick={() => handleModelSelection(card)}
              >
                <img src={card.image} alt={card.label} className="h-36 w-full object-cover" />
                <div className="p-4">
                  <div className="text-sm font-black" style={{ color: '#0d1117' }}>{card.label}</div>
                  <div className="text-xs mt-2" style={{ color: '#9ca3af' }}>{card.description}</div>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {step === 'TIPO' && selectedModelCard && (
        <section className="grid gap-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-sm font-black uppercase" style={{ color: '#0d1117' }}>Tipo de producto</h2>
              <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>Modelo seleccionado: {selectedModelCard.label}</p>
            </div>
            <button className="btn-ghost" onClick={() => setStep('CATALOGO')}>Cambiar modelo</button>
          </div>

          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            {PRODUCT_TYPES.map(card => (
              <button
                key={card.id}
                className="text-left rounded-2xl overflow-hidden transition-all"
                style={{ border: '1px solid #e8eaed', background: '#ffffff' }}
                onClick={() => handleTypeSelection(card)}
              >
                <img src={card.image} alt={card.label} className="h-36 w-full object-cover" />
                <div className="p-4">
                  <div className="text-sm font-black" style={{ color: '#0d1117' }}>{card.label}</div>
                  <div className="text-xs mt-2" style={{ color: '#9ca3af' }}>{card.description}</div>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {step === 'MEDIDAS' && selectedModelCard && selectedTypeCard && (
        <section className="grid gap-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-sm font-black uppercase" style={{ color: '#0d1117' }}>Medidas y confirmación</h2>
              <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>
                {selectedModelCard.label} · {selectedTypeCard.label}
              </p>
            </div>
            <button className="btn-ghost" onClick={() => setStep('TIPO')}>Cambiar tipo</button>
          </div>

          <div className="rounded-2xl p-6 grid gap-4" style={{ background: '#ffffff', border: '1px solid #e8eaed' }}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="field-label">Ancho (mm)</label>
                <input
                  className="field"
                  type="number"
                  min={1}
                  value={widthMm || ''}
                  onChange={e => setWidthMm(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="field-label">Alto (mm)</label>
                <input
                  className="field"
                  type="number"
                  min={1}
                  value={heightMm || ''}
                  onChange={e => setHeightMm(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="text-xs" style={{ color: '#9ca3af' }}>
              Superficie estimada: <strong style={{ color: '#0d1117' }}>{m2.toFixed(2)} m²</strong>
            </div>
            <div className="flex gap-2">
              <button className="btn-primary" onClick={addItem}>Añadir producto</button>
              <button className="btn-ghost" onClick={handleNewProduct}>Añadir otro tipo</button>
            </div>
          </div>
        </section>
      )}

      {step === 'RESUMEN' && (
        <section className="grid gap-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-sm font-black uppercase" style={{ color: '#0d1117' }}>Resumen de productos</h2>
              <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>Revisa la lista antes de finalizar la oferta.</p>
            </div>
            <button className="btn-ghost" onClick={handleNewProduct}>Añadir otro producto</button>
          </div>

          <div className="rounded-2xl p-6" style={{ background: '#ffffff', border: '1px solid #e8eaed' }}>
            <div className="grid gap-3">
              {items.map((item, index) => (
                <div key={`${item.doorModel}-${item.doorType}-${index}`} className="flex items-center justify-between text-xs">
                  <div>
                    <strong style={{ color: '#0d1117' }}>{formatDoorModel(item.doorModel)}</strong>
                    <div style={{ color: '#9ca3af' }}>{formatDoorType(item.doorType)} · {item.widthMm}x{item.heightMm} mm</div>
                  </div>
                  <div className="text-xs" style={{ color: '#9ca3af' }}>
                    {(item.widthMm * item.heightMm / 1000000).toFixed(2)} m²
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <label className="field-label">Canal de envío</label>
              <div className="flex gap-2">
                {(['WHATSAPP', 'EMAIL', 'BOTH'] as QuoteChannel[]).map(value => (
                  <button
                    key={value}
                    className={value === channel ? 'btn-primary' : 'btn-ghost'}
                    onClick={() => setChannel(value)}
                  >
                    {value === 'WHATSAPP' ? 'WhatsApp' : value === 'EMAIL' ? 'Email' : 'Ambos'}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button className="btn-primary" onClick={finalizeQuote} disabled={submitting}>
                {submitting ? 'Generando...' : 'Finalizar oferta'}
              </button>
              <button className="btn-ghost" onClick={() => setStep('CATALOGO')}>Volver al catálogo</button>
            </div>
          </div>
        </section>
      )}

      {step === 'ENVIADO' && quote && (
        <section className="rounded-2xl p-6" style={{ background: '#ffffff', border: '1px solid #e8eaed' }}>
          <h2 className="text-sm font-black uppercase" style={{ color: '#0d1117' }}>Presupuesto registrado</h2>
          <p className="text-xs mt-2" style={{ color: '#9ca3af' }}>
            Nº {quote.quoteNumber} · Total estimado {quote.total.toFixed(2)} €
          </p>
          <div className="mt-4 text-xs" style={{ color: '#9ca3af' }}>
            Estado: <strong style={{ color: '#0d1117' }}>{quote.status}</strong> · Canal: {quote.channel}
          </div>
          <div className="mt-6 flex gap-2">
            <button className="btn-primary" onClick={() => {
              setItems([]);
              setQuote(null);
              setSelectedModel(null);
              setSelectedType(null);
              setStep('CATALOGO');
            }}>Nueva oferta</button>
            <button className="btn-ghost" onClick={() => setStep('CONFIRMADO')}>Volver</button>
          </div>
        </section>
      )}
    </div>
  );
};

export default CustomerOnboarding;
