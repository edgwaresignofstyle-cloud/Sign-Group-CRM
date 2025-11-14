import React, { useState, useEffect } from 'react';
import { ItemCategory } from '../types';
import { XIcon, Icon, LockClosedIcon } from './icons';

type ColorOption = {
    name: string;
    value: { bg: string; text: string; border: string; };
};

interface CategoryModalProps {
  category: ItemCategory | null;
  onSave: (category: ItemCategory) => void;
  onClose: () => void;
  availableColors: ColorOption[];
  availableIcons: string[];
  isReadOnly: boolean;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ category, onSave, onClose, availableColors, availableIcons, isReadOnly }) => {
  
  const getInitialFormData = (): Omit<ItemCategory, 'id'> => {
    if (category) return { ...category };
    return {
      name: '',
      icon: availableIcons[0],
      color: availableColors[0].value,
    };
  };

  const [formData, setFormData] = useState<Omit<ItemCategory, 'id'>>(getInitialFormData);

  useEffect(() => {
    setFormData(getInitialFormData());
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;
    onSave({ ...formData, id: category?.id || '' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                {category ? 'Edit Category' : 'Add New Category'}
                {isReadOnly && <LockClosedIcon className="w-5 h-5 text-gray-400" title="Read Only"/>}
            </h2>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <XIcon className="w-6 h-6" />
            </button>
          </div>
          <fieldset disabled={isReadOnly} className="group">
          <div className="p-8 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Category Name</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 group-disabled:bg-gray-100"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Color</label>
              <div className="mt-2 grid grid-cols-8 gap-2">
                {availableColors.map(colorOpt => (
                  <button
                    type="button"
                    key={colorOpt.name}
                    onClick={() => setFormData(prev => ({ ...prev, color: colorOpt.value }))}
                    className={`w-8 h-8 rounded-full ${colorOpt.value.bg} border-2 ${JSON.stringify(formData.color) === JSON.stringify(colorOpt.value) ? colorOpt.value.border : 'border-transparent'} group-disabled:cursor-not-allowed`}
                    aria-label={colorOpt.name}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Icon</label>
              <div className="mt-2 grid grid-cols-8 gap-2">
                {availableIcons.map(iconName => (
                    <button
                        type="button"
                        key={iconName}
                        onClick={() => setFormData(prev => ({...prev, icon: iconName}))}
                        className={`p-2 rounded-lg border-2 ${formData.icon === iconName ? 'bg-indigo-100 border-indigo-500' : 'bg-gray-100 border-transparent'} group-disabled:cursor-not-allowed`}
                    >
                        <Icon name={iconName} className="w-5 h-5 text-gray-700" />
                    </button>
                ))}
              </div>
            </div>
          </div>
          </fieldset>
          <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            {!isReadOnly && (
                <button type="submit" className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                Save Category
                </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
