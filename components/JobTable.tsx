import React from 'react';
import { Job, CostItem, PermissionSet, User, UserRole } from '../types';
import JobRow from './JobRow';
import StatusBadge from './StatusBadge';
import { EditIcon, TrashIcon, CameraIcon } from './icons';
import StageProgress from './StageProgress';
import { calculateQuotation } from '../utils/financials';

// --- START OF JobCard COMPONENT ---
interface JobCardProps {
  job: Job;
  costItems: CostItem[];
  onEdit: (job: Job) => void;
  onDelete: (jobId: string) => void;
  permissions: PermissionSet;
  currentUser: User;
}

const formatCurrency = (amount: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount);
const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
};

const JobCard: React.FC<JobCardProps> = ({ job, costItems, onEdit, onDelete, permissions, currentUser }) => {
    const quotationTotal = calculateQuotation(job.quotationDetails, costItems);
    const totalPaid = job.payments.reduce((acc, p) => acc + p.amount, 0);
    const balance = job.invoiceDetails.amount - totalPaid;

    const canEdit = permissions.edit && (currentUser.role === UserRole.ADMIN || job.salespersonId === currentUser.id);
    const canDelete = permissions.delete && (currentUser.role === UserRole.ADMIN);

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="p-4">
                <div className="flex justify-between items-start gap-4">
                    <div>
                        <h3 className="font-bold text-lg text-gray-900">{job.clientName}</h3>
                        <p className="text-sm text-gray-500">{job.jobDescription}</p>
                    </div>
                    {job.mockupImage ? (
                        <img src={job.mockupImage} alt="Mock-up" className="w-16 h-16 object-cover rounded-md shadow-sm flex-shrink-0" />
                    ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center flex-shrink-0">
                           <CameraIcon className="w-6 h-6 text-gray-400" />
                        </div>
                    )}
                </div>
                
                <div className="mt-4">
                    <StatusBadge stage={job.stage} />
                    <StageProgress currentStage={job.stage} />
                </div>
            </div>

            <div className="px-4 py-3 bg-gray-50/70 border-t grid grid-cols-2 gap-4 text-sm">
                <div>
                    <div className="font-semibold text-gray-600">Quote</div>
                    <div className="text-gray-900">{formatCurrency(quotationTotal)}</div>
                </div>
                <div>
                    <div className="font-semibold text-gray-600">Paid</div>
                    <div className="text-green-600">{formatCurrency(totalPaid)}</div>
                </div>
                <div>
                    <div className="font-semibold text-gray-600">Balance</div>
                    <div className={`font-bold ${balance > 0 ? 'text-red-600' : 'text-gray-800'}`}>
                        {formatCurrency(balance)}
                    </div>
                </div>
                <div>
                    <div className="font-semibold text-gray-600">Installation</div>
                    <div className="text-gray-900">{formatDate(job.installationDate)}</div>
                </div>
            </div>

            <div className="p-2 bg-white border-t flex justify-end items-center gap-2">
                 <button 
                    onClick={() => onEdit(job)} 
                    disabled={!canEdit}
                    className={`flex items-center gap-2 text-sm font-medium py-2 px-3 rounded-md transition-colors ${canEdit ? 'text-indigo-600 hover:bg-indigo-50' : 'text-gray-400 cursor-not-allowed'}`} 
                    aria-label={canEdit ? "Edit" : "You do not have permission to edit"}
                  >
                    <EditIcon className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button 
                    onClick={() => onDelete(job.id)} 
                    disabled={!canDelete}
                    className={`flex items-center gap-2 text-sm font-medium py-2 px-3 rounded-md transition-colors ${canDelete ? 'text-red-600 hover:bg-red-50' : 'text-gray-400 cursor-not-allowed'}`} 
                    aria-label={canDelete ? "Delete" : "You do not have permission to delete"}
                  >
                    <TrashIcon className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
            </div>
        </div>
    );
};
// --- END OF JobCard COMPONENT ---


interface JobTableProps {
  jobs: Job[];
  costItems: CostItem[];
  onEdit: (job: Job) => void;
  onDelete: (jobId: string) => void;
  permissions: PermissionSet;
  currentUser: User;
}

const JobTable: React.FC<JobTableProps> = ({ jobs, costItems, onEdit, onDelete, permissions, currentUser }) => {
  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3 min-w-[200px]">Client / Job</th>
                <th scope="col" className="px-6 py-3 min-w-[150px]">Status</th>
                <th scope="col" className="px-6 py-3 min-w-[150px]">Financials</th>
                <th scope="col" className="px-6 py-3 min-w-[120px]">Installation</th>
                <th scope="col" className="px-6 py-3 min-w-[100px]">Mock-up</th>
                <th scope="col" className="px-6 py-3 min-w-[100px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length > 0 ? (
                jobs.map(job => (
                  <JobRow 
                      key={job.id} 
                      job={job} 
                      onEdit={onEdit} 
                      onDelete={onDelete} 
                      costItems={costItems}
                      permissions={permissions}
                      currentUser={currentUser}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-500">
                    No jobs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {jobs.length > 0 ? (
          jobs.map(job => (
            <JobCard
              key={job.id}
              job={job}
              costItems={costItems}
              onEdit={onEdit}
              onDelete={onDelete}
              permissions={permissions}
              currentUser={currentUser}
            />
          ))
        ) : (
          <div className="text-center py-10 text-gray-500 bg-white rounded-lg shadow-md">
            No jobs found.
          </div>
        )}
      </div>
    </>
  );
};

export default JobTable;
