import React from 'react';
import { ViewType, Alert, User } from '../../types';
import Button from '../ui/Button';
import NotificationsDropdown from './NotificationsDropdown';
import ProfileDropdown from './ProfileDropdown';

interface HeaderProps {
  onAddOrderClick: () => void;
  setCurrentView: (view: ViewType) => void;
  alerts: Alert[];
  user: User;
}

const Header: React.FC<HeaderProps> = ({ onAddOrderClick, setCurrentView, alerts, user }) => {
  return (
    <header className="bg-surface border-b border-border p-4 flex items-center justify-between flex-shrink-0">
      {/* Search Bar */}
      <div className="relative w-full max-w-md">
        <input
          type="text"
          placeholder="Search orders, drivers, or locations..."
          className="w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        />
      </div>

      <div className="flex items-center space-x-4">
        <Button onClick={onAddOrderClick}>Create Order</Button>
        <NotificationsDropdown alerts={alerts} />
        <ProfileDropdown user={user} setCurrentView={setCurrentView} />
      </div>
    </header>
  );
};

export default Header;