import { AlertCircle, Building2, CheckCircle, Edit, MapPin, Plus, Search, Store as StoreIcon, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AdminStoreService } from '../../../services/admin-store.service';
import type { StoreDto } from '../../../types';

export default function StoresView() {
  const { t } = useTranslation();
  const [stores, setStores] = useState<StoreDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<StoreDto | null>(null);
  const [formData, setFormData] = useState<Partial<StoreDto>>({
    code: '',
    name: '',
    address: '',
    taxId: '',
    isActive: true,
  });

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await AdminStoreService.getAll();
      setStores(data);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error?.response?.data?.message || 'Failed to load stores');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.code || !formData.name) {
      setError(t('stores.codeAndNameRequired'));
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      if (editingStore) {
        await AdminStoreService.update(editingStore.id, formData as StoreDto);
      } else {
        await AdminStoreService.create(formData as StoreDto);
      }
      await loadStores();
      handleCloseModal();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error?.response?.data?.message || t('stores.failedToSave'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('stores.confirmDelete'))) return;

    setIsLoading(true);
    setError('');
    try {
      await AdminStoreService.delete(id);
      await loadStores();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error?.response?.data?.message || t('stores.failedToDelete'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (store: StoreDto) => {
    setEditingStore(store);
    setFormData(store);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStore(null);
    setFormData({ code: '', name: '', address: '', taxId: '', isActive: true });
    setError('');
  };

  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            {t('stores.title')}
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {t('stores.subtitle')}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all self-start sm:self-auto"
          style={{ backgroundColor: 'var(--accent)', color: 'var(--text-inverse)' }}
        >
          <Plus className="w-4 h-4" />
          {t('stores.addStore')}
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
        <input
          type="text"
          placeholder={t('common.search')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border outline-none transition-all text-sm"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)',
            color: 'var(--text-primary)',
          }}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-lg flex items-start gap-3 border" style={{ backgroundColor: 'var(--danger-bg)', borderColor: 'var(--danger)', color: 'var(--danger-text)' }}>
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Stores Grid */}
      {isLoading && stores.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full animate-pulse" style={{ backgroundColor: 'var(--surface-alt)' }} />
          <p style={{ color: 'var(--text-secondary)' }}>{t('common.loading')}</p>
        </div>
      ) : filteredStores.length === 0 ? (
        <div className="text-center py-12 rounded-lg" style={{ backgroundColor: 'var(--surface)' }}>
          <Building2 className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-tertiary)' }} />
          <p style={{ color: 'var(--text-secondary)' }}>{t('stores.noStores')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStores.map((store) => (
            <div
              key={store.id}
              className="rounded-lg border p-5 transition-all hover:shadow-lg"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent-light)' }}>
                    <StoreIcon className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                  </div>
                  <div>
                    <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {store.name}
                    </h3>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      {store.code}
                    </p>
                  </div>
                </div>
                {store.isActive ? (
                  <span className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success-text)' }}>
                    {t('common.active')}
                  </span>
                ) : (
                  <span className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: 'var(--danger-bg)', color: 'var(--danger-text)' }}>
                    {t('common.inactive')}
                  </span>
                )}
              </div>

              {store.address && (
                <div className="flex items-start gap-2 mb-3">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--text-tertiary)' }} />
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {store.address}
                  </p>
                </div>
              )}

              {store.taxId && (
                <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>
                  Tax ID: {store.taxId}
                </p>
              )}

              <div className="flex gap-2 pt-3 border-t" style={{ borderColor: 'var(--border-light)' }}>
                <button
                  onClick={() => handleEdit(store)}
                  className="flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  style={{ backgroundColor: 'var(--surface-alt)', color: 'var(--text-primary)' }}
                >
                  <Edit className="w-4 h-4" />
                  {t('common.edit')}
                </button>
                <button
                  onClick={() => handleDelete(store.id)}
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{ backgroundColor: 'var(--danger-bg)', color: 'var(--danger-text)' }}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-lg rounded-xl shadow-2xl border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--border)' }}>
              <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                {editingStore ? t('stores.editStore') : t('stores.createStore')}
              </h2>
              <button onClick={handleCloseModal} className="p-1 rounded-lg transition-colors" style={{ color: 'var(--text-tertiary)' }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                    {t('stores.storeCode')} *
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border outline-none text-sm"
                    style={{ backgroundColor: 'var(--surface-alt)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                    placeholder={t('stores.enterCode')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                    {t('stores.storeName')} *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border outline-none text-sm"
                    style={{ backgroundColor: 'var(--surface-alt)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                    placeholder={t('stores.enterName')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  {t('stores.address')}
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border outline-none text-sm"
                  style={{ backgroundColor: 'var(--surface-alt)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                  placeholder={t('stores.enterAddress')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  {t('stores.taxId')}
                </label>
                <input
                  type="text"
                  value={formData.taxId}
                  onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border outline-none text-sm"
                  style={{ backgroundColor: 'var(--surface-alt)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                  placeholder={t('stores.enterTaxId')}
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: 'var(--accent)' }}
                />
                <label htmlFor="isActive" className="text-sm font-medium cursor-pointer" style={{ color: 'var(--text-primary)' }}>
                  Store is active
                </label>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t" style={{ borderColor: 'var(--border)' }}>
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors"
                style={{ backgroundColor: 'var(--surface-alt)', color: 'var(--text-primary)' }}
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ backgroundColor: 'var(--accent)', color: 'var(--text-inverse)' }}
              >
                <CheckCircle className="w-4 h-4" />
                {editingStore ? t('common.save') : t('common.create')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
