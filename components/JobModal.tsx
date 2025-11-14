import React, { useState, useEffect, useMemo } from 'react';
import { Job, ProductionStage, QuotationDetails, CostItem, User, PaymentRecord, InvoiceDetails } from '../types';
import { STAGE_OPTIONS } from '../constants';
import { XIcon, CameraIcon, LockClosedIcon, HistoryIcon, PrinterIcon, CashIcon } from './icons';
import QuotationBuilder from './QuotationBuilder';
import { calculateQuotation } from '../utils/financials';

interface JobModalProps {
  job: Job | null;
  onSave: (job: Job) => void;
  onClose: () => void;
  costItems: CostItem[];
  defaultFixedCostContribution: number;
  isReadOnly: boolean;
  users: User[];
  currentUser: User;
  onViewReport: (job: Job) => void;
}

const JobModal: React.FC<JobModalProps> = ({ job, onSave, onClose, costItems, defaultFixedCostContribution, isReadOnly, users, currentUser, onViewReport }) => {
  const getInitialFormData = (): Omit<Job, 'id' | 'salespersonId' | 'changelog'> => {
    if (job) {
      const formPayments = Array(3).fill(null).map((_, i) =>
        job.payments[i] || { amount: 0, date: '', userId: null }
      );
      return { ...job, payments: formPayments };
    }
    return {
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      installationAddress: '',
      jobDescription: '',
      notes: '',
      quotationDetails: {
        lineItems: [],
        fixedCosts: 0,
        profitMarkupPercentage: 25,
        fixedCostContributionPercentage: defaultFixedCostContribution,
      },
      invoiceDetails: { amount: 0, date: '', userId: null },
      payments: Array(3).fill(null).map(() => ({ amount: 0, date: '', userId: null })),
      stage: ProductionStage.QUOTATION_SENT,
      installationDate: '',
      mockupImage: null,
    };
  };
  
  const [formData, setFormData] = useState<Omit<Job, 'id' | 'salespersonId' | 'changelog'>>(getInitialFormData);

  useEffect(() => {
    setFormData(getInitialFormData());
  }, [job, defaultFixedCostContribution]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleQuoteDetailsChange = (details: QuotationDetails) => {
    setFormData(prev => ({...prev, quotationDetails: details}));
  }

  const handleInvoiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
        const newAmount = name === 'amount' ? parseFloat(value) || 0 : prev.invoiceDetails.amount;
        const newDate = name === 'date' ? value : prev.invoiceDetails.date;
        const needsUserUpdate = newAmount !== (job?.invoiceDetails.amount || 0) || newDate !== (job?.invoiceDetails.date || '');
        
        return {
            ...prev,
            invoiceDetails: {
                ...prev.invoiceDetails,
                [name]: name === 'amount' ? parseFloat(value) || 0 : value,
                userId: needsUserUpdate ? currentUser.id : prev.invoiceDetails.userId,
            }
        }
    });
  };

  const handlePaymentChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newPayments = [...formData.payments];
    const oldPayment = job?.payments[index] || { amount: 0, date: '' };
    
    const currentPayment = newPayments[index];
    const newAmount = name === 'amount' ? parseFloat(value) || 0 : currentPayment.amount;
    const newDate = name === 'date' ? value : currentPayment.date;
    
    let userId = currentPayment.userId;
    if (newAmount !== oldPayment.amount || newDate !== oldPayment.date) {
        userId = currentUser.id;
    }
    if (newAmount === 0 && newDate === '') {
        userId = null;
    }

    newPayments[index] = { ...currentPayment, [name]: name === 'amount' ? newAmount : newDate, userId };
    setFormData(prev => ({ ...prev, payments: newPayments }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, mockupImage: reader.result as string }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;
    const finalPayments = formData.payments.filter(p => p.amount > 0 || p.date);
    onSave({ 
      ...formData, 
      payments: finalPayments,
      id: job?.id || '', 
      salespersonId: job?.salespersonId || '',
      changelog: job?.changelog || []
    });
  };
  
  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, mockupImage: null }));
    const fileInput = document.getElementById('mockupImage') as HTMLInputElement;
    if(fileInput) fileInput.value = '';
  }

  const quotationTotal = useMemo(() => calculateQuotation(formData.quotationDetails, costItems), [formData.quotationDetails, costItems]);
  const totalPaid = useMemo(() => formData.payments.reduce((sum, p) => sum + p.amount, 0), [formData.payments]);
  const balanceDue = useMemo(() => formData.invoiceDetails.amount - totalPaid, [formData.invoiceDetails.amount, totalPaid]);

  const getUserName = (userId: string | null) => users.find(u => u.id === userId)?.name || 'Unknown';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              {job ? 'Edit Job' : 'Add New Job'}
              {isReadOnly && <LockClosedIcon className="w-5 h-5 text-gray-400" title="Read Only"/>}
            </h2>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <XIcon className="w-6 h-6" />
            </button>
          </div>
          <fieldset disabled={isReadOnly} className="group">
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Client Info */}
            <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Client Information</h3>
            </div>
            <div>
              <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">Client Name</label>
              <input type="text" name="clientName" id="clientName" value={formData.clientName} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 group-disabled:bg-gray-100" required />
            </div>
            <div>
              <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700">Client Email</label>
              <input type="email" name="clientEmail" id="clientEmail" value={formData.clientEmail} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 group-disabled:bg-gray-100" required />
            </div>
            <div>
              <label htmlFor="clientPhone" className="block text-sm font-medium text-gray-700">Telephone Number</label>
              <input type="tel" name="clientPhone" id="clientPhone" value={formData.clientPhone} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 group-disabled:bg-gray-100" />
            </div>
             <div className="md:col-span-2">
              <label htmlFor="installationAddress" className="block text-sm font-medium text-gray-700">Installation Address</label>
              <textarea name="installationAddress" id="installationAddress" value={formData.installationAddress} onChange={handleChange} rows={3} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 group-disabled:bg-gray-100"></textarea>
            </div>
            
            {/* Job Details */}
            <div className="md:col-span-2 mt-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Job Details</h3>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700">Job Description</label>
              <textarea name="jobDescription" id="jobDescription" value={formData.jobDescription} onChange={handleChange} rows={3} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 group-disabled:bg-gray-100" required></textarea>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Internal Notes</label>
              <textarea name="notes" id="notes" value={formData.notes || ''} onChange={handleChange} rows={3} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 group-disabled:bg-gray-100" placeholder="Add any internal notes for the production team, salesperson, etc."></textarea>
            </div>
            
            {/* Quotation Builder */}
             <div className="md:col-span-2 mt-4">
                <QuotationBuilder 
                    details={formData.quotationDetails} 
                    onChange={handleQuoteDetailsChange}
                    costItems={costItems}
                    isReadOnly={isReadOnly}
                />
            </div>

            {/* Financials */}
            <div className="md:col-span-2 mt-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2 flex items-center gap-2">
                <CashIcon className="w-6 h-6 text-indigo-600"/>
                Financials
              </h3>
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50/50 space-y-4">
                {/* Invoice */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="invoiceAmount" className="block text-sm font-medium text-gray-700">Invoice Amount (£)</label>
                        <input type="number" name="amount" id="invoiceAmount" value={formData.invoiceDetails.amount} onChange={handleInvoiceChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 group-disabled:bg-gray-100" />
                    </div>
                    <div>
                        <label htmlFor="invoiceDate" className="block text-sm font-medium text-gray-700">Invoice Date</label>
                        <input type="date" name="date" id="invoiceDate" value={formData.invoiceDetails.date} onChange={handleInvoiceChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 group-disabled:bg-gray-100" />
                    </div>
                </div>
                {formData.invoiceDetails.userId && <p className="text-xs text-gray-500 -mt-2">Last updated by: {getUserName(formData.invoiceDetails.userId)}</p>}

                {/* Payments */}
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="text-md font-semibold text-gray-600">Payments Received</h4>
                  {formData.payments.map((payment, index) => (
                    <div key={index} className="space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor={`paymentAmount-${index}`} className="block text-sm font-medium text-gray-700">Payment {index + 1} (£)</label>
                          <input type="number" name="amount" id={`paymentAmount-${index}`} value={payment.amount} onChange={(e) => handlePaymentChange(index, e)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 group-disabled:bg-gray-100" />
                        </div>
                        <div>
                          <label htmlFor={`paymentDate-${index}`} className="block text-sm font-medium text-gray-700">Payment {index + 1} Date</label>
                          <input type="date" name="date" id={`paymentDate-${index}`} value={payment.date} onChange={(e) => handlePaymentChange(index, e)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 group-disabled:bg-gray-100" />
                        </div>
                      </div>
                      {payment.userId && <p className="text-xs text-gray-500 -mt-1">Last updated by: {getUserName(payment.userId)}</p>}
                    </div>
                  ))}
                </div>
                {/* Financial Summary */}
                <div className="flex justify-end pt-4 border-t">
                    <div className="w-full max-w-xs space-y-1 text-sm">
                        <div className="flex justify-between font-medium">
                            <span>Total Paid:</span>
                            <span className="text-green-600">{new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(totalPaid)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-base">
                            <span>Balance Due:</span>
                            <span className={balanceDue > 0 ? "text-red-600" : "text-gray-800"}>
                                {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(balanceDue)}
                            </span>
                        </div>
                    </div>
                </div>
              </div>
            </div>
            
            {/* Production */}
            <div className="md:col-span-2 mt-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Production & Scheduling</h3>
            </div>
            <div>
              <label htmlFor="stage" className="block text-sm font-medium text-gray-700">Production Stage</label>
              <select name="stage" id="stage" value={formData.stage} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 group-disabled:bg-gray-100">
                {STAGE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="installationDate" className="block text-sm font-medium text-gray-700">Installation Date</label>
              <input type="date" name="installationDate" id="installationDate" value={formData.installationDate} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 group-disabled:bg-gray-100" />
            </div>

            {/* Stage History */}
            {job && job.changelog && job.changelog.length > 0 && (
                <div className="md:col-span-2 mt-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2 flex items-center gap-2">
                        <HistoryIcon className="w-6 h-6 text-indigo-600"/>
                        Stage History
                    </h3>
                    <ul className="space-y-3 max-h-40 overflow-y-auto pr-2">
                        {[...job.changelog].reverse().map((entry, index) => { // Show newest first
                            const user = users.find(u => u.id === entry.userId);
                            return (
                                <li key={index} className="text-sm text-gray-600 border-l-2 border-gray-200 pl-3">
                                    <p>
                                        <span className="font-semibold text-gray-800">{user?.name || 'Unknown User'}</span> changed status from{' '}
                                        <span className="font-semibold">{entry.fromStage}</span> to <span className="font-semibold">{entry.toStage}</span>.
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {new Date(entry.timestamp).toLocaleString('en-US', { 
                                            year: 'numeric', month: 'short', day: 'numeric', 
                                            hour: 'numeric', minute: '2-digit', hour12: true 
                                        })}
                                    </p>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}


            {/* Mockup Image */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Mock-up Image</label>
              <div className="mt-1 flex items-center gap-4">
                <div className="w-32 h-24 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                  {formData.mockupImage ? (
                    <img src={formData.mockupImage} alt="Mock-up Preview" className="w-full h-full object-cover" />
                  ) : (
                    <CameraIcon className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                {!isReadOnly && (
                    <div>
                        <input type="file" id="mockupImage" onChange={handleImageChange} accept="image/*" className="hidden" />
                        <label htmlFor="mockupImage" className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Upload
                        </label>
                        {formData.mockupImage && (
                            <button type="button" onClick={handleRemoveImage} className="ml-2 text-sm text-red-600 hover:text-red-800">
                            Remove
                            </button>
                        )}
                    </div>
                )}
              </div>
            </div>
          </div>
          </fieldset>
          <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-between items-center sticky bottom-0">
            <div>
                {job && (
                    <button
                        type="button"
                        onClick={() => onViewReport(job)}
                        className="flex items-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <PrinterIcon className="w-5 h-5" />
                        <span>View Report</span>
                    </button>
                )}
            </div>
            <div className="flex justify-end gap-3">
                <button type="button" onClick={onClose} className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Cancel
                </button>
                {!isReadOnly && (
                    <button type="submit" className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Save Job
                    </button>
                )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobModal;
