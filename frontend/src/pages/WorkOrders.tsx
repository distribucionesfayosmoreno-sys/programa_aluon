import React, { useEffect, useMemo, useState } from 'react';
import { useCustomers } from '../hooks/useCustomers';

const MODELS = [
  { id: 'CLASSIC', label: 'ALUON Classic', pricePerM2: 140 },
  { id: 'PRO', label: 'ALUON Pro', pricePerM2: 190 },
  { id: 'LUX', label: 'ALUON Lux', pricePerM2: 260 },
];

const DOOR_MODELS = [
  { id: 'PREMIUM', label: 'ALUON Premium' },
  { id: 'CLASSIC', label: 'ALUON Classic' },
  { id: 'INOX', label: 'ALUON Inox' },
  { id: 'VENECIANA', label: 'ALUON Veneciana' },
];

const DOOR_TYPES = [
  { id: 'PEATONAL', label: 'Peatonal' },
  { id: 'ABATIBLE_UNA', label: 'Abatible 1 hoja' },
  { id: 'ABATIBLE_DOS', label: 'Abatible 2 hojas' },
  { id: 'CORREDERA', label: 'Corredera' },
  { id: 'VALLA', label: 'Valla' },
];

const MOCK_REQUESTS = [
  {
    id: 'REQ-001',
    customerName: 'Maderas Sierra Norte',
    modelId: 'PRO',
    m2: 42.5,
    reference: 'MOD-PR-442',
    googleView: true,
    notes: 'Acabado satinado. Entrega urgente.',
  },
  {
    id: 'REQ-002',
    customerName: 'Construcciones Lumbre',
    modelId: 'CLASSIC',
    m2: 18,
    reference: 'MOD-CL-107',
    googleView: false,
    notes: 'Medidas especiales en esquinas.',
  },
  {
    id: 'REQ-003',
    customerName: 'Grupo Arista',
    modelId: 'LUX',
    m2: 64,
    reference: 'MOD-LX-880',
    googleView: true,
    notes: 'Necesita simulación en tienda.',
  },
];

const SectionTitle = ({ n, label }: { n: string; label: string }) => (
  <div className="flex items-center gap-3 mb-5">
    <span style={{ fontSize: 9, fontWeight: 900, color: '#e5534b', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
      {n} · {label}
    </span>
    <div className="flex-1 h-px" style={{ backgroundColor: '#e8eaed' }} />
  </div>
);

const StatusPill = ({ label, ok }: { label: string; ok: boolean }) => (
  <span
    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold"
    style={{
      fontSize: 10,
      background: ok ? '#ecfdf3' : '#f3f4f6',
      color: ok ? '#15803d' : '#6b7280',
      border: `1px solid ${ok ? '#bbf7d0' : '#e5e7eb'}`,
    }}
  >
    {label}
  </span>
);

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="field-label">{children}</label>
);

const Field = (p: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...p} className="field" autoComplete="off" />
);

const TextArea = (p: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...p} className="field" rows={4} />
);

type TabKey = 'INBOX' | 'REQUEST' | 'BUDGET' | 'DEV' | 'PROD' | 'FINAL';

type BudgetData = {
  budgetNumber: string;
  budgetDate: string;
  customerName: string;
  customerAddress: string;
  customerEmail: string;
  customerPhone: string;
  modelLabel: string;
  m2: number;
  pricePerM2: number;
  total: number;
  notes: string;
  reference: string;
};

type NewRequestData = {
  customerName: string;
  modelId: string;
  m2: number;
  reference: string;
  googleView: boolean;
  notes: string;
};

type CutlistDoorType = 'PEATONAL' | 'ABATIBLE_UNA' | 'ABATIBLE_DOS' | 'CORREDERA' | 'VALLA';
type CutlistDoorModel = 'PREMIUM' | 'CLASSIC' | 'INOX' | 'VENECIANA';
type CutlistRailType = 'CARRIL_16' | 'CARRIL_20';
type CutlistMountingType = 'A' | 'B';

type CutlistRequest = {
  doorType: CutlistDoorType;
  model: CutlistDoorModel;
  widthMm: number;
  heightMm: number;
  groundClearanceMm?: number;
  largueroMm?: number;
  topFrame?: boolean;
  automationReinforcement?: boolean;
  railType?: CutlistRailType;
  mountingType?: CutlistMountingType;
  tail?: boolean;
  notes?: string;
};

type CutlistItem = {
  description: string;
  units: number;
  cutMeasure: string;
};

type CutlistResponse = {
  id: string;
  doorType: CutlistDoorType;
  model: CutlistDoorModel;
  widthMm: number;
  heightMm: number;
  items: CutlistItem[];
};

