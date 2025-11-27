
import React, { useState, useMemo } from 'react';
import { Hub, Geofence } from '../types';
import Button from '../components/ui/Button';
import { ICONS } from '../constants';

// FIX: Add onAddHub and onEditHub to props for parent-controlled modal management.
interface HubsViewProps {
  hubs: Hub[];
  geofences: Geofence[];
  onSelectHub: (hubId: string) => void;
  onAddHub: () => void;
  onEditHub: (hub: Hub) => void;
}

const HubsView: React.FC<HubsViewProps> = ({ hubs, geofences, onSelectHub, onAddHub, onEditHub }) => {
  // FIX: Remove local modal state, as it's now handled by App.tsx.
  const [searchTerm, setSearchTerm] = useState('');
  const [geofenceFilter, setGeofenceFilter] = useState<string>('ALL');

  const filteredHubs = useMemo(() => {
    return hubs
      .filter(hub => geofenceFilter === 'ALL' || hub.geofenceId === geofenceFilter)
      .filter(hub => hub.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [hubs, searchTerm, geofenceFilter]);

  // FIX: Remove mock handlers as parent now controls this logic.

  return (
    <div className="p-6">
      <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-text-primary">Operational Hubs</h3>
            {/* FIX: Use onAddHub prop to trigger modal in parent. */}
            <Button onClick={onAddHub}>Add Hub</Button>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search by hub name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
            <select
              value={geofenceFilter}
              onChange={(e) => setGeofenceFilter(e.target.value)}
              className="bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            >
              <option value="ALL">All Geofences</option>
              {geofences.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          {filteredHubs.length > 0 ? (
            <table className="w-full text-sm text-left text-text-secondary">
              <thead className="text-xs text-text-secondary uppercase bg-background border-b border-border">
                <tr>
                  <th scope="col" className="px-6 py-3">Hub Name</th>
                  <th scope="col" className="px-6 py-3">Location</th>
                  <th scope="col" className="px-6 py-3">Geofence</th>
                  <th scope="col" className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredHubs.map((hub) => (
                  <tr key={hub.id} className="bg-surface border-b border-border last:border-b-0 hover:bg-secondary">
                    <th scope="row" className="px-6 py-4 font-medium text-text-primary whitespace-nowrap cursor-pointer hover:underline" onClick={() => onSelectHub(hub.id)}>
                      {hub.name}
                    </th>
                    <td className="px-6 py-4">{hub.address || 'N/A'}</td>
                    <td className="px-6 py-4 font-mono">{geofences.find(g => g.id === hub.geofenceId)?.name || 'N/A'}</td>
                    <td className="px-6 py-4">
                      {/* FIX: Use onEditHub prop to trigger modal in parent. */}
                      <Button variant="secondary" onClick={() => onEditHub(hub)}>Edit</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-16">
              <div className="mx-auto h-12 w-12 text-text-secondary">{ICONS.hubs}</div>
              <h3 className="mt-2 text-lg font-medium text-text-primary">No hubs found</h3>
              <p className="mt-1 text-sm text-text-secondary">Create a hub or adjust your filters.</p>
              {/* FIX: Use onAddHub prop to trigger modal in parent. */}
              <div className="mt-6">
                <Button onClick={onAddHub}>Add Hub</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HubsView;
