import { useState } from 'react';
import { readImageAsDataUrl } from './productCatalogImage';
import type { ProductCatalogFamily, ProductCatalogFamilyForm } from './AdminManagement.types';

type Props = {
  family?: ProductCatalogFamily | null;
  saving: boolean;
  onClose: () => void;
  onSave: (payload: ProductCatalogFamilyForm) => Promise<void>;
};

const toInitialState = (family?: ProductCatalogFamily | null): ProductCatalogFamilyForm => ({
  technicalModel: family?.technicalModel ?? '',
  name: family?.name ?? '',
  description: family?.description ?? '',
  imageUrl: family?.imageUrl ?? '',
  sortOrder: family?.sortOrder ?? 10,
  active: family?.active ?? true,
});

export const ProductCatalogFamilyModal = ({ family, saving, onClose, onSave }: Props) => {
  const [form, setForm] = useState<ProductCatalogFamilyForm>(() => toInitialState(family));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await onSave({ ...form, technicalModel: form.technicalModel.trim() });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <form onSubmit={handleSubmit} className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-sm font-black uppercase tracking-wider">{family ? 'Editar familia' : 'Nueva familia'}</div>
            <div className="text-xs mt-1 text-slate-500">Configura la card principal que se mostrará en presupuestos.</div>
          </div>
          <button type="button" className="btn-ghost" onClick={onClose}>Cerrar</button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="field-label">Nombre *</label>
            <input className="field" value={form.name} onChange={event => setForm(prev => ({ ...prev, name: event.target.value }))} required />
          </div>
          <div>
            <label className="field-label">Modelo técnico *</label>
            <input
              className="field"
              value={form.technicalModel}
              onChange={event => setForm(prev => ({ ...prev, technicalModel: event.target.value }))}
              placeholder="Escribe el modelo técnico libremente"
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Se guardará como texto libre y se mostrará tal cual en el catálogo.
            </p>
          </div>
          <div className="md:col-span-2">
            <label className="field-label">Texto descriptivo</label>
            <textarea className="field min-h-24" value={form.description} onChange={event => setForm(prev => ({ ...prev, description: event.target.value }))} />
          </div>
          <div>
            <label className="field-label">Orden</label>
            <input className="field" type="number" value={form.sortOrder} onChange={event => setForm(prev => ({ ...prev, sortOrder: Number(event.target.value) || 0 }))} />
          </div>
          <div className="flex items-center gap-3 pt-7">
            <input id="family-active" type="checkbox" checked={form.active} onChange={event => setForm(prev => ({ ...prev, active: event.target.checked }))} />
            <label htmlFor="family-active" className="text-sm font-semibold">Activa en el wizard</label>
          </div>
          <div className="md:col-span-2">
            <label className="field-label">Imagen de la card</label>
            <input
              type="file"
              accept="image/*"
              onChange={async event => {
                const file = event.target.files?.[0];
                if (!file) {
                  return;
                }
                const imageUrl = await readImageAsDataUrl(file, {
                  maxWidth: 1280,
                  maxHeight: 960,
                });
                setForm(prev => ({ ...prev, imageUrl }));
              }}
            />
            {form.imageUrl && <img src={form.imageUrl} alt="Vista previa familia" className="mt-3 h-32 w-full rounded-2xl object-cover border border-slate-200" />}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
          <button type="button" className="btn-ghost" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Guardando...' : 'Guardar familia'}</button>
        </div>
      </form>
    </div>
  );
};
