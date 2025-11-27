
import React, { useState } from 'react';
import { Hub, Geofence } from '../types';
import Button from '../components/ui/Button';
import { ICONS } from '../constants';
import AddHubModal from '../components/hubs/AddHubModal';
import EditHubModal from '../components/hubs/EditHubModal';

interface HubsViewProps {
  hubs: Hub[];
  geofences: Geofence[];
}

const HubsView: React.FC<HubsViewProps> = ({ hubs, geofences }) => {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [editingHub, setEditingHub] = useState<Hub | null>(null);

  const handleAddHub = (hub: Omit<Hub, 'id'>) => {
    alert(`Hub "${hub.name}" added! (mock)`);
    console.log("Adding hub:", hub);
  };

  const handleUpdateHub = (hub: Hub) => {
    alert(`Hub "${hub.name}" updated! (mock)`);
    console.log("Updating hub:", hub);
  };

  return (
    <>
      <div className="p-6">
        <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border flex justify-between items-center">
            <h3 className="text-lg font-semibold text-text-primary">Operational Hubs</h3>
            <Button onClick={() => setAddModalOpen(true)}>Add Hub</Button>
          </div>
          <div className="overflow-x-auto">
            {hubs.length > 0 ? (
              <table className="w-full text-sm text-left text-text-secondary">
                <thead className="text-xs text-text-secondary uppercase bg-background border-b border-border">
                  <tr>
                    <th scope="col" className="px-6 py-3">Hub Name</th>
                    <th scope="col" className="px-6 py-3">Location</th>
                    <th scope="col" className="px-6 py-3">Geofence ID</th>
                    <th scope="col" className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {hubs.map((hub) => (
                    <tr key={hub.id} className="bg-surface border-b border-border last:border-b-0 hover:bg-secondary">
                      <th scope="row" className="px-6 py-4 font-medium text-text-primary whitespace-nowrap">
                        {hub.name}
                      </th>
                      <td className="px-6 py-4">{hub.address || 'N/A'}</td>
                      <td className="px-6 py-4 font-mono">{hub.geofenceId}</td>
                      <td className="px-6 py-4">
                        <Button variant="secondary" onClick={() => setEditingHub(hub)}>Edit</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-16">
                <div className="mx-auto h-12 w-12 text-text-secondary">{ICONS.hubs}</div>
                <h3 className="mt-2 text-lg font-medium text-text-primary">No hubs created</h3>
                <p className="mt-1 text-sm text-text-secondary">Create your first operational hub to assign drivers and tasks.</p>
                <div className="mt-6">
                  <Button onClick={() => setAddModalOpen(true)}>Add Hub</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <AddHubModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAddHub={handleAddHub}
        geofences={geofences}
      />
      <EditHubModal
        isOpen={!!editingHub}
        onClose={() => setEditingHub(null)}
        onUpdateHub={handleUpdateHub}
        hub={editingHub}
        geofences={geofences}
      />
    </>
  );
};

export default HubsView;
