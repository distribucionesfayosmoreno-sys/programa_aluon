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
  telefono: string;
  email: string;
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
      const response = await fetch('/api/customers');
      const data = await response.json();
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

  const saveCustomer = async (customer: Customer) => {
    const method = customer.id ? 'PUT' : 'POST';
    const url = customer.id ? `/api/customers/${customer.id}` : '/api/customers';
    
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer),
    });
    
    if (response.ok) {
      fetchCustomers();
    }
  };

  const deleteCustomer = async (id: string) => {
    const response = await fetch(`/api/customers/${id}`, { method: 'DELETE' });
    if (response.ok) {
      fetchCustomers();
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return { customers, loading, saveCustomer, deleteCustomer, refresh: fetchCustomers };
};
