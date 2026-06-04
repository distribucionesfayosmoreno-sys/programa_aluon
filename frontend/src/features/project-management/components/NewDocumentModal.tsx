import { documentManagementTheme } from '../documentManagementTheme';
import { useNewDocumentModal } from './useNewDocumentModal';
import type { NewDocumentModalProps } from './NewDocumentModal.types';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Cerrar modal"
        className="absolute inset-0 bg-slate-950/45"
        onClick={onClose}
      />

      <div
        className="relative z-10 w-full max-w-3xl overflow-hidden rounded-[28px] border"
        style={{
          borderColor: documentManagementTheme.border,
          background: documentManagementTheme.panelBg,
          boxShadow: documentManagementTheme.shadow,
        }}
      >
        <div
          className="flex items-center justify-between border-b px-6 py-5"
          style={{ borderColor: documentManagementTheme.border, background: documentManagementTheme.panelSoftBg }}
        >
          <div>
            <h2 className="text-lg font-black" style={{ color: documentManagementTheme.text }}>
              Nuevo documento
            </h2>
            <p className="mt-1 text-sm" style={{ color: documentManagementTheme.muted }}>
              Alta manual de pedido, albarán, factura o abono sin heredar datos de otro documento.
            </p>
          </div>

          <button
            type="button"
            className="rounded-xl border px-3 py-2 text-sm font-bold"
            style={{
              borderColor: documentManagementTheme.border,
              background: documentManagementTheme.panelBg,
              color: documentManagementTheme.text,
            }}
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>

        <div className="grid gap-5 px-6 py-5 md:grid-cols-[1.2fr,0.8fr]">
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
              value={vm.state.customerName}
              onChange={(event) => vm.actions.setCustomerName(event.target.value)}
              placeholder="Nombre del cliente"
              className="w-full rounded-2xl border px-4 py-3 text-sm outline-none"
              style={{
                borderColor: documentManagementTheme.border,
                background: documentManagementTheme.panelBg,
                color: documentManagementTheme.text,
              }}
            />

            <label className="mb-2 mt-5 block text-xs font-bold" style={{ color: documentManagementTheme.muted }}>
              Número de documento
            </label>
            <input
              value={vm.state.number}
              onChange={(event) => vm.actions.setNumber(event.target.value)}
              placeholder="Ej. FA-2026-0001"
              className="w-full rounded-2xl border px-4 py-3 text-sm outline-none"
              style={{
                borderColor: documentManagementTheme.border,
                background: documentManagementTheme.panelBg,
                color: documentManagementTheme.text,
              }}
            />
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
                {vm.state.customerName.trim() || 'Cliente pendiente'} · {vm.state.number.trim() || 'Número pendiente'}
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
      </div>
    </div>
  );
};
