import { documentManagementTheme } from '../documentManagementTheme';

type Props = {
  isEditing: boolean;
  isSaving: boolean;
  saveError: string;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
};

export const ManualDocumentDrawerFooter = ({
  isEditing,
  isSaving,
  saveError,
  onEdit,
  onCancelEdit,
  onSave,
  onCancel,
}: Props) => (
  <div
    className="px-3 py-1 border-t flex items-center justify-between shrink-0 z-30 relative h-12"
    style={{
      background: documentManagementTheme.panelSoftBg,
      borderTop: `1px solid ${documentManagementTheme.border}`,
    }}
  >
    <div className="text-[11px] font-semibold" style={{ color: documentManagementTheme.muted }}>
      {saveError || 'Documento manual editable'}
    </div>

    <div className="flex gap-2 items-center">
      {!isEditing ? (
        <button
          type="button"
          onClick={onEdit}
          disabled={isSaving}
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
        <>
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="text-white px-4 py-1.5 rounded-md transition flex items-center gap-2 border shadow-sm text-xs font-bold h-9 disabled:opacity-50"
            style={{ background: documentManagementTheme.accent, borderColor: documentManagementTheme.accent }}
          >
            {isSaving ? 'Guardando…' : 'Guardar'}
          </button>
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
        </>
      )}

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
        Cerrar
      </button>
    </div>
  </div>
);
