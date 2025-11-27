import React from 'react';
import { Alert, AlertType } from '../../types';

const timeSince = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return "just now";
}

const getAlertMeta = (type: AlertType) => {
    switch(type) {
        case AlertType.DRIVER_DELAYED: return { icon: '🚦', color: 'text-yellow-400' };
        case AlertType.ORDER_FAILED: return { icon: '❌', color: 'text-red-400' };
        case AlertType.LOW_COVERAGE: return { icon: '👥', color: 'text-blue-400' };
        case AlertType.ORDER_STATUS_UPDATED: return { icon: '📦', color: 'text-gray-400' };
        case AlertType.ENTERED_EXCLUSION_ZONE: return { icon: '⚠️', color: 'text-red-400' };
        case AlertType.CHALLENGE_COMPLETED: return { icon: '🏆', color: 'text-yellow-400' };
        default: return { icon: '🔔', color: 'text-gray-400' };
    }
}

interface AlertItemProps {
    alert: Alert;
    isDropdownItem?: boolean;
}

const AlertItem: React.FC<AlertItemProps> = ({ alert, isDropdownItem = false }) => {
    const { icon, color } = getAlertMeta(alert.type);

    const containerClasses = isDropdownItem
        ? "flex items-start space-x-3 p-3 transition-colors hover:bg-secondary"
        : "flex items-start space-x-4 p-3 bg-surface/80";

    return (
        <li className={containerClasses}>
            <div className={`flex-shrink-0 text-xl pt-1 ${color}`}>{icon}</div>
            <div className="flex-1">
                <p className="text-sm font-semibold text-text-primary">{alert.type}</p>
                <p className="text-xs text-text-secondary">{alert.message}</p>
            </div>
            <p className="text-xs text-text-secondary pt-1 flex-shrink-0">
                {timeSince(new Date(alert.timestamp))}
            </p>
        </li>
    );
};

export default AlertItem;