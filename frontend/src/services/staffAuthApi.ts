export type StaffUser = {
  id: number;
  username: string;
  nombre: string;
  apellidos: string;
  role: string;
};

export type StaffLoginResponse = {
  token: string;
  expiresInSeconds: number;
  user: StaffUser;
};

export const STAFF_LOGIN_REQUIRED_EVENT = 'aluon-staff-login-required';

const TOKEN_KEY = 'aluon-staff-token';

export const getStaffToken = () => localStorage.getItem(TOKEN_KEY);

export const staffAuthHeaders = (headers: HeadersInit = {}): HeadersInit => {
  const token = getStaffToken();
  return token ? { ...headers, Authorization: `Bearer ${token}` } : headers;
};

export const loginStaff = async (username: string, password: string): Promise<StaffLoginResponse> => {
  const response = await fetch('/api/staff-auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) throw new Error((await response.text().catch(() => '')) || 'Credenciales inválidas.');
  const result = await response.json() as StaffLoginResponse;
  localStorage.setItem(TOKEN_KEY, result.token);
  return result;
};

export const loadCurrentStaff = async (): Promise<StaffUser | null> => {
  if (!getStaffToken()) return null;
  const response = await fetch('/api/staff-auth/me', { headers: staffAuthHeaders() });
  if (response.status === 204 || response.status === 401) {
    localStorage.removeItem(TOKEN_KEY);
    return null;
  }
  if (!response.ok) throw new Error('No se pudo comprobar la sesión.');
  return response.json() as Promise<StaffUser>;
};

export const logoutStaff = async () => {
  try {
    await fetch('/api/staff-auth/logout', { method: 'POST', headers: staffAuthHeaders() });
  } finally {
    localStorage.removeItem(TOKEN_KEY);
  }
};

/** Check the current session before attempting a protected change. */
export const requireStaffRole = async (roles: readonly string[]): Promise<void> => {
  const user = await loadCurrentStaff();
  if (!user) {
    window.dispatchEvent(new Event(STAFF_LOGIN_REQUIRED_EVENT));
    throw new Error('Inicia sesión y vuelve a guardar. El borrador se conserva.');
  }
  if (!roles.includes(user.role)) {
    throw new Error('Tu usuario no tiene permiso para guardar configuraciones de pedidos.');
  }
};
