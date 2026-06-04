import { useEffect, useState, type ReactNode } from 'react';
import AppDialog from '../../components/feedback/AppDialog';
import type { Customer } from '../../hooks/useCustomers';
import { dashboardTheme } from '../dashboard/dashboardTheme';
import type { Customer360DocumentItem, Customer360WorkOrderItem } from './customer360Types';
import { Customer360DocumentModal } from './Customer360DocumentModal';
import { useCustomer360 } from './useCustomer360';

type Props = {
  open: boolean;
  customer: Customer | null;
  onClose: () => void;
};

const formatDate = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
};

const toCustomerLabel = (customer: Customer): string => customer.nombreComercial || customer.razonSocial || 'Cliente';

const documentTypeLabel: Record<Customer360DocumentItem['type'], string> = {
  PRESUPUESTO: 'Presupuesto',
  PEDIDO: 'Pedido',
  ALBARAN: 'Albarán',
  FACTURA: 'Factura',
  ABONO: 'Abono',
};

const typeTone: Record<Customer360DocumentItem['type'], { bg: string; color: string }> = {
  PRESUPUESTO: { bg: '#eff6ff', color: '#1d4ed8' },
  PEDIDO: { bg: '#fef3c7', color: '#b45309' },
  ALBARAN: { bg: '#ecfeff', color: '#0e7490' },
  FACTURA: { bg: '#f3e8ff', color: '#7c3aed' },
  ABONO: { bg: '#ecfdf5', color: '#047857' },
};

const statusTone = (type: Customer360DocumentItem['type'], status: string): { bg: string; color: string; label: string } => {
  const normalized = status.toUpperCase();

  if (type === 'FACTURA') {
    if (normalized === 'PAGADA') return { bg: '#dcfce7', color: '#15803d', label: 'Pagada' };
    if (normalized === 'ANULADA') return { bg: '#fee2e2', color: '#b91c1c', label: 'Anulada' };
    return { bg: '#fef3c7', color: '#b45309', label: normalized || 'Pendiente' };
  }

  if (type === 'ALBARAN') {
    if (normalized === 'FACTURADO') return { bg: '#dcfce7', color: '#15803d', label: 'Facturado' };
    return { bg: '#fef3c7', color: '#b45309', label: normalized || 'Pendiente' };
  }

  if (type === 'PEDIDO') {
    if (normalized === 'FINALIZADO') return { bg: '#dcfce7', color: '#15803d', label: 'Finalizado' };
    return { bg: '#dbeafe', color: '#1d4ed8', label: normalized || 'Abierto' };
  }

  if (type === 'ABONO') {
    return { bg: '#ecfdf5', color: '#047857', label: normalized || 'Emitido' };
  }

  if (normalized === 'ENVIADO' || normalized === 'VALIDADO') {
    return { bg: '#dcfce7', color: '#15803d', label: normalized === 'VALIDADO' ? 'Validado' : 'Enviado' };
  }

  return { bg: '#fef3c7', color: '#b45309', label: normalized || 'Pendiente' };
};

const shellStyle = {
  background: `linear-gradient(180deg, ${dashboardTheme.surfaceSoft} 0%, ${dashboardTheme.surface} 26%)`,
};

const panelClassName = 'rounded-[18px] border bg-white shadow-[0_18px_40px_rgba(16,24,40,0.08)]';

const SectionTitle = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="flex items-end justify-between gap-4">
    <div>
      <div className="flex items-center gap-3">
        <span className="h-5 w-[3px] rounded-full" style={{ backgroundColor: dashboardTheme.accentBars.transactions }} aria-hidden="true" />
        <h3 className="text-[14px] leading-none font-semibold" style={{ color: dashboardTheme.text }}>
          {title}
        </h3>
      </div>
      {subtitle ? (
        <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.12em]" style={{ color: dashboardTheme.muted }}>
          {subtitle}
        </p>
      ) : null}
    </div>
  </div>
);

