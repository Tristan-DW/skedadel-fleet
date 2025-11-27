
import React, { useState, useMemo } from 'react';
import { Geofence, Hub } from '../types';
import Button from '../components/ui/Button';

interface GeofencesViewProps {
  geofences: Geofence[];
  hubs: Hub[];
  onAddGeofence: () => void;
  onEditGeofence: (geofence: Geofence) => void;
  onDeleteGeofence: (id: string) => void;
  onManageHubs: (geofence: Geofence) => void;
}

const GeofencesView: React.FC<GeofencesViewProps> = ({ geofences, hubs, onAddGeofence, onEditGeofence, onDeleteGeofence, onManageHubs }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGeofences = useMemo(() => 
    geofences.filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [geofences, searchTerm]
  );

  return (
    <div className="p-6">
      <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-text-primary">Geofences</h3>
            <Button onClick={onAddGeofence}>Create Geofence</Button>
          </div>
           <input
              type="text"
              placeholder="Search by geofence name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-text-secondary">
            <thead className="text-xs text-text-secondary uppercase bg-background border-b border-border">
              <tr>
                <th scope="col" className="px-6 py-3">Name</th>
                <th scope="col" className="px-6 py-3">Color</th>
                <th scope="col" className="px-6 py-3">Associated Hubs</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGeofences.map((geofence) => (
                <tr key={geofence.id} className="bg-surface border-b border-border last:border-b-0">
                  <th scope="row" className="px-6 py-4 font-medium text-text-primary whitespace-nowrap">
                    {geofence.name}
                  </th>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className="w-4 h-4 rounded-full border border-border" style={{backgroundColor: geofence.color}}></span>
                      <span>{geofence.color}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {hubs.filter(h => h.geofenceId === geofence.id).length}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <Button variant="secondary" onClick={() => onEditGeofence(geofence)}>Edit</Button>
                      <Button variant="secondary" onClick={() => onManageHubs(geofence)}>Manage Hubs</Button>
                      <Button variant="danger" onClick={() => onDeleteGeofence(geofence.id)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GeofencesView;
