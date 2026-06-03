import { useEffect, useState } from 'react';
import type {
  ProductCatalogChildForm,
  ProductCatalogFamily,
  ProductCatalogFamilyForm,
} from './AdminManagement.types';
import {
  createProductCatalogChild,
  createProductCatalogFamily,
  deleteProductCatalogChild,
  deleteProductCatalogFamily,
  listProductCatalogFamilies,
  updateProductCatalogChild,
  updateProductCatalogFamily,
} from './productCatalogAdminApi';
import { setProductWizardStepInUrl } from './productCatalogUrl';

export const useProductCatalogManagement = () => {
  const [families, setFamilies] = useState<ProductCatalogFamily[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const reload = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listProductCatalogFamilies();
      setFamilies(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el catálogo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void reload();
  }, []);

  const saveFamily = async (familyId: string | null, payload: ProductCatalogFamilyForm) => {
    setSaving(true);
    setError('');
    try {
      if (familyId) {
        await updateProductCatalogFamily(familyId, payload);
      } else {
        await createProductCatalogFamily(payload);
      }
      setProductWizardStepInUrl();
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar la familia');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const removeFamily = async (familyId: string) => {
    setSaving(true);
    setError('');
    try {
      await deleteProductCatalogFamily(familyId);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar la familia');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const saveChild = async (childId: string | null, payload: ProductCatalogChildForm) => {
    setSaving(true);
    setError('');
    try {
      if (childId) {
        await updateProductCatalogChild(childId, payload);
      } else {
        await createProductCatalogChild(payload);
      }
      setProductWizardStepInUrl();
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el hijo');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const removeChild = async (childId: string) => {
    setSaving(true);
    setError('');
    try {
      await deleteProductCatalogChild(childId);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el hijo');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return {
    families,
    loading,
    saving,
    error,
    saveFamily,
    removeFamily,
    saveChild,
    removeChild,
  };
};