const StatCard = ({ label, value, hint }: { label: string; value: string | number; hint?: string }) => (
  <div className="rounded-[16px] border bg-white px-4 py-4" style={{ borderColor: dashboardTheme.border, boxShadow: dashboardTheme.shadowSoft }}>
    <div className="text-[10px] font-black uppercase tracking-[0.16em]" style={{ color: dashboardTheme.muted }}>
      {label}
    </div>
    <div className="mt-2 text-2xl font-black tracking-tight" style={{ color: dashboardTheme.text }}>
      {value}
    </div>
    {hint ? (
      <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: dashboardTheme.muted }}>
        {hint}
      </div>
    ) : null}
  </div>
);

const InfoBlock = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="rounded-[16px] border bg-white px-4 py-4" style={{ borderColor: dashboardTheme.border }}>
    <div className="text-[10px] font-black uppercase tracking-[0.16em]" style={{ color: dashboardTheme.muted }}>
      {title}
    </div>
    <div className="mt-3 space-y-1.5">{children}</div>
  </div>
);

const InfoLine = ({ label, value }: { label: string; value?: string | null }) => (
  <div className="flex items-start justify-between gap-4 text-sm">
    <span className="text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: dashboardTheme.muted }}>
      {label}
    </span>
    <span className="text-right font-medium" style={{ color: dashboardTheme.text }}>
      {value || '—'}
    </span>
  </div>
);

const DocumentRow = ({ document, onClick }: { document: Customer360DocumentItem; onClick: (document: Customer360DocumentItem) => void }) => {
  const tone = typeTone[document.type];
  const status = statusTone(document.type, document.statusLabel);

  return (
    <div
      className="grid grid-cols-1 gap-3 rounded-[16px] border bg-white px-4 py-3 md:grid-cols-[1.3fr_0.8fr_auto]"
      style={{ borderColor: dashboardTheme.border }}
      role="button"
      tabIndex={0}
      onClick={() => onClick(document)}
      onKeyDown={event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick(document);
        }
      }}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em]"
            style={{ background: tone.bg, color: tone.color }}
          >
            {documentTypeLabel[document.type]}
          </span>
          <span className="text-[11px] font-semibold" style={{ color: dashboardTheme.text }}>
            {document.number}
          </span>
        </div>
        <div className="mt-1 truncate text-[11px] font-medium" style={{ color: dashboardTheme.muted }}>
          {document.customerName}
        </div>
      </div>

      <div>
        <div className="text-[10px] font-black uppercase tracking-[0.14em]" style={{ color: dashboardTheme.muted }}>
          Estado
        </div>
        <div
          className="mt-1 inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em]"
          style={{ background: status.bg, color: status.color }}
        >
          {status.label}
        </div>
      </div>

      <div className="text-left md:text-right">
        <div className="text-[10px] font-black uppercase tracking-[0.14em]" style={{ color: dashboardTheme.muted }}>
          {document.source}
        </div>
        <div className="mt-1 text-[11px] font-semibold" style={{ color: dashboardTheme.text }}>
          {formatDate(document.createdAt)}
        </div>
      </div>
    </div>
  );
};

const WorkOrderRow = ({ workOrder }: { workOrder: Customer360WorkOrderItem }) => {
  const isClosed = ['FINALIZADO', 'FINAL', 'CERRADO', 'COMPLETADO'].includes(workOrder.statusLabel.toUpperCase());

  return (
    <div
      className="grid grid-cols-1 gap-3 rounded-[16px] border bg-white px-4 py-3 md:grid-cols-[1fr_auto_auto]"
      style={{ borderColor: dashboardTheme.border }}
    >
      <div className="min-w-0">
        <div className="text-[11px] font-black uppercase tracking-[0.14em]" style={{ color: dashboardTheme.text }}>
          {workOrder.code}
        </div>
        <div className="mt-1 truncate text-[11px] font-medium" style={{ color: dashboardTheme.muted }}>
          {workOrder.customerName}
        </div>
      </div>

      <div
        className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em]"
        style={{ background: isClosed ? '#dcfce7' : '#dbeafe', color: isClosed ? '#15803d' : '#1d4ed8' }}
      >
        {workOrder.statusLabel}
      </div>

      <div className="text-left text-[11px] font-semibold md:text-right" style={{ color: dashboardTheme.text }}>
        {formatDate(workOrder.createdAt)}
      </div>
    </div>
  );
};

