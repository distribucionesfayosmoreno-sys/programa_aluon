import React from 'react';
import { createPortal } from 'react-dom';
import { CustomerModalProps, TabKey } from './customer-modal/customerModalTypes';
import {
  FL,
  FI,
  ValidationHint,
  SectionTitle,
} from './customer-modal/CustomerModalComponents';
import {
  emailPatternHint,
  ibanPatternHint,
  normalizeDocumentNumber,
  normalizeIban,
  normalizePostalCodeEs,
  phonePatternHint,
} from './customer-modal/customerModalValidators';
import { useCustomerModal } from './customer-modal/useCustomerModal';

const CustomerModal: React.FC<CustomerModalProps> = ({ customer, onClose, onSave }) => {
  const {
    tab,
    setTab,
    form,
    setForm,
    newAddr,
    handleChange,
    handleAddrField,
    addAddr,
    removeAddr,
    handleSubmit,
    isEdit,
    docHint,
    showDocError,
    showDocOk,
    showPhoneError,
    showPhoneOk,
    showEmailError,
    showEmailOk,
    showIbanError,
    showIbanOk,
  } = useCustomerModal({ customer, onClose, onSave });

  const portalTarget =
    typeof document !== 'undefined' ? document.getElementById('main-layout') : null;

  const content = (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{ background: 'rgba(13,17,23,0.70)', backdropFilter: 'blur(6px)' }}
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0" onClick={onClose} />

      <div
        className="relative w-full max-w-6xl rounded-2xl flex flex-col overflow-hidden animate-fade-up"
        style={{ background: '#ffffff', maxHeight: 'calc(100vh - 48px)', boxShadow: '0 24px 70px rgba(0,0,0,0.32)' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-7 py-5"
          style={{ background: '#0d1117', borderBottom: '1px solid #21262d' }}
        >
          <div className="flex items-center gap-3.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--accent-shadow-light)' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--accent)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 style={{ fontSize: 13, fontWeight: 900, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {isEdit ? 'Editar cliente' : 'Nuevo cliente'}
              </h2>
              <p style={{ fontSize: 10, fontWeight: 600, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2 }}>
                {isEdit ? form.nombreComercial : 'Completa los datos del cliente'}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex" style={{ background: '#f8f9fb', borderBottom: '1px solid #e8eaed' }}>
          {(['GENERAL', 'ADDRESSES'] as TabKey[]).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className="flex items-center gap-2 px-6 py-3.5 cursor-pointer transition-all duration-200"
              style={{
                fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.07em',
                borderBottom: `2px solid ${tab === t ? 'var(--accent)' : 'transparent'}`,
                color: tab === t ? 'var(--accent)' : '#8b949e',
                background: tab === t ? '#ffffff' : 'transparent',
              }}
            >
              {t === 'GENERAL' ? 'Datos generales' : 'Direcciones'}
              {t === 'ADDRESSES' && (
                <span style={{
                  fontSize: 9, fontWeight: 900, padding: '2px 6px', borderRadius: 4,
                  background: tab === 'ADDRESSES' ? 'var(--accent)' : '#e8eaed',
                  color: tab === 'ADDRESSES' ? '#fff' : '#8b949e'
                }}>
                  {form.direccionesEntrega.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Form body */}
        <form id="cm-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-7 space-y-8">

          {tab === 'GENERAL' ? (
            <>
              {/* 01 Empresa */}
              <section>
                <SectionTitle n="01" label="Empresa" />
                <div className="grid grid-cols-1 md:grid-cols-6 gap-x-6 gap-y-4">
                  <div className="md:col-span-3">
                    <FL>Nombre Comercial *</FL>
                    <FI name="nombreComercial" value={form.nombreComercial} onChange={handleChange} required />
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
                      {['CIF', 'DNI', 'NIE', 'PASAPORTE'].map(v => <option key={v}>{v}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <FL>Número de documento</FL>
                    <div className="relative">
                        <FI
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
                        {showDocOk && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--success, #16a34a)' }}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                      )}
                    </div>
                    <ValidationHint status={showDocError ? 'error' : showDocOk ? 'ok' : 'neutral'} hint={docHint} />
                  </div>

                  <div className="md:col-span-2">
                    <FL>Teléfono</FL>
                      <FI
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
                    <FL>Tarifa</FL>
                    <FI name="tarifa" value={form.tarifa} onChange={handleChange} />
                  </div>
                </div>
              </section>

              {/* 02 Dirección fiscal */}
              <section>
                <SectionTitle n="02" label="Dirección fiscal" />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-4">
                  <div className="md:col-span-2"><FL>Calle / Dirección</FL><FI name="direccion" value={form.direccion} onChange={handleChange} /></div>
                  <div>
                    <FL>CP</FL>
                    <FI
                      name="cp"
                      inputMode="numeric"
                      value={form.cp}
                      onChange={e => setForm(prev => ({ ...prev, cp: normalizePostalCodeEs(e.target.value) }))}
                    />
                  </div>
                  <div><FL>Población</FL><FI name="poblacion" value={form.poblacion} onChange={handleChange} /></div>
                  <div><FL>Ciudad</FL><FI name="provincia" value={form.provincia} onChange={handleChange} /></div>
                  <div><FL>País</FL><FI name="pais" value={form.pais} onChange={handleChange} /></div>
                </div>
              </section>

              {/* 03 Finanzas */}
                <section>
                  <SectionTitle n="03" label="Finanzas" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                  <div className="md:col-span-1">
                    <FL>IBAN</FL>
                      <FI
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
                    <div>
                      <FL>Forma de pago</FL>
                      <select name="formaPago" value={form.formaPago} onChange={handleChange} className="field">
                        {['', 'EFECTIVO', 'BIZUM', 'TRANSFERENCIA'].map(v => (
                          <option key={v} value={v}>
                            {v || 'SELECCIONA...'}
                          </option>
                        ))}
                      </select>
                    </div>
                  <div className="flex gap-4">
                    <div className="flex-1"><FL>Días vto.</FL><FI name="diasVencimiento" type="number" value={form.diasVencimiento} onChange={handleChange} /></div>
                    <div className="flex-1"><FL>Remanente</FL><FI name="remanente" type="number" value={form.remanente} onChange={handleChange} /></div>
                  </div>
                </div>
              </section>
            </>
          ) : (
            /* Addresses tab */
            <div className="space-y-6">
              <div className="p-6 rounded-xl space-y-3" style={{ background: '#f8f9fb', border: '1px solid #e8eaed' }}>
                <p style={{ fontSize: 10, fontWeight: 900, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 12 }}>
                  Nueva dirección de entrega
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FI placeholder="ALIAS (ej: ALMACÉN SUR)" value={newAddr.nombreAlias} onChange={e => handleAddrField('nombreAlias', e.target.value)} />
                  <FI placeholder="PERSONA DE CONTACTO"    value={newAddr.contacto}    onChange={e => handleAddrField('contacto',    e.target.value)} />
                  <FI placeholder="TELÉFONO"               value={newAddr.telefono}    onChange={e => handleAddrField('telefono',    e.target.value)} />
                  <div className="sm:col-span-2">
                    <FI placeholder="CALLE / DIRECCIÓN"   value={newAddr.direccion}  onChange={e => handleAddrField('direccion',  e.target.value)} />
                  </div>
                  <FI placeholder="POBLACIÓN"              value={newAddr.poblacion}  onChange={e => handleAddrField('poblacion',  e.target.value)} />
                  <FI placeholder="PROVINCIA"              value={newAddr.provincia}  onChange={e => handleAddrField('provincia',  e.target.value)} />
                </div>
                <button
                  type="button"
                  onClick={addAddr}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide text-white cursor-pointer transition-colors duration-200"
                  style={{ background: '#0d1117', marginTop: 4 }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#21262d')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#0d1117')}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Añadir dirección
                </button>
              </div>

              {form.direccionesEntrega.length === 0 ? (
                <p className="text-center py-10 text-xs font-semibold uppercase tracking-wide" style={{ color: '#8b949e' }}>
                  No hay direcciones añadidas todavía.
                </p>
              ) : (
                <div className="space-y-3">
                  {form.direccionesEntrega.map((a, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-4 px-5 py-4 rounded-xl group transition-colors duration-200 cursor-default"
                      style={{ background: '#ffffff', border: '1px solid #e8eaed' }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent-dark)')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = '#e8eaed')}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: '#f8f9fb', border: '1px solid #e8eaed' }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#8b949e' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 900, color: '#0d1117', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{a.nombreAlias}</div>
                          <div style={{ fontSize: 10, color: '#8b949e', marginTop: 2 }}>
                            {[a.direccion, a.poblacion, a.provincia].filter(Boolean).join(' · ')}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAddr(i)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-200"
                        style={{ color: '#8b949e' }}
                      onMouseEnter={e => { e.currentTarget.style.color = 'var(--danger)'; e.currentTarget.style.backgroundColor = 'var(--danger-bg)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#8b949e'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </form>

        {/* Footer */}
        <div
          className="flex items-center justify-between gap-4 px-7 py-5"
          style={{ borderTop: '1px solid #e8eaed', background: '#f8f9fb' }}
        >
          <p style={{ fontSize: 10, color: '#8b949e', fontWeight: 600 }} className="hidden sm:block">* Campos obligatorios</p>
          <div className="flex items-center gap-3 ml-auto">
            <button type="button" onClick={onClose} className="btn-ghost">Cancelar</button>
            <button type="submit" form="cm-form" className="btn-primary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              {isEdit ? 'Guardar cambios' : 'Crear cliente'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return portalTarget ? createPortal(content, portalTarget) : content;
};

export default CustomerModal;
