import React from 'react';
import { Job, CostItem, PermissionSet, User, UserRole } from '../types';
import StatusBadge from './StatusBadge';
import { EditIcon, TrashIcon, CameraIcon } from './icons';
import StageProgress from './StageProgress';
import { calculateQuotation } from '../utils/financials';

interface JobRowProps {
  job: Job;
  costItems: CostItem[];
  onEdit: (job: Job) => void;
  onDelete: (jobId: string) => void;
  permissions: PermissionSet;
  currentUser: User;
}

const JobRow: React.FC<JobRowProps> = ({ job, costItems, onEdit, onDelete, permissions, currentUser }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
  };

  const quotationTotal = calculateQuotation(job.quotationDetails, costItems);
  const totalPaid = job.payments.reduce((acc, p) => acc + p.amount, 0);
  const balance = job.invoiceDetails.amount - totalPaid;
  
  const canEdit = permissions.edit && (currentUser.role === UserRole.ADMIN || job.salespersonId === currentUser.id);
  const canDelete = permissions.delete && (currentUser.role === UserRole.ADMIN);

  return (
    <tr className="bg-white border-b hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div className="font-bold text-gray-900">{job.clientName}</div>
        <div className="text-xs text-gray-500 truncate max-w-xs">{job.jobDescription}</div>
        <div className="text-xs text-gray-500 truncate max-w-xs font-medium mt-1">{job.installationAddress}</div>
      </td>
      <td className="px-6 py-4">
        <div>
          <StatusBadge stage={job.stage} />
          <StageProgress currentStage={job.stage} />
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-gray-900">
            <span className="font-semibold">Quote:</span> {formatCurrency(quotationTotal)}
        </div>
        <div className="text-gray-900">
          <span className="font-semibold">Invoice:</span> {formatCurrency(job.invoiceDetails.amount)}
        </div>
        <div className="text-green-600">
          <span className="font-semibold">Paid:</span> {formatCurrency(totalPaid)}
        </div>
        <div className={`font-bold ${balance > 0 ? 'text-red-600' : 'text-gray-800'}`}>
          <span className="font-semibold">Balance:</span> {formatCurrency(balance)}
        </div>
      </td>
      <td className="px-6 py-4 font-medium text-gray-900">{formatDate(job.installationDate)}</td>
      <td className="px-6 py-4">
        {job.mockupImage ? (
          <img src={job.mockupImage} alt="Mock-up" className="w-16 h-12 object-cover rounded-md shadow-sm" />
        ) : (
          <div className="w-16 h-12 bg-gray-200 rounded-md flex items-center justify-center">
             <CameraIcon className="w-6 h-6 text-gray-400" />
          </div>
        )}
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex justify-end items-center gap-4">
          <button 
            onClick={() => onEdit(job)} 
            disabled={!canEdit}
            className={`transition-colors ${canEdit ? 'text-indigo-600 hover:text-indigo-800' : 'text-gray-300 cursor-not-allowed'}`} 
            aria-label={canEdit ? "Edit" : "You do not have permission to edit"}
          >
            <EditIcon className="w-5 h-5" />
          </button>
          <button 
            onClick={() => onDelete(job.id)} 
            disabled={!canDelete}
            className={`transition-colors ${canDelete ? 'text-red-600 hover:text-red-800' : 'text-gray-300 cursor-not-allowed'}`} 
            aria-label={canDelete ? "Delete" : "You do not have permission to delete"}
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default JobRow;
