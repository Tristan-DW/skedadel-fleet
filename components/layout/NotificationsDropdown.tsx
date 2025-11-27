import React from 'react';
import Dropdown from '../ui/Dropdown';
import { Alert } from '../../types';
import { ICONS } from '../../constants';
import AlertItem from '../shared/AlertItem';

interface NotificationsDropdownProps {
    alerts: Alert[];
}

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({ alerts }) => {
    const hasUnread = alerts?.length > 0;

    const trigger = (
        <button className="relative p-2 rounded-full hover:bg-secondary transition-colors">
            {ICONS.bell}
            {hasUnread && (
                <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-surface"></span>
            )}
        </button>
    );

    return (
        <Dropdown trigger={trigger} menuWidth="w-96">
            <div className="px-4 py-3 font-semibold text-text-primary border-b border-border">
                Notifications
            </div>
            <div className="py-1 max-h-80 overflow-y-auto">
                {alerts?.length > 0 ? (
                    <ul className="divide-y divide-border">
                        {alerts.map(alert => (
                            <AlertItem key={alert.id} alert={alert} isDropdownItem />
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-text-secondary text-center py-4">No new notifications</p>
                )}
            </div>
        </Dropdown>
    );
};

export default NotificationsDropdown;