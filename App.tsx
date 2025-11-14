import React, { useState, useMemo } from 'react';
import { Job, CostItem, AppView, FixedCostItem, ItemCategory, User, Permissions, UserRole, ChangelogEntry } from './types';
import { INITIAL_JOBS, INITIAL_COST_ITEMS, INITIAL_FIXED_COSTS, INITIAL_FIXED_COST_CONTRIBUTION_PERCENTAGE, INITIAL_ITEM_CATEGORIES, AVAILABLE_CATEGORY_COLORS, AVAILABLE_ICONS, USERS, ROLE_PERMISSIONS } from './constants';
import Header from './components/Header';
import JobTable from './components/JobTable';
import JobModal from './components/JobModal';
import FinancialsDashboard from './components/FinancialsDashboard';
import ItemsDashboard from './components/ItemsDashboard';
import ItemModal from './components/ItemModal';
import FixedCostModal from './components/FixedCostModal';
import CategoryModal from './components/CategoryModal';
import ConfirmationModal from './components/ConfirmationModal';
import UserManagementDashboard from './components/UserManagementDashboard';
import UserModal from './components/UserModal';
import ProfileModal from './components/ProfileModal';
import { PlusIcon } from './components/icons';
import JobReportModal from './components/JobReportModal';

type ConfirmationState = {
  message: string;
  onConfirm: () => void;
} | null;

