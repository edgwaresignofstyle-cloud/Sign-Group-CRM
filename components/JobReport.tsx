import React from 'react';
import { Job, CostItem, User } from '../types';
import { calculateQuotation } from '../utils/financials';
import StatusBadge from './StatusBadge';

interface JobReportProps {
  job: Job;
  costItems: CostItem[];
  users: User[];
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount);
};

const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6 break-inside-avoid">
        <h3 className="text-lg font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-3">{title}</h3>
        {children}
    </div>
);

const InfoPair: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="flex flex-col mb-2">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <span className="text-base text-gray-900">{value || '-'}</span>
    </div>
);

export const JobReport: React.FC<JobReportProps> = React.forwardRef<HTMLDivElement, JobReportProps>(({ job, costItems, users }, ref) => {
  const quotationTotal = calculateQuotation(job.quotationDetails, costItems);
  const salesperson = users.find(u => u.id === job.salespersonId);
  const totalPaid = job.payments.reduce((acc, p) => acc + p.amount, 0);
  const balance = job.invoiceDetails.amount - totalPaid;

  const { lineItems } = job.quotationDetails;
  const lineItemsTotal = lineItems.reduce((total, item) => {
    const costItem = costItems.find(dbItem => dbItem.id === item.itemId);
    if (!costItem) return total;
    return total + (costItem.costPerUnit * item.quantity);
  }, 0);
  const subtotal = lineItemsTotal + job.quotationDetails.fixedCosts;
  const profitMarkupAmount = subtotal * (job.quotationDetails.profitMarkupPercentage / 100);
  const fixedCostContributionAmount = subtotal * (job.quotationDetails.fixedCostContributionPercentage / 100);

  return (
    <div ref={ref} className="p-8 bg-white text-gray-900 font-sans">
      <header className="flex justify-between items-start mb-8 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-indigo-600">Sign Group CRM</h1>
          <h2 className="text-xl font-light text-gray-700">Job Report</h2>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Job ID: {job.id}</p>
          <p className="text-sm text-gray-600">Report Generated: {new Date().toLocaleDateString('en-GB')}</p>
        </div>
      </header>

      <main>
        <Section title="Client & Job Overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <div>
                    <InfoPair label="Client Name" value={job.clientName} />
                    <InfoPair label="Client Contact" value={<>{job.clientEmail}<br/>{job.clientPhone}</>} />
                    <InfoPair label="Installation Address" value={job.installationAddress} />
                </div>
                 <div>
                    <InfoPair label="Job Description" value={job.jobDescription} />
                    <InfoPair label="Salesperson" value={salesperson?.name} />
                    <InfoPair label="Current Stage" value={<StatusBadge stage={job.stage} />} />
                    <InfoPair label="Installation Date" value={formatDate(job.installationDate)} />
                </div>
            </div>
        </Section>
        
        <Section title="Quotation Details">
             <table className="w-full text-sm text-left mb-4">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                    <tr>
                        <th className="px-4 py-2">Item</th>
                        <th className="px-4 py-2 text-center">Qty</th>
                        <th className="px-4 py-2 text-right">Unit Cost</th>
                        <th className="px-4 py-2 text-right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {lineItems.map((lineItem, index) => {
                        const item = costItems.find(ci => ci.id === lineItem.itemId);
                        if (!item) return null;
                        return (
                            <tr key={index} className="border-b">
                                <td className="px-4 py-2 font-medium">{item.name}</td>
                                <td className="px-4 py-2 text-center">{lineItem.quantity} {item.unit}</td>
                                <td className="px-4 py-2 text-right">{formatCurrency(item.costPerUnit)}</td>
                                <td className="px-4 py-2 text-right">{formatCurrency(item.costPerUnit * lineItem.quantity)}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>

            <div className="flex justify-end">
                <div className="w-full max-w-sm space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-600">Items Total:</span> <span>{formatCurrency(lineItemsTotal)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Job Fixed Costs:</span> <span>{formatCurrency(job.quotationDetails.fixedCosts)}</span></div>
                    <div className="flex justify-between font-semibold border-t pt-1"><span className="text-gray-800">Subtotal:</span> <span>{formatCurrency(subtotal)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Overhead ({job.quotationDetails.fixedCostContributionPercentage}%):</span> <span>{formatCurrency(fixedCostContributionAmount)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Profit Markup ({job.quotationDetails.profitMarkupPercentage}%):</span> <span>{formatCurrency(profitMarkupAmount)}</span></div>
                    <div className="flex justify-between text-lg font-bold text-indigo-600 border-t-2 mt-2 pt-2"><span >Grand Total:</span> <span>{formatCurrency(quotationTotal)}</span></div>
                </div>
            </div>
        </Section>
        
        <Section title="Financial Summary">
             <div className="grid grid-cols-3 gap-4 text-center mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                    <InfoPair label="Total Invoiced" value={<span className="text-xl font-bold">{formatCurrency(job.invoiceDetails.amount)}</span>} />
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                    <InfoPair label="Amount Paid" value={<span className="text-xl font-bold text-green-700">{formatCurrency(totalPaid)}</span>} />
                </div>
                 <div className="bg-red-50 p-4 rounded-lg">
                    <InfoPair label="Balance Due" value={<span className="text-xl font-bold text-red-700">{formatCurrency(balance)}</span>} />
                </div>
            </div>
            
            <h4 className="text-base font-semibold text-gray-700 mb-2">Payment History</h4>
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                    <tr>
                        <th className="px-4 py-2">Date</th>
                        <th className="px-4 py-2">Amount</th>
                        <th className="px-4 py-2">Recorded By</th>
                    </tr>
                </thead>
                <tbody>
                    {job.payments.map((payment, index) => {
                        const user = users.find(u => u.id === payment.userId);
                        return (
                            <tr key={index} className="border-b">
                                <td className="px-4 py-2">{formatDate(payment.date)}</td>
                                <td className="px-4 py-2">{formatCurrency(payment.amount)}</td>
                                <td className="px-4 py-2">{user?.name || 'N/A'}</td>
                            </tr>
                        )
                    })}
                    {job.payments.length === 0 && (
                        <tr>
                            <td colSpan={3} className="text-center py-4 text-gray-500">No payments recorded.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </Section>

        {job.notes && (
            <Section title="Internal Notes">
                <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded-md border border-gray-200">{job.notes}</p>
            </Section>
        )}

        {job.mockupImage && (
            <Section title="Mock-up">
                <img src={job.mockupImage} alt="Job Mock-up" className="max-w-md mx-auto rounded-lg shadow-md" />
            </Section>
        )}
      </main>
    </div>
  );
});
