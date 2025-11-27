import React from 'react';
import { User } from '../../types';

interface UserSwitcherProps {
  currentUser: User;
  allUsers: User[];
  setCurrentUser: (user: User) => void;
}

const UserSwitcher: React.FC<UserSwitcherProps> = ({ currentUser, allUsers, setCurrentUser }) => {

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUserId = e.target.value;
    const selectedUser = allUsers.find(u => u.id === selectedUserId);
    if (selectedUser) {
      setCurrentUser(selectedUser);
    }
  };

  return (
    <div className="p-2 bg-background rounded-lg border border-border">
      <label htmlFor="user-switcher" className="block text-xs font-medium text-text-secondary mb-1">
        Demo User Role
      </label>
      <select
        id="user-switcher"
        value={currentUser.id}
        onChange={handleUserChange}
        className="block w-full bg-surface border-border rounded-md shadow-sm py-1.5 px-2 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
      >
        {allUsers.map(user => (
          <option key={user.id} value={user.id}>
            {user.name} ({user.role})
          </option>
        ))}
      </select>
       <p className="text-xs text-text-secondary mt-2">
        Switch user to see role-specific views.
      </p>
    </div>
  );
};

export default UserSwitcher;