const App: React.FC = () => {
  // --- AUTHENTICATION STATE ---
  const [currentUser, setCurrentUser] = useState<User>(USERS[0]);

  // State for core data
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [costItems, setCostItems] = useState<CostItem[]>(INITIAL_COST_ITEMS);
  const [itemCategories, setItemCategories] = useState<ItemCategory[]>(INITIAL_ITEM_CATEGORIES);
  const [companyFixedCosts, setCompanyFixedCosts] = useState<FixedCostItem[]>(INITIAL_FIXED_COSTS);
  const [fixedCostContributionPercentage, setFixedCostContributionPercentage] = useState<number>(INITIAL_FIXED_COST_CONTRIBUTION_PERCENTAGE);
  const [users, setUsers] = useState<User[]>(USERS);

  // State for UI control
  const [activeView, setActiveView] = useState<AppView>('jobs');
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for Modals
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CostItem | null>(null);
  const [isFixedCostModalOpen, setIsFixedCostModalOpen] = useState(false);
  const [editingFixedCost, setEditingFixedCost] = useState<FixedCostItem | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ItemCategory | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [confirmation, setConfirmation] = useState<ConfirmationState>(null);
  const [reportingJob, setReportingJob] = useState<Job | null>(null);

  const permissions = currentUser.permissions;

  // --- Auth Handlers ---
  const handleLogout = () => {
    // Login is suspended, so logout does nothing.
  };
  
  // --- Confirmation Handler ---
  const handleConfirm = () => {
    if (confirmation) {
      confirmation.onConfirm();
      setConfirmation(null);
    }
  };

  // --- Job Handlers ---
  const handleAddNewJob = () => {
    setEditingJob(null);
    setIsJobModalOpen(true);
  };
  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setIsJobModalOpen(true);
  };
  const handleDeleteJob = (jobId: string) => {
    setConfirmation({
      message: 'Are you sure you want to permanently delete this job?',
      onConfirm: () => setJobs(jobs.filter(job => job.id !== jobId)),
    });
  };
  const handleSaveJob = (jobToSave: Job) => {
    if (editingJob) {
      let updatedJob = { ...jobToSave };
      // Check for stage change and create a log entry
      if (editingJob.stage !== jobToSave.stage) {
        const newChangelogEntry: ChangelogEntry = {
          userId: currentUser.id,
          timestamp: new Date().toISOString(),
          fromStage: editingJob.stage,
          toStage: jobToSave.stage,
        };
        updatedJob.changelog = [...(jobToSave.changelog || []), newChangelogEntry];
      }
      setJobs(jobs.map(job => (job.id === updatedJob.id ? updatedJob : job)));
    } else {
      setJobs([{ ...jobToSave, id: `job-${Date.now()}`, salespersonId: currentUser.id, changelog: [] }, ...jobs]);
    }
    setIsJobModalOpen(false);
    setEditingJob(null);
  };
  
  const handleOpenReport = (job: Job) => {
    setReportingJob(job);
    setIsJobModalOpen(false); // Close edit modal when opening report
  };

  // --- Item Handlers ---
  const handleAddNewItem = () => {
    setEditingItem(null);
    setIsItemModalOpen(true);
  };
  const handleEditItem = (item: CostItem) => {
    setEditingItem(item);
    setIsItemModalOpen(true);
  };
  const handleDeleteItem = (itemId: string) => {
    setConfirmation({
      message: 'Are you sure you want to delete this item? This cannot be undone.',
      onConfirm: () => setCostItems(costItems.filter(item => item.id !== itemId)),
    });
  };
  const handleSaveItem = (itemToSave: CostItem) => {
    if(editingItem) {
      setCostItems(costItems.map(item => item.id === itemToSave.id ? itemToSave : item));
    } else {
      setCostItems([...costItems, { ...itemToSave, id: `ci-${Date.now()}`}]);
    }
    setIsItemModalOpen(false);
    setEditingItem(null);
  };

  // --- Category Handlers ---
  const handleAddNewCategory = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };
  const handleEditCategory = (category: ItemCategory) => {
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  };
  const handleDeleteCategory = (categoryId: string) => {
    setConfirmation({
      message: 'Are you sure you want to delete this category?',
      onConfirm: () => setItemCategories(itemCategories.filter(cat => cat.id !== categoryId)),
    });
  };
  const handleSaveCategory = (categoryToSave: ItemCategory) => {
    if (editingCategory) {
      setItemCategories(itemCategories.map(cat => cat.id === categoryToSave.id ? categoryToSave : cat));
    } else {
      setItemCategories([...itemCategories, { ...categoryToSave, id: `cat-${Date.now()}`}]);
    }
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
  };

  // --- Company Fixed Cost Handlers ---
  const handleAddNewFixedCost = () => {
    setEditingFixedCost(null);
    setIsFixedCostModalOpen(true);
  };
  const handleEditFixedCost = (item: FixedCostItem) => {
    setEditingFixedCost(item);
    setIsFixedCostModalOpen(true);
  };
  const handleDeleteFixedCost = (itemId: string) => {
    setConfirmation({
        message: 'Are you sure you want to delete this fixed cost item?',
        onConfirm: () => setCompanyFixedCosts(companyFixedCosts.filter(item => item.id !== itemId))
    });
  };
  const handleSaveFixedCost = (itemToSave: FixedCostItem) => {
    if (editingFixedCost) {
      setCompanyFixedCosts(companyFixedCosts.map(item => item.id === itemToSave.id ? itemToSave : item));
    } else {
      setCompanyFixedCosts([...companyFixedCosts, { ...itemToSave, id: `fc-${Date.now()}`}]);
    }
    setIsFixedCostModalOpen(false);
    setEditingFixedCost(null);
  };

  // --- User Handlers ---
    const handleAddNewUser = () => {
        setEditingUser(null);
        setIsUserModalOpen(true);
    };
    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setIsUserModalOpen(true);
    };
    const handleDeleteUser = (userId: string) => {
        if (userId === currentUser.id) {
            alert("You cannot delete your own account.");
            return;
        }
        setConfirmation({
            message: 'Are you sure you want to delete this user?',
            onConfirm: () => setUsers(users.filter(user => user.id !== userId)),
        });
    };
    const handleSaveUser = (userToSave: User) => {
        if (editingUser) {
            setUsers(users.map(user => (user.id === userToSave.id ? userToSave : user)));
             if (currentUser.id === userToSave.id) {
                setCurrentUser(userToSave);
            }
        } else {
            const newUser = { 
                ...userToSave, 
                id: `user-${Date.now()}`, 
                password: 'password123',
                permissions: userToSave.permissions || ROLE_PERMISSIONS[userToSave.role],
            };
            setUsers([...users, newUser]);
        }
        setIsUserModalOpen(false);
        setEditingUser(null);
    };

    const handleOpenProfile = () => {
        setIsProfileModalOpen(true);
    };

    const handleSaveProfile = async (
        userId: string, 
        currentPasswordAttempt: string, 
        newDetails: { name: string; email: string; password?: string }
    ): Promise<boolean> => {
        const userToUpdate = users.find(u => u.id === userId);
        if (!userToUpdate || userToUpdate.password !== currentPasswordAttempt) {
            return false;
        }

        const updatedUsers = users.map(u => {
            if (u.id === userId) {
                return {
                    ...u,
                    name: newDetails.name,
                    email: newDetails.email,
                    password: newDetails.password || u.password,
                };
            }
            return u;
        });
        
        setUsers(updatedUsers);

        const updatedCurrentUser = updatedUsers.find(u => u.id === userId);
        if (updatedCurrentUser) {
            setCurrentUser(updatedCurrentUser);
        }
        
        setIsProfileModalOpen(false);
        return true;
    };


  const filteredJobs = useMemo(() => {
    return jobs.filter(job =>
      job.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.jobDescription.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [jobs, searchTerm]);

  const renderContent = () => {
    switch(activeView) {
      case 'financials':
        return permissions.financials.view ? <FinancialsDashboard 
                  jobs={jobs} 
                  companyFixedCosts={companyFixedCosts}
                  fixedCostContributionPercentage={fixedCostContributionPercentage}
                  onAddFixedCost={handleAddNewFixedCost}
                  onEditFixedCost={handleEditFixedCost}
                  onDeleteFixedCost={handleDeleteFixedCost}
                  onUpdateContributionPercentage={setFixedCostContributionPercentage}
                  permissions={permissions.financials}
                /> : <div>Access Denied</div>;
      case 'items':
        return permissions.items.view ? <ItemsDashboard 
                  items={costItems}
                  categories={itemCategories}
                  onAddNewItem={handleAddNewItem}
                  onEditItem={handleEditItem}
                  onDeleteItem={handleDeleteItem}
                  onAddNewCategory={handleAddNewCategory}
                  onEditCategory={handleEditCategory}
                  onDeleteCategory={handleDeleteCategory} 
                  permissions={permissions.items}
                /> : <div>Access Denied</div>;
      case 'users':
        return permissions.users.view ? <UserManagementDashboard
                    users={users}
                    onAddNewUser={handleAddNewUser}
                    onEditUser={handleEditUser}
                    onDeleteUser={handleDeleteUser}
                 /> : <div>Access Denied</div>;
      case 'jobs':
      default:
        return permissions.jobs.view ? (
          <>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
              <input
                type="text"
                placeholder="Search by client or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full max-w-lg p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
               {permissions.jobs.create && (
                  <button
                    onClick={handleAddNewJob}
                    className="flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-3 px-5 rounded-lg shadow-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <PlusIcon className="w-5 h-5" />
                    <span>Add New Job</span>
                  </button>
               )}
            </div>
            <JobTable 
              jobs={filteredJobs} 
              onEdit={handleEditJob} 
              onDelete={handleDeleteJob} 
              costItems={costItems}
              permissions={permissions.jobs}
              currentUser={currentUser}
            />
          </>
        ) : <div>Access Denied</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header 
        activeView={activeView} 
        onNavigate={setActiveView} 
        permissions={permissions} 
        currentUser={currentUser} 
        onOpenProfile={handleOpenProfile} 
        onLogout={handleLogout}
      />
      <main className="container mx-auto p-4 md:p-8">
        {renderContent()}
      </main>
      
      {isJobModalOpen && (
        <JobModal
          job={editingJob}
          onSave={handleSaveJob}
          onClose={() => setIsJobModalOpen(false)}
          costItems={costItems}
          defaultFixedCostContribution={fixedCostContributionPercentage}
          isReadOnly={!permissions.jobs.edit || (editingJob?.salespersonId !== currentUser.id && currentUser.role !== UserRole.ADMIN)}
          users={users}
          currentUser={currentUser}
          onViewReport={handleOpenReport}
        />
      )}

      {reportingJob && (
        <JobReportModal
          job={reportingJob}
          costItems={costItems}
          users={users}
          onClose={() => setReportingJob(null)}
        />
      )}

      {isItemModalOpen && (
        <ItemModal
            item={editingItem}
            onSave={handleSaveItem}
            onClose={() => setIsItemModalOpen(false)}
            categories={itemCategories}
            isReadOnly={!permissions.items.edit}
        />
      )}

      {isCategoryModalOpen && (
        <CategoryModal
          category={editingCategory}
          onSave={handleSaveCategory}
          onClose={() => setIsCategoryModalOpen(false)}
          availableColors={AVAILABLE_CATEGORY_COLORS}
          availableIcons={AVAILABLE_ICONS}
          isReadOnly={!permissions.items.edit}
        />
      )}

      {isFixedCostModalOpen && (
        <FixedCostModal
            item={editingFixedCost}
            onSave={handleSaveFixedCost}
            onClose={() => setIsFixedCostModalOpen(false)}
            isReadOnly={!permissions.financials.edit}
        />
      )}

       {isUserModalOpen && (
        <UserModal
          user={editingUser}
          onSave={handleSaveUser}
          onClose={() => setIsUserModalOpen(false)}
          rolePermissions={ROLE_PERMISSIONS}
        />
      )}

      {isProfileModalOpen && (
        <ProfileModal
            user={currentUser}
            onSave={handleSaveProfile}
            onClose={() => setIsProfileModalOpen(false)}
        />
      )}

      {confirmation && (
        <ConfirmationModal
          message={confirmation.message}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmation(null)}
        />
      )}
    </div>
  );
};

export default App;
