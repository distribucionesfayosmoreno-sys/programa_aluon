import React, { useMemo, useState } from 'react';
import { useCustomers } from '../hooks/useCustomers';

const MODELS = [
  { id: 'CLASSIC', label: 'ALUON Classic', pricePerM2: 140 },
  { id: 'PRO', label: 'ALUON Pro', pricePerM2: 190 },
  { id: 'LUX', label: 'ALUON Lux', pricePerM2: 260 },
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

const WorkOrders: React.FC = () => {
  const { customers } = useCustomers();
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

  const [prodCut, setProdCut] = useState(false);
  const [prodFab, setProdFab] = useState(false);
  const [prodLac, setProdLac] = useState(false);
  const [prodLacControl, setProdLacControl] = useState(false);

  const [finalized, setFinalized] = useState(false);
  const [ready, setReady] = useState<'PICKUP' | 'SHIPPING' | ''>('');
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [tab, setTab] = useState<TabKey>('INBOX');

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
  };

  const canGenerateDevelopment = budgetGenerated && accountingApproved && adminApproved;
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
                {MOCK_REQUESTS.map(req => {
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
                  onClick={() => setCutlistGenerated(true)}
                  disabled={!canGenerateDevelopment}
                  style={{ opacity: canGenerateDevelopment ? 1 : 0.5, cursor: canGenerateDevelopment ? 'pointer' : 'not-allowed' }}
                >
                  Generar despiece
                </button>
                <StatusPill label="Desarrollo generado" ok={developmentGenerated} />
                <StatusPill label="Despiece generado" ok={cutlistGenerated} />
              </div>
              <p className="text-xs mt-3" style={{ color: '#9ca3af' }}>
                El despiece se integrará con el generador JS que aportarás.
              </p>
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
    </div>
  );
};

export default WorkOrders;
