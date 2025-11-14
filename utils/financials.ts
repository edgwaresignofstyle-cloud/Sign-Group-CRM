import { QuotationDetails, CostItem } from '../types';

export const calculateQuotation = (details: QuotationDetails, costItems: CostItem[]): number => {
  const lineItemsTotal = details.lineItems.reduce((total, item) => {
    const costItem = costItems.find(dbItem => dbItem.id === item.itemId);
    if (!costItem) return total;
    return total + (costItem.costPerUnit * item.quantity);
  }, 0);

  const subtotal = lineItemsTotal + details.fixedCosts;
  const profitMarkupAmount = subtotal * (details.profitMarkupPercentage / 100);
  const fixedCostContributionAmount = subtotal * (details.fixedCostContributionPercentage / 100);
  const finalTotal = subtotal + profitMarkupAmount + fixedCostContributionAmount;

  return finalTotal;
};