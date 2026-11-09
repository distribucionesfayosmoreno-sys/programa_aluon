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
    <div className="flex flex-col rounded-3xl border border-slate-200 bg-white p-3" style={{ height: 'calc(100vh - 220px)', minHeight: 400 }}>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-3">
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
          className="admin-compact-button admin-compact-button--primary"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Nuevo empleado
        </button>
      </div>

      <div className="flex-1 overflow-auto rounded-2xl border border-slate-200">
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse" style={{ fontSize: 12 }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
              <tr>
                <th className="p-3 bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-500">Empleado</th>
                <th className="p-3 bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-500">Email</th>
                <th className="p-3 bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-500">Rol</th>
                <th className="p-3 bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-500">Contrato</th>
                <th className="p-3 bg-slate-50 border-b border-slate-200" style={{ width: 170 }} />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="p-3 text-sm text-slate-500" colSpan={5}>Cargando...</td></tr>
              ) : users.length === 0 ? (
                <tr><td className="p-3 text-sm text-slate-500" colSpan={5}>No hay usuarios.</td></tr>
              ) : users.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td className="p-3 border-t border-slate-100">
                    <span className="font-semibold">{[user.nombre, user.apellidos].filter(Boolean).join(' ')}</span>
                  </td>
                  <td className="p-3 border-t border-slate-100 text-slate-500">{user.email}</td>
                  <td className="p-3 border-t border-slate-100 text-slate-500">{user.role}</td>
                  <td className="p-3 border-t border-slate-100 text-slate-500">{user.tipoContrato}</td>
                  <td className="p-3 border-t border-slate-100 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="admin-compact-button admin-compact-button--action" onClick={() => handleEdit(user)}>Editar</button>
                      <button className="admin-compact-button admin-compact-button--action" onClick={() => user.id && deleteUser(user.id)}>Eliminar</button>
                    </div>
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
