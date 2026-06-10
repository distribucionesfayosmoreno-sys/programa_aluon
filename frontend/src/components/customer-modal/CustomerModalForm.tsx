import React from 'react';
import { AccordionSection } from './AccordionSection';
import { FL, FI, FS, ValidationHint, SectionTitle } from './CustomerModalComponents';
import type { Customer, DeliveryAddress } from '../../hooks/useCustomers';
import type { CustomerTariffOption } from './customerTariffOptions';
import {
  emailPatternHint,
  ibanPatternHint,
  normalizeDocumentNumber,
  normalizeIban,
  normalizePostalCodeEs,
  phonePatternHint,
} from './customerModalValidators';
import { CUSTOMER_PAYMENT_METHODS, isCustomerPaymentMethod } from './customerPaymentMethods';

type Props = {
  form: Customer;
  setForm: React.Dispatch<React.SetStateAction<Customer>>;
  newAddr: DeliveryAddress;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleAddrField: (field: keyof DeliveryAddress, value: string) => void;
  addAddr: () => void;
  removeAddr: (idx: number) => void;
  showDocError: boolean;
  showDocOk: boolean;
  docHint: string;
  showPhoneError: boolean;
  showPhoneOk: boolean;
  showEmailError: boolean;
  showEmailOk: boolean;
  showIbanError: boolean;
  showIbanOk: boolean;
  showPaymentError: boolean;
  showPaymentOk: boolean;
  paymentHint: string;
  submitError: string;
  tariffOptions: CustomerTariffOption[];
  onSubmit: (e: React.FormEvent) => void;
};

