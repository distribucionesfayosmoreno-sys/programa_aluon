import { useEffect, useState } from 'react';

export type Role =
  | 'SUPERADMIN'
  | 'ADMIN'
  | 'DIOS'
  | 'CONTABILIDAD'
  | 'RRHH'
  | 'ALMACEN'
  | 'SOLDADOR'
  | 'CONDUCTOR'
  | 'MONTADOR';

export type ContractType =
  | 'INDEFINIDO'
  | 'TEMPORAL'
  | 'PRACTICAS'
  | 'AUTONOMO'
  | 'PARCIAL'
  | 'COMPLETO';

export interface AdminUser {
  id?: number;
  nombre: string;
  apellidos: string;
  email: string;
  telefono?: number;
  role: Role;
  horario?: string;
  tipoContrato: ContractType;
  fotoBase64?: string | null;
}

export interface AdminUserForm extends AdminUser {
  fotoFile?: File | null;
}

export const useAdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [contractTypes, setContractTypes] = useState<ContractType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRoles = async () => {
    try {
      const response = await fetch('/api/admin/roles');
      const data = await response.json();
      if (Array.isArray(data)) {
        setRoles(data as Role[]);
      } else {
        console.error('API roles response is not an array:', data);
        setRoles([]);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const fetchContractTypes = async () => {
    try {
      const response = await fetch('/api/admin/contract-types');
      const data = await response.json();
      if (Array.isArray(data)) {
        setContractTypes(data as ContractType[]);
      } else {
        console.error('API contract types response is not an array:', data);
        setContractTypes([]);
      }
    } catch (error) {
      console.error('Error fetching contract types:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        console.error('API users response is not an array:', data);
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    await Promise.all([fetchRoles(), fetchContractTypes(), fetchUsers()]);
  };

  const saveUser = async (user: AdminUserForm) => {
    const isEdit = Boolean(user.id);
    const url = isEdit ? `/api/admin/users/${user.id}` : '/api/admin/users';
    const method = isEdit ? 'PUT' : 'POST';

    const payload: Partial<AdminUser> = {
      nombre: user.nombre,
      apellidos: user.apellidos,
      email: user.email,
      telefono: user.telefono,
      role: user.role,
      horario: user.horario,
      tipoContrato: user.tipoContrato,
      fotoBase64: user.fotoBase64 ?? null,
    };

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      fetchUsers();
    }
  };

  const deleteUser = async (id: number) => {
    const response = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    if (response.ok) {
      fetchUsers();
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return { users, roles, contractTypes, loading, saveUser, deleteUser, refresh };
};
