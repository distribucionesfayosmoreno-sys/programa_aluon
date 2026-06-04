import { documentManagementTheme } from '../documentManagementTheme';

type FooterDocType = 'PEDIDO' | 'ALBARAN' | 'FACTURA';

type Props = {
  isConverting: boolean;
  isEditing: boolean;
  isSaving: boolean;
  saveError: string;
  primaryEmitTarget: FooterDocType | null;
  canEmit: (tipo: FooterDocType) => boolean;
  onEmitOpen: (tipo: FooterDocType) => void;
  onCancel: () => void;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSave: () => void;
  onPreview: () => void;
  relatedCodesByTipo: Map<FooterDocType, string>;
  onNavigateRelated: (tipo: FooterDocType) => void;
};

const typeColors: Record<FooterDocType, string> = {
  PEDIDO: 'bg-amber-50 text-amber-700 border-amber-200 hover:border-amber-400 hover:bg-amber-100',
  ALBARAN: 'bg-violet-50 text-violet-700 border-violet-200 hover:border-violet-400 hover:bg-violet-100',
  FACTURA: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-100',
};

const labelColors: Record<FooterDocType, string> = {
  PEDIDO: 'text-orange-400',
  ALBARAN: 'text-purple-400',
  FACTURA: 'text-emerald-400',
};

export const DocumentDrawerFooter = ({
  isConverting,
  isEditing,
  isSaving,
  saveError,
  primaryEmitTarget,
  canEmit,
  onEmitOpen,
  onCancel,
  onEdit,
  onCancelEdit,
  onSave,
  onPreview,
  relatedCodesByTipo,
  onNavigateRelated,
}: Props) => (
  <div
    className="px-3 py-1 border-t flex gap-2 items-center justify-between shrink-0 z-30 relative h-12"
    style={{
      background: documentManagementTheme.panelSoftBg,
      borderTop: `1px solid ${documentManagementTheme.border}`,
    }}
  >
    <div className="flex gap-2 items-center flex-1 min-w-0 overflow-hidden">
      {relatedCodesByTipo.size > 0 ? (
        <div
          className="flex gap-2 px-2 py-1 rounded-md border overflow-x-auto max-w-full"
          style={{
            background: documentManagementTheme.panelBg,
            borderColor: documentManagementTheme.border,
            boxShadow: documentManagementTheme.shadowSoft,
          }}
        >
          {(Array.from(relatedCodesByTipo.keys()) as FooterDocType[]).map((tipo) => {
            const code = relatedCodesByTipo.get(tipo);
            if (!code) return null;
            return (
              <button
                key={tipo}
                type="button"
                className={`text-[10px] font-black px-3 py-1 rounded-md border flex items-center gap-2 transition-all shrink-0 ${typeColors[tipo]}`}
                onClick={() => onNavigateRelated(tipo)}
                title={`Ver ${tipo}: ${code}`}
              >
                <span className={`uppercase tracking-wide ${labelColors[tipo]}`}>{tipo}</span>
                <span className="font-bold">{code}</span>
                <span className="text-[10px] opacity-40">⌊</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>

    <div className="flex gap-2 items-center pr-2">
      {saveError ? (
        <div
          className="text-[11px] font-bold px-2 py-1 rounded-md border shrink-0"
          style={{ borderColor: '#fecaca', background: '#fff1f2', color: '#9f1239' }}
          title={saveError}
        >
          Error al guardar
        </div>
      ) : null}

      <button
        type="button"
        onClick={onPreview}
        disabled={isConverting || isSaving}
        className="text-gray-700 px-4 py-1.5 rounded-md transition border text-xs font-bold flex items-center gap-1.5 h-9 disabled:opacity-50"
        style={{
          background: documentManagementTheme.panelBg,
          borderColor: documentManagementTheme.border,
          color: documentManagementTheme.text,
          boxShadow: documentManagementTheme.shadowSoft,
        }}
      >
        <span className="text-gray-400 opacity-70">📄</span> Previsualizar
      </button>

      {!isEditing ? (
        <button
          type="button"
          onClick={onEdit}
          disabled={isConverting || isSaving}
          className="px-4 py-1.5 rounded-md transition border text-xs font-bold h-9 disabled:opacity-50"
          style={{
            background: documentManagementTheme.panelBg,
            borderColor: documentManagementTheme.border,
            color: documentManagementTheme.text,
            boxShadow: documentManagementTheme.shadowSoft,
          }}
        >
          Editar
        </button>
      ) : (
        <button
          type="button"
          onClick={onSave}
          disabled={isConverting || isSaving}
          className="text-white px-4 py-1.5 rounded-md transition flex items-center gap-2 border shadow-sm text-xs font-bold h-9 disabled:opacity-50"
          style={{ background: documentManagementTheme.accent, borderColor: '#db2777' }}
          title="Guardar cambios"
        >
          <span className="opacity-90">💾</span> Guardar
        </button>
      )}

      {primaryEmitTarget && !isEditing ? (
        <button
          type="button"
          onClick={() => onEmitOpen(primaryEmitTarget)}
          disabled={isConverting || isSaving || !canEmit(primaryEmitTarget)}
          className="text-white px-4 py-1.5 rounded-md transition flex items-center gap-2 border shadow-sm text-xs font-bold h-9 disabled:opacity-50"
          style={{ background: documentManagementTheme.accent, borderColor: '#db2777' }}
          title={
            !canEmit(primaryEmitTarget)
              ? (primaryEmitTarget === 'ALBARAN' ? 'Primero emite el Pedido' : 'Primero emite el Albarán')
              : (primaryEmitTarget === 'ALBARAN' ? 'Emitir y abrir Albarán' : 'Emitir y abrir Factura')
          }
        >
          <span className="opacity-90">💾</span>
          {primaryEmitTarget === 'ALBARAN' ? 'Albaranar' : 'Facturar'}
        </button>
      ) : null}

      {isEditing ? (
        <button
          type="button"
          onClick={onCancelEdit}
          disabled={isSaving}
          className="px-4 py-1.5 rounded-md transition border text-xs font-bold h-9 disabled:opacity-50"
          style={{
            background: documentManagementTheme.panelBg,
            borderColor: documentManagementTheme.border,
            color: documentManagementTheme.text,
            boxShadow: documentManagementTheme.shadowSoft,
          }}
        >
          Cancelar edición
        </button>
      ) : null}

      <button
        type="button"
        onClick={onCancel}
        disabled={isSaving}
        className="px-4 py-1.5 rounded-md text-xs font-bold border transition-colors h-9 disabled:opacity-50"
        style={{
          background: documentManagementTheme.panelBg,
          color: documentManagementTheme.text,
          borderColor: documentManagementTheme.border,
          boxShadow: documentManagementTheme.shadowSoft,
        }}
      >
        Cancelar
      </button>
    </div>
  </div>
);
