import type { RegistrationResponse } from './models';

type CustomerOnboardingConfirmationProps = {
  registrationResponse: RegistrationResponse;
  submitting: boolean;
  onRequestQuote: () => void;
  onManageOrder: () => void;
  onRefreshStatus: () => void;
  onRestart: () => void;
};

export const CustomerOnboardingConfirmation = ({
  registrationResponse,
  submitting,
  onRequestQuote,
  onManageOrder,
  onRefreshStatus,
  onRestart,
}: CustomerOnboardingConfirmationProps) => (
  <>
    {registrationResponse.status === 'APROBADO' && (
      <div className="rounded-2xl p-6" style={{ background: '#ffffff', border: '1px solid #e8eaed' }}>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-sm font-black uppercase" style={{ color: '#0d1117' }}>Registro confirmado</h2>
            <p className="text-xs" style={{ color: '#9ca3af' }}>Cliente: {registrationResponse.nombreComercial}</p>
          </div>
          <div className="flex gap-2">
            <button className="btn-primary" onClick={onRequestQuote}>Pedir presupuesto</button>
            <button className="btn-ghost" onClick={onManageOrder}>Gestionar pedido</button>
          </div>
        </div>
      </div>
    )}

    {registrationResponse.status === 'PENDIENTE' && (
      <div className="rounded-2xl p-6" style={{ background: '#ffffff', border: '1px solid #e8eaed' }}>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-sm font-black uppercase" style={{ color: '#0d1117' }}>Solicitud enviada</h2>
            <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>
              Estamos validando tu inscripción. Te avisaremos cuando esté aprobada.
            </p>
          </div>
          <div className="flex gap-2">
            <button className="btn-primary" onClick={onRefreshStatus} disabled={submitting}>
              {submitting ? 'Consultando...' : 'Revisar estado'}
            </button>
          </div>
        </div>
      </div>
    )}

    {registrationResponse.status === 'RECHAZADO' && (
      <div className="rounded-2xl p-6" style={{ background: '#ffffff', border: '1px solid #e8eaed' }}>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-sm font-black uppercase" style={{ color: '#0d1117' }}>Inscripción rechazada</h2>
            <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>
              Contacta con nuestro equipo para revisar la solicitud.
            </p>
          </div>
          <div className="flex gap-2">
            <button className="btn-ghost" onClick={onRestart}>Enviar nueva solicitud</button>
          </div>
        </div>
      </div>
    )}
  </>
);
