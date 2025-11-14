import React, { useMemo } from 'react';
import { Job, ProductionStage, ChartDataPoint, FixedCostItem, PermissionSet } from '../types';
import { TrendingUpIcon, TrendingDownIcon, CashIcon, ChartLineIcon, BuildingOfficeIcon, PlusIcon, EditIcon, TrashIcon } from './icons';
import LineChart from './LineChart';

interface FinancialsDashboardProps {
  jobs: Job[];
  companyFixedCosts: FixedCostItem[];
  fixedCostContributionPercentage: number;
  onAddFixedCost: () => void;
  onEditFixedCost: (item: FixedCostItem) => void;
  onDeleteFixedCost: (id: string) => void;
  onUpdateContributionPercentage: (percentage: number) => void;
  permissions: PermissionSet;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount);
};

const FixedCostsManager: React.FC<Omit<FinancialsDashboardProps, 'jobs'>> = ({
    companyFixedCosts,
    fixedCostContributionPercentage,
    onAddFixedCost,
    onEditFixedCost,
    onDeleteFixedCost,
    onUpdateContributionPercentage,
    permissions,
}) => {
    const totalFixedCosts = useMemo(() => 
        companyFixedCosts.reduce((total, item) => total + item.monthlyAmount, 0), 
    [companyFixedCosts]);
    
    const canEdit = permissions.edit;

    return (
        <div className="p-6 bg-white shadow-lg rounded-xl">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <BuildingOfficeIcon className="w-6 h-6 text-indigo-600" />
                    Monthly Fixed Costs
                </h2>
                {canEdit && (
                    <button onClick={onAddFixedCost} className="flex items-center gap-2 text-sm bg-indigo-600 text-white font-semibold py-2 px-3 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors">
                        <PlusIcon className="w-4 h-4" />
                        Add Cost
                    </button>
                )}
            </div>
            
            <div className="max-h-60 overflow-y-auto mb-4 border rounded-lg">
                <table className="w-full text-sm text-left text-gray-600">
                     <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0">
                        <tr>
                            <th scope="col" className="px-4 py-2">Cost Name</th>
                            <th scope="col" className="px-4 py-2">Monthly Amount</th>
                            {canEdit && <th scope="col" className="px-4 py-2 text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {companyFixedCosts.length > 0 ? companyFixedCosts.map(item => (
                            <tr key={item.id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-2 font-medium text-gray-900">{item.name}</td>
                                <td className="px-4 py-2">{formatCurrency(item.monthlyAmount)}</td>
                                {canEdit && (
                                    <td className="px-4 py-2 text-right">
                                        <div className="flex justify-end items-center gap-3">
                                            <button onClick={() => onEditFixedCost(item)} className="text-indigo-600 hover:text-indigo-800"><EditIcon className="w-4 h-4" /></button>
                                            <button onClick={() => onDeleteFixedCost(item.id)} className="text-red-600 hover:text-red-800"><TrashIcon className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        )) : (
                            <tr><td colSpan={canEdit ? 3 : 2} className="text-center py-4 text-gray-500">No fixed costs added.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="border-t pt-4">
                <div className="flex justify-between items-center font-bold text-lg mb-4">
                    <span>Total Monthly Costs:</span>
                    <span className="text-indigo-600">{formatCurrency(totalFixedCosts)}</span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <label htmlFor="overhead" className="font-semibold text-gray-700">Quotation Overhead Contribution (%):</label>
                    <input 
                        type="number"
                        id="overhead"
                        value={fixedCostContributionPercentage}
                        onChange={(e) => onUpdateContributionPercentage(parseFloat(e.target.value) || 0)}
                        className="w-full sm:w-24 p-2 border-gray-300 rounded-md shadow-sm text-right font-bold disabled:bg-gray-200"
                        disabled={!canEdit}
                    />
                </div>
                 <p className="text-xs text-gray-500 mt-2 text-center sm:text-left">This percentage is added to new quotations to cover overheads.</p>
            </div>
        </div>
    );
};


const FinancialsDashboard: React.FC<FinancialsDashboardProps> = (props) => {
  const { jobs, companyFixedCosts } = props;
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const totalMonthlyFixedCosts = useMemo(() => 
    companyFixedCosts.reduce((total, item) => total + item.monthlyAmount, 0), 
  [companyFixedCosts]);

  // --- Current Month Calculations ---
  const monthlyRevenue = useMemo(() => jobs
    .filter(job => {
      const installationDate = new Date(job.installationDate);
      return (
        job.stage === ProductionStage.COMPLETED &&
        installationDate.getMonth() === currentMonth &&
        installationDate.getFullYear() === currentYear
      );
    })
    .reduce((total, job) => total + job.payments.reduce((sum, p) => sum + p.amount, 0), 0), [jobs, currentMonth, currentYear]);

  const progressPercentage = totalMonthlyFixedCosts > 0 
    ? Math.min((monthlyRevenue / totalMonthlyFixedCosts) * 100, 100) 
    : (monthlyRevenue > 0 ? 100 : 0);
  const profit = monthlyRevenue - totalMonthlyFixedCosts;

  // --- Previous Month Calculations ---
  const { previousMonthRevenue, previousMonthProfitOrLoss } = useMemo(() => {
    const previousMonthDate = new Date(currentYear, currentMonth - 1, 1);
    const previousMonth = previousMonthDate.getMonth();
    const previousMonthYear = previousMonthDate.getFullYear();

    const revenue = jobs
      .filter(job => {
          const installationDate = new Date(job.installationDate);
          return (
              job.stage === ProductionStage.COMPLETED &&
              installationDate.getMonth() === previousMonth &&
              installationDate.getFullYear() === previousMonthYear
          );
      })
      .reduce((total, job) => total + job.payments.reduce((sum, p) => sum + p.amount, 0), 0);
      
    const profitOrLoss = revenue - totalMonthlyFixedCosts;
    return { previousMonthRevenue: revenue, previousMonthProfitOrLoss: profitOrLoss };
  }, [jobs, currentMonth, currentYear, totalMonthlyFixedCosts]);
    

  // --- Comparison Calculation ---
  const { percentageChange, isPositiveChange } = useMemo(() => {
    let change = 0;
    if (previousMonthRevenue > 0) {
        change = ((monthlyRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;
    } else if (monthlyRevenue > 0) {
        change = 100; // Representing growth from zero
    }
    return { percentageChange: change, isPositiveChange: change >= 0 };
  }, [monthlyRevenue, previousMonthRevenue]);
  
  // --- Chart Data Calculation ---
  const chartData = useMemo<ChartDataPoint[]>(() => {
    const data: ChartDataPoint[] = [];
    for (let i = 11; i >= 0; i--) {
        const date = new Date(currentYear, currentMonth - i, 1);
        const month = date.getMonth();
        const year = date.getFullYear();

        const monthRevenue = jobs
            .filter(job => {
                const installationDate = new Date(job.installationDate);
                return (
                    job.stage === ProductionStage.COMPLETED &&
                    installationDate.getMonth() === month &&
                    installationDate.getFullYear() === year
                );
            })
            .reduce((total, job) => total + job.payments.reduce((sum, p) => sum + p.amount, 0), 0);
        
        const profitOrLoss = monthRevenue - totalMonthlyFixedCosts;

        data.push({
            label: date.toLocaleString('default', { month: 'short', year: '2-digit' }),
            value: profitOrLoss,
        });
    }
    return data;
  }, [jobs, currentMonth, currentYear, totalMonthlyFixedCosts]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="p-6 bg-white shadow-lg rounded-xl">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                This Month's Financials ({currentDate.toLocaleString('default', { month: 'long' })})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Monthly Revenue */}
                <div className="bg-gray-50 p-4 rounded-lg flex items-start">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <CashIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Monthly Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(monthlyRevenue)}</p>
                  </div>
                </div>
                
                {/* Vs. Last Month */}
                <div className="bg-gray-50 p-4 rounded-lg flex items-start">
                  <div className={`${isPositiveChange ? 'bg-green-100' : 'bg-red-100'} p-3 rounded-full mr-4`}>
                    {isPositiveChange ? (
                      <TrendingUpIcon className="w-6 h-6 text-green-600" />
                    ) : (
                      <TrendingDownIcon className="w-6 h-6 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Vs. Last Month</p>
                    <p className={`text-2xl font-bold ${isPositiveChange ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositiveChange ? '+' : ''}{percentageChange.toFixed(1)}%
                    </p>
                  </div>
                </div>
                
                {/* Breakeven Goal */}
                <div className="bg-gray-50 p-4 rounded-lg md:col-span-2 lg:col-span-2">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Progress to Breakeven</p>
                            <p className="text-xl font-bold text-gray-900">
                                {formatCurrency(monthlyRevenue)} of {formatCurrency(totalMonthlyFixedCosts)}
                            </p>
                        </div>
                        <div className="flex items-start gap-6 text-right">
                            {profit > 0 && (
                                <div>
                                    <p className="text-sm font-medium text-green-600">This Month's Profit</p>
                                    <p className="text-xl font-bold text-green-600 flex items-center justify-end gap-1">
                                        <TrendingUpIcon className="w-5 h-5"/>
                                        {formatCurrency(profit)}
                                    </p>
                                </div>
                            )}
                            <div>
                                <p className="text-sm font-medium text-gray-500">Last Month's P/L</p>
                                <p className={`text-xl font-bold ${previousMonthProfitOrLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(previousMonthProfitOrLoss)}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                        <div 
                            className="bg-indigo-600 h-4 rounded-full transition-all duration-500 ease-out" 
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white shadow-lg rounded-xl">
                 <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <ChartLineIcon className="w-6 h-6 text-indigo-600" />
                    12-Month Profit/Loss Trend
                </h2>
                <div className="h-80 w-full">
                    <LineChart data={chartData} />
                </div>
            </div>
        </div>
        <div className="lg:col-span-1">
            <FixedCostsManager {...props} />
        </div>
    </div>
  );
};

export default FinancialsDashboard;
