import React, { useMemo } from 'react';
import { QuotationDetails, CostItem } from '../types';
import { PlusIcon, TrashIcon, CalculatorIcon } from './icons';

interface QuotationBuilderProps {
  details: QuotationDetails;
  onChange: (newDetails: QuotationDetails) => void;
  costItems: CostItem[];
  isReadOnly: boolean;
}

const QuotationBuilder: React.FC<QuotationBuilderProps> = ({ details, onChange, costItems, isReadOnly }) => {

  const handleLineItemChange = (index: number, field: 'itemId' | 'quantity', value: string | number) => {
    const updatedLineItems = [...details.lineItems];
    updatedLineItems[index] = { ...updatedLineItems[index], [field]: value };
    onChange({ ...details, lineItems: updatedLineItems });
  };

  const addLineItem = () => {
    const defaultItem = costItems[0];
    if (!defaultItem) return;
    const newLineItems = [...details.lineItems, { itemId: defaultItem.id, quantity: 1 }];
    onChange({ ...details, lineItems: newLineItems });
  };

  const removeLineItem = (index: number) => {
    const newLineItems = details.lineItems.filter((_, i) => i !== index);
    onChange({ ...details, lineItems: newLineItems });
  };
  
  const handleNumericChange = (field: 'fixedCosts' | 'profitMarkupPercentage' | 'fixedCostContributionPercentage', value: string) => {
     onChange({ ...details, [field]: parseFloat(value) || 0 });
  }

  const lineItemsTotal = useMemo(() => {
    return details.lineItems.reduce((total, item) => {
      const costItem = costItems.find(dbItem => dbItem.id === item.itemId);
      if (!costItem) return total;
      return total + (costItem.costPerUnit * item.quantity);
    }, 0);
  }, [details.lineItems, costItems]);
  
  const subtotal = lineItemsTotal + details.fixedCosts;
  const profitMarkupAmount = subtotal * (details.profitMarkupPercentage / 100);
  const fixedCostContributionAmount = subtotal * (details.fixedCostContributionPercentage / 100);
  const finalTotal = subtotal + profitMarkupAmount + fixedCostContributionAmount;


  return (
    <div className="md:col-span-2 p-4 border border-gray-200 rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2 flex items-center gap-2">
        <CalculatorIcon className="w-6 h-6 text-indigo-600"/>
        Quotation Builder
      </h3>
      
      <fieldset disabled={isReadOnly} className="group">
      {/* Line Items */}
      <div className="space-y-3">
        {details.lineItems.map((item, index) => {
          const selectedCostItem = costItems.find(ci => ci.id === item.itemId);
          const itemTotal = selectedCostItem ? selectedCostItem.costPerUnit * item.quantity : 0;

          return (
            <div key={index} className="grid grid-cols-12 gap-3 items-center">
              <div className="col-span-5">
                <select
                  value={item.itemId}
                  onChange={(e) => handleLineItemChange(index, 'itemId', e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm text-sm group-disabled:bg-gray-100"
                >
                  {costItems.map(ci => (
                    <option key={ci.id} value={ci.id}>{ci.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                 <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleLineItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                  className="w-full border-gray-300 rounded-md shadow-sm text-sm group-disabled:bg-gray-100"
                  min="0"
                />
              </div>
              <div className="col-span-2 text-sm text-gray-600 text-center">
                / {selectedCostItem?.unit}
              </div>
               <div className="col-span-2 text-sm font-medium text-gray-800 text-right">
                  {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(itemTotal)}
              </div>
              <div className="col-span-1 text-right">
                 <button type="button" onClick={() => removeLineItem(index)} className="text-red-500 hover:text-red-700 disabled:text-gray-300 disabled:cursor-not-allowed">
                    <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={addLineItem}
        disabled={costItems.length === 0 || isReadOnly}
        className="mt-3 flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 disabled:text-gray-400 disabled:cursor-not-allowed"
      >
        <PlusIcon className="w-4 h-4" />
        Add Line Item
      </button>

      {/* Totals Section */}
      <div className="mt-6 border-t pt-4 space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Line Items Total:</span>
          <span className="font-medium text-gray-800">{new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(lineItemsTotal)}</span>
        </div>
         <div className="flex justify-between items-center gap-4">
          <label htmlFor="fixedCosts" className="text-gray-600">Job-Specific Fixed Costs (£):</label>
          <input 
            type="number"
            id="fixedCosts"
            value={details.fixedCosts}
            onChange={(e) => handleNumericChange('fixedCosts', e.target.value)}
            className="w-24 border-gray-300 rounded-md shadow-sm text-sm text-right group-disabled:bg-gray-100"
          />
        </div>
         <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-700">Subtotal:</span>
            <span className="font-semibold text-gray-900">{new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(subtotal)}</span>
        </div>
        <div className="flex justify-between items-center gap-4">
          <label htmlFor="fixedCostContributionPercentage" className="text-gray-600">Overhead Contribution (%):</label>
           <input 
            type="number"
            id="fixedCostContributionPercentage"
            value={details.fixedCostContributionPercentage}
            onChange={(e) => handleNumericChange('fixedCostContributionPercentage', e.target.value)}
            className="w-24 border-gray-300 rounded-md shadow-sm text-sm text-right group-disabled:bg-gray-100"
          />
        </div>
        <div className="flex justify-between items-center gap-4">
          <label htmlFor="profitMarkupPercentage" className="text-gray-600">Profit Markup (%):</label>
           <input 
            type="number"
            id="profitMarkupPercentage"
            value={details.profitMarkupPercentage}
            onChange={(e) => handleNumericChange('profitMarkupPercentage', e.target.value)}
            className="w-24 border-gray-300 rounded-md shadow-sm text-sm text-right group-disabled:bg-gray-100"
          />
        </div>
         <div className="flex justify-between items-center text-base font-bold text-indigo-600 border-t pt-2 mt-2">
            <span>FINAL QUOTE:</span>
            <span>{new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(finalTotal)}</span>
        </div>
      </div>
      </fieldset>
    </div>
  );
};

export default QuotationBuilder;
