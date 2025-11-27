import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Hub, Geofence } from '../../types';

interface AddHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddHub: (hub: Omit<Hub, 'id'>) => void;
  geofences: Geofence[];
}

const AddHubModal: React.FC<AddHubModalProps> = ({ isOpen, onClose, onAddHub, geofences }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [geofenceId, setGeofenceId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address || !geofenceId) return;
    
    onAddHub({
      name,
      location: { lat: -26.1, lng: 28.05, address }, // Mock lat/lng
      geofenceId,
    });

    onClose();
    // Reset form
    setName('');
    setAddress('');
    setGeofenceId('');
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Hub">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="hubName" className="block text-sm font-medium text-text-secondary">Hub Name</label>
          <input type="text" id="hubName" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-text-secondary">Address</label>
          <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required />
        </div>
        <div>
          <label htmlFor="geofence" className="block text-sm font-medium text-text-secondary">Assign Geofence</label>
          <select id="geofence" value={geofenceId} onChange={(e) => setGeofenceId(e.target.value)} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required>
            <option value="">Select a geofence</option>
            {geofences.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">Create Hub</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddHubModal;