import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Hub, Geofence } from '../../types';

interface EditHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateHub: (hub: Hub) => void;
  hub: Hub | null;
  geofences: Geofence[];
}

const EditHubModal: React.FC<EditHubModalProps> = ({ isOpen, onClose, onUpdateHub, hub, geofences }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [geofenceId, setGeofenceId] = useState('');

  useEffect(() => {
    if (hub) {
      setName(hub.name);
      setAddress(hub.address || '');
      setGeofenceId(hub.geofenceId);
    }
  }, [hub]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hub || !name || !address || !geofenceId) return;

    onUpdateHub({
      ...hub,
      name,
      address,
      geofenceId,
    });

    onClose();
  };

  if (!hub) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit Hub: ${hub.name}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="edit-hubName" className="block text-sm font-medium text-text-secondary">Hub Name</label>
          <input type="text" id="edit-hubName" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required />
        </div>
        <div>
          <label htmlFor="edit-hub-address" className="block text-sm font-medium text-text-secondary">Address</label>
          <input type="text" id="edit-hub-address" value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required />
        </div>
        <div>
          <label htmlFor="edit-hub-geofence" className="block text-sm font-medium text-text-secondary">Assign Geofence</label>
          <select id="edit-hub-geofence" value={geofenceId} onChange={(e) => setGeofenceId(e.target.value)} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required>
            {geofences.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditHubModal;
