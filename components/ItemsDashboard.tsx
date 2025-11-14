import React from 'react';
import { CostItem, ItemCategory, PermissionSet } from '../types';
import { EditIcon, TrashIcon, PlusIcon, Icon } from './icons';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount);
};

// --- START OF ItemCard COMPONENT ---
interface ItemCardProps {
  item: CostItem;
  canEdit: boolean;
  canDelete: boolean;
  onEditItem: (item: CostItem) => void;
  onDeleteItem: (itemId: string) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, canEdit, canDelete, onEditItem, onDeleteItem }) => {
    return (
        <div className="bg-white p-3 border-b last:border-0 flex justify-between items-center">
            <div>
                <div className="font-medium text-gray-900">{item.name}</div>
                <div className="text-sm text-gray-500">
                    {formatCurrency(item.costPerUnit)} / {item.unit}
                </div>
            </div>
            {canEdit && (
                <div className="flex items-center gap-2">
                    <button onClick={() => onEditItem(item)} className="text-indigo-600 hover:text-indigo-800 transition-colors p-2 rounded-full hover:bg-indigo-50" aria-label={`Edit ${item.name}`}>
                        <EditIcon className="w-5 h-5" />
                    </button>
                    {canDelete && (
                        <button onClick={() => onDeleteItem(item.id)} className="text-red-600 hover:text-red-800 transition-colors p-2 rounded-full hover:bg-red-50" aria-label={`Delete ${item.name}`}>
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};
// --- END OF ItemCard COMPONENT ---


interface ItemsDashboardProps {
  items: CostItem[];
  categories: ItemCategory[];
  onAddNewItem: () => void;
  onEditItem: (item: CostItem) => void;
  onDeleteItem: (itemId: string) => void;
  onAddNewCategory: () => void;
  onEditCategory: (category: ItemCategory) => void;
  onDeleteCategory: (categoryId: string) => void;
  permissions: PermissionSet;
}


const ItemsDashboard: React.FC<ItemsDashboardProps> = ({ 
    items, 
    categories, 
    onAddNewItem, 
    onEditItem, 
    onDeleteItem,
    onAddNewCategory,
    onEditCategory,
    onDeleteCategory,
    permissions
}) => {
  const canEdit = permissions.edit;
  const canCreate = permissions.create;
  const canDelete = permissions.delete;

  return (
    <div>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold text-gray-800">Manage Items & Categories</h2>
            {canCreate && (
                <div className="flex gap-2 w-full sm:w-auto">
                    <button
                    onClick={onAddNewCategory}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white text-indigo-600 border border-indigo-600 font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-indigo-50 transition-colors"
                    >
                    <PlusIcon className="w-5 h-5" />
                    <span>Add Category</span>
                    </button>
                    <button
                    onClick={onAddNewItem}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                    <PlusIcon className="w-5 h-5" />
                    <span>Add New Item</span>
                    </button>
                </div>
            )}
        </div>
        <div className="space-y-8">
          {categories.map(category => {
            const categoryItems = items.filter(item => item.categoryId === category.id);
            const isDeletable = categoryItems.length === 0 && canDelete;

            return (
              <div key={category.id}>
                <div className={`flex items-center justify-between gap-3 mb-4 p-3 rounded-t-lg border-b-2 ${category.color.bg} ${category.color.border}`}>
                  <div className="flex items-center gap-3">
                    <Icon name={category.icon} className={`w-6 h-6 ${category.color.text}`} />
                    <h3 className={`text-xl font-bold ${category.color.text}`}>{category.name}</h3>
                  </div>
                  {canEdit && (
                    <div className="flex items-center gap-3">
                        <button onClick={() => onEditCategory(category)} className={`p-1 rounded-md hover:bg-black/10 transition-colors ${category.color.text}`} aria-label={`Edit ${category.name} category`}>
                        <EditIcon className="w-4 h-4" />
                        </button>
                        <div className="relative group">
                            <button 
                                onClick={() => onDeleteCategory(category.id)} 
                                disabled={!isDeletable}
                                className={`p-1 rounded-md transition-colors ${isDeletable ? `hover:bg-black/10 ${category.color.text}` : 'text-gray-400 cursor-not-allowed'}`}
                                aria-label={`Delete ${category.name} category`}
                            >
                                <TrashIcon className="w-4 h-4" />
                            </button>
                            {!isDeletable && canDelete && (
                            <div className="absolute bottom-full right-0 mb-2 w-48 p-2 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                    Cannot delete a category that contains items. Please move or delete items first.
                            </div>
                            )}
                        </div>
                    </div>
                  )}
                </div>
                <div className="bg-white shadow-md rounded-b-lg overflow-hidden">
                   {/* Desktop Table View */}
                  <div className="overflow-x-auto hidden md:block">
                    <table className="w-full text-sm text-left text-gray-600">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3">Item Name</th>
                          <th scope="col" className="px-6 py-3">Unit</th>
                          <th scope="col" className="px-6 py-3">Cost Per Unit</th>
                          {canEdit && <th scope="col" className="px-6 py-3 text-right">Actions</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {categoryItems.length > 0 ? (
                          categoryItems.map(item => (
                            <tr key={item.id} className="bg-white border-b last:border-b-0 hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                              <td className="px-6 py-4">{item.unit}</td>
                              <td className="px-6 py-4">{formatCurrency(item.costPerUnit)}</td>
                              {canEdit && (
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end items-center gap-4">
                                        <button onClick={() => onEditItem(item)} className="text-indigo-600 hover:text-indigo-800 transition-colors" aria-label={`Edit ${item.name}`}>
                                            <EditIcon className="w-5 h-5" />
                                        </button>
                                        {canDelete && (
                                            <button onClick={() => onDeleteItem(item.id)} className="text-red-600 hover:text-red-800 transition-colors" aria-label={`Delete ${item.name}`}>
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                              )}
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={canEdit ? 4 : 3} className="text-center py-6 text-gray-500">
                              No items in this category.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden">
                     {categoryItems.length > 0 ? (
                        categoryItems.map(item => (
                          <ItemCard 
                            key={item.id}
                            item={item}
                            canEdit={canEdit}
                            canDelete={canDelete}
                            onEditItem={onEditItem}
                            onDeleteItem={onDeleteItem}
                          />
                        ))
                     ) : (
                       <div className="text-center py-6 text-gray-500">
                          No items in this category.
                       </div>
                     )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
    </div>
  );
};

export default ItemsDashboard;
