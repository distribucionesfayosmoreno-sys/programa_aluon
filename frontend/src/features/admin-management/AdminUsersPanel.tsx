import { useState } from 'react';
import UserModal from '../../components/UserModal';
import { useAdminUsers, type AdminUser, type AdminUserForm } from '../../hooks/useAdminUsers';

export const AdminUsersPanel = () => {
  const { users, roles, contractTypes, loading, saveUser, deleteUser } = useAdminUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUserForm | undefined>();

  const handleEdit = (user: AdminUser) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 220px)', minHeight: 400 }}>
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <div className="text-sm font-black uppercase tracking-wider" style={{ color: '#111827' }}>
            Administración de usuarios
          </div>
          <p className="text-xs mt-1" style={{ color: '#6b7280' }}>
            Gestión del personal interno del ERP.
          </p>
        </div>

        <button
          id="btn-nuevo-usuario"
          onClick={() => {
            setSelectedUser(undefined);
            setIsModalOpen(true);
          }}
          className="btn-primary"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Nuevo empleado
        </button>
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
              ) : users.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td className="px-3 py-2.5">
                    <span className="font-semibold">{[user.nombre, user.apellidos].filter(Boolean).join(' ')}</span>
                  </td>
                  <td className="px-3 py-2.5" style={{ color: '#6b7280' }}>{user.email}</td>
                  <td className="px-3 py-2.5" style={{ color: '#6b7280' }}>{user.role}</td>
                  <td className="px-3 py-2.5" style={{ color: '#6b7280' }}>{user.tipoContrato}</td>
                  <td className="px-3 py-2.5 text-right">
                    <button className="btn-ghost mr-2" onClick={() => handleEdit(user)}>Editar</button>
                    <button className="btn-ghost" onClick={() => user.id && deleteUser(user.id)}>Eliminar</button>
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
