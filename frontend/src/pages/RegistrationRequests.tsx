import { useEffect, useState } from 'react';

type RegistrationStatus = 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';

type RegistrationRequest = {
  id: string;
  nombreComercial: string;
  razonSocial?: string | null;
  personaContacto?: string | null;
  email: string;
  telefonoWhatsapp: string;
  direccion?: string | null;
  cp?: string | null;
  poblacion?: string | null;
  provincia?: string | null;
  pais?: string | null;
  status: RegistrationStatus;
  tariffCode?: string | null;
  autoApproveQuotes: boolean;
  createdAt: string;
};

type TariffOption = {
  code: string;
  label: string;
};

const RegistrationRequests = () => {
  const [requests, setRequests] = useState<RegistrationRequest[]>([]);
  const [tariffs, setTariffs] = useState<TariffOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [requestsRes, tariffsRes] = await Promise.all([
        fetch('/api/registrations/pending'),
        fetch('/api/tariffs'),
      ]);
      if (!requestsRes.ok) throw new Error('Error al cargar inscripciones');
      if (!tariffsRes.ok) throw new Error('Error al cargar tarifas');
      const [requestsData, tariffsData] = await Promise.all([
        requestsRes.json(),
        tariffsRes.json(),
      ]);
      setRequests(Array.isArray(requestsData) ? requestsData : []);
      setTariffs(Array.isArray(tariffsData) ? tariffsData : []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar datos';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateRequest = (id: string, patch: Partial<RegistrationRequest>) => {
    setRequests(prev => prev.map(req => req.id === id ? { ...req, ...patch } : req));
  };

  const approve = async (id: string) => {
    const req = requests.find(r => r.id === id);
    if (!req) return;
    setApprovingId(id);
    setError('');
    try {
      const response = await fetch(`/api/registrations/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tariffCode: req.tariffCode,
          autoApproveQuotes: req.autoApproveQuotes,
        }),
      });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'Error al aprobar');
      }
      setRequests(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al aprobar';
      setError(message);
    } finally {
      setApprovingId(null);
    }
  };

  const reject = async (id: string) => {
    setApprovingId(id);
    setError('');
    try {
      const response = await fetch(`/api/registrations/${id}/reject`, { method: 'POST' });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'Error al rechazar');
      }
      setRequests(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al rechazar';
      setError(message);
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 128px)', minHeight: 400 }}>
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-1 h-5 rounded-full bg-brand" />
            <h1 className="text-xl font-black uppercase tracking-tight" style={{ color: '#0d1117' }}>
              Inscripciones de Clientes
            </h1>
          </div>
          <p className="text-xs font-semibold uppercase tracking-wide ml-3.5 mt-0.5" style={{ color: '#9ca3af' }}>
            CRM · Validación
          </p>
        </div>
        <button className="btn-ghost" onClick={fetchData}>Actualizar</button>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl text-xs font-bold" style={{ background: '#fff7ed', color: '#c2410c', border: '1px solid #fed7aa' }}>
          {error}
        </div>
      )}

      <div
        className="flex-1 rounded-2xl overflow-hidden flex flex-col min-h-0"
        style={{ border: '1px solid #e5e7eb', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
      >
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse" style={{ fontSize: 12 }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
              <tr>
                <th className="px-3 py-2" style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>Cliente</th>
                <th className="px-3 py-2" style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>Contacto</th>
                <th className="px-3 py-2" style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>WhatsApp</th>
                <th className="px-3 py-2" style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>Tarifa</th>
                <th className="px-3 py-2" style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>Auto‑aprobar</th>
                <th style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb', width: 160 }} />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="px-3 py-4" colSpan={6}>Cargando...</td></tr>
              ) : requests.length === 0 ? (
                <tr><td className="px-3 py-6" colSpan={6}>No hay inscripciones pendientes.</td></tr>
              ) : requests.map(req => (
                <tr key={req.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td className="px-3 py-2.5">
                    <div className="font-semibold">{req.nombreComercial}</div>
                    <div style={{ color: '#6b7280' }}>{req.razonSocial || '—'}</div>
                  </td>
                  <td className="px-3 py-2.5" style={{ color: '#6b7280' }}>
                    <div>{req.personaContacto || '—'}</div>
                    <div>{req.email}</div>
                  </td>
                  <td className="px-3 py-2.5" style={{ color: '#6b7280' }}>{req.telefonoWhatsapp}</td>
                  <td className="px-3 py-2.5">
                    <select
                      className="field"
                      value={req.tariffCode || ''}
                      onChange={e => updateRequest(req.id, { tariffCode: e.target.value })}
                    >
                      <option value="">Selecciona tarifa</option>
                      {tariffs.map(t => (
                        <option key={t.code} value={t.code}>{t.label} ({t.code})</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2.5">
                    <label className="flex items-center gap-2 text-xs" style={{ color: '#6b7280' }}>
                      <input
                        type="checkbox"
                        checked={req.autoApproveQuotes}
                        onChange={e => updateRequest(req.id, { autoApproveQuotes: e.target.checked })}
                      />
                      Auto‑aprobar presupuestos
                    </label>
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <button
                      className="btn-primary mr-2"
                      disabled={approvingId === req.id || !req.tariffCode}
                      onClick={() => approve(req.id)}
                    >
                      Aprobar
                    </button>
                    <button
                      className="btn-ghost"
                      disabled={approvingId === req.id}
                      onClick={() => reject(req.id)}
                    >
                      Rechazar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RegistrationRequests;
