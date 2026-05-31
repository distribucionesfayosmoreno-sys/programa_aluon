import type { RegistrationRequest } from './models';

type CustomerOnboardingRegistrationProps = {
  registration: RegistrationRequest;
  onChange: (field: keyof RegistrationRequest, value: string) => void;
  onSubmit: () => void;
  submitting: boolean;
};

export const CustomerOnboardingRegistration = ({
  registration,
  onChange,
  onSubmit,
  submitting,
}: CustomerOnboardingRegistrationProps) => (
  <div className="grid gap-6">
    <div className="rounded-2xl p-6" style={{ background: '#ffffff', border: '1px solid #e8eaed' }}>
      <h2 className="text-sm font-black uppercase" style={{ color: '#0d1117' }}>Datos de empresa</h2>
      <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>Completa la información para activar tu acceso.</p>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="col-span-2">
          <label className="field-label">Nombre comercial</label>
          <input
            className="field"
            value={registration.nombreComercial}
            onChange={e => onChange('nombreComercial', e.target.value)}
            placeholder="ALUON Distribuciones"
          />
        </div>
        <div className="col-span-2">
          <label className="field-label">Razón social</label>
          <input
            className="field"
            value={registration.razonSocial ?? ''}
            onChange={e => onChange('razonSocial', e.target.value)}
            placeholder="ALUON Distribuciones SL"
          />
        </div>
        <div>
          <label className="field-label">Persona de contacto</label>
          <input
            className="field"
            value={registration.personaContacto ?? ''}
            onChange={e => onChange('personaContacto', e.target.value)}
            placeholder="María Rojas"
          />
        </div>
        <div>
          <label className="field-label">Teléfono WhatsApp</label>
          <input
            className="field"
            value={registration.telefonoWhatsapp}
            onChange={e => onChange('telefonoWhatsapp', e.target.value)}
            placeholder="+34 600 123 456"
          />
        </div>
        <div>
          <label className="field-label">Email de ofertas</label>
          <input
            className="field"
            value={registration.email}
            onChange={e => onChange('email', e.target.value)}
            placeholder="compras@cliente.com"
          />
        </div>
        <div>
          <label className="field-label">Dirección</label>
          <input
            className="field"
            value={registration.direccion ?? ''}
            onChange={e => onChange('direccion', e.target.value)}
            placeholder="Calle Mayor 24"
          />
        </div>
        <div>
          <label className="field-label">CP</label>
          <input
            className="field"
            value={registration.cp ?? ''}
            onChange={e => onChange('cp', e.target.value)}
            placeholder="28001"
          />
        </div>
        <div>
          <label className="field-label">Población</label>
          <input
            className="field"
            value={registration.poblacion ?? ''}
            onChange={e => onChange('poblacion', e.target.value)}
            placeholder="Madrid"
          />
        </div>
        <div>
          <label className="field-label">Provincia</label>
          <input
            className="field"
            value={registration.provincia ?? ''}
            onChange={e => onChange('provincia', e.target.value)}
            placeholder="Madrid"
          />
        </div>
        <div>
          <label className="field-label">País</label>
          <input
            className="field"
            value={registration.pais ?? ''}
            onChange={e => onChange('pais', e.target.value)}
            placeholder="España"
          />
        </div>
      </div>

      <div className="mt-6">
        <button className="btn-primary" onClick={onSubmit} disabled={submitting}>
          {submitting ? 'Registrando...' : 'Confirmar registro'}
        </button>
      </div>
    </div>

  </div>
);