const BudgetModal = ({
  open,
  onClose,
  data,
  canExport,
  onPrint,
  onEmail,
}: {
  open: boolean;
  onClose: () => void;
  data: BudgetData;
  canExport: boolean;
  onPrint: () => void;
  onEmail: () => void;
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{ background: 'rgba(13,17,23,0.70)', backdropFilter: 'blur(6px)' }}
    >
      <div className="absolute inset-0" onClick={onClose} />

      <div
        className="relative w-full max-w-5xl rounded-2xl flex flex-col overflow-hidden animate-fade-up"
        style={{ background: '#ffffff', maxHeight: 'calc(100vh - 48px)', boxShadow: '0 24px 70px rgba(0,0,0,0.32)' }}
      >
        <div
          className="flex items-center justify-between px-7 py-5"
          style={{ background: '#0d1117', borderBottom: '1px solid #21262d' }}
        >
          <div className="flex items-center gap-3.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(229,83,75,0.15)' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#e5534b' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0-6v2m0 16v2m8-10h2M2 12H4m12.95-6.95l1.41 1.41M5.64 18.36l1.41-1.41m0-10.3L5.64 5.64m12.72 12.72-1.41-1.41" />
              </svg>
            </div>
            <div>
              <h2 style={{ fontSize: 13, fontWeight: 900, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Presupuesto
              </h2>
              <p style={{ fontSize: 10, fontWeight: 600, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2 }}>
                {data.budgetNumber}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200"
            style={{ color: '#8b949e' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#21262d'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#8b949e'; }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-7">
          <div className="rounded-xl p-6" style={{ border: '1px solid #e8eaed', background: '#ffffff' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center md:text-left">
                <div className="text-lg font-black tracking-widest" style={{ color: '#111827' }}>ALUON</div>
                <div className="text-xs font-bold uppercase mt-1" style={{ color: '#6b7280', letterSpacing: '0.08em' }}>
                  ALUMINIO SOLDADO, S.L.
                </div>
                <div className="mt-2 flex justify-center md:justify-start">
                  <div className="h-px w-20" style={{ background: '#9ca3af' }} />
                </div>
                <div className="mt-3 text-xs font-semibold uppercase leading-5" style={{ color: '#6b7280', letterSpacing: '0.04em' }}>
                  Telf. 925 55 40 14
                  <br />
                  Ctra. 4004 Km. 29,200
                  <br />
                  45290 Pantoja (Toledo)
                  <br />
                  info@aluon.es
                </div>

                <div className="grid grid-cols-3 gap-2 mt-6 text-[11px] font-semibold uppercase" style={{ color: '#6b7280', letterSpacing: '0.06em' }}>
                  <div>18 de</div>
                  <div>Marzo</div>
                  <div>de 2026</div>
                </div>
                <div className="mt-2 text-[11px] font-black uppercase" style={{ color: '#111827', letterSpacing: '0.08em' }}>
                  Presupuesto Nº {data.budgetNumber}
                </div>
              </div>

              <div className="flex flex-col items-start md:items-end gap-2">
                <div className="w-56 h-20 flex items-center justify-center" style={{ background: '#111827', color: '#fff' }}>
                  <div className="text-center">
                    <div className="text-xl font-black" style={{ letterSpacing: '0.3em' }}>ALUON</div>
                    <div className="text-[11px]" style={{ color: '#cbd5f5' }}>Somos Aluminio Soldado</div>
                  </div>
                </div>
                <div className="mt-3 text-xs font-semibold uppercase" style={{ color: '#6b7280', letterSpacing: '0.04em' }}>
                  {data.customerName}
                </div>
                <div className="text-xs uppercase" style={{ color: '#6b7280' }}>{data.customerAddress || '—'}</div>
                <div className="text-xs uppercase" style={{ color: '#6b7280' }}>Toledo</div>
                <div className="text-xs uppercase" style={{ color: '#6b7280' }}>Telf. {data.customerPhone}</div>
                <div className="text-xs uppercase" style={{ color: '#6b7280' }}>E-mail {data.customerEmail || '—'}</div>
              </div>
            </div>

            <div className="mt-5 border rounded-lg overflow-hidden" style={{ borderColor: '#e5e7eb' }}>
              <div className="grid grid-cols-12 text-xs font-bold" style={{ background: '#f9fafb', color: '#6b7280' }}>
                <div className="col-span-2 px-3 py-2">Cantidad</div>
                <div className="col-span-7 px-3 py-2">Descripción</div>
                <div className="col-span-1 px-3 py-2 text-right">Precio Ud.</div>
                <div className="col-span-2 px-3 py-2 text-right">Total</div>
              </div>
              <div className="grid grid-cols-12 text-xs" style={{ borderTop: '1px solid #e5e7eb' }}>
                <div className="col-span-2 px-3 py-3">{data.m2.toFixed(2)}</div>
                <div className="col-span-7 px-3 py-3">
                  <div className="font-semibold">{data.modelLabel}</div>
                  <div style={{ color: '#6b7280' }}>Referencia: {data.reference || '—'}</div>
                  <div style={{ color: '#6b7280' }}>m²: {data.m2.toFixed(2)}</div>
                  {data.notes && <div style={{ color: '#6b7280' }}>Notas: {data.notes}</div>}
                </div>
                <div className="col-span-1 px-3 py-3 text-right">{data.pricePerM2.toFixed(2)}</div>
                <div className="col-span-2 px-3 py-3 text-right font-semibold">{data.total.toFixed(2)}</div>
              </div>
            </div>

            <div className="mt-6 text-xs" style={{ color: '#6b7280' }}>
              <div className="font-bold uppercase" style={{ color: '#111827' }}>Condiciones generales</div>
              <div className="mt-1">Forma de pago: a la aceptación del presupuesto 50%, resto el día anterior del suministro del material.</div>
              <div>Validez del presupuesto: 15 días.</div>
              <div>Cualquier modificación de la presente oferta llevará consigo un nuevo estudio.</div>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-8 text-xs" style={{ color: '#6b7280' }}>
              <div className="text-center">
                <div className="h-px mb-2" style={{ background: '#e5e7eb' }} />
                Conforme el cliente
              </div>
              <div className="text-center">
                <div className="h-px mb-2" style={{ background: '#e5e7eb' }} />
                Conforme la empresa
              </div>
            </div>
          </div>
        </div>

        <div
          className="flex items-center justify-between gap-4 px-7 py-5"
          style={{ borderTop: '1px solid #e8eaed', background: '#f8f9fb' }}
        >
          <p style={{ fontSize: 10, color: '#8b949e', fontWeight: 600 }} className="hidden sm:block">
            Confirmación requerida para impresión o envío
          </p>
          <div className="flex items-center gap-3 ml-auto">
            <button type="button" onClick={onClose} className="btn-ghost">Cerrar</button>
            <button
              type="button"
              onClick={onPrint}
              className="btn-primary"
              disabled={!canExport}
              style={{ opacity: canExport ? 1 : 0.5, cursor: canExport ? 'pointer' : 'not-allowed' }}
            >
              Imprimir
            </button>
            <button
              type="button"
              onClick={onEmail}
              className="btn-primary"
              disabled={!canExport}
              style={{ opacity: canExport ? 1 : 0.5, cursor: canExport ? 'pointer' : 'not-allowed' }}
            >
              Enviar por mail
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const NewRequestModal = ({
  open,
  onClose,
  onCreate,
  customers,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (data: NewRequestData) => void;
  customers: { id?: string; nombreComercial: string; razonSocial: string }[];
}) => {
  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [modelId, setModelId] = useState(MODELS[0].id);
  const [m2, setM2] = useState(0);
  const [reference, setReference] = useState('');
  const [googleView, setGoogleView] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (open) {
      setCustomerId('');
      setCustomerName('');
      setModelId(MODELS[0].id);
      setM2(0);
      setReference('');
      setGoogleView(false);
      setNotes('');
    }
  }, [open]);

  const resolvedCustomerName = (() => {
    const match = customers.find(c => c.id === customerId);
    return match?.nombreComercial || match?.razonSocial || customerName;
  })();

  const canCreate = Boolean(resolvedCustomerName) && m2 > 0 && reference.trim().length > 0;

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{ background: 'rgba(13,17,23,0.70)', backdropFilter: 'blur(6px)' }}
    >
      <div className="absolute inset-0" onClick={onClose} />

      <div
        className="relative w-full max-w-3xl rounded-2xl flex flex-col overflow-hidden animate-fade-up"
        style={{ background: '#ffffff', maxHeight: 'calc(100vh - 48px)', boxShadow: '0 24px 70px rgba(0,0,0,0.32)' }}
      >
        <div
          className="flex items-center justify-between px-7 py-5"
          style={{ background: '#0d1117', borderBottom: '1px solid #21262d' }}
        >
          <div>
            <h2 style={{ fontSize: 13, fontWeight: 900, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Nueva solicitud
            </h2>
            <p style={{ fontSize: 10, fontWeight: 600, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2 }}>
              Bandeja de solicitudes
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200"
            style={{ color: '#8b949e' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#21262d'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#8b949e'; }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-7 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FieldLabel>Cliente (CRM)</FieldLabel>
              <select
                className="field"
                value={customerId}
                onChange={e => setCustomerId(e.target.value)}
              >
                <option value="">Selecciona un cliente</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.nombreComercial || c.razonSocial || c.id}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <FieldLabel>Nombre cliente (manual)</FieldLabel>
              <Field
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="Si no está en CRM"
              />
            </div>
            <div>
              <FieldLabel>Modelo</FieldLabel>
              <select
                className="field"
                value={modelId}
                onChange={e => setModelId(e.target.value)}
              >
                {MODELS.map(m => (
                  <option key={m.id} value={m.id}>{m.label}</option>
                ))}
              </select>
            </div>
            <div>
              <FieldLabel>m² estimados</FieldLabel>
              <Field
                type="number"
                min={0}
                step="0.01"
                value={m2}
                onChange={e => setM2(Number(e.target.value || 0))}
              />
            </div>
            <div className="md:col-span-2">
              <FieldLabel>Referencia del modelo</FieldLabel>
              <Field
                value={reference}
                onChange={e => setReference(e.target.value)}
                placeholder="Código o referencia interna"
              />
            </div>
            <div className="md:col-span-2 flex items-center gap-3">
              <input
                type="checkbox"
                checked={googleView}
                onChange={e => setGoogleView(e.target.checked)}
                style={{ accentColor: '#e5534b', width: 16, height: 16 }}
              />
              <span className="text-xs font-semibold uppercase" style={{ color: '#8b949e', letterSpacing: '0.08em' }}>
                Visualización en Google (apoyo en tienda)
              </span>
            </div>
            <div className="md:col-span-2">
              <FieldLabel>Notas</FieldLabel>
              <TextArea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Observaciones, medidas especiales, acabados..."
              />
            </div>
          </div>
        </div>

        <div
          className="flex items-center justify-between gap-4 px-7 py-5"
          style={{ borderTop: '1px solid #e8eaed', background: '#f8f9fb' }}
        >
          <button type="button" onClick={onClose} className="btn-ghost">Cancelar</button>
          <button
            type="button"
            className="btn-primary"
            disabled={!canCreate}
            style={{ opacity: canCreate ? 1 : 0.5, cursor: canCreate ? 'pointer' : 'not-allowed' }}
            onClick={() => onCreate({
              customerName: resolvedCustomerName,
              modelId,
              m2,
              reference: reference.toUpperCase(),
              googleView,
              notes,
            })}
          >
            Crear solicitud
          </button>
        </div>
      </div>
    </div>
  );
};

const WorkOrders: React.FC<{ openNewRequest?: boolean; onNewRequestHandled?: () => void }> = ({
  openNewRequest,
  onNewRequestHandled,
}) => {
  const { customers } = useCustomers();
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const [customerId, setCustomerId] = useState('');
  const [modelId, setModelId] = useState(MODELS[0].id);
  const [modelReference, setModelReference] = useState('');
  const [modelImage, setModelImage] = useState<File | null>(null);
  const [m2, setM2] = useState(0);
  const [googleView, setGoogleView] = useState(false);
  const [notes, setNotes] = useState('');

  const [budgetGenerated, setBudgetGenerated] = useState(false);
  const [accountingApproved, setAccountingApproved] = useState(false);
  const [adminApproved, setAdminApproved] = useState(false);

  const [developmentGenerated, setDevelopmentGenerated] = useState(false);
  const [cutlistGenerated, setCutlistGenerated] = useState(false);

  const [doorType, setDoorType] = useState<CutlistDoorType>('PEATONAL');
  const [doorModel, setDoorModel] = useState<CutlistDoorModel>('PREMIUM');
  const [widthMm, setWidthMm] = useState(0);
  const [heightMm, setHeightMm] = useState(0);
  const [groundClearanceMm, setGroundClearanceMm] = useState(0);
  const [largueroMm, setLargueroMm] = useState<50 | 80>(50);
  const [topFrame, setTopFrame] = useState(true);
  const [automationReinforcement, setAutomationReinforcement] = useState(false);
  const [railType, setRailType] = useState<CutlistRailType>('CARRIL_16');
  const [mountingType, setMountingType] = useState<CutlistMountingType>('A');
  const [tail, setTail] = useState(false);
  const [cutlistResult, setCutlistResult] = useState<CutlistResponse | null>(null);
  const [cutlistError, setCutlistError] = useState('');
  const [cutlistLoading, setCutlistLoading] = useState(false);

  const [prodCut, setProdCut] = useState(false);
  const [prodFab, setProdFab] = useState(false);
  const [prodLac, setProdLac] = useState(false);
  const [prodLacControl, setProdLacControl] = useState(false);

  const [finalized, setFinalized] = useState(false);
  const [ready, setReady] = useState<'PICKUP' | 'SHIPPING' | ''>('');
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [tab, setTab] = useState<TabKey>('INBOX');
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);

  const selectedModel = MODELS.find(m => m.id === modelId) ?? MODELS[0];
  const hasModelRef = Boolean(modelReference.trim()) || Boolean(modelImage);
  const canGenerateBudget = Boolean(customerId) && m2 > 0 && hasModelRef;

  const budget = useMemo(() => {
    const base = selectedModel.pricePerM2;
    const total = Math.round(m2 * base * 100) / 100;
    return { base, total };
  }, [m2, selectedModel]);

  const productionSteps = [prodCut, prodFab, prodLac, prodLacControl];
  const productionPct = Math.round((productionSteps.filter(Boolean).length / productionSteps.length) * 100);

  const overallPct = useMemo(() => {
    const checks = [
      Boolean(customerId) && m2 > 0 && hasModelRef,
      budgetGenerated,
      accountingApproved,
      adminApproved,
      developmentGenerated,
      cutlistGenerated,
      prodCut,
      prodFab,
      prodLac,
      prodLacControl,
      finalized,
      ready !== '',
    ];
    const done = checks.filter(Boolean).length;
    return Math.round((done / checks.length) * 100);
  }, [
    customerId,
    m2,
    hasModelRef,
    budgetGenerated,
    accountingApproved,
    adminApproved,
    developmentGenerated,
    cutlistGenerated,
    prodCut,
    prodFab,
    prodLac,
    prodLacControl,
    finalized,
    ready,
  ]);

  const resetDownstream = () => {
    setBudgetGenerated(false);
    setAccountingApproved(false);
    setAdminApproved(false);
    setDevelopmentGenerated(false);
    setCutlistGenerated(false);
    setCutlistResult(null);
    setCutlistError('');
    setCutlistLoading(false);
    setProdCut(false);
    setProdFab(false);
    setProdLac(false);
    setProdLacControl(false);
    setFinalized(false);
    setReady('');
  };

  const handleGenerateBudget = () => {
    if (!canGenerateBudget) return;
    setBudgetGenerated(true);
    setShowBudgetModal(true);
  };

  const canGenerateDevelopment = budgetGenerated && accountingApproved && adminApproved;

  const needsGroundClearance = doorType === 'PEATONAL' || doorType === 'ABATIBLE_UNA' || doorType === 'ABATIBLE_DOS';
  const needsLarguero = doorType === 'PEATONAL' || doorType === 'ABATIBLE_UNA' || doorType === 'ABATIBLE_DOS';
  const needsTopFrame = doorType === 'PEATONAL' || doorType === 'ABATIBLE_UNA' || doorType === 'ABATIBLE_DOS';
  const needsAutomation = doorType === 'ABATIBLE_UNA' || doorType === 'ABATIBLE_DOS' || doorType === 'CORREDERA';
  const needsRail = doorType === 'CORREDERA';
  const needsMounting = doorType === 'CORREDERA';
  const needsTail = doorType === 'CORREDERA';

  const canGenerateCutlist = canGenerateDevelopment
    && widthMm > 0
    && heightMm > 0
    && (!needsGroundClearance || groundClearanceMm >= 0)
    && (!needsLarguero || (largueroMm === 50 || largueroMm === 80))
    && (!needsTopFrame || typeof topFrame === 'boolean')
    && (!needsAutomation || typeof automationReinforcement === 'boolean')
    && (!needsRail || Boolean(railType))
    && (!needsMounting || Boolean(mountingType))
    && (!needsTail || typeof tail === 'boolean');

  const buildCutlistPayload = (): CutlistRequest => ({
    doorType,
    model: doorModel,
    widthMm,
    heightMm,
    groundClearanceMm: needsGroundClearance ? groundClearanceMm : undefined,
    largueroMm: needsLarguero ? largueroMm : undefined,
    topFrame: needsTopFrame ? topFrame : undefined,
    automationReinforcement: needsAutomation ? automationReinforcement : undefined,
    railType: needsRail ? railType : undefined,
    mountingType: needsMounting ? mountingType : undefined,
    tail: needsTail ? tail : undefined,
    notes,
  });

  const handleGenerateCutlist = async () => {
    if (!canGenerateCutlist) return;
    setCutlistLoading(true);
    setCutlistError('');
    try {
      const response = await fetch('/api/cutlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildCutlistPayload()),
      });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'Error al generar el despiece');
      }
      const data: CutlistResponse = await response.json();
      setCutlistResult(data);
      setCutlistGenerated(true);
    } catch (error) {
      setCutlistGenerated(false);
      setCutlistResult(null);
      setCutlistError(error instanceof Error ? error.message : 'Error inesperado al generar el despiece');
    } finally {
      setCutlistLoading(false);
    }
  };

  const clearCutlist = () => {
    setCutlistGenerated(false);
    setCutlistResult(null);
    setCutlistError('');
  };

  const canStartProduction = canGenerateDevelopment && developmentGenerated && cutlistGenerated;
  const canFinalize = canStartProduction && prodCut && prodFab && prodLac && prodLacControl;

  const pipelineSteps: Array<{ key: TabKey; label: string; done: boolean }> = [
    { key: 'INBOX', label: 'Solicitudes', done: selectedRequestId !== null },
    { key: 'REQUEST', label: 'Solicitud', done: Boolean(customerId) && m2 > 0 && hasModelRef },
    { key: 'BUDGET', label: 'Presupuesto', done: budgetGenerated && accountingApproved && adminApproved },
    { key: 'DEV', label: 'Desarrollo', done: developmentGenerated && cutlistGenerated },
    { key: 'PROD', label: 'Producción', done: prodCut && prodFab && prodLac && prodLacControl },
    { key: 'FINAL', label: 'Finalización', done: finalized && ready !== '' },
  ];

  const resolveCustomerId = (name: string) => {
    const match = customers.find(c => {
      const n = (c.nombreComercial || c.razonSocial || '').toLowerCase();
      return n.includes(name.toLowerCase());
    });
    return match?.id ?? '';
  };

  const applyRequest = (req: typeof MOCK_REQUESTS[number]) => {
    resetDownstream();
    setSelectedRequestId(req.id);
    setCustomerId(resolveCustomerId(req.customerName));
    setModelId(req.modelId);
    setM2(req.m2);
    setModelReference(req.reference.toUpperCase());
    setGoogleView(req.googleView);
    setNotes(req.notes);
    setModelImage(null);
    setTab('REQUEST');
  };

  useEffect(() => {
    if (openNewRequest) {
      setShowRequestModal(true);
      onNewRequestHandled?.();
    }
  }, [openNewRequest, onNewRequestHandled]);

  const createRequest = (data: NewRequestData) => {
    const lastId = requests
      .map(r => Number(r.id.replace('REQ-', '')))
      .filter(n => !Number.isNaN(n))
      .sort((a, b) => b - a)[0] ?? 0;
    const nextId = `REQ-${String(lastId + 1).padStart(3, '0')}`;
    setRequests(prev => ([
      {
        id: nextId,
        customerName: data.customerName,
        modelId: data.modelId,
        m2: data.m2,
        reference: data.reference,
        googleView: data.googleView,
        notes: data.notes,
      },
      ...prev,
    ]));
    setSelectedRequestId(nextId);
    setShowRequestModal(false);
    setTab('INBOX');
  };

  const budgetNumber = useMemo(() => {
    const date = new Date();
    const yy = date.getFullYear().toString().slice(-2);
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const ref = (selectedRequestId ?? 'GEN').replace('REQ-', '');
    return `P-${yy}${mm}${dd}-${ref}`;
  }, [selectedRequestId]);

  const budgetDate = useMemo(() => {
    const date = new Date();
    const opts: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('es-ES', opts);
  }, []);

  const selectedCustomer = customers.find(c => c.id === customerId);
  const budgetData: BudgetData = {
    budgetNumber,
    budgetDate,
    customerName: selectedCustomer?.nombreComercial || selectedCustomer?.razonSocial || '—',
    customerAddress: [selectedCustomer?.direccion, selectedCustomer?.cp, selectedCustomer?.poblacion, selectedCustomer?.provincia]
      .filter(Boolean)
      .join(' · '),
    customerEmail: selectedCustomer?.email || '',
    customerPhone: selectedCustomer?.telefono || '—',
    modelLabel: selectedModel.label,
    m2,
    pricePerM2: selectedModel.pricePerM2,
    total: budget.total,
    notes,
    reference: modelReference,
  };

  const handlePrint = () => {
    if (!accountingApproved || !adminApproved) return;
    const w = window.open('', '_blank', 'width=900,height=700');
    if (!w) return;
    w.document.write(`<!doctype html>
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
</html>`);
    w.document.close();
    w.focus();
    w.print();
  };

  const handleEmail = () => {
    if (!accountingApproved || !adminApproved) return;
    const subject = `Presupuesto ${budgetData.budgetNumber}`;
    const body = `Adjunto presupuesto ${budgetData.budgetNumber}.\n\nCliente: ${budgetData.customerName}\nModelo: ${budgetData.modelLabel}\nTotal: ${budgetData.total.toFixed(2)} €\n`;
    const mail = `mailto:${budgetData.customerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mail;
  };

  return (
    <div className="flex flex-col" style={{ minHeight: 600 }}>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-1 h-5 rounded-full bg-brand" />
            <h1 className="text-xl font-black uppercase tracking-tight" style={{ color: '#0d1117' }}>
              Órdenes de trabajo
            </h1>
          </div>
          <p className="text-xs font-semibold uppercase tracking-wide ml-3.5 mt-0.5" style={{ color: '#9ca3af' }}>
            Workflow · Presupuestos · Producción
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: '#f8f9fb', border: '1px solid #e8eaed' }}>
            <div className="h-2 w-24 rounded-full" style={{ background: '#e8eaed', overflow: 'hidden' }}>
              <div className="h-full" style={{ width: `${overallPct}%`, background: '#e5534b' }} />
            </div>
            <span className="text-xs font-bold" style={{ color: '#8b949e' }}>{overallPct}%</span>
          </div>
          <button className="btn-primary" onClick={() => setShowRequestModal(true)}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nueva orden
          </button>
          <button className="btn-ghost" onClick={resetDownstream}>Reiniciar flujo</button>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6 overflow-x-auto">
        {pipelineSteps.map((step, idx) => (
          <button
            key={step.key}
            type="button"
            onClick={() => setTab(step.key)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl whitespace-nowrap"
            style={{
              border: `1px solid ${tab === step.key ? '#e5534b' : '#e8eaed'}`,
              background: tab === step.key ? '#fff7f7' : '#ffffff',
            }}
          >
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black"
              style={{
                background: step.done ? '#e5534b' : '#e8eaed',
                color: step.done ? '#ffffff' : '#6b7280',
              }}
            >
              {idx + 1}
            </span>
            <span className="text-xs font-black uppercase" style={{ color: '#0d1117', letterSpacing: '0.08em' }}>
              {step.label}
            </span>
            {step.done && (
              <span className="text-[10px] font-black" style={{ color: '#15803d' }}>
                ✓
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-8">
          {tab === 'INBOX' && (
            <section className="p-6 rounded-2xl" style={{ background: '#ffffff', border: '1px solid #e8eaed', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              <SectionTitle n="00" label="Bandeja de solicitudes (emulación)" />
              <div className="space-y-3">
              {requests.map(req => {
                  const active = selectedRequestId === req.id;
                  return (
                    <div
                      key={req.id}
                      className="flex items-center justify-between gap-4 p-4 rounded-xl"
                      style={{
                        border: `1px solid ${active ? '#e5534b' : '#e8eaed'}`,
                        background: active ? '#fff7f7' : '#f9fafb',
                      }}
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-black uppercase" style={{ color: '#0d1117', letterSpacing: '0.08em' }}>
                          {req.customerName}
                        </div>
                        <div className="text-xs mt-1" style={{ color: '#8b949e' }}>
                          {req.id} · {MODELS.find(m => m.id === req.modelId)?.label} · {req.m2} m²
                        </div>
                        <div className="text-xs mt-1" style={{ color: '#9ca3af' }}>
                          Ref: {req.reference} · {req.googleView ? 'Google view' : 'Sin Google view'}
                        </div>
                      </div>
                      <button type="button" className="btn-ghost" onClick={() => applyRequest(req)}>
                        Cargar solicitud
                      </button>
                    </div>
                  );
                })}
              </div>
              {selectedRequestId && !customerId && (
                <p className="text-xs mt-3" style={{ color: '#dc2626' }}>
                  No se encontró el cliente en CRM. Selecciónalo manualmente en la solicitud.
                </p>
              )}
            </section>
          )}

          {tab === 'REQUEST' && (
            <section className="p-6 rounded-2xl" style={{ background: '#ffffff', border: '1px solid #e8eaed', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              <SectionTitle n="01" label="Solicitud del cliente" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FieldLabel>Cliente</FieldLabel>
                  <select
                    className="field"
                    value={customerId}
                    onChange={e => { setCustomerId(e.target.value); resetDownstream(); }}
                  >
                    <option value="">Selecciona un cliente</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.nombreComercial || c.razonSocial || c.id}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <FieldLabel>Modelo</FieldLabel>
                  <select
                    className="field"
                    value={modelId}
                    onChange={e => { setModelId(e.target.value); resetDownstream(); }}
                  >
                    {MODELS.map(m => (
                      <option key={m.id} value={m.id}>{m.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <FieldLabel>m² estimados</FieldLabel>
                  <Field
                    type="number"
                    min={0}
                    step="0.01"
                    value={m2}
                    onChange={e => { setM2(Number(e.target.value || 0)); resetDownstream(); }}
                  />
                </div>
                <div>
                  <FieldLabel>Referencia del modelo</FieldLabel>
                  <Field
                    placeholder="Código o referencia interna"
                    value={modelReference}
                    onChange={e => { setModelReference(e.target.value.toUpperCase()); resetDownstream(); }}
                  />
                </div>
                <div>
                  <FieldLabel>Imagen del modelo</FieldLabel>
                  <input
                    type="file"
                    accept="image/*"
                    className="field"
                    onChange={e => { setModelImage(e.target.files?.[0] ?? null); resetDownstream(); }}
                  />
                </div>
                <div className="flex items-center gap-3 pt-7">
                  <input
                    type="checkbox"
                    checked={googleView}
                    onChange={e => setGoogleView(e.target.checked)}
                    style={{ accentColor: '#e5534b', width: 16, height: 16 }}
                  />
                  <span className="text-xs font-semibold uppercase" style={{ color: '#8b949e', letterSpacing: '0.08em' }}>
                    Visualización en Google (apoyo en tienda)
                  </span>
                </div>
                <div className="md:col-span-2">
                  <FieldLabel>Notas del cliente</FieldLabel>
                  <TextArea
                    placeholder="Observaciones, medidas especiales, acabados..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                  />
                </div>
              </div>
              {!hasModelRef && (
                <p className="text-xs font-semibold mt-3" style={{ color: '#dc2626' }}>
                  Debe incluir imagen o referencia del modelo.
                </p>
              )}
            </section>
          )}

          {tab === 'BUDGET' && (
            <section className="p-6 rounded-2xl" style={{ background: '#ffffff', border: '1px solid #e8eaed', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              <SectionTitle n="02" label="Presupuesto" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <FieldLabel>Precio €/m²</FieldLabel>
                  <Field value={selectedModel.pricePerM2} readOnly />
                </div>
                <div>
                  <FieldLabel>Total estimado</FieldLabel>
                  <Field value={`${budget.total} €`} readOnly />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    className="btn-primary w-full justify-center"
                    onClick={handleGenerateBudget}
                    disabled={!canGenerateBudget}
                    style={{ opacity: canGenerateBudget ? 1 : 0.5, cursor: canGenerateBudget ? 'pointer' : 'not-allowed' }}
                  >
                    Generar presupuesto
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <StatusPill label="Presupuesto generado" ok={budgetGenerated} />
                <StatusPill label="Confirmado contabilidad" ok={accountingApproved} />
                <StatusPill label="Autorizado superior" ok={adminApproved} />
              </div>
              <div className="flex items-center gap-3 mt-4">
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => setAccountingApproved(v => !v)}
                  disabled={!budgetGenerated}
                  style={{ opacity: budgetGenerated ? 1 : 0.5, cursor: budgetGenerated ? 'pointer' : 'not-allowed' }}
                >
                  Confirmar (Contabilidad)
                </button>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => setAdminApproved(v => !v)}
                  disabled={!budgetGenerated}
                  style={{ opacity: budgetGenerated ? 1 : 0.5, cursor: budgetGenerated ? 'pointer' : 'not-allowed' }}
                >
                  Autorizar (Admin/Dios)
                </button>
              </div>
            </section>
          )}

          {tab === 'DEV' && (
            <section className="p-6 rounded-2xl" style={{ background: '#ffffff', border: '1px solid #e8eaed', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              <SectionTitle n="03" label="Desarrollo automático" />
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setDevelopmentGenerated(true)}
                  disabled={!canGenerateDevelopment}
                  style={{ opacity: canGenerateDevelopment ? 1 : 0.5, cursor: canGenerateDevelopment ? 'pointer' : 'not-allowed' }}
                >
                  Generar desarrollo
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleGenerateCutlist}
                  disabled={!canGenerateCutlist || cutlistLoading}
                  style={{ opacity: canGenerateCutlist && !cutlistLoading ? 1 : 0.5, cursor: canGenerateCutlist && !cutlistLoading ? 'pointer' : 'not-allowed' }}
                >
                  {cutlistLoading ? 'Generando...' : 'Generar despiece'}
                </button>
                <StatusPill label="Desarrollo generado" ok={developmentGenerated} />
                <StatusPill label="Despiece generado" ok={cutlistGenerated} />
              </div>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <FieldLabel>Tipo de puerta</FieldLabel>
                  <select
                    className="field"
                    value={doorType}
                    onChange={e => { setDoorType(e.target.value as CutlistDoorType); clearCutlist(); }}
                  >
                    {DOOR_TYPES.map(type => (
                      <option key={type.id} value={type.id}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <FieldLabel>Modelo (despiece)</FieldLabel>
                  <select
                    className="field"
                    value={doorModel}
                    onChange={e => { setDoorModel(e.target.value as CutlistDoorModel); clearCutlist(); }}
                  >
                    {DOOR_MODELS.map(model => (
                      <option key={model.id} value={model.id}>{model.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <FieldLabel>Anchura total (mm)</FieldLabel>
                  <Field
                    type="number"
                    min={0}
                    value={widthMm}
                    onChange={e => { setWidthMm(Number(e.target.value || 0)); clearCutlist(); }}
                  />
                </div>
                <div>
                  <FieldLabel>Altura total (mm)</FieldLabel>
                  <Field
                    type="number"
                    min={0}
                    value={heightMm}
                    onChange={e => { setHeightMm(Number(e.target.value || 0)); clearCutlist(); }}
                  />
                </div>
                {needsGroundClearance && (
                  <div>
                    <FieldLabel>Holgura suelo (mm)</FieldLabel>
                    <Field
                      type="number"
                      min={0}
                      value={groundClearanceMm}
                      onChange={e => { setGroundClearanceMm(Number(e.target.value || 0)); clearCutlist(); }}
                    />
                  </div>
                )}
                {needsLarguero && (
                  <div>
                    <FieldLabel>Larguero</FieldLabel>
                    <select
                      className="field"
                      value={String(largueroMm)}
                      onChange={e => { setLargueroMm(Number(e.target.value) as 50 | 80); clearCutlist(); }}
                    >
                      <option value="50">50 mm</option>
                      <option value="80">80 mm</option>
                    </select>
                  </div>
                )}
                {needsTopFrame && (
                  <div>
                    <FieldLabel>Marco superior</FieldLabel>
                    <select
                      className="field"
                      value={topFrame ? 'yes' : 'no'}
                      onChange={e => { setTopFrame(e.target.value === 'yes'); clearCutlist(); }}
                    >
                      <option value="yes">Sí</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                )}
                {needsAutomation && (
                  <div>
                    <FieldLabel>Refuerzo automatización</FieldLabel>
                    <select
                      className="field"
                      value={automationReinforcement ? 'yes' : 'no'}
                      onChange={e => { setAutomationReinforcement(e.target.value === 'yes'); clearCutlist(); }}
                    >
                      <option value="yes">Sí</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                )}
                {needsRail && (
                  <div>
                    <FieldLabel>Carril</FieldLabel>
                    <select
                      className="field"
                      value={railType}
                      onChange={e => { setRailType(e.target.value as CutlistRailType); clearCutlist(); }}
                    >
                      <option value="CARRIL_16">Carril 16</option>
                      <option value="CARRIL_20">Carril 20</option>
                    </select>
                  </div>
                )}
                {needsMounting && (
                  <div>
                    <FieldLabel>Montaje</FieldLabel>
                    <select
                      className="field"
                      value={mountingType}
                      onChange={e => { setMountingType(e.target.value as CutlistMountingType); clearCutlist(); }}
                    >
                      <option value="A">Montaje A</option>
                      <option value="B">Montaje B</option>
                    </select>
                  </div>
                )}
                {needsTail && (
                  <div>
                    <FieldLabel>Cola</FieldLabel>
                    <select
                      className="field"
                      value={tail ? 'yes' : 'no'}
                      onChange={e => { setTail(e.target.value === 'yes'); clearCutlist(); }}
                    >
                      <option value="yes">Sí</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                )}
              </div>
              {cutlistError && (
                <p className="text-xs font-semibold mt-3" style={{ color: '#dc2626' }}>
                  {cutlistError}
                </p>
              )}
              {cutlistResult && (
                <div className="mt-6">
                  <div className="text-xs font-black uppercase tracking-widest" style={{ color: '#8b949e' }}>
                    Resultado despiece
                  </div>
                  <div className="mt-3 overflow-x-auto">
                    <table className="w-full text-xs" style={{ borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: '#f9fafb', color: '#6b7280' }}>
                          <th className="text-left px-3 py-2" style={{ border: '1px solid #e5e7eb' }}>Descripción</th>
                          <th className="text-left px-3 py-2" style={{ border: '1px solid #e5e7eb' }}>Unidades</th>
                          <th className="text-left px-3 py-2" style={{ border: '1px solid #e5e7eb' }}>Medida corte</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cutlistResult.items.map((item, idx) => (
                          <tr key={`${cutlistResult.id}-${idx}`}>
                            <td className="px-3 py-2" style={{ border: '1px solid #e5e7eb' }}>{item.description}</td>
                            <td className="px-3 py-2" style={{ border: '1px solid #e5e7eb' }}>{item.units}x</td>
                            <td className="px-3 py-2" style={{ border: '1px solid #e5e7eb' }}>{item.cutMeasure}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>
          )}

          {tab === 'PROD' && (
            <section className="p-6 rounded-2xl" style={{ background: '#ffffff', border: '1px solid #e8eaed', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              <SectionTitle n="04" label="Producción" />
              <div className="flex items-center gap-3 mb-4">
                <div className="h-2 w-40 rounded-full" style={{ background: '#e8eaed', overflow: 'hidden' }}>
                  <div className="h-full" style={{ width: `${productionPct}%`, background: '#e5534b' }} />
                </div>
                <span className="text-xs font-bold" style={{ color: '#8b949e' }}>{productionPct}%</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="flex items-center gap-3 p-3 rounded-xl" style={{ border: '1px solid #e8eaed', background: '#f9fafb' }}>
                  <input
                    type="checkbox"
                    checked={prodCut}
                    onChange={e => setProdCut(e.target.checked)}
                    disabled={!canStartProduction}
                    style={{ accentColor: '#e5534b', width: 16, height: 16 }}
                  />
                  <span className="text-xs font-bold uppercase" style={{ color: '#0d1117' }}>Corte</span>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-xl" style={{ border: '1px solid #e8eaed', background: '#f9fafb' }}>
                  <input
                    type="checkbox"
                    checked={prodFab}
                    onChange={e => setProdFab(e.target.checked)}
                    disabled={!canStartProduction}
                    style={{ accentColor: '#e5534b', width: 16, height: 16 }}
                  />
                  <span className="text-xs font-bold uppercase" style={{ color: '#0d1117' }}>Fabricación</span>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-xl" style={{ border: '1px solid #e8eaed', background: '#f9fafb' }}>
                  <input
                    type="checkbox"
                    checked={prodLac}
                    onChange={e => setProdLac(e.target.checked)}
                    disabled={!canStartProduction}
                    style={{ accentColor: '#e5534b', width: 16, height: 16 }}
                  />
                  <span className="text-xs font-bold uppercase" style={{ color: '#0d1117' }}>Lacado</span>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-xl" style={{ border: '1px solid #e8eaed', background: '#f9fafb' }}>
                  <input
                    type="checkbox"
                    checked={prodLacControl}
                    onChange={e => setProdLacControl(e.target.checked)}
                    disabled={!canStartProduction}
                    style={{ accentColor: '#e5534b', width: 16, height: 16 }}
                  />
                  <span className="text-xs font-bold uppercase" style={{ color: '#0d1117' }}>Control paso lacado</span>
                </label>
              </div>
              {!canStartProduction && (
                <p className="text-xs mt-3" style={{ color: '#9ca3af' }}>
                  Producción habilitada tras aprobación y desarrollo.
                </p>
              )}
            </section>
          )}

          {tab === 'FINAL' && (
            <section className="p-6 rounded-2xl" style={{ background: '#ffffff', border: '1px solid #e8eaed', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              <SectionTitle n="05" label="Finalización" />
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={finalized}
                    onChange={e => setFinalized(e.target.checked)}
                    disabled={!canFinalize}
                    style={{ accentColor: '#e5534b', width: 16, height: 16 }}
                  />
                  <span className="text-xs font-bold uppercase" style={{ color: '#0d1117' }}>Producto finalizado</span>
                </label>
                <select
                  className="field"
                  value={ready}
                  onChange={e => setReady(e.target.value as typeof ready)}
                  disabled={!finalized}
                  style={{ maxWidth: 220, opacity: finalized ? 1 : 0.5 }}
                >
                  <option value="">Listo para...</option>
                  <option value="PICKUP">Recogida</option>
                  <option value="SHIPPING">Envío</option>
                </select>
              </div>
              {!canFinalize && (
                <p className="text-xs mt-3" style={{ color: '#9ca3af' }}>
                  Finalización disponible al completar producción.
                </p>
              )}
            </section>
          )}
        </div>

        <aside className="space-y-6">
          <div className="p-6 rounded-2xl" style={{ background: '#0d1117', color: '#ffffff', boxShadow: '0 20px 50px rgba(13,17,23,0.35)' }}>
            <div className="text-xs font-black uppercase tracking-widest" style={{ color: '#8b949e' }}>
              Resumen del pedido
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <div className="text-xs" style={{ color: '#8b949e' }}>Cliente</div>
                <div className="text-sm font-bold">
                  {customers.find(c => c.id === customerId)?.nombreComercial || '—'}
                </div>
              </div>
              <div>
                <div className="text-xs" style={{ color: '#8b949e' }}>Modelo</div>
                <div className="text-sm font-bold">{selectedModel.label}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs" style={{ color: '#8b949e' }}>m²</div>
                  <div className="text-sm font-bold">{m2 || '—'}</div>
                </div>
                <div>
                  <div className="text-xs" style={{ color: '#8b949e' }}>Total</div>
                  <div className="text-sm font-bold">{budget.total} €</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusPill label="Presupuesto" ok={budgetGenerated} />
                <StatusPill label="Aprobado" ok={accountingApproved && adminApproved} />
              </div>
              <div className="pt-2 text-xs" style={{ color: '#8b949e' }}>
                {googleView ? 'Incluye visualización Google.' : 'Sin visualización Google.'}
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl" style={{ background: '#ffffff', border: '1px solid #e8eaed' }}>
            <div className="text-xs font-black uppercase tracking-widest" style={{ color: '#8b949e' }}>
              Estado del workflow
            </div>
            <div className="mt-4 space-y-2">
              <StatusPill label="Solicitud completa" ok={Boolean(customerId) && m2 > 0 && hasModelRef} />
              <StatusPill label="Presupuesto generado" ok={budgetGenerated} />
              <StatusPill label="Contabilidad" ok={accountingApproved} />
              <StatusPill label="Admin/Dios" ok={adminApproved} />
              <StatusPill label="Desarrollo" ok={developmentGenerated} />
              <StatusPill label="Despiece" ok={cutlistGenerated} />
              <StatusPill label="Producción" ok={prodCut && prodFab && prodLac && prodLacControl} />
              <StatusPill label="Finalizado" ok={finalized} />
              <StatusPill label="Listo" ok={ready !== ''} />
            </div>
          </div>
        </aside>
      </div>

      <BudgetModal
        open={showBudgetModal}
        onClose={() => setShowBudgetModal(false)}
        data={budgetData}
        canExport={accountingApproved && adminApproved}
        onPrint={handlePrint}
        onEmail={handleEmail}
      />

      <NewRequestModal
        open={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        onCreate={createRequest}
        customers={customers}
      />
    </div>
  );
};

export default WorkOrders;
