import { useState } from 'react';
import type { DoorType } from '../customer-onboarding/models';
import type { ProductCategory } from '../budget-wizard/BudgetWizard.types';
import { readImageAsDataUrl } from './productCatalogImage';
import type { ProductCatalogChild, ProductCatalogChildForm, ProductCatalogFamily } from './AdminManagement.types';

type Props = {
  child?: ProductCatalogChild | null;
  defaultFamilyId?: string | null;
  families: ProductCatalogFamily[];
  saving: boolean;
  onClose: () => void;
  onSave: (payload: ProductCatalogChildForm) => Promise<void>;
};

const productCategories: ProductCategory[] = ['PUERTA_PASO', 'PUERTA_GARAJE', 'VALLA', 'REJA'];
const doorTypes: DoorType[] = ['PEATONAL', 'ABATIBLE_UNA', 'ABATIBLE_DOS', 'CORREDERA', 'VALLA'];

const toInitialState = (child: ProductCatalogChild | null | undefined, defaultFamilyId?: string | null): ProductCatalogChildForm => ({
  familyId: child?.familyId ?? defaultFamilyId ?? '',
  productCategory: child?.productCategory ?? 'PUERTA_PASO',
  doorType: child?.doorType ?? 'PEATONAL',
  name: child?.name ?? '',
  description: child?.description ?? '',
  imageUrl: child?.imageUrl ?? '',
  sortOrder: child?.sortOrder ?? 10,
  active: child?.active ?? true,
});

export const ProductCatalogChildModal = ({ child, defaultFamilyId, families, saving, onClose, onSave }: Props) => {
  const [form, setForm] = useState<ProductCatalogChildForm>(() => toInitialState(child, defaultFamilyId));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <form onSubmit={handleSubmit} className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-sm font-black uppercase tracking-wider">{child ? 'Editar hijo' : 'Nuevo hijo'}</div>
            <div className="text-xs mt-1 text-slate-500">Estas opciones son las cards del segundo paso del wizard.</div>
          </div>
          <button type="button" className="btn-ghost" onClick={onClose}>Cerrar</button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="field-label">Familia *</label>
            <select className="field" value={form.familyId} onChange={event => setForm(prev => ({ ...prev, familyId: event.target.value }))} required>
              <option value="">Selecciona una familia</option>
              {families.map(family => (
                <option key={family.id} value={family.id}>{family.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label">Nombre visible *</label>
            <input className="field" value={form.name} onChange={event => setForm(prev => ({ ...prev, name: event.target.value }))} required />
          </div>
          <div>
            <label className="field-label">Categoría técnica *</label>
            <select className="field" value={form.productCategory} onChange={event => setForm(prev => ({ ...prev, productCategory: event.target.value as ProductCategory }))}>
              {productCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label">Tipo técnico *</label>
            <select className="field" value={form.doorType} onChange={event => setForm(prev => ({ ...prev, doorType: event.target.value as DoorType }))}>
              {doorTypes.map(doorType => (
                <option key={doorType} value={doorType}>{doorType}</option>
              ))}
            </select>
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
            <input id="child-active" type="checkbox" checked={form.active} onChange={event => setForm(prev => ({ ...prev, active: event.target.checked }))} />
            <label htmlFor="child-active" className="text-sm font-semibold">Activo en el wizard</label>
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
                  maxWidth: 1024,
                  maxHeight: 768,
                });
                setForm(prev => ({ ...prev, imageUrl }));
              }}
            />
            {form.imageUrl && <img src={form.imageUrl} alt="Vista previa hijo" className="mt-3 h-32 w-full rounded-2xl object-cover border border-slate-200" />}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
          <button type="button" className="btn-ghost" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Guardando...' : 'Guardar hijo'}</button>
        </div>
      </form>
    </div>
  );
};
