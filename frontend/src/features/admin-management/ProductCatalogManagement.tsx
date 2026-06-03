import { useMemo, useState } from 'react';
import { resolveChildCardImage, resolveFamilyCardImage } from '../budget-wizard/budgetWizardCatalogMedia';
import { ProductCatalogChildModal } from './ProductCatalogChildModal';
import { ProductCatalogFamilyModal } from './ProductCatalogFamilyModal';
import type { ProductCatalogChild, ProductCatalogFamily } from './AdminManagement.types';
import { useProductCatalogManagement } from './useProductCatalogManagement';

export const ProductCatalogManagement = () => {
  const { families, loading, saving, error, saveFamily, removeFamily, saveChild, removeChild } = useProductCatalogManagement();
  const [editingFamily, setEditingFamily] = useState<ProductCatalogFamily | null>(null);
  const [editingChild, setEditingChild] = useState<ProductCatalogChild | null>(null);
  const [newChildFamilyId, setNewChildFamilyId] = useState<string | null>(null);

  const orderedFamilies = useMemo(
    () => [...families].sort((left, right) => left.sortOrder - right.sortOrder || left.name.localeCompare(right.name)),
    [families],
  );

  return (
    <div className="flex flex-col gap-4 min-h-0">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-black uppercase tracking-wider" style={{ color: '#111827' }}>
            Familias y tarjetas de producto
          </div>
          <p className="text-xs mt-1" style={{ color: '#6b7280' }}>
            Desde aquí se crean las familias del primer paso y los hijos del segundo paso del wizard.
          </p>
        </div>
        <button className="btn-primary" onClick={() => setEditingFamily({ id: '', technicalModel: '', name: '', description: '', imageUrl: '', sortOrder: 10, active: true, children: [] })}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Nueva familia
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className="flex-1 overflow-auto pr-1">
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500">
            Cargando catálogo...
          </div>
        ) : orderedFamilies.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center text-sm text-slate-500">
            No hay familias configuradas todavía.
          </div>
        ) : (
          <div className="grid gap-4">
            {orderedFamilies.map(family => (
              <section key={family.id} className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-[280px,1fr]">
                  <div className="relative min-h-56 border-b lg:border-b-0 lg:border-r border-slate-200">
                    <img src={resolveFamilyCardImage(family)} alt={family.name} className="absolute inset-0 h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-white/10" />
                    <div className="relative z-10 flex h-full flex-col justify-end p-5">
                      <div className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: '#2563eb' }}>
                        {family.active ? 'Activa' : 'Oculta'}
                      </div>
                      <div className="mt-2 text-lg font-black uppercase tracking-wide">{family.name}</div>
                      <div className="mt-2 text-xs text-slate-600">{family.description || 'Sin texto descriptivo.'}</div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button className="btn-ghost" onClick={() => setEditingFamily(family)}>Editar familia</button>
                        <button className="btn-ghost" onClick={() => setNewChildFamilyId(family.id)}>Nuevo hijo</button>
                        <button className="btn-ghost" onClick={() => void removeFamily(family.id)}>Eliminar</button>
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div>
                        <div className="text-xs font-black uppercase tracking-wider text-slate-800">Hijos de la familia</div>
                        <div className="text-[11px] text-slate-500 mt-1">Estas cards aparecen en el segundo paso del presupuesto.</div>
                      </div>
                      <div className="text-[11px] text-slate-500">Modelo técnico: {family.technicalModel}</div>
                    </div>

                    {family.children.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-center text-xs text-slate-500">
                        Esta familia todavía no tiene hijos configurados.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {family.children.map(child => (
                          <article key={child.id} className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50">
                            <img src={resolveChildCardImage(child)} alt={child.name} className="h-36 w-full object-cover bg-white" />
                            <div className="p-4 space-y-2">
                              <div className="flex items-center justify-between gap-3">
                                <div className="text-sm font-black uppercase tracking-wide">{child.name}</div>
                                <span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold text-slate-500 border border-slate-200">
                                  {child.active ? 'Activo' : 'Oculto'}
                                </span>
                              </div>
                              <div className="text-xs text-slate-600">{child.description || 'Sin texto descriptivo.'}</div>
                              <div className="text-[11px] text-slate-500">
                                {child.productCategory} · {child.doorType}
                              </div>
                              <div className="flex gap-2 pt-2">
                                <button className="btn-ghost" onClick={() => setEditingChild(child)}>Editar</button>
                                <button className="btn-ghost" onClick={() => void removeChild(child.id)}>Eliminar</button>
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      {editingFamily && (
        <ProductCatalogFamilyModal
          family={editingFamily.id ? editingFamily : null}
          saving={saving}
          onClose={() => setEditingFamily(null)}
          onSave={payload => saveFamily(editingFamily.id || null, payload)}
        />
      )}

      {(editingChild || newChildFamilyId) && (
        <ProductCatalogChildModal
          child={editingChild}
          defaultFamilyId={newChildFamilyId}
          families={families}
          saving={saving}
          onClose={() => {
            setEditingChild(null);
            setNewChildFamilyId(null);
          }}
          onSave={payload => saveChild(editingChild?.id ?? null, payload)}
        />
      )}
    </div>
  );
};
