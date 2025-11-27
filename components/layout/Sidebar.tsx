import React from 'react';
import { ViewType, User } from '../../types';
import { ICONS } from '../../constants';
import UserSwitcher from './UserSwitcher';

interface NavItemProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ label, icon, isActive, onClick }) => {
  return (
    <li>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onClick();
        }}
        className={`flex items-center p-2 text-base font-normal rounded-lg transition-colors duration-200 ${isActive
            ? 'bg-primary text-white'
            : 'text-text-secondary hover:bg-secondary'
          }`}
      >
        <div className="w-6 h-6">{icon}</div>
        <span className="ml-3">{label}</span>
      </a>
    </li>
  );
};

const NavGroup: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h3 className="px-3 pt-4 pb-2 text-xs font-semibold text-text-secondary uppercase tracking-wider">{title}</h3>
    <ul className="space-y-2">
      {children}
    </ul>
  </div>
);

const Sidebar: React.FC<{
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  currentUser: User;
  allUsers: User[];
  setCurrentUser: (user: User) => void;
}> = ({ currentView, setCurrentView, currentUser, allUsers, setCurrentUser: switchUser }) => {

  const navConfig = [
    {
      group: 'Operations',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: ICONS.dashboard },
        { id: 'orders', label: 'Orders', icon: ICONS.orders },
        { id: 'drivers', label: 'Drivers', icon: ICONS.drivers },
        { id: 'stores', label: 'Stores', icon: ICONS.stores },
        { id: 'live_chat', label: 'Live Chat', icon: ICONS.live_chat },
      ]
    },
    {
      group: 'Fleet',
      items: [
        { id: 'teams', label: 'Teams', icon: ICONS.teams },
        { id: 'hubs', label: 'Hubs', icon: ICONS.hubs },
        { id: 'geofences', label: 'Geofences', icon: ICONS.geofences },
        { id: 'exclusion_zones', label: 'Exclusion Zones', icon: ICONS.exclusion_zones },
      ]
    },
    {
      group: 'Performance',
      items: [
        { id: 'analytics', label: 'Analytics', icon: ICONS.analytics },
        { id: 'challenges', label: 'Challenges', icon: ICONS.challenges },
      ]
    },
    {
      group: 'System',
      items: [
        { id: 'financials', label: 'Financials', icon: ICONS.financials },
        { id: 'api_docs', label: 'API & Webhooks', icon: ICONS.api_docs },
        { id: 'api_tester', label: 'API Tester', icon: ICONS.api_docs },
        { id: 'integrations', label: 'Integrations', icon: ICONS.integrations },
        { id: 'settings', label: 'Settings', icon: ICONS.settings },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-surface border-r border-border flex-shrink-0 flex flex-col">
      <div className="p-4 border-b border-border">
        <h1 className="text-2xl font-bold text-text-primary">Skedadel</h1>
        <p className="text-sm text-text-secondary">Last-Mile Platform</p>
      </div>
      <div className="flex-1 overflow-y-auto py-4 px-3">
        {navConfig.map(group => (
          <NavGroup key={group.group} title={group.group}>
            {group.items.map(item => (
              <NavItem
                key={item.id}
                label={item.label}
                icon={item.icon}
                isActive={currentView === item.id}
                onClick={() => setCurrentView(item.id as ViewType)}
              />
            ))}
          </NavGroup>
        ))}
      </div>
      <div className="p-4 mt-auto border-t border-border">
        <UserSwitcher currentUser={currentUser} allUsers={allUsers} setCurrentUser={switchUser} />
      </div>
    </aside>
  );
};

export default Sidebar;