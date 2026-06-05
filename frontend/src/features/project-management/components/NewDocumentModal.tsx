import { documentManagementTheme } from '../documentManagementTheme';
import { useNewDocumentModal } from './useNewDocumentModal';
import type { NewDocumentModalProps } from './NewDocumentModal.types';
import AppDialog from '../../../components/feedback/AppDialog';

const DOC_TYPES = ['PEDIDO', 'ALBARAN', 'FACTURA', 'ABONO'] as const;

export const NewDocumentModal = ({
  open,
  onClose,
  onCreate,
  onCreated,
}: NewDocumentModalProps) => {
  const vm = useNewDocumentModal({
    open,
    onCreate,
    onCreated,
  });

  if (!open) {
    return null;
  }

  return (
    <AppDialog
      open={open}
      title="Nuevo documento"
      subtitle="Alta manual de pedido, albarán, factura o abono sin heredar datos."
      onClose={onClose}
      maxWidthClassName="max-w-3xl"
    >
      <div className="grid gap-5 md:grid-cols-[1.2fr,0.8fr]">
        <section
          className="rounded-[22px] border p-5"
          style={{ borderColor: documentManagementTheme.border, background: documentManagementTheme.panelSoftBg }}
        >
          <div className="text-[11px] font-black uppercase tracking-[0.18em]" style={{ color: documentManagementTheme.muted }}>
            Datos del documento
          </div>

          <label className="mb-2 mt-5 block text-xs font-bold" style={{ color: documentManagementTheme.muted }}>
            Cliente
          </label>
          <input
            list="document-customer-suggestions"
            value={vm.state.customerName}
            onChange={(event) => vm.actions.setCustomerName(event.target.value)}
            placeholder="Empieza a escribir el nombre comercial"
            className="w-full rounded-2xl border px-4 py-3 text-sm outline-none"
            style={{
              borderColor: documentManagementTheme.border,
              background: documentManagementTheme.panelBg,
              color: documentManagementTheme.text,
            }}
          />
          <datalist id="document-customer-suggestions">
            {vm.state.customerSuggestions.map((customer) => (
              <option key={customer.id} value={customer.nombreComercial} />
            ))}
          </datalist>
          <div className="mt-2 flex items-center justify-between gap-3 text-[11px] font-semibold" style={{ color: documentManagementTheme.muted }}>
            <span>
              {vm.state.customerSearchLoading
                ? 'Buscando coincidencias...'
                : vm.state.customerSearchError
                  ? vm.state.customerSearchError
                  : vm.state.customerName.trim()
                    ? `${vm.state.customerSuggestions.length} coincidencias`
                    : 'Escribe para buscar clientes'}
            </span>
          </div>
          <div className="mt-5 rounded-2xl border px-4 py-3 text-xs font-semibold" style={{ borderColor: documentManagementTheme.border, color: documentManagementTheme.muted }}>
            El número de documento se generará automáticamente al guardar.
          </div>
        </section>

        <section
          className="rounded-[22px] border p-5"
          style={{ borderColor: documentManagementTheme.border, background: documentManagementTheme.panelSoftBg }}
        >
          <div className="text-[11px] font-black uppercase tracking-[0.18em]" style={{ color: documentManagementTheme.muted }}>
            Configuración
          </div>

          <label className="mb-2 mt-5 block text-xs font-bold" style={{ color: documentManagementTheme.muted }}>
            Tipo
          </label>
          <select
            value={vm.state.selectedType}
            onChange={(event) => vm.actions.setSelectedType(event.target.value as typeof vm.state.selectedType)}
            disabled={vm.state.submitting}
            className="w-full rounded-2xl border px-4 py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              borderColor: documentManagementTheme.border,
              background: documentManagementTheme.panelBg,
              color: documentManagementTheme.text,
            }}
          >
            <option value="">Selecciona un tipo</option>
            {DOC_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <div className="mt-5 rounded-2xl border px-4 py-4" style={{ borderColor: documentManagementTheme.border }}>
            <div className="text-xs font-bold" style={{ color: documentManagementTheme.muted }}>
              Resumen
            </div>
            <div className="mt-2 text-sm font-black" style={{ color: documentManagementTheme.text }}>
              {vm.state.selectedType || 'Tipo pendiente'}
            </div>
            <div className="mt-1 text-xs" style={{ color: documentManagementTheme.muted }}>
              {vm.state.customerName.trim() || 'Cliente pendiente'} · Número automático
            </div>
          </div>

          {vm.state.error ? (
            <div
              className="mt-5 rounded-2xl border px-4 py-3 text-sm"
              style={{ borderColor: '#bfdbfe', background: '#eff6ff', color: '#1d4ed8' }}
            >
              {vm.state.error}
            </div>
          ) : null}

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              className="rounded-2xl border px-4 py-3 text-sm font-bold"
              style={{
                borderColor: documentManagementTheme.border,
                background: documentManagementTheme.panelBg,
                color: documentManagementTheme.text,
              }}
              onClick={onClose}
              disabled={vm.state.submitting}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="rounded-2xl px-4 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-60"
              style={{ background: '#2563eb' }}
              onClick={() => void vm.actions.submit()}
              disabled={!vm.canSubmit}
            >
              {vm.state.submitting ? 'Guardando…' : 'Crear documento'}
            </button>
          </div>
        </section>
      </div>
    </AppDialog>
  );
};