export const CustomerModalForm = ({
  form,
  setForm,
  newAddr,
  handleChange,
  handleAddrField,
  addAddr,
  removeAddr,
  showDocError,
  showDocOk,
  docHint,
  showPhoneError,
  showPhoneOk,
  showEmailError,
  showEmailOk,
  showIbanError,
  showIbanOk,
  showPaymentError,
  showPaymentOk,
  paymentHint,
  submitError,
  tariffOptions,
  onSubmit,
}: Props) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const paymentValue = isCustomerPaymentMethod(form.formaPago) ? form.formaPago : '';

  return (
    <form id="customer-modal-form" onSubmit={onSubmit} className="space-y-4">
      {submitError ? (
        <div
          className="p-4 rounded-2xl border flex items-start gap-3"
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.06)',
            borderColor: 'rgba(239, 68, 68, 0.22)',
            color: '#ef4444',
          }}
        >
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div className="text-[10px]">
            <div className="font-extrabold uppercase tracking-wider mb-1">Error al guardar</div>
            <div className="font-semibold text-gray-700 leading-relaxed">{submitError}</div>
          </div>
        </div>
      ) : null}

      <AccordionSection
        title="Empresa"
        description="Nombre comercial, razón social y documento"
        defaultOpen
      >
        <SectionTitle n="01" label="Empresa" />
        <div className="grid grid-cols-1 md:grid-cols-6 gap-x-6 gap-y-4">
          <div className="md:col-span-3">
            <FL>Nombre Comercial *</FL>
            <FI id="customer-nombre-comercial" name="nombreComercial" value={form.nombreComercial} onChange={handleChange} required />
          </div>
          <div className="md:col-span-3">
            <FL>Razón Social</FL>
            <FI name="razonSocial" value={form.razonSocial} onChange={handleChange} />
          </div>

          <div className="md:col-span-2">
            <FL>Persona de Contacto</FL>
            <FI name="personaContacto" value={form.personaContacto} onChange={handleChange} />
          </div>
          <div className="md:col-span-2">
            <FL>Tipo de Documento</FL>
            <select name="tipoDocumento" value={form.tipoDocumento} onChange={handleChange} className="field">
              <option value="">Selecciona…</option>
              {['CIF', 'DNI', 'NIE', 'PASAPORTE'].map(v => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <FL>Número de Documento *</FL>
            <div className="relative">
              <FI
                id="customer-numero-documento"
                name="numeroDocumento"
                value={form.numeroDocumento}
                onChange={e => setForm(p => ({ ...p, numeroDocumento: normalizeDocumentNumber(e.target.value) }))}
                style={{
                  outline: 'none',
                  borderColor: showDocOk ? 'var(--success, #16a34a)' : showDocError ? 'var(--danger, #ef4444)' : '#e5e7eb',
                  boxShadow: showDocOk
                    ? '0 0 0 3px rgba(22,163,74,0.12)'
                    : showDocError
                      ? '0 0 0 3px rgba(239,68,68,0.12)'
                      : undefined,
                  paddingRight: 36,
                }}
                aria-invalid={showDocError}
              />
              {showDocOk ? (
                <div className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--success, #16a34a)' }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : null}
            </div>
            <ValidationHint status={showDocError ? 'error' : showDocOk ? 'ok' : 'neutral'} hint={docHint} />
          </div>

          <div className="md:col-span-2">
            <FL>Teléfono</FL>
            <FI
              id="customer-telefono"
              name="telefono"
              inputMode="tel"
              value={form.telefono}
              onChange={e => setForm(p => ({ ...p, telefono: e.target.value }))}
              style={{
                outline: 'none',
                borderColor: showPhoneOk ? 'var(--success, #16a34a)' : showPhoneError ? 'var(--danger, #ef4444)' : '#e5e7eb',
                boxShadow: showPhoneOk
                  ? '0 0 0 3px rgba(22,163,74,0.12)'
                  : showPhoneError
                    ? '0 0 0 3px rgba(239,68,68,0.12)'
                    : undefined,
              }}
              aria-invalid={showPhoneError}
            />
            <ValidationHint status={showPhoneError ? 'error' : showPhoneOk ? 'ok' : 'neutral'} hint={phonePatternHint} />
          </div>
          <div className="md:col-span-2">
            <FL>Email</FL>
            <FI
              id="customer-email"
              name="email"
              type="email"
              inputMode="email"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              style={{
                outline: 'none',
                borderColor: showEmailOk ? 'var(--success, #16a34a)' : showEmailError ? 'var(--danger, #ef4444)' : '#e5e7eb',
                boxShadow: showEmailOk
                  ? '0 0 0 3px rgba(22,163,74,0.12)'
                  : showEmailError
                    ? '0 0 0 3px rgba(239,68,68,0.12)'
                    : undefined,
              }}
              aria-invalid={showEmailError}
            />
            <ValidationHint status={showEmailError ? 'error' : showEmailOk ? 'ok' : 'neutral'} hint={emailPatternHint} />
          </div>
          <div className="md:col-span-2">
            <div className="flex items-center justify-between gap-3">
              <FL>Contraseña</FL>
              <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: form.hasPassword ? '#16a34a' : '#94a3b8' }}>
                {form.hasPassword ? 'Configurada' : 'Sin contraseña'}
              </span>
            </div>
            <div className="relative">
              <FI
                id="customer-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password ?? ''}
                onChange={handleChange}
                placeholder={form.hasPassword ? 'Deja vacío para mantenerla' : 'Escribe una nueva contraseña'}
                autoComplete="new-password"
                style={{ paddingRight: 84 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2.5 py-1 text-[9px] font-semibold"
                style={{ background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0' }}
              >
                {showPassword ? 'Ocultar' : 'Ver'}
              </button>
            </div>
            <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#94a3b8' }}>
              Se guarda cifrada. Si la dejas en blanco, no se modifica.
            </div>
          </div>
          <div className="md:col-span-2">
            <FL>Tarifa</FL>
            <FS name="tarifa" value={form.tarifa} onChange={handleChange}>
              {tariffOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </FS>
          </div>
        </div>
      </AccordionSection>

      <AccordionSection title="Dirección fiscal" description="Dirección, CP, población y país" defaultOpen={false}>
        <SectionTitle n="02" label="Dirección fiscal" />
        <div className="grid grid-cols-1 md:grid-cols-6 gap-x-6 gap-y-4">
          <div className="md:col-span-3">
            <FL>Calle / Dirección</FL>
            <FI name="direccion" value={form.direccion} onChange={handleChange} />
          </div>
          <div className="md:col-span-1">
            <FL>CP</FL>
            <FI
              name="cp"
              inputMode="numeric"
              value={form.cp}
              onChange={e => setForm(p => ({ ...p, cp: normalizePostalCodeEs(e.target.value) }))}
            />
          </div>
          <div className="md:col-span-2">
            <FL>Población</FL>
            <FI name="poblacion" value={form.poblacion} onChange={handleChange} />
          </div>
          <div className="md:col-span-2">
            <FL>Provincia</FL>
            <FI name="provincia" value={form.provincia} onChange={handleChange} />
          </div>
          <div className="md:col-span-2">
            <FL>País</FL>
            <FI name="pais" value={form.pais} onChange={handleChange} />
          </div>
        </div>
      </AccordionSection>

      <AccordionSection title="Pago" description="IBAN, forma de pago y vencimiento" defaultOpen={false}>
        <SectionTitle n="03" label="Pago" />
        <div className="grid grid-cols-1 md:grid-cols-6 gap-x-6 gap-y-4">
          <div className="md:col-span-4">
            <FL>IBAN</FL>
            <FI
              id="customer-iban"
              name="iban"
              value={form.iban}
              onChange={e => setForm(p => ({ ...p, iban: normalizeIban(e.target.value) }))}
              style={{
                outline: 'none',
                borderColor: showIbanOk ? 'var(--success, #16a34a)' : showIbanError ? 'var(--danger, #ef4444)' : '#e5e7eb',
                boxShadow: showIbanOk
                  ? '0 0 0 3px rgba(22,163,74,0.12)'
                  : showIbanError
                    ? '0 0 0 3px rgba(239,68,68,0.12)'
                    : undefined,
              }}
              aria-invalid={showIbanError}
            />
            <ValidationHint status={showIbanError ? 'error' : showIbanOk ? 'ok' : 'neutral'} hint={ibanPatternHint} />
          </div>
          <div className="md:col-span-2">
            <FL>Forma de pago</FL>
            <FS
              id="customer-forma-pago"
              name="formaPago"
              value={paymentValue}
              onChange={handleChange}
              aria-invalid={showPaymentError}
              style={{
                outline: 'none',
                borderColor: showPaymentOk ? 'var(--success, #16a34a)' : showPaymentError ? 'var(--danger, #ef4444)' : '#e5e7eb',
                boxShadow: showPaymentOk
                  ? '0 0 0 3px rgba(22,163,74,0.12)'
                  : showPaymentError
                    ? '0 0 0 3px rgba(239,68,68,0.12)'
                    : undefined,
              }}
            >
              <option value="">Selecciona…</option>
              {CUSTOMER_PAYMENT_METHODS.map(method => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </FS>
            <ValidationHint status={showPaymentError ? 'error' : showPaymentOk ? 'ok' : 'neutral'} hint={paymentHint} />
          </div>
          <div className="md:col-span-2">
            <FL>Días vencimiento</FL>
            <FI
              name="diasVencimiento"
              inputMode="numeric"
              value={String(form.diasVencimiento ?? 0)}
              onChange={handleChange}
            />
          </div>
        </div>
      </AccordionSection>

      <AccordionSection
        title="Direcciones de entrega"
        description={`${form.direccionesEntrega.length} direcciones`}
        defaultOpen={false}
      >
        <SectionTitle n="04" label="Direcciones de entrega" />
        <div className="space-y-4">
          {form.direccionesEntrega.map((addr, idx) => (
                <div key={addr.id ?? `${idx}`} className="rounded-2xl p-4" style={{ border: '1px solid #eef2f7', background: '#ffffff' }}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[10px] font-semibold truncate" style={{ color: '#0f172a' }}>
                      {addr.nombreAlias || `Dirección ${idx + 1}`}
                    </div>
                    <button
                      type="button"
                      className="text-[9px] font-semibold"
                      style={{ color: '#ef4444' }}
                      onClick={() => removeAddr(idx)}
                    >
                      Eliminar
                    </button>
                  </div>
                  <div className="mt-2 text-[8px] font-semibold" style={{ color: '#94a3b8' }}>
                    {[addr.direccion, addr.poblacion, addr.provincia].filter(Boolean).join(' · ')}
                  </div>
                </div>
              ))}

              <div className="rounded-2xl p-4" style={{ border: '1px dashed #e2e8f0', background: '#ffffff' }}>
                <div className="text-[10px] font-semibold" style={{ color: '#0f172a' }}>Añadir dirección</div>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-6 gap-x-6 gap-y-4">
                  <div className="md:col-span-2"><FL>Alias</FL><FI value={newAddr.nombreAlias} onChange={e => handleAddrField('nombreAlias', e.target.value)} /></div>
                  <div className="md:col-span-2"><FL>Dirección</FL><FI value={newAddr.direccion} onChange={e => handleAddrField('direccion', e.target.value)} /></div>
                  <div className="md:col-span-1"><FL>CP</FL><FI value={newAddr.cp} onChange={e => handleAddrField('cp', normalizePostalCodeEs(e.target.value))} /></div>
                  <div className="md:col-span-1"><FL>Población</FL><FI value={newAddr.poblacion} onChange={e => handleAddrField('poblacion', e.target.value)} /></div>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={addAddr}
                    className="px-3 py-2 rounded-xl text-[9px] font-semibold"
                    style={{ background: 'rgba(59,130,246,0.10)', color: 'var(--accent)' }}
                  >
                    Añadir
                  </button>
            </div>
          </div>
        </div>
      </AccordionSection>
    </form>
  );
};
