import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { AdminUserForm, ContractType, Role } from '../hooks/useAdminUsers';

interface Props {
  user?: AdminUserForm;
  roles: Role[];
  contractTypes: ContractType[];
  onClose: () => void;
  onSave: (u: AdminUserForm) => void;
}

const EMPTY_USER: AdminUserForm = {
  nombre: '',
  apellidos: '',
  email: '',
  role: 'ADMIN',
  tipoContrato: 'INDEFINIDO',
};

const UserModal: React.FC<Props> = ({ user, roles, contractTypes, onClose, onSave }) => {
  const [form, setForm] = useState<AdminUserForm>(user ?? EMPTY_USER);

  useEffect(() => {
    if (!user && roles.length > 0 && !form.role) {
      setForm(prev => ({ ...prev, role: roles[0] }));
    }
    if (!user && contractTypes.length > 0 && !form.tipoContrato) {
      setForm(prev => ({ ...prev, tipoContrato: contractTypes[0] }));
    }
  }, [roles, contractTypes, user, form.role, form.tipoContrato]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 9);
    setForm(prev => ({ ...prev, telefono: value ? Number(value) : undefined }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setForm(prev => ({ ...prev, fotoFile: null, fotoBase64: null }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      setForm(prev => ({ ...prev, fotoFile: file, fotoBase64: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  const isEdit = Boolean(user?.id);
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
        className="relative w-full max-w-2xl rounded-2xl flex flex-col overflow-hidden animate-fade-up"
        style={{ background: '#ffffff', maxHeight: 'calc(100vh - 48px)', boxShadow: '0 24px 70px rgba(0,0,0,0.32)' }}
      >
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
                {isEdit ? 'Editar usuario' : 'Nuevo empleado'}
              </h2>
              <p style={{ fontSize: 10, fontWeight: 600, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2 }}>
                {isEdit ? [form.nombre, form.apellidos].filter(Boolean).join(' ') : 'Completa los datos del usuario'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="submit" form="um-form" className="btn-primary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              {isEdit ? 'Guardar cambios' : 'Crear usuario'}
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200"
              style={{ color: '#8b949e' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#21262d'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#8b949e'; }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form id="um-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-7 space-y-6">
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <label className="field-label">Nombre *</label>
                <input className="field" name="nombre" value={form.nombre} onChange={handleChange} required />
              </div>
              <div>
                <label className="field-label">Apellidos *</label>
                <input className="field" name="apellidos" value={form.apellidos} onChange={handleChange} required />
              </div>
              <div className="md:col-span-2">
                <label className="field-label">Email *</label>
                <input className="field" name="email" type="email" value={form.email} onChange={handleChange} required />
              </div>
              <div>
                <label className="field-label">Teléfono</label>
                <input className="field" name="telefono" value={form.telefono ?? ''} onChange={handlePhoneChange} />
              </div>
              <div>
                <label className="field-label">Horario</label>
                <input className="field" name="horario" value={form.horario ?? ''} onChange={handleChange} />
              </div>
              <div>
                <label className="field-label">Rol *</label>
                <select name="role" value={form.role} onChange={handleChange} className="field">
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="field-label">Tipo contrato *</label>
                <select name="tipoContrato" value={form.tipoContrato} onChange={handleChange} className="field">
                  {contractTypes.map(ct => (
                    <option key={ct} value={ct}>{ct}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="field-label">Foto</label>
                <input type="file" accept="image/*" onChange={handleFileChange} />
              </div>
            </div>
          </section>
        </form>
      </div>
    </div>
  );

  return portalTarget ? createPortal(content, portalTarget) : content;
};

export default UserModal;
