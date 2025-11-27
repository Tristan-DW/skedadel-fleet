
import React, { useState, useMemo } from 'react';
import { Driver, Team, Vehicle, DriverStatus } from '../types';
import Button from '../components/ui/Button';

// FIX: Add onAddDriver and onEditDriver to props to be controlled by the parent component.
interface DriversViewProps {
  drivers: Driver[];
  teams: Team[];
  vehicles: Vehicle[];
  onSelectDriver: (driverId: string) => void;
  onAddDriver: () => void;
  onEditDriver: (driver: Driver) => void;
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

const DriversView: React.FC<DriversViewProps> = ({ drivers, teams, vehicles, onSelectDriver, onAddDriver, onEditDriver }) => {
  // FIX: Remove local state for modals, as it's now handled in App.tsx.
  const [searchTerm, setSearchTerm] = useState('');
  const [teamFilter, setTeamFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<DriverStatus | 'ALL'>('ALL');

  const filteredDrivers = useMemo(() => {
    return drivers
      .filter(driver => teamFilter === 'ALL' || driver.teamId === teamFilter)
      .filter(driver => statusFilter === 'ALL' || driver.status === statusFilter)
      .filter(driver => driver.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [drivers, searchTerm, teamFilter, statusFilter]);

  // FIX: Remove mock handlers as parent component now provides logic.

  return (
    <div className="p-6">
      <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border space-y-4">
          <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-text-primary">Fleet Drivers</h3>
              {/* FIX: Use onAddDriver from props to open modal. */}
              <Button onClick={onAddDriver}>Add Driver</Button>
          </div>
          <div className="flex items-center space-x-2">
              <input
                  type="text"
                  placeholder="Search by driver name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
              <select
                  value={teamFilter}
                  onChange={(e) => setTeamFilter(e.target.value)}
                  className="bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
                  <option value="ALL">All Teams</option>
                  {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as DriverStatus | 'ALL')}
                  className="bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
                  <option value="ALL">All Statuses</option>
                  {/* FIX: Explicitly type `s` as DriverStatus to resolve TypeScript inference issue. */}
                  {Object.values(DriverStatus).map((s: DriverStatus) => <option key={s} value={s}>{s}</option>)}
              </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-text-secondary">
            <thead className="text-xs text-text-secondary uppercase bg-background border-b border-border">
              <tr>
                <th scope="col" className="px-6 py-3">Name</th>
                <th scope="col" className="px-6 py-3">Contact</th>
                <th scope="col" className="px-6 py-3">Team</th>
                <th scope="col" className="px-6 py-3">Vehicle</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDrivers.map((driver) => {
                const team = teams.find(t => t.id === driver.teamId);
                const vehicle = vehicles.find(v => v.id === driver.vehicleId);
                return (
                  <tr key={driver.id} className="bg-surface border-b border-border last:border-b-0 hover:bg-secondary">
                    <th scope="row" className="px-6 py-4 font-medium text-text-primary whitespace-nowrap cursor-pointer hover:underline" onClick={() => onSelectDriver(driver.id)}>
                      {driver.name}
                    </th>
                    <td className="px-6 py-4">{driver.phone}</td>
                    <td className="px-6 py-4">{team?.name || 'N/A'}</td>
                    <td className="px-6 py-4">{vehicle?.licensePlate || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                          <DriverStatusIndicator status={driver.status} />
                          <span>{driver.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {/* FIX: Use onEditDriver from props to open modal. */}
                      <Button variant="secondary" onClick={() => onEditDriver(driver)}>Edit</Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DriversView;