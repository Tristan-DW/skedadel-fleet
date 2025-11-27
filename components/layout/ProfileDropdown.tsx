import React from 'react';
import Dropdown, { DropdownItem } from '../ui/Dropdown';
import { User, ViewType } from '../../types';
import { ICONS } from '../../constants';

interface ProfileDropdownProps {
  user: User;
  setCurrentView: (view: ViewType) => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ user, setCurrentView }) => {
  const trigger = (
    <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-secondary transition-colors">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-white">
            {user.name.charAt(0)}
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
    </button>
  );

  return (
    <Dropdown trigger={trigger} menuWidth="w-48">
        <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-semibold text-text-primary">{user.name}</p>
            <p className="text-xs text-text-secondary truncate">{user.email}</p>
        </div>
        <div className="py-1">
            <DropdownItem onClick={() => setCurrentView('settings')}>
                {ICONS.settings}
                <span>Settings</span>
            </DropdownItem>
            <DropdownItem onClick={() => alert('Logged out!')}>
                {ICONS.logout}
                <span>Logout</span>
            </DropdownItem>
        </div>
    </Dropdown>
  );
};

export default ProfileDropdown;