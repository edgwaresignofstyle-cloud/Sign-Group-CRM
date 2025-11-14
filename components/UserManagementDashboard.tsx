import React from 'react';
import { User } from '../types';
import { EditIcon, TrashIcon, PlusIcon, UserCircleIcon } from './icons';

// --- START OF UserCard COMPONENT ---
interface UserCardProps {
  user: User;
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onEditUser, onDeleteUser }) => {
    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
            <div className="p-4 flex items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <UserCircleIcon className="w-10 h-10 text-gray-400 flex-shrink-0" />
                    <div>
                        <div className="font-bold text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500 break-all">{user.email}</div>
                    </div>
                </div>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 self-center">
                    {user.role}
                </span>
            </div>
            <div className="p-2 bg-gray-50/70 border-t flex justify-end items-center gap-2">
                <button onClick={() => onEditUser(user)} className="flex items-center gap-2 text-sm font-medium py-2 px-3 rounded-md text-indigo-600 hover:bg-indigo-50 transition-colors" aria-label={`Edit ${user.name}`}>
                    <EditIcon className="w-4 h-4" />
                    <span>Edit</span>
                </button>
                <button onClick={() => onDeleteUser(user.id)} className="flex items-center gap-2 text-sm font-medium py-2 px-3 rounded-md text-red-600 hover:bg-red-50 transition-colors" aria-label={`Delete ${user.name}`}>
                    <TrashIcon className="w-4 h-4" />
                    <span>Delete</span>
                </button>
            </div>
        </div>
    );
};
// --- END OF UserCard COMPONENT ---


interface UserManagementDashboardProps {
  users: User[];
  onAddNewUser: () => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
}

const UserManagementDashboard: React.FC<UserManagementDashboardProps> = ({ users, onAddNewUser, onEditUser, onDeleteUser }) => {
  return (
    <div>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
            <button
                onClick={onAddNewUser}
                className="flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                <PlusIcon className="w-5 h-5" />
                <span>Add New User</span>
            </button>
        </div>
        {/* Desktop Table View */}
        <div className="hidden md:block bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                        <tr>
                            <th scope="col" className="px-6 py-3">User</th>
                            <th scope="col" className="px-6 py-3">Role</th>
                            <th scope="col" className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <UserCircleIcon className="w-8 h-8 text-gray-400" />
                                        <div>
                                            <div className="font-bold text-gray-900">{user.name}</div>
                                            <div className="text-xs text-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end items-center gap-4">
                                        <button onClick={() => onEditUser(user)} className="text-indigo-600 hover:text-indigo-800 transition-colors" aria-label={`Edit ${user.name}`}>
                                            <EditIcon className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => onDeleteUser(user.id)} className="text-red-600 hover:text-red-800 transition-colors" aria-label={`Delete ${user.name}`}>
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
         {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {users.map(user => (
            <UserCard 
              key={user.id}
              user={user}
              onEditUser={onEditUser}
              onDeleteUser={onDeleteUser}
            />
          ))}
        </div>
    </div>
  );
};

export default UserManagementDashboard;
