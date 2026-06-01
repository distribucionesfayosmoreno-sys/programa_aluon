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

const isLocalUiSession = (): boolean => {
  const envName = (import.meta.env.VITE_APP_ENV_NAME ?? import.meta.env.MODE ?? '').toLowerCase();
  if (envName === 'local') return true;
  if (envName !== 'development') return false;
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname.toLowerCase();
  return host === 'localhost' || host === '127.0.0.1';
};

const padLeft = (value: string, length: number, padChar: string): string =>
  value.length >= length ? value : `${padChar.repeat(length - value.length)}${value}`;

const buildValidDniFromNumber = (value: number): string => {
  const digits = padLeft(String(Math.abs(Math.trunc(value)) % 100000000), 8, '0');
  const letters = 'TRWAGMYFPDXBNJZSQVHLCKE';
  const idx = Number(digits) % 23;
  return `${digits}${letters[idx]}`;
};

const createLocalPrefillCustomer = (): Customer => {
  const now = Date.now();
  const suffix = padLeft(String(now % 10000), 4, '0');
  const dni = buildValidDniFromNumber(now);

  return {
    ...EMPTY_CUSTOMER,
    nombreComercial: `PRUEBA CLIENTE ${suffix}`,
    razonSocial: `PRUEBA CLIENTE ${suffix} S.L.`,
    personaContacto: 'RODRIGO',
    tarifa: 'GENERAL',
    tipoDocumento: 'DNI',
    numeroDocumento: dni,
    telefono: '612345678',
    email: `prueba+${suffix}@example.com`,
    direccion: 'CALLE PRUEBA 1',
    cp: '',
    poblacion: '',
    provincia: '',
    pais: 'ESPAÑA',
    iban: '',
    formaPago: 'TRANSFERENCIA',
    diasVencimiento: 30,
    remanente: 0,
    direccionesEntrega: [],
  };
};

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
  onSave: (customer: Customer) => Promise<void>;
}

export const useCustomerModal = ({ customer, onClose, onSave }: UseCustomerModalParams) => {
  const [tab, setTab] = useState<TabKey>('GENERAL');
  const [form, setForm] = useState<Customer>(() => {
    if (!customer?.id && isLocalUiSession()) return createLocalPrefillCustomer();
    return sanitizeCustomer(customer, EMPTY_CUSTOMER);
  });
  const [newAddr, setNewAddr] = useState<DeliveryAddress>(EMPTY_ADDR);
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [validationDialogOpen, setValidationDialogOpen] = useState(false);
  const [validationDialogItems, setValidationDialogItems] = useState<string[]>([]);
  const [validationFocusTargetId, setValidationFocusTargetId] = useState<string>('');
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const items: string[] = [];
    let focusTargetId = '';
    const hasNombreComercial = form.nombreComercial.trim().length > 0;
    if (!hasNombreComercial) {
      items.push('El nombre comercial es obligatorio.');
      focusTargetId ||= 'customer-nombre-comercial';
    }

    const isDocValidNow = validateDocumentNumber(form.tipoDocumento, form.numeroDocumento);
    if (!isDocValidNow) {
      items.push(`El número de documento (${form.tipoDocumento}) no es válido.`);
      focusTargetId ||= 'customer-numero-documento';
    }

    const isPhoneValidNow = form.telefono.trim().length === 0 ? true : validatePhone(form.telefono);
    if (!isPhoneValidNow) {
      items.push('El teléfono no tiene un formato válido.');
      focusTargetId ||= 'customer-telefono';
    }

    const emailNow = normalizeEmail(form.email);
    const isEmailValidNow = emailNow.length === 0 ? true : validateEmail(emailNow);
    if (!isEmailValidNow) {
      items.push('El email no tiene un formato válido.');
      focusTargetId ||= 'customer-email';
    }

    const ibanNow = normalizeIban(form.iban);
    const isIbanValidNow = ibanNow.length === 0 ? true : validateIban(ibanNow);
    if (!isIbanValidNow) {
      items.push('El IBAN no es válido.');
      focusTargetId ||= 'customer-iban';
    }

    if (items.length > 0) {
      setValidationDialogItems(items);
      setValidationFocusTargetId(focusTargetId);
      setValidationDialogOpen(true);
      setTab('GENERAL');
      return;
    }

    setIsSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      console.error('Error saving customer:', err);
      setSubmitError(err instanceof Error ? err.message : 'Error desconocido al guardar el cliente');
    } finally {
      setIsSaving(false);
    }
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
    isSaving,
    submitError,
    validationDialogOpen,
    validationDialogItems,
    validationFocusTargetId,
    closeValidationDialog: () => setValidationDialogOpen(false),
  };
};
