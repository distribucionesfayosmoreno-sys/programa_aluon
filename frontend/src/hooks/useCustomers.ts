import { useState, useEffect } from 'react';

export interface DeliveryAddress {
  id?: string;
  nombreAlias: string;
  direccion: string;
  cp: string;
  poblacion: string;
  provincia: string;
  telefono: string;
  contacto: string;
}

export interface Customer {
  id?: string;
  nombreComercial: string;
  razonSocial: string;
  personaContacto: string;
  tarifa: string;
  tipoDocumento: 'DNI' | 'CIF' | 'NIE' | 'PASAPORTE';
  numeroDocumento: string;
  telefono: string;
  email: string;
  password?: string;
  hasPassword?: boolean;
  direccion: string;
  cp: string;
  poblacion: string;
  provincia: string;
  pais: string;
  iban: string;
  formaPago: string;
  diasVencimiento: number;
  remanente: number;
  direccionesEntrega: DeliveryAddress[];
}

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/erp/customers');
      if (!response.ok) {
        const details = await response.text().catch(() => '');
        const message = details?.trim() || `Error cargando clientes (status ${response.status})`;
        throw new Error(message);
      }
      const data: unknown = await response.json();
      if (Array.isArray(data)) {
        setCustomers(data);
      } else {
        console.error('API response is not an array:', data);
        setCustomers([]);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveCustomer = async (customer: Customer): Promise<void> => {
    const method = customer.id ? 'PUT' : 'POST';
    const url = customer.id ? `/api/erp/customers/${customer.id}` : '/api/erp/customers';
    
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer),
    });
    
    if (!response.ok) {
      const details = await response.text().catch(() => '');
      const message = details?.trim() || `Error guardando cliente (status ${response.status})`;
      throw new Error(message);
    }
    
    await fetchCustomers();
  };

  const deleteCustomer = async (id: string) => {
    const response = await fetch(`/api/erp/customers/${id}`, { method: 'DELETE' });
    if (!response.ok) {
      const details = await response.text().catch(() => '');
      const message = details?.trim() || `Error eliminando cliente (status ${response.status})`;
      throw new Error(message);
    }
    // Optimistic update; fallback to refresh to ensure consistency
    setCustomers(prev => prev.filter(c => c.id !== id));
    fetchCustomers();
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const checkDocumentExists = async (numeroDocumento: string, excludeId?: string): Promise<boolean> => {
    if (!numeroDocumento) return false;
    try {
      const url = new URL('/api/erp/customers/check-document', window.location.origin);
      url.searchParams.set('numeroDocumento', numeroDocumento);
      if (excludeId) {
        url.searchParams.set('excludeId', excludeId);
      }
      const response = await fetch(url.toString());
      if (!response.ok) return false;
      return await response.json();
    } catch (error) {
      console.error('Error checking document:', error);
      return false;
    }
  };

  return { customers, loading, saveCustomer, deleteCustomer, refresh: fetchCustomers, checkDocumentExists };
};
