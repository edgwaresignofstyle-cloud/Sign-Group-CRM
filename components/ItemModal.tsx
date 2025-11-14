import React, { useState, useEffect } from 'react';
import { CostItem, ItemCategory } from '../types';
import { XIcon, LockClosedIcon } from './icons';

interface ItemModalProps {
  item: CostItem | null;
  categories: ItemCategory[];
  onSave: (item: CostItem) => void;
  onClose: () => void;
  isReadOnly: boolean;
}

const ItemModal: React.FC<ItemModalProps> = ({ item, categories, onSave, onClose, isReadOnly }) => {
  const getInitialFormData = (): Omit<CostItem, 'id'> => {
    if (item) return item;
    return {
      name: '',
      unit: 'item',
      costPerUnit: 0,
      categoryId: categories[0]?.id || '',
    };
  };
  
  const [formData, setFormData] = useState<Omit<CostItem, 'id'>>(getInitialFormData);

  useEffect(() => {
    setFormData(getInitialFormData());
  }, [item, categories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'costPerUnit' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;
    if (!formData.categoryId && categories.length > 0) {
        // Prevent saving without a category if categories exist
        alert("Please select a category.");
        return;
    }
    onSave({ ...formData, id: item?.id || '' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                {item ? 'Edit Item' : 'Add New Item'}
                {isReadOnly && <LockClosedIcon className="w-5 h-5 text-gray-400" title="Read Only"/>}
            </h2>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <XIcon className="w-6 h-6" />
            </button>
          </div>
          <fieldset disabled={isReadOnly} className="group">
          <div className="p-8 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Item Name</label>
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
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">Category</label>
              <select
                name="categoryId"
                id="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 group-disabled:bg-gray-100"
                required
              >
                <option value="" disabled>Select a category</option>
                {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700">Unit</label>
              <select
                name="unit"
                id="unit"
                value={formData.unit}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 group-disabled:bg-gray-100"
              >
                <option value="item">Item</option>
                <option value="sqm">SQM</option>
                <option value="meter">Meter</option>
                <option value="hour">Hour</option>
                <option value="day">Day</option>
              </select>
            </div>
            <div>
              <label htmlFor="costPerUnit" className="block text-sm font-medium text-gray-700">Cost Per Unit (£)</label>
              <input
                type="number"
                name="costPerUnit"
                id="costPerUnit"
                value={formData.costPerUnit}
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
                Save Item
                </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemModal;
