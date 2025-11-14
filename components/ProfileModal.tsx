import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { XIcon, KeyIcon, UserCircleIcon } from './icons';

interface ProfileModalProps {
  user: User;
  onSave: (userId: string, currentPasswordAttempt: string, newDetails: { name: string; email: string; password?: string }) => Promise<boolean>;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ user, onSave, onClose }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword && newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    
    if (!currentPassword) {
        setError("Current password is required to save changes.");
        return;
    }

    const newDetails: { name: string; email: string; password?: string } = { name, email };
    if (newPassword) {
      newDetails.password = newPassword;
    }

    const success = await onSave(user.id, currentPassword, newDetails);

    if (!success) {
      setError("Incorrect current password. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <UserCircleIcon className="w-6 h-6 text-indigo-600"/>
                My Profile
            </h2>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <XIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="p-8 space-y-6">
            <div>
              <label htmlFor="profileName" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                id="profileName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="profileEmail" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                id="profileEmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            
            <div className="border-t pt-6 space-y-6">
                <p className="text-sm text-gray-500 flex items-start gap-2">
                    <KeyIcon className="w-5 h-5 mt-0.5 text-gray-400 flex-shrink-0"/>
                    <span>To change your password, enter your current password and then your new password below. Otherwise, just enter your current password to save other changes.</span>
                </p>
                <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
                    <input
                        type="password"
                        id="currentPassword"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>
                 <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                    <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                 <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          </div>
          <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;