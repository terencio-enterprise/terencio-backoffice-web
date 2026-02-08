import { AlertCircle, CheckCircle, Clock, Copy, Lock, Plus, RotateCcw, Search, Smartphone, Store as StoreIcon, Unlock, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AdminStoreService } from '../../../services/admin-store.service';
import { AdminDeviceService } from '../../../services/device.service';
import type { DeviceDto, GenerateCodeRequest, GeneratedCodeDto, StoreDto } from '../../../types';

export default function DevicesView() {
  const { t } = useTranslation();
  const [devices, setDevices] = useState<DeviceDto[]>([]);
  const [stores, setStores] = useState<StoreDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<GeneratedCodeDto | null>(null);
  const [codeFormData, setCodeFormData] = useState<GenerateCodeRequest>({
    storeId: '',
    posName: '',
    validityHours: 24,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [devicesData, storesData] = await Promise.all([
        AdminDeviceService.getAll(),
        AdminStoreService.getAll(),
      ]);
      setDevices(devicesData);
      setStores(storesData);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error?.response?.data?.message || 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateCode = async () => {
    if (!codeFormData.storeId || !codeFormData.posName) {
      setError(t('devices.storeRequired'));
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      const code = await AdminDeviceService.generateCode(codeFormData);
      setGeneratedCode(code);
      setSuccess(t('devices.codeGenerated'));
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error?.response?.data?.message || t('devices.failedToGenerate'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, action: 'block' | 'unblock' | 'reset') => {
    const confirmMsg = action === 'reset' 
      ? t('devices.confirmReset')
      : action === 'block' 
      ? t('devices.confirmBlock')
      : t('devices.confirmUnblock');
    
    if (!confirm(confirmMsg)) return;

    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      await AdminDeviceService.updateStatus(id, action);
      await loadData();
      const successMsg = action === 'block' ? t('devices.deviceBlocked') : action === 'unblock' ? t('devices.deviceUnblocked') : t('devices.deviceReset');
      setSuccess(successMsg);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const errorMsg = action === 'block' ? t('devices.failedToBlock') : action === 'unblock' ? t('devices.failedToUnblock') : t('devices.failedToReset');
      setError(error?.response?.data?.message || errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (generatedCode?.code) {
      navigator.clipboard.writeText(generatedCode.code);
      setSuccess(t('devices.codeCopied'));
      setTimeout(() => setSuccess(''), 2000);
    }
  };

  const handleCloseCodeModal = () => {
    setIsCodeModalOpen(false);
    setGeneratedCode(null);
    setCodeFormData({ storeId: '', posName: '', validityHours: 24 });
    setError('');
  };

  const filteredDevices = devices.filter(
    (device) =>
      device.storeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.serialCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.hardwareId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status?: string) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return { bg: 'var(--success-bg)', text: 'var(--success-text)' };
      case 'BLOCKED':
        return { bg: 'var(--danger-bg)', text: 'var(--danger-text)' };
      case 'PENDING':
        return { bg: 'var(--warning-bg)', text: 'var(--warning-text)' };
      default:
        return { bg: 'var(--surface-alt)', text: 'var(--text-tertiary)' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            {t('devices.title')}
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {t('devices.subtitle')}
          </p>
        </div>
        <button
          onClick={() => setIsCodeModalOpen(true)}
          className="px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all self-start sm:self-auto cursor-pointer noSelect"
          style={{ backgroundColor: 'var(--accent)', color: 'var(--text-inverse)' }}
        >
          <Plus className="w-4 h-4" />
          {t('devices.generateCode')}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 noSelect">
        <div className="rounded-lg border p-4" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent-light)' }}>
              <Smartphone className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{devices.length}</p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{t('common.status')}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border p-4" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--success-bg)' }}>
              <CheckCircle className="w-5 h-5" style={{ color: 'var(--success-text)' }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {devices.filter((d) => d.status === 'ACTIVE').length}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{t('common.active')}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border p-4" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--warning-bg)' }}>
              <Clock className="w-5 h-5" style={{ color: 'var(--warning-text)' }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {devices.filter((d) => d.status === 'PENDING').length}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{t('badges.pending')}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border p-4" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--danger-bg)' }}>
              <Lock className="w-5 h-5" style={{ color: 'var(--danger-text)' }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {devices.filter((d) => d.status === 'BLOCKED').length}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{t('devices.block')}</p>
            </div>
          </div>
        </div>
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

      {/* Messages */}
      {error && !isCodeModalOpen && (
        <div className="p-4 rounded-lg flex items-start gap-3 border" style={{ backgroundColor: 'var(--danger-bg)', borderColor: 'var(--danger)', color: 'var(--danger-text)' }}>
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}
      {success && (
        <div className="p-4 rounded-lg flex items-start gap-3 border" style={{ backgroundColor: 'var(--success-bg)', borderColor: 'var(--success)', color: 'var(--success-text)' }}>
          <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{success}</p>
        </div>
      )}

      {/* Devices Table */}
      <div className="rounded-lg border overflow-hidden" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: 'var(--surface-alt)' }}>
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  {t('devices.deviceName').toUpperCase()}
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  {t('devices.store').toUpperCase()}
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  {t('common.status').toUpperCase()}
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  {t('devices.version').toUpperCase()}
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  {t('devices.lastSync').toUpperCase()}
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  {t('common.actions').toUpperCase()}
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading && devices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <p style={{ color: 'var(--text-secondary)' }}>{t('common.loading')}</p>
                  </td>
                </tr>
              ) : filteredDevices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <Smartphone className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-tertiary)' }} />
                    <p style={{ color: 'var(--text-secondary)' }}>{t('devices.failedToLoad')}</p>
                  </td>
                </tr>
              ) : (
                filteredDevices.map((device) => {
                  const statusColors = getStatusColor(device.status);
                  return (
                    <tr key={device.id} className="border-t" style={{ borderColor: 'var(--border-light)' }}>
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                            {device.serialCode || 'N/A'}
                          </p>
                          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                            {device.hardwareId || 'No Hardware ID'}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <StoreIcon className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
                          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            {device.storeName || 'N/A'}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-2 py-1 rounded text-xs font-medium uppercase" style={{ backgroundColor: statusColors.bg, color: statusColors.text }}>
                          {device.status || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {device.versionApp || 'N/A'}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {device.lastSyncAt ? new Date(device.lastSyncAt).toLocaleDateString() : 'Never'}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {device.status === 'BLOCKED' ? (
                            <button
                              onClick={() => handleUpdateStatus(device.id, 'unblock')}
                              className="p-2 rounded-lg transition-colors cursor-pointer"
                              style={{ color: 'var(--success-text)' }}
                              title={t('devices.unblock')}
                            >
                              <Unlock className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUpdateStatus(device.id, 'block')}
                              className="p-2 rounded-lg transition-colors cursor-pointer"
                              style={{ color: 'var(--danger-text)' }}
                              title={t('devices.block')}
                            >
                              <Lock className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleUpdateStatus(device.id, 'reset')}
                            className="p-2 rounded-lg transition-colors cursor-pointer"
                            style={{ color: 'var(--text-secondary)' }}
                            title={t('devices.reset')}
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Code Modal */}
      {isCodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-lg rounded-xl shadow-2xl border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--border)' }}>
              <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                {t('devices.setupCodeGeneration')}
              </h2>
              <button onClick={handleCloseCodeModal} className="p-1 rounded-lg transition-colors cursor-pointer" style={{ color: 'var(--text-tertiary)' }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {error && (
                <div className="p-3 rounded-lg flex items-start gap-2 border text-sm" style={{ backgroundColor: 'var(--danger-bg)', borderColor: 'var(--danger)', color: 'var(--danger-text)' }}>
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              {generatedCode ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--success-bg)', borderColor: 'var(--success)' }}>
                    <p className="text-sm font-medium mb-3" style={{ color: 'var(--success-text)' }}>
                      {t('devices.codeGenerated')}
                    </p>
                    <div className="flex items-center gap-2 p-3 rounded-lg" style={{ backgroundColor: 'var(--surface)' }}>
                      <code className="flex-1 text-2xl font-mono font-bold tracking-wider text-center" style={{ color: 'var(--text-primary)' }}>
                        {generatedCode.code}
                      </code>
                      <button
                        onClick={handleCopyCode}
                        className="p-2 rounded-lg transition-colors cursor-pointer"
                        style={{ backgroundColor: 'var(--accent)', color: 'var(--text-inverse)' }}
                        title={t('devices.copyCode')}
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm space-y-2" style={{ color: 'var(--text-secondary)' }}>
                    <p><strong>{t('devices.deviceName')}:</strong> {generatedCode.posName}</p>
                    <p><strong>{t('devices.expiresAt')}:</strong> {new Date(generatedCode.expiresAt).toLocaleString()}</p>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                      {t('devices.store')} *
                    </label>
                    <select
                      value={codeFormData.storeId}
                      onChange={(e) => setCodeFormData({ ...codeFormData, storeId: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border outline-none text-sm"
                      style={{ backgroundColor: 'var(--surface-alt)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                    >
                      <option value="">{t('devices.selectStore')}</option>
                      {stores.map((store) => (
                        <option key={store.id} value={store.id}>
                          {store.name} ({store.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                      {t('devices.deviceName')} *
                    </label>
                    <input
                      type="text"
                      value={codeFormData.posName}
                      onChange={(e) => setCodeFormData({ ...codeFormData, posName: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border outline-none text-sm"
                      style={{ backgroundColor: 'var(--surface-alt)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                      placeholder={t('devices.enterPosName')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                      {t('devices.codeValidity')}
                    </label>
                    <input
                      type="number"
                      value={codeFormData.validityHours}
                      onChange={(e) => setCodeFormData({ ...codeFormData, validityHours: parseInt(e.target.value) || 24 })}
                      className="w-full px-3 py-2 rounded-lg border outline-none text-sm"
                      style={{ backgroundColor: 'var(--surface-alt)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                      min="1"
                      max="168"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-3 p-6 border-t" style={{ borderColor: 'var(--border)' }}>
              {generatedCode ? (
                <button
                  onClick={handleCloseCodeModal}
                  className="w-full px-4 py-2.5 rounded-lg font-medium transition-colors cursor-pointer noSelect"
                  style={{ backgroundColor: 'var(--accent)', color: 'var(--text-inverse)' }}
                >
                  {t('devices.done')}
                </button>
              ) : (
                <>
                  <button
                    onClick={handleCloseCodeModal}
                    className="flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors cursor-pointer noSelect"
                    style={{ backgroundColor: 'var(--surface-alt)', color: 'var(--text-primary)' }}
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    onClick={handleGenerateCode}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 cursor-pointer noSelect"
                    style={{ backgroundColor: 'var(--accent)', color: 'var(--text-inverse)' }}
                  >
                    {t('devices.generateCode')}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
