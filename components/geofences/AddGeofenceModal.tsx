import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Geofence } from '../../types';

interface AddGeofenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGeofence: (geofence: Omit<Geofence, 'id' | 'coordinates'>) => void;
}

const AddGeofenceModal: React.FC<AddGeofenceModalProps> = ({ isOpen, onClose, onAddGeofence }) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('rgba(239, 68, 68, 0.2)');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !color) return;
    
    onAddGeofence({ name, color });

    onClose();
    setName('');
    setColor('rgba(239, 68, 68, 0.2)');
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Geofence">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="geofenceName" className="block text-sm font-medium text-text-secondary">Geofence Name</label>
          <input type="text" id="geofenceName" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required />
        </div>
        <div>
          <label htmlFor="color" className="block text-sm font-medium text-text-secondary">Zone Color</label>
           <select id="color" value={color} onChange={(e) => setColor(e.target.value)} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required>
            <option value="rgba(239, 68, 68, 0.2)">Red</option>
            <option value="rgba(59, 130, 246, 0.2)">Blue</option>
            <option value="rgba(16, 185, 129, 0.2)">Green</option>
            <option value="rgba(245, 158, 11, 0.2)">Amber</option>
          </select>
        </div>
        <p className="text-xs text-text-secondary">For this demo, geofence coordinates will be pre-defined upon creation.</p>
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">Create Geofence</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddGeofenceModal;