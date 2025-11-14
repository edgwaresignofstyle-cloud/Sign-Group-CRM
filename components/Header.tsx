import React from 'react';
import { BriefcaseIcon, ChartBarIcon, ClipboardListIcon, UserCircleIcon, UsersIcon as UsersNavIcon, LogoutIcon } from './icons';
import { AppView, Permissions, User } from '../types';

interface HeaderProps {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
  permissions: Permissions;
  currentUser: User;
  onOpenProfile: () => void;
  onLogout: () => void;
}

const NavButton: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  const baseClasses = "flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-colors duration-200 text-sm font-medium w-full sm:w-auto";
  const activeClasses = "bg-indigo-100 text-indigo-700";
  const inactiveClasses = "text-gray-500 hover:bg-gray-100 hover:text-gray-700";
  
  return (
    <button onClick={onClick} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`} aria-label={label}>
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
};

const Header: React.FC<HeaderProps> = ({ activeView, onNavigate, permissions, currentUser, onOpenProfile, onLogout }) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 md:px-8 py-3 flex flex-wrap justify-between items-center gap-y-3">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-indigo-600">
          Sign Group <span className="font-light text-gray-600">CRM</span>
        </h1>
        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <nav className="p-1 bg-gray-50 rounded-lg shadow-inner flex items-center gap-1 w-full sm:w-auto">
            {permissions.jobs.view && (
              <NavButton 
                label="Jobs"
                icon={<ClipboardListIcon className="w-5 h-5" />}
                isActive={activeView === 'jobs'}
                onClick={() => onNavigate('jobs')}
              />
            )}
            {permissions.financials.view && (
              <NavButton 
                label="Financials"
                icon={<ChartBarIcon className="w-5 h-5" />}
                isActive={activeView === 'financials'}
                onClick={() => onNavigate('financials')}
              />
            )}
            {permissions.items.view && (
              <NavButton 
                label="Items"
                icon={<BriefcaseIcon className="w-5 h-5" />}
                isActive={activeView === 'items'}
                onClick={() => onNavigate('items')}
              />
            )}
            {permissions.users.view && (
              <NavButton 
                label="Users"
                icon={<UsersNavIcon className="w-5 h-5" />}
                isActive={activeView === 'users'}
                onClick={() => onNavigate('users')}
              />
            )}
          </nav>
          <div className="flex items-center gap-2 border-l pl-2 sm:pl-4">
            <button onClick={onOpenProfile} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <UserCircleIcon className="w-8 h-8 text-gray-400" />
                <div className="hidden sm:block">
                    <div className="font-semibold text-sm text-gray-800 text-left">{currentUser.name}</div>
                    <div className="text-xs text-gray-500 text-left">{currentUser.role}</div>
                </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
