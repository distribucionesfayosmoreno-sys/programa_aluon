import React from 'react';
import { createPortal } from 'react-dom';
import type { CustomerModalProps } from './customer-modal/customerModalTypes';
import { CustomerDrawerShell } from './customer-modal/CustomerDrawerShell';
import { CustomerModalForm } from './customer-modal/CustomerModalForm';
import { useCustomerModal } from './customer-modal/useCustomerModal';
import WarningDialog from './feedback/WarningDialog';

const CustomerModal: React.FC<CustomerModalProps> = ({ customer, onClose, onSave, onOpenBudget, onOpenVision360 }) => {
  const {
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
    closeValidationDialog,
  } = useCustomerModal({ customer, onClose, onSave });

  const portalTarget =
    typeof document !== 'undefined' ? document.getElementById('main-layout') : null;

  if (!portalTarget) return null;

  const content = (
    <CustomerDrawerShell
      title={isEdit ? 'Editar cliente' : 'Nuevo cliente'}
      subtitle={isEdit ? form.nombreComercial : 'Completa los datos del cliente'}
      onClose={onClose}
      maxWidthPx={760}
      footer={
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => onOpenBudget?.(customer ?? form)}
              className="px-4 py-2 rounded-xl text-[9px] font-semibold"
              style={{ border: '1px solid #dbeafe', background: '#eff6ff', color: '#1d4ed8' }}
              disabled={isSaving || !customer?.id}
              title={!customer?.id ? 'Guarda el cliente antes de generar un presupuesto' : undefined}
            >
              Generar presupuesto
            </button>
            <button
              type="button"
              onClick={() => onOpenVision360?.(customer ?? form)}
              className="px-4 py-2 rounded-xl text-[9px] font-semibold"
              style={{ border: '1px solid #e9d5ff', background: '#faf5ff', color: '#7c3aed' }}
              disabled={isSaving || !customer?.id}
              title={!customer?.id ? 'Guarda el cliente antes de abrir Vision 360' : undefined}
            >
              Vision360
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-[9px] font-semibold"
              style={{ border: '1px solid #e2e8f0', background: '#ffffff', color: '#0f172a' }}
              disabled={isSaving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="customer-modal-form"
              disabled={isSaving}
              className="px-4 py-2 rounded-xl text-[9px] font-semibold flex items-center gap-2"
              style={{ background: isSaving ? '#94a3b8' : 'var(--accent)', color: '#ffffff' }}
            >
              {isSaving ? <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" /> : null}
              {isSaving ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </div>
      }
    >
      <CustomerModalForm
        form={form}
        setForm={setForm}
        newAddr={newAddr}
        handleChange={handleChange}
        handleAddrField={handleAddrField}
        addAddr={addAddr}
        removeAddr={removeAddr}
        onSubmit={handleSubmit}
        showDocError={showDocError}
        showDocOk={showDocOk}
        docHint={docHint}
        showPhoneError={showPhoneError}
        showPhoneOk={showPhoneOk}
        showEmailError={showEmailError}
        showEmailOk={showEmailOk}
        showIbanError={showIbanError}
        showIbanOk={showIbanOk}
        submitError={submitError ?? ''}
      />
      <WarningDialog
        open={validationDialogOpen}
        title="Faltan o hay datos incorrectos"
        description="Corrige estos campos antes de crear/guardar el cliente."
        items={validationDialogItems}
        detail={validationDialogItems.some(i => i.includes('documento')) ? docHint : undefined}
        primaryLabel="Revisar"
        onPrimary={() => {
          if (!validationFocusTargetId) return;
          const el = document.getElementById(validationFocusTargetId);
          if (el && 'focus' in el) (el as HTMLInputElement).focus();
        }}
        onClose={closeValidationDialog}
      />
    </CustomerDrawerShell>
  );

  return createPortal(content, portalTarget);
};

export default CustomerModal;
