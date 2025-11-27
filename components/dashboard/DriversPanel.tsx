import React, { useState } from 'react';
import { Driver, DriverStatus } from '../../types';

const DriverStatusIndicator: React.FC<{ status: DriverStatus }> = ({ status }) => {
    const statusStyles: Record<DriverStatus, string> = {
      [DriverStatus.ON_DUTY]: 'bg-red-500',
      [DriverStatus.AVAILABLE]: 'bg-green-500',
      [DriverStatus.OFFLINE]: 'bg-gray-500',
      [DriverStatus.MAINTENANCE]: 'bg-yellow-500',
    };
    return <span className={`h-2.5 w-2.5 rounded-full ${statusStyles[status]}`}></span>;
};

type StatusFilter = DriverStatus | 'ALL';

const DriversPanel: React.FC<{ drivers: Driver[] }> = ({ drivers }) => {
    const [filter, setFilter] = useState<StatusFilter>('ALL');

    const filteredDrivers = filter === 'ALL' ? drivers : drivers.filter(d => d.status === filter);

    const filters: { label: string, value: StatusFilter }[] = [
        { label: 'All', value: 'ALL' },
        { label: 'On Duty', value: DriverStatus.ON_DUTY },
        { label: 'Available', value: DriverStatus.AVAILABLE },
        { label: 'Offline', value: DriverStatus.OFFLINE },
    ];

    return (
        <div className="bg-surface/70 backdrop-blur-sm border border-border rounded-lg shadow-xl flex flex-col max-h-96">
            <h3 className="text-base font-semibold text-text-primary p-3 border-b border-border">
                Drivers
            </h3>
            <div className="flex space-x-2 p-2 border-b border-border overflow-x-auto">
                {filters.map(({label, value}) => (
                    <button 
                        key={value}
                        onClick={() => setFilter(value)}
                        className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                            filter === value ? 'bg-primary text-white' : 'bg-background hover:bg-secondary'
                        }`}
                    >
                        {label} ({value === 'ALL' ? drivers.length : drivers.filter(d => d.status === value).length})
                    </button>
                ))}
            </div>
            <ul className="overflow-y-auto flex-1">
                {filteredDrivers.map(driver => (
                    <li key={driver.id} className="flex items-center justify-between p-3 border-b border-border last:border-b-0 hover:bg-secondary cursor-pointer">
                        <div className="flex items-center space-x-3">
                            <DriverStatusIndicator status={driver.status} />
                            <div>
                                <p className="font-medium text-sm text-text-primary">{driver.name}</p>
                                <p className="text-xs text-text-secondary">{driver.status}</p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DriversPanel;
