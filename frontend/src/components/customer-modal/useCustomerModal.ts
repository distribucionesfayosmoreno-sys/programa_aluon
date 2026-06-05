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
  password: '', hasPassword: false,
  direccion: '', cp: '', poblacion: '', provincia: '', pais: 'ESPAÑA',
  iban: '', formaPago: '', diasVencimiento: 0, remanente: 0, direccionesEntrega: [],
};

export const EMPTY_ADDR: DeliveryAddress = {
  nombreAlias: '', direccion: '', cp: '', poblacion: '', provincia: '', telefono: '', contacto: '',
};

const createBlankCustomer = (): Customer => ({
  nombreComercial: '',
  razonSocial: '',
  personaContacto: '',
  tarifa: '',
  tipoDocumento: '' as Customer['tipoDocumento'],
  numeroDocumento: '',
  telefono: '',
  email: '',
  password: '',
  hasPassword: false,
  direccion: '',
  cp: '',
  poblacion: '',
  provincia: '',
  pais: '',
  iban: '',
  formaPago: '',
  diasVencimiento: 0,
  remanente: 0,
  direccionesEntrega: [],
});

interface UseCustomerModalParams {
  customer?: Customer;
  onClose: () => void;
  onSave: (customer: Customer) => Promise<void>;
}

export const useCustomerModal = ({ customer, onClose, onSave }: UseCustomerModalParams) => {
  const [tab, setTab] = useState<TabKey>('GENERAL');
  const [form, setForm] = useState<Customer>(() => {
    if (!customer?.id) return createBlankCustomer();
    return sanitizeCustomer(customer, EMPTY_CUSTOMER);
  });
  const [newAddr, setNewAddr] = useState<DeliveryAddress>(EMPTY_ADDR);
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [validationDialogOpen, setValidationDialogOpen] = useState(false);
  const [validationDialogItems, setValidationDialogItems] = useState<string[]>([]);
  const [validationFocusTargetId, setValidationFocusTargetId] = useState<string>('');
  const [documentExistsError, setDocumentExistsError] = useState(false);
  const lastPostalLookupRef = useRef<string>('');
  const lastDocumentLookupRef = useRef<string>('');

  useEffect(() => {
    if (!customer?.id) {
      setForm(createBlankCustomer());
      setNewAddr(EMPTY_ADDR);
      setTab('GENERAL');
      return;
    }

    setForm(sanitizeCustomer(customer, EMPTY_CUSTOMER));
    setNewAddr(EMPTY_ADDR);
    setTab('GENERAL');
  }, [customer]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(p => ({
      ...p,
      [name]: name === 'password' ? value : value.toUpperCase(),
    }));
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
    } else if (documentExistsError) {
      items.push(`El número de documento ya está registrado en otro cliente.`);
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
  const showDocError = (normalizeDocumentNumber(form.numeroDocumento).length > 0 && !isDocValid) || documentExistsError;
  const showDocOk = normalizeDocumentNumber(form.numeroDocumento).length > 0 && isDocValid && !documentExistsError;
  const computedDocHint = documentExistsError ? 'Este documento ya está registrado' : docHint;

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
    const doc = normalizeDocumentNumber(form.numeroDocumento);
    if (!doc || !validateDocumentNumber(form.tipoDocumento, form.numeroDocumento)) {
      setDocumentExistsError(false);
      lastDocumentLookupRef.current = '';
      return;
    }
    
    if (lastDocumentLookupRef.current === doc) return;
    lastDocumentLookupRef.current = doc;

    const controller = new AbortController();
    void (async () => {
      try {
        const url = new URL('/api/erp/customers/check-document', window.location.origin);
        url.searchParams.set('numeroDocumento', doc);
        if (customer?.id) {
          url.searchParams.set('excludeId', customer.id);
        }
        const response = await fetch(url.toString(), { signal: controller.signal });
        if (!response.ok) return;
        const exists = await response.json();
        setDocumentExistsError(exists);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
        console.error('Error checking document existence:', err);
      }
    })();

    return () => controller.abort();
  }, [form.numeroDocumento, form.tipoDocumento, customer?.id]);

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
    docHint: computedDocHint,
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
