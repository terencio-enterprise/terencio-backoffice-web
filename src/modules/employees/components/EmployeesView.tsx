import { AlertCircle, CheckCircle, Edit, Eye, EyeOff, KeyRound, Plus, Search, Shield, User, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AdminStoreService } from '../../../services/admin-store.service';
import { AdminUserService } from '../../../services/admin-user.service';
import type { CreateUserRequest, StoreDto, UpdateUserRequest, UserDto } from '../../../types';

export default function EmployeesView() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<UserDto[]>([]);
  const [stores, setStores] = useState<StoreDto[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserDto | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<Partial<CreateUserRequest>>({
    username: '',
    posPin: '',
    backofficePassword: '',
    fullName: '',
    role: '',
    storeId: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [usersData, storesData, rolesData] = await Promise.all([
        AdminUserService.getAll(),
        AdminStoreService.getAll(),
        AdminUserService.getRoles(),
      ]);
      setUsers(usersData);
      setStores(storesData);
      setRoles(rolesData);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error?.response?.data?.message || 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.username || !formData.fullName || !formData.role || !formData.storeId) {
      setError('Username, full name, role, and store are required');
      return;
    }

    if (!editingUser && (!formData.posPin || !formData.backofficePassword)) {
      setError('PIN and password are required for new users');
      return;
    }

    if (formData.posPin && formData.posPin.length !== 6) {
      setError('PIN must be exactly 6 digits');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      if (editingUser) {
        const updateData: UpdateUserRequest = {
          fullName: formData.fullName!,
          role: formData.role!,
          storeId: formData.storeId!,
        };
        await AdminUserService.update(editingUser.id, updateData);
      } else {
        await AdminUserService.create(formData as CreateUserRequest);
      }
      await loadData();
      handleCloseModal();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error?.response?.data?.message || 'Failed to save user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (user: UserDto) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      storeId: '', // Note: Backend should return storeId in UserDto
      posPin: '',
      backofficePassword: '',
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({
      username: '',
      posPin: '',
      backofficePassword: '',
      fullName: '',
      role: '',
      storeId: '',
    });
    setError('');
    setShowPassword(false);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadgeColor = (role: string) => {
    switch (role.toUpperCase()) {
      case 'ADMIN':
        return { bg: 'var(--danger-bg)', text: 'var(--danger-text)' };
      case 'MANAGER':
        return { bg: 'var(--info-bg)', text: 'var(--info-text)' };
      case 'CASHIER':
        return { bg: 'var(--success-bg)', text: 'var(--success-text)' };
      default:
        return { bg: 'var(--warning-bg)', text: 'var(--warning-text)' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            Employees Management
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Manage employee accounts, roles, and permissions
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all self-start sm:self-auto"
          style={{ backgroundColor: 'var(--accent)', color: 'var(--text-inverse)' }}
        >
          <Plus className="w-4 h-4" />
          Add Employee
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-lg border p-4" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent-light)' }}>
              <Users className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{users.length}</p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Total Employees</p>
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
                {users.filter((u) => u.isActive === 1).length}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Active</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border p-4" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--danger-bg)' }}>
              <Shield className="w-5 h-5" style={{ color: 'var(--danger-text)' }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {users.filter((u) => u.role === 'ADMIN').length}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Admins</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border p-4" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--info-bg)' }}>
              <User className="w-5 h-5" style={{ color: 'var(--info-text)' }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {users.filter((u) => u.role === 'CASHIER').length}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Cashiers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
        <input
          type="text"
          placeholder="Search employees..."
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
      {error && !isModalOpen && (
        <div className="p-4 rounded-lg flex items-start gap-3 border" style={{ backgroundColor: 'var(--danger-bg)', borderColor: 'var(--danger)', color: 'var(--danger-text)' }}>
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Employees Table */}
      <div className="rounded-lg border overflow-hidden" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: 'var(--surface-alt)' }}>
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  EMPLOYEE
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  USERNAME
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  ROLE
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  STATUS
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  CREATED
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading && users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <p style={{ color: 'var(--text-secondary)' }}>Loading employees...</p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <Users className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-tertiary)' }} />
                    <p style={{ color: 'var(--text-secondary)' }}>No employees found</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const roleColors = getRoleBadgeColor(user.role);
                  return (
                    <tr key={user.id} className="border-t" style={{ borderColor: 'var(--border-light)' }}>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--surface-alt)' }}>
                            <User className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                          </div>
                          <div>
                            <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                              {user.fullName}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {user.username}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: roleColors.bg, color: roleColors.text }}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {user.isActive === 1 ? (
                          <span className="px-2 py-1 rounded text-xs font-medium flex items-center gap-1 w-fit" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success-text)' }}>
                            <CheckCircle className="w-3 h-3" />
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: 'var(--danger-bg)', color: 'var(--danger-text)' }}>
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="p-2 rounded-lg transition-colors"
                            style={{ color: 'var(--text-secondary)' }}
                            title="Edit user"
                          >
                            <Edit className="w-4 h-4" />
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-xl shadow-2xl border my-8" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--border)' }}>
              <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                {editingUser ? 'Edit Employee' : 'Add New Employee'}
              </h2>
              <button onClick={handleCloseModal} className="p-1 rounded-lg transition-colors" style={{ color: 'var(--text-tertiary)' }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              {error && (
                <div className="p-3 rounded-lg flex items-start gap-2 border text-sm" style={{ backgroundColor: 'var(--danger-bg)', borderColor: 'var(--danger)', color: 'var(--danger-text)' }}>
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                    Username *
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border outline-none text-sm"
                    style={{ backgroundColor: 'var(--surface-alt)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                    placeholder="john.doe"
                    disabled={!!editingUser}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border outline-none text-sm"
                    style={{ backgroundColor: 'var(--surface-alt)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {!editingUser && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                        POS PIN (6 digits) *
                      </label>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={formData.posPin}
                          onChange={(e) => setFormData({ ...formData, posPin: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                          className="w-full pl-10 pr-4 py-2 rounded-lg border outline-none text-sm"
                          style={{ backgroundColor: 'var(--surface-alt)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                          placeholder="123456"
                          maxLength={6}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                        BackOffice Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={formData.backofficePassword}
                          onChange={(e) => setFormData({ ...formData, backofficePassword: e.target.value })}
                          className="w-full px-3 pr-10 py-2 rounded-lg border outline-none text-sm"
                          style={{ backgroundColor: 'var(--surface-alt)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                          style={{ color: 'var(--text-tertiary)' }}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                    Role *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border outline-none text-sm"
                    style={{ backgroundColor: 'var(--surface-alt)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                  >
                    <option value="">Select role</option>
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                    Store *
                  </label>
                  <select
                    value={formData.storeId}
                    onChange={(e) => setFormData({ ...formData, storeId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border outline-none text-sm"
                    style={{ backgroundColor: 'var(--surface-alt)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                  >
                    <option value="">Select store</option>
                    {stores.map((store) => (
                      <option key={store.id} value={store.id}>
                        {store.name} ({store.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t" style={{ borderColor: 'var(--border)' }}>
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors"
                style={{ backgroundColor: 'var(--surface-alt)', color: 'var(--text-primary)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ backgroundColor: 'var(--accent)', color: 'var(--text-inverse)' }}
              >
                <CheckCircle className="w-4 h-4" />
                {editingUser ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
