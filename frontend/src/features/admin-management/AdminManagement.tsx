import React, { useState } from 'react';
import { useAdminUsers, type AdminUser, type AdminUserForm } from '../../hooks/useAdminUsers';
import UserModal from '../../components/UserModal';

const AdminManagement: React.FC = () => {
  const { users, roles, contractTypes, loading, saveUser, deleteUser } = useAdminUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUserForm | undefined>();

  const handleEdit = (u: AdminUser) => {
    setSelectedUser(u);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedUser(undefined);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 128px)', minHeight: 400 }}>
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-1 h-5 rounded-full bg-brand" />
            <h1 className="text-xl font-black uppercase tracking-tight" style={{ color: '#0d1117' }}>
              Administración de Usuarios
            </h1>
          </div>
          <p className="text-xs font-semibold uppercase tracking-wide ml-3.5 mt-0.5" style={{ color: '#9ca3af' }}>
            ERP · UTILIDADES
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button id="btn-nuevo-usuario" onClick={handleCreate} className="btn-primary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nuevo empleado
          </button>
        </div>
      </div>

      <div
        className="flex-1 rounded-2xl overflow-hidden flex flex-col min-h-0"
        style={{ border: '1px solid #e5e7eb', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
      >
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse" style={{ fontSize: 12 }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
              <tr>
                <th className="px-3 py-2" style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>Empleado</th>
                <th className="px-3 py-2" style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>Email</th>
                <th className="px-3 py-2" style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>Rol</th>
                <th className="px-3 py-2" style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>Contrato</th>
                <th style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb', width: 80 }} />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="px-3 py-4" colSpan={5}>Cargando...</td></tr>
              ) : users.length === 0 ? (
                <tr><td className="px-3 py-6" colSpan={5}>No hay usuarios.</td></tr>
              ) : users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td className="px-3 py-2.5">
                    <span className="font-semibold">{[u.nombre, u.apellidos].filter(Boolean).join(' ')}</span>
                  </td>
                  <td className="px-3 py-2.5" style={{ color: '#6b7280' }}>{u.email}</td>
                  <td className="px-3 py-2.5" style={{ color: '#6b7280' }}>{u.role}</td>
                  <td className="px-3 py-2.5" style={{ color: '#6b7280' }}>{u.tipoContrato}</td>
                  <td className="px-3 py-2.5 text-right">
                    <button className="btn-ghost mr-2" onClick={() => handleEdit(u)}>Editar</button>
                    <button className="btn-ghost" onClick={() => u.id && deleteUser(u.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <UserModal
          user={selectedUser}
          roles={roles}
          contractTypes={contractTypes}
          onClose={() => setIsModalOpen(false)}
          onSave={saveUser}
        />
      )}
    </div>
  );
};

export default AdminManagement;
