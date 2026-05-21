import { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
import { Customer, DeliveryAddress } from '../../hooks/useCustomers';
import { TabKey } from './customerModalTypes';
import {
  documentPatternHint,
  lookupPostalCodeEs,
  normalizeDocumentNumber,
  normalizeEmail,
  normalizeIban,
  normalizePostalCodeEs,
  sanitizeCustomer,
  validateDocumentNumber,
  validateEmail,
  validateIban,
  validatePhone,
} from './customerModalValidators';

export const EMPTY_CUSTOMER: Customer = {
  nombreComercial: '', razonSocial: '', personaContacto: '',
  tarifa: '', tipoDocumento: 'CIF', numeroDocumento: '', telefono: '', email: '',
  direccion: '', cp: '', poblacion: '', provincia: '', pais: 'ESPAÑA',
  iban: '', formaPago: '', diasVencimiento: 0, remanente: 0, direccionesEntrega: [],
};

export const EMPTY_ADDR: DeliveryAddress = {
  nombreAlias: '', direccion: '', cp: '', poblacion: '', provincia: '', telefono: '', contacto: '',
};

interface UseCustomerModalParams {
  customer?: Customer;
  onClose: () => void;
  onSave: (customer: Customer) => void;
}

export const useCustomerModal = ({ customer, onClose, onSave }: UseCustomerModalParams) => {
  const [tab, setTab] = useState<TabKey>('GENERAL');
  const [form, setForm] = useState<Customer>(() => sanitizeCustomer(customer, EMPTY_CUSTOMER));
  const [newAddr, setNewAddr] = useState<DeliveryAddress>(EMPTY_ADDR);
  const lastPostalLookupRef = useRef<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value.toUpperCase() }));
  };

  const handleAddrField = (name: keyof DeliveryAddress, value: string) =>
    setNewAddr(p => ({ ...p, [name]: value.toUpperCase() }));

  const addAddr = () => {
    if (!newAddr.nombreAlias) return;
    setForm(p => ({ ...p, direccionesEntrega: [...p.direccionesEntrega, newAddr] }));
    setNewAddr(EMPTY_ADDR);
  };

  const removeAddr = (i: number) =>
    setForm(p => ({ ...p, direccionesEntrega: p.direccionesEntrega.filter((_, j) => j !== i) }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  const isEdit = Boolean(customer?.id);
  const docHint = documentPatternHint(form.tipoDocumento);
  const isDocValid = validateDocumentNumber(form.tipoDocumento, form.numeroDocumento);
  const showDocError = normalizeDocumentNumber(form.numeroDocumento).length > 0 && !isDocValid;
  const showDocOk = normalizeDocumentNumber(form.numeroDocumento).length > 0 && isDocValid;

  const isPhoneValid = validatePhone(form.telefono);
  const showPhoneError = form.telefono.trim().length > 0 && !isPhoneValid;
  const showPhoneOk = form.telefono.trim().length > 0 && isPhoneValid;

  const normalizedEmail = normalizeEmail(form.email);
  const isEmailValid = validateEmail(normalizedEmail);
  const showEmailError = normalizedEmail.length > 0 && !isEmailValid;
  const showEmailOk = normalizedEmail.length > 0 && isEmailValid;

  const normalizedIban = normalizeIban(form.iban);
  const isIbanValid = validateIban(normalizedIban);
  const showIbanError = normalizedIban.length > 0 && !isIbanValid;
  const showIbanOk = normalizedIban.length > 0 && isIbanValid;

  useEffect(() => {
    const cp = normalizePostalCodeEs(form.cp);
    if (cp.length !== 5) {
      lastPostalLookupRef.current = '';
      return;
    }
    if (lastPostalLookupRef.current === cp) return;
    lastPostalLookupRef.current = cp;
    const controller = new AbortController();
    void (async () => {
      const result = await lookupPostalCodeEs(cp, controller.signal).catch(() => null);
      if (!result) return;

      setForm(prev => {
        const currentCp = normalizePostalCodeEs(prev.cp);
        if (currentCp !== cp) return prev;
        return {
          ...prev,
          poblacion: result.poblacion.toUpperCase(),
          provincia: result.ciudad,
        };
      });
    })();

    return () => controller.abort();
  }, [form.cp]);

  return {
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
  };
};