export const Customer360Modal = ({ open, customer, onClose }: Props) => {
  const { loading, error, data } = useCustomer360({ customer, open });
  const [selectedDocument, setSelectedDocument] = useState<Customer360DocumentItem | null>(null);

  const displayedCustomer = data?.customer ?? customer;
  const title = displayedCustomer ? toCustomerLabel(displayedCustomer) : 'Vision 360';
  const subtitle = customer?.numeroDocumento || customer?.telefono || 'Visión completa del cliente';

  useEffect(() => {
    if (!open) {
      setSelectedDocument(null);
    }
  }, [open]);

  return (
    <AppDialog
      open={open}
      title={title}
      subtitle={subtitle}
      onClose={onClose}
      maxWidthClassName="max-w-7xl"
      headerVariant="none"
      bodyClassName="p-0"
    >
      <div className="relative rounded-[22px] border p-6" style={{ ...shellStyle, borderColor: dashboardTheme.border }}>
        <div className="space-y-5">
          <div className={`${panelClassName} p-6`}>
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
              <div className="max-w-3xl">
                <div className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: dashboardTheme.muted }}>
                  Ficha del cliente
                </div>
                <h2 className="mt-2 text-3xl font-black tracking-tight" style={{ color: dashboardTheme.text }}>
                  {title}
                </h2>
                <p className="mt-2 text-sm font-medium" style={{ color: dashboardTheme.muted }}>
                  Vista consolidada con documentos, facturación, logística y órdenes asociadas.
                </p>
              </div>

              <div className="grid min-w-[220px] grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <InfoBlock title="Documento fiscal">
                  <InfoLine label="Número" value={data?.customer.numeroDocumento ?? customer?.numeroDocumento} />
                  <InfoLine label="Tarifa" value={data?.customer.tarifa ?? customer?.tarifa} />
                </InfoBlock>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Presupuestos" value={data?.metrics.budgets ?? 0} hint={`${data?.metrics.totalDocuments ?? 0} documentos`} />
              <StatCard label="Pedidos" value={data?.metrics.orders ?? 0} />
              <StatCard label="Albaranes" value={data?.metrics.deliveryNotes ?? 0} hint={`${data?.metrics.pendingDeliveryNotes ?? 0} pendientes`} />
              <StatCard label="Facturas" value={data?.metrics.invoices ?? 0} hint={`${data?.metrics.paidInvoices ?? 0} pagadas`} />
            </div>
          </div>

          {loading ? (
            <div className={`${panelClassName} px-4 py-3 text-sm font-semibold`} style={{ borderColor: dashboardTheme.border, color: '#1d4ed8', background: '#eff6ff' }}>
              Cargando Vision 360...
            </div>
          ) : null}

          {error ? (
            <div className={`${panelClassName} px-4 py-3 text-sm font-semibold`} style={{ borderColor: '#fecaca', color: '#b91c1c', background: '#fef2f2' }}>
              {error}
            </div>
          ) : null}

          {data ? (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.25fr_0.95fr]">
                <section className={panelClassName}>
                  <div className="px-5 pt-4 pb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="h-5 w-[3px] rounded-full" style={{ backgroundColor: dashboardTheme.accentBars.income }} aria-hidden="true" />
                      <h3 className="text-[14px] leading-none font-semibold" style={{ color: dashboardTheme.text }}>
                        Datos del cliente
                      </h3>
                    </div>
                  </div>
                  <div className="px-5 pb-5">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <InfoBlock title="Contacto">
                        <InfoLine label="Persona" value={data.customer.personaContacto} />
                        <InfoLine label="Teléfono" value={data.customer.telefono} />
                        <InfoLine label="Email" value={data.customer.email} />
                      </InfoBlock>

                      <InfoBlock title="Dirección fiscal">
                        <InfoLine label="Dirección" value={data.customer.direccion} />
                        <InfoLine label="Código postal" value={data.customer.cp} />
                        <InfoLine label="Población" value={data.customer.poblacion} />
                        <InfoLine label="Provincia" value={data.customer.provincia} />
                        <InfoLine label="País" value={data.customer.pais} />
                      </InfoBlock>
                    </div>
                  </div>
                </section>

                <section className={panelClassName}>
                  <div className="px-5 pt-4 pb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="h-5 w-[3px] rounded-full" style={{ backgroundColor: dashboardTheme.accentBars.transactions }} aria-hidden="true" />
                      <h3 className="text-[14px] leading-none font-semibold" style={{ color: dashboardTheme.text }}>
                        Resumen operativo
                      </h3>
                    </div>
                  </div>
                  <div className="px-5 pb-5">
                    <div className="grid grid-cols-2 gap-3">
                      <StatCard label="Pagadas" value={data.metrics.paidInvoices} />
                      <StatCard label="Pendientes" value={data.metrics.pendingInvoices} />
                      <StatCard label="Facturadas" value={data.metrics.billedDeliveryNotes} />
                      <StatCard label="Pendientes" value={data.metrics.pendingDeliveryNotes} />
                      <StatCard label="Órdenes abiertas" value={data.metrics.openWorkOrders} />
                      <StatCard label="Órdenes cerradas" value={data.metrics.closedWorkOrders} />
                    </div>
                  </div>
                </section>
              </div>

              <section className={panelClassName}>
                <div className="px-5 pt-4 pb-3">
                  <SectionTitle title="Direcciones de entrega" subtitle={`${data.deliveryAddresses.length} direcciones vinculadas`} />
                </div>
                <div className="px-5 pb-5">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {data.deliveryAddresses.length > 0 ? (
                      data.deliveryAddresses.map(address => (
                        <div
                          key={address.id ?? `${address.nombreAlias}-${address.direccion}`}
                          className="rounded-[16px] border px-4 py-4"
                          style={{ borderColor: dashboardTheme.border, backgroundColor: dashboardTheme.surfaceSoft }}
                        >
                          <div className="text-[11px] font-black uppercase tracking-[0.14em]" style={{ color: dashboardTheme.text }}>
                            {address.nombreAlias || 'Dirección'}
                          </div>
                          <div className="mt-2 text-[11px] font-medium leading-5" style={{ color: dashboardTheme.muted }}>
                            {[address.direccion, address.cp, address.poblacion, address.provincia].filter(Boolean).join(' · ') || '—'}
                          </div>
                          <div className="mt-1 text-[11px]" style={{ color: dashboardTheme.muted }}>
                            {address.contacto || 'Sin contacto'} {address.telefono ? `· ${address.telefono}` : ''}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm font-medium" style={{ color: dashboardTheme.muted }}>
                        Sin direcciones de entrega registradas.
                      </div>
                    )}
                  </div>
                </div>
              </section>

              <section className={panelClassName}>
                <div className="px-5 pt-4 pb-3">
                  <SectionTitle title="Documentos asociados" subtitle="Presupuestos, pedidos, albaranes, facturas y abonos" />
                </div>
                <div className="px-5 pb-5">
                  <div className="space-y-3">
                    {data.documents.length > 0 ? (
                      data.documents.slice(0, 12).map(document => (
                        <DocumentRow
                          key={`${document.source}:${document.id}:${document.number}:${document.createdAt}`}
                          document={document}
                          onClick={setSelectedDocument}
                        />
                      ))
                    ) : (
                      <div className="text-sm font-medium" style={{ color: dashboardTheme.muted }}>
                        No hay documentos vinculados con este cliente.
                      </div>
                    )}
                  </div>
                </div>
              </section>

              <section className={panelClassName}>
                <div className="px-5 pt-4 pb-3">
                  <SectionTitle title="Órdenes de trabajo" subtitle="Solicitudes y estado operativo del flujo" />
                </div>
                <div className="px-5 pb-5">
                  <div className="space-y-3">
                    {data.workOrders.length > 0 ? (
                      data.workOrders.slice(0, 10).map(workOrder => <WorkOrderRow key={workOrder.id} workOrder={workOrder} />)
                    ) : (
                      <div className="text-sm font-medium" style={{ color: dashboardTheme.muted }}>
                        No hay órdenes de trabajo asociadas a este cliente.
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </div>
          ) : null}
        </div>
      </div>
      <Customer360DocumentModal
        open={Boolean(selectedDocument)}
        document={selectedDocument}
        onClose={() => setSelectedDocument(null)}
      />
    </AppDialog>
  );
};
