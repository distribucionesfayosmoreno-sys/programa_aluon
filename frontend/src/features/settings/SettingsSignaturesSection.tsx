import type { ChangeEvent, FormEvent } from 'react';
import type { EmailSignature, EmailSignatureForm } from './models';

type SettingsSignaturesSectionProps = {
  form: EmailSignatureForm;
  signatures: EmailSignature[];
  loading: boolean;
  statusMessage: string | null;
  previewHtml: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onInputChange: (field: keyof EmailSignatureForm) => (event: ChangeEvent<HTMLInputElement>) => void;
  onCopyHtml: () => void;
  onUseSignature: (signature: EmailSignature) => void;
};

export const SettingsSignaturesSection = ({
  form,
  signatures,
  loading,
  statusMessage,
  previewHtml,
  onSubmit,
  onInputChange,
  onCopyHtml,
  onUseSignature,
}: SettingsSignaturesSectionProps) => (
  <>
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h2 className="text-lg font-black uppercase" style={{ color: '#0d1117' }}>
          Generador de firmas
        </h2>
        <p className="text-xs mt-2" style={{ color: '#9ca3af' }}>
          Crea firmas HTML con el logo de Aluon y pégalas en tu cliente de correo.
        </p>
      </div>
      <button className="btn-ghost" type="button" onClick={onCopyHtml}>
        Copiar HTML
      </button>
    </div>

    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="field-label">Nombre completo *</label>
        <input
          className="field"
          value={form.fullName}
          onChange={onInputChange('fullName')}
          required
        />
      </div>
      <div>
        <label className="field-label">Cargo / puesto</label>
        <input className="field" value={form.role} onChange={onInputChange('role')} />
      </div>
      <div>
        <label className="field-label">Email *</label>
        <input
          className="field"
          type="email"
          value={form.email}
          onChange={onInputChange('email')}
          required
        />
      </div>
      <div>
        <label className="field-label">Teléfono</label>
        <input className="field" value={form.phone} onChange={onInputChange('phone')} />
      </div>
      <div>
        <label className="field-label">Web</label>
        <input className="field" value={form.website} onChange={onInputChange('website')} />
      </div>
      <div>
        <label className="field-label">Dirección</label>
        <input className="field" value={form.address} onChange={onInputChange('address')} />
      </div>
      <div>
        <label className="field-label">URL Logo (opcional)</label>
        <input className="field" value={form.logoUrl} onChange={onInputChange('logoUrl')} />
      </div>
      <div>
        <label className="field-label">Color acento</label>
        <input className="field" value={form.accentColor} onChange={onInputChange('accentColor')} />
      </div>
      <div className="md:col-span-2 flex items-center gap-3">
        <button className="btn-primary" type="submit">
          Generar firma
        </button>
        {statusMessage && (
          <span className="text-xs font-semibold" style={{ color: '#6b7280' }}>
            {statusMessage}
          </span>
        )}
      </div>
    </form>

    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
      <div>
        <div className="text-xs font-bold uppercase tracking-widest" style={{ color: '#9ca3af' }}>
          Firmas guardadas
        </div>
        <div className="mt-3 rounded-xl overflow-hidden" style={{ border: '1px solid #e5e7eb' }}>
          <div className="max-h-64 overflow-auto">
            <table className="w-full text-left" style={{ fontSize: 12 }}>
              <thead style={{ position: 'sticky', top: 0, zIndex: 5 }}>
                <tr style={{ background: '#f9fafb' }}>
                  <th className="px-3 py-2" style={{ borderBottom: '1px solid #e5e7eb' }}>Nombre</th>
                  <th className="px-3 py-2" style={{ borderBottom: '1px solid #e5e7eb' }}>Email</th>
                  <th style={{ borderBottom: '1px solid #e5e7eb', width: 90 }} />
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td className="px-3 py-4" colSpan={3}>Cargando...</td></tr>
                ) : signatures.length === 0 ? (
                  <tr><td className="px-3 py-4" colSpan={3}>Sin firmas aún.</td></tr>
                ) : signatures.map(signature => (
                  <tr key={signature.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td className="px-3 py-2.5">
                      <div className="font-semibold">{signature.fullName}</div>
                      <div className="text-[10px] uppercase tracking-widest" style={{ color: '#9ca3af' }}>
                        {signature.role || 'Sin cargo'}
                      </div>
                    </td>
                    <td className="px-3 py-2.5" style={{ color: '#6b7280' }}>
                      {signature.email}
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <button
                        className="btn-ghost"
                        type="button"
                        onClick={() => onUseSignature(signature)}
                      >
                        Usar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div>
        <div className="text-xs font-bold uppercase tracking-widest" style={{ color: '#9ca3af' }}>
          Previsualización
        </div>
        <div
          className="mt-3 rounded-xl p-4"
          style={{ border: '1px solid #e5e7eb', background: '#f9fafb', minHeight: 180 }}
        >
          {previewHtml ? (
            <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
          ) : (
            <p className="text-xs" style={{ color: '#9ca3af' }}>
              Genera o selecciona una firma para verla aquí.
            </p>
          )}
        </div>
      </div>
    </div>
  </>
);
