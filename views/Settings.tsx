import React, { useState } from 'react';
import Tabs from '../components/ui/Tabs';
import { User, UserRole, Webhook } from '../types';
import Button from '../components/ui/Button';
import { ICONS } from '../constants';
import WebhookSettingsView from '../components/settings/WebhookSettingsView';

interface SettingsProps {
    users: User[];
    currentUser: User;
    setCurrentUser: (user: User) => void;
    webhooks: Webhook[];
    setWebhooks: React.Dispatch<React.SetStateAction<Webhook[]>>;
}

type SettingsTab = 'profile' | 'team' | 'webhooks' | 'notifications';

const RoleBadge: React.FC<{ role: UserRole }> = ({ role }) => {
    // Fix: Added 'Team Lead' to satisfy the Record<UserRole, string> type.
    const roleStyles: Record<UserRole, string> = {
        'Admin': 'bg-primary/20 text-primary border border-primary/50',
        'Manager': 'bg-blue-500/20 text-blue-300 border border-blue-500/50',
        'Team Lead': 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50',
        'Driver': 'bg-gray-500/20 text-gray-300 border border-gray-500/50',
    };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${roleStyles[role]}`}>{role}</span>
}

const ProfileSettingsView: React.FC<{ user: User, onUpdate: (user: User) => void }> = ({ user, onUpdate }) => {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);

    const handleSave = () => {
        onUpdate({ ...user, name, email });
        alert('Profile updated!');
    };

    return (
        <div className="bg-surface border border-border rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-text-primary p-4 border-b border-border">My Profile</h3>
            <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-text-secondary">Full Name</label>
                        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-text-secondary">Email Address</label>
                        <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>
                </div>
                <div>
                     <label htmlFor="role" className="block text-sm font-medium text-text-secondary">Role</label>
                     <p className="mt-1 text-text-primary"><RoleBadge role={user.role} /></p>
                </div>
            </div>
            <div className="p-4 bg-background border-t border-border flex justify-end">
                <Button onClick={handleSave}>Save Changes</Button>
            </div>
        </div>
    );
};

const NotificationToggle: React.FC<{ label: string, description: string }> = ({ label, description }) => {
    const [emailEnabled, setEmailEnabled] = useState(true);
    const [inAppEnabled, setInAppEnabled] = useState(true);
    return (
         <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <div>
                <h4 className="text-text-primary font-medium">{label}</h4>
                <p className="text-text-secondary text-sm">{description}</p>
            </div>
            <div className="col-span-2 flex items-center justify-around mt-2 sm:mt-0">
                <label className="flex items-center cursor-pointer">
                    <input type="checkbox" checked={emailEnabled} onChange={() => setEmailEnabled(!emailEnabled)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-success"></div>
                </label>
                 <label className="flex items-center cursor-pointer">
                    <input type="checkbox" checked={inAppEnabled} onChange={() => setInAppEnabled(!inAppEnabled)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-success"></div>
                </label>
            </div>
        </div>
    );
};

const NotificationSettingsView: React.FC = () => (
     <div className="bg-surface border border-border rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-text-primary p-4 border-b border-border">Notification Preferences</h3>
        <div className="p-6">
            <div className="divide-y divide-border">
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 font-semibold text-text-secondary text-sm">
                    <h4>Event Type</h4>
                    <div className="col-span-2 flex items-center justify-around">
                        <span>Email</span>
                        <span>In-App</span>
                    </div>
                </div>
                <NotificationToggle label="Order Failed" description="Get notified when a delivery fails or is returned." />
                <NotificationToggle label="Driver Delayed" description="Alert when a driver's ETA changes significantly." />
                <NotificationToggle label="Low Coverage" description="Alert for low driver availability in a specific zone." />
                <NotificationToggle label="Maintenance Required" description="Get notified when a vehicle is flagged for maintenance." />
            </div>
        </div>
         <div className="p-4 bg-background border-t border-border flex justify-end">
            <Button onClick={() => alert('Notification settings saved!')}>Save Preferences</Button>
        </div>
    </div>
);


const TeamManagementView: React.FC<{ users: User[] }> = ({ users }) => (
    <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h3 className="text-lg font-semibold text-text-primary">Team Members</h3>
        <Button>Invite User</Button>
      </div>
      <div className="overflow-x-auto">
        {users.length > 0 ? (
            <table className="w-full text-sm text-left text-text-secondary">
            <thead className="text-xs text-text-secondary uppercase bg-background border-b border-border">
                <tr>
                <th scope="col" className="px-6 py-3">Name</th>
                <th scope="col" className="px-6 py-3">Email</th>
                <th scope="col" className="px-6 py-3">Role</th>
                <th scope="col" className="px-6 py-3">Last Login</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user) => (
                    <tr key={user.id} className="bg-surface border-b border-border last:border-b-0 hover:bg-secondary">
                    <th scope="row" className="px-6 py-4 font-medium text-text-primary whitespace-nowrap">
                        {user.name}
                    </th>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4"><RoleBadge role={user.role} /></td>
                    <td className="px-6 py-4">{new Date(user.lastLogin).toLocaleString()}</td>
                    </tr>
                ))}
            </tbody>
            </table>
        ) : (
            <div className="text-center py-16">
              <div className="mx-auto h-12 w-12 text-text-secondary">{ICONS.drivers}</div>
              <h3 className="mt-2 text-lg font-medium text-text-primary">No team members</h3>
              <p className="mt-1 text-sm text-text-secondary">Invite users to build your team and manage your fleet.</p>
              <div className="mt-6">
                <Button>Invite User</Button>
              </div>
            </div>
        )}
      </div>
    </div>
)

const SettingsView: React.FC<SettingsProps> = ({ users, currentUser, setCurrentUser, webhooks, setWebhooks }) => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

    const TABS: {id: SettingsTab, label: string}[] = [
        {id: 'profile', label: 'My Profile'},
        {id: 'team', label: 'Team Management'},
        {id: 'webhooks', label: 'Webhooks'},
        {id: 'notifications', label: 'Notifications'},
    ]

    const renderContent = () => {
        switch(activeTab) {
            case 'team':
                return <TeamManagementView users={users} />;
            case 'profile':
                return <ProfileSettingsView user={currentUser} onUpdate={setCurrentUser} />;
             case 'webhooks':
                return <WebhookSettingsView webhooks={webhooks} setWebhooks={setWebhooks} />;
             case 'notifications':
                return <NotificationSettingsView />;
            default:
                return null;
        }
    }

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold text-text-primary">Settings</h2>
            <div className="bg-surface border border-border rounded-lg p-2">
                <Tabs tabs={TABS} activeTab={activeTab} onTabClick={(tabId) => setActiveTab(tabId)} />
            </div>
            <div className="mt-4">
                {renderContent()}
            </div>
        </div>
    )
}

export default SettingsView;