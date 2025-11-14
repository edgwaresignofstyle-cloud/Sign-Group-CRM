import React from 'react';
import { Job, CostItem, User } from '../types';
import { XIcon, PrinterIcon } from './icons';
import { JobReport } from './JobReport';

interface JobReportModalProps {
    job: Job;
    costItems: CostItem[];
    users: User[];
    onClose: () => void;
}

const JobReportModal: React.FC<JobReportModalProps> = ({ job, costItems, users, onClose }) => {
    
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4 print:p-0 print:bg-white print:block">
            <style>{`
                @media print {
                    body > #root > div > *:not(.print\\:block) {
                        display: none;
                    }
                    .print\\:block {
                        display: block !important;
                    }
                }
            `}</style>
            <div className="bg-gray-100 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col print:max-h-full print:h-full print:shadow-none print:rounded-none">
                <header className="p-4 border-b border-gray-300 flex justify-between items-center bg-white rounded-t-lg print:hidden">
                    <h2 className="text-xl font-bold text-gray-800">
                        Job Report: <span className="font-normal">{job.clientName}</span>
                    </h2>
                    <div className="flex items-center gap-3">
                        <button onClick={handlePrint} className="flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors">
                            <PrinterIcon className="w-5 h-5" />
                            <span>Print / Save PDF</span>
                        </button>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <XIcon className="w-6 h-6" />
                        </button>
                    </div>
                </header>
                <div className="overflow-y-auto flex-grow">
                    <JobReport job={job} costItems={costItems} users={users} />
                </div>
            </div>
        </div>
    );
};

export default JobReportModal;