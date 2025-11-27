
import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Geofence, Hub } from '../../types';

interface ManageGeofenceHubsModalProps {
  isOpen: boolean;
  onClose: () => void;
  geofence: Geofence | null;
  allHubs: Hub[];
  onUpdateHubs: (geofenceId: string, hubIds: string[]) => void;
}

const HubItem: React.FC<{ hub: Hub, onAction: () => void, actionIcon: React.ReactNode }> = ({ hub, onAction, actionIcon }) => (
    <div className="flex items-center justify-between p-2 bg-background rounded-md">
        <span>{hub.name}</span>
        <button onClick={onAction} className="text-text-secondary hover:text-primary">{actionIcon}</button>
    </div>
);


const ManageGeofenceHubsModal: React.FC<ManageGeofenceHubsModalProps> = ({ isOpen, onClose, geofence, allHubs, onUpdateHubs }) => {
  const [assignedHubIds, setAssignedHubIds] = useState<string[]>([]);
  
  useEffect(() => {
    if (geofence) {
      const currentHubIds = allHubs.filter(h => h.geofenceId === geofence.id).map(h => h.id);
      setAssignedHubIds(currentHubIds);
    }
  }, [geofence, allHubs, isOpen]);

  const addHub = (hubId: string) => {
    setAssignedHubIds(prev => [...prev, hubId]);
  };
  
  const removeHub = (hubId: string) => {
    setAssignedHubIds(prev => prev.filter(id => id !== hubId));
  };
  
  const handleSubmit = () => {
    if (geofence) {
      onUpdateHubs(geofence.id, assignedHubIds);
      onClose();
    }
  };

  if (!geofence) return null;
  
  const assignedHubs = allHubs.filter(h => assignedHubIds.includes(h.id));
  const availableHubs = allHubs.filter(h => h.geofenceId !== geofence.id && !assignedHubIds.includes(h.id));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Manage Hubs for ${geofence.name}`}>
      <div className="grid grid-cols-2 gap-4 h-96">
        <div className="border border-border rounded-lg p-2 flex flex-col">
            <h4 className="font-semibold text-center mb-2">Available Hubs</h4>
            <div className="overflow-y-auto space-y-2 flex-1 p-1">
                {availableHubs.map(h => (
                    <HubItem 
                        key={h.id} 
                        hub={h} 
                        onAction={() => addHub(h.id)} 
                        actionIcon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414l-3-3z" clipRule="evenodd" /></svg>} 
                    />
                ))}
            </div>
        </div>
        <div className="border border-border rounded-lg p-2 flex flex-col">
            <h4 className="font-semibold text-center mb-2">Assigned Hubs ({assignedHubs.length})</h4>
            <div className="overflow-y-auto space-y-2 flex-1 p-1">
                {assignedHubs.map(h => (
                     <HubItem 
                        key={h.id} 
                        hub={h} 
                        onAction={() => removeHub(h.id)} 
                        actionIcon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>} 
                    />
                ))}
            </div>
        </div>
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Update Hubs</Button>
      </div>
    </Modal>
  );
};

export default ManageGeofenceHubsModal;