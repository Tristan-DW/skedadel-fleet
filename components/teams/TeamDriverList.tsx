import React from 'react';
import { Driver, DriverStatus } from '../../types';
import Button from '../ui/Button';

interface TeamDriverListProps {
  drivers: Driver[];
  onManageDrivers: () => void;
}

const DriverStatusIndicator: React.FC<{ status: DriverStatus }> = ({ status }) => {
    const statusStyles: Record<DriverStatus, string> = {
      [DriverStatus.ON_DUTY]: 'bg-red-500',
      [DriverStatus.AVAILABLE]: 'bg-green-500',
      [DriverStatus.OFFLINE]: 'bg-gray-500',
      [DriverStatus.MAINTENANCE]: 'bg-yellow-500',
    };
    return <span className={`h-2.5 w-2.5 rounded-full ${statusStyles[status]}`} title={status}></span>;
};

const TeamDriverList: React.FC<TeamDriverListProps> = ({ drivers, onManageDrivers }) => {
  return (
    <div className="bg-surface border border-border rounded-lg shadow-sm">
      {/* Fix: Added a header with a button to trigger onManageDrivers, which was missing. */}
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h3 className="text-lg font-semibold text-text-primary">Team Roster ({drivers.length})</h3>
        <Button variant="secondary" onClick={onManageDrivers}>Manage Roster</Button>
      </div>
      <ul className="divide-y divide-border max-h-96 overflow-y-auto">
        {drivers.map(driver => (
          <li key={driver.id} className="p-3 flex items-center justify-between hover:bg-secondary">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center font-bold text-text-primary text-sm">
                {driver.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-text-primary text-sm">{driver.name}</p>
                <p className="text-xs text-text-secondary">{driver.phone}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <DriverStatusIndicator status={driver.status} />
              <span className="text-xs text-text-secondary">{driver.status}</span>
            </div>
          </li>
        ))}
        {drivers.length === 0 && <p className="text-center text-text-secondary p-4">No drivers in this team.</p>}
      </ul>
    </div>
  );
};

export default TeamDriverList;