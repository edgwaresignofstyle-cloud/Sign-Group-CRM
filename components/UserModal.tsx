import React, { useState, useEffect } from 'react';
import { User, UserRole, Permissions } from '../types';
import { XIcon } from './icons';

interface UserModalProps {
  user: User | null;
  onSave: (user: User) => void;
  onClose: () => void;
  rolePermissions: Record<UserRole, Permissions>;
}

const UserModal: React.FC<UserModalProps> = ({ user, onSave, onClose, rolePermissions }) => {
  const getInitialFormData = (): Omit<User, 'id' | 'password'> => {
    if (user) return JSON.parse(JSON.stringify(user)); // Deep copy
    const defaultRole = UserRole.SALES;
    return {
      name: '',
      email: '',
      role: defaultRole,
      permissions: rolePermissions[defaultRole],
    };
  };

  const [formData, setFormData] = useState<Omit<User, 'id' | 'password'>>(getInitialFormData);

  useEffect(() => {
    setFormData(getInitialFormData());
  }, [user]);

  const handleBasicChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as UserRole;
    if (window.confirm('Changing the role will reset permissions to the default for that role. Do you want to continue?')) {
        setFormData(prev => ({
            ...prev,
            role: newRole,
            permissions: rolePermissions[newRole],
        }));
    } else {
        // If user cancels, just update the role without changing permissions
        setFormData(prev => ({ ...prev, role: newRole }));
    }
  };

  const handlePermissionChange = (module: keyof Permissions, action: keyof Permissions['jobs'], value: boolean) => {
    setFormData(prev => ({
        ...prev,
        permissions: {
            ...prev.permissions,
            [module]: {
                ...prev.permissions[module],
                [action]: value,
            },
        },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, id: user?.id || '' });
  };

  const modules = Object.keys(formData.permissions) as Array<keyof Permissions>;
  const actions = ['view', 'create', 'edit', 'delete'] as const;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
            <h2 className="text-xl font-bold text-gray-800">{user ? 'Edit User' : 'Add New User'}</h2>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <XIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="p-8 space-y-8">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleBasicChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    required
                />
                </div>
                <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleBasicChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    required
                />
                </div>
                <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                <select
                    name="role"
                    id="role"
                    value={formData.role}
                    onChange={handleRoleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                    {Object.values(UserRole).map(role => (
                    <option key={role} value={role}>{role}</option>
                    ))}
                </select>
                </div>
                 {!user && (
                    <div className="md:col-span-2">
                        <p className="text-sm text-gray-500">A default password will be set for the new user. They can change it from their profile.</p>
                    </div>
                )}
            </div>
            
            {/* Permissions */}
            <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Permissions</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="py-2 px-4">Module</th>
                                {actions.map(action => <th key={action} className="py-2 px-4 text-center capitalize">{action}</th>)}
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {modules.map(module => (
                                <tr key={module} className="border-b">
                                    <td className="py-3 px-4 font-medium text-gray-900 capitalize">{module}</td>
                                    {actions.map(action => (
                                        <td key={action} className="py-2 px-4 text-center">
                                            <input 
                                                type="checkbox"
                                                checked={formData.permissions[module][action]}
                                                onChange={(e) => handlePermissionChange(module, action, e.target.checked)}
                                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

          </div>
          <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;