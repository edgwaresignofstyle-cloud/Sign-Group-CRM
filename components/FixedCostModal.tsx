import React, { useState, useEffect } from 'react';
import { FixedCostItem } from '../types';
import { XIcon, LockClosedIcon } from './icons';

interface FixedCostModalProps {
  item: FixedCostItem | null;
  onSave: (item: FixedCostItem) => void;
  onClose: () => void;
  isReadOnly: boolean;
}

const FixedCostModal: React.FC<FixedCostModalProps> = ({ item, onSave, onClose, isReadOnly }) => {
  const [formData, setFormData] = useState<Omit<FixedCostItem, 'id'>>({
    name: '',
    monthlyAmount: 0,
  });

  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
        setFormData({ name: '', monthlyAmount: 0 });
    }
  }, [item]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'monthlyAmount' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;
    onSave({ ...formData, id: item?.id || '' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                {item ? 'Edit Fixed Cost' : 'Add Fixed Cost'}
                {isReadOnly && <LockClosedIcon className="w-5 h-5 text-gray-400" title="Read Only"/>}
            </h2>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <XIcon className="w-6 h-6" />
            </button>
          </div>
          <fieldset disabled={isReadOnly} className="group">
          <div className="p-8 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Cost Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 group-disabled:bg-gray-100"
                required
              />
            </div>
            <div>
              <label htmlFor="monthlyAmount" className="block text-sm font-medium text-gray-700">Monthly Amount (£)</label>
              <input
                type="number"
                name="monthlyAmount"
                id="monthlyAmount"
                value={formData.monthlyAmount}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 group-disabled:bg-gray-100"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>
          </fieldset>
          <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            {!isReadOnly && (
                <button
                type="submit"
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                Save Cost
                </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default FixedCostModal;
