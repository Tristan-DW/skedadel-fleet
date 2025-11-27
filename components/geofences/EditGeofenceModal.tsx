import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Geofence } from '../../types';

interface EditGeofenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateGeofence: (geofence: Geofence) => void;
  geofence: Geofence | null;
}

const EditGeofenceModal: React.FC<EditGeofenceModalProps> = ({ isOpen, onClose, onUpdateGeofence, geofence }) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('');

  useEffect(() => {
    if (geofence) {
      setName(geofence.name);
      setColor(geofence.color);
    }
  }, [geofence]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!geofence || !name || !color) return;
    
    onUpdateGeofence({ ...geofence, name, color });

    onClose();
  };
  
  if (!geofence) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit Geofence: ${geofence.name}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="edit-geofenceName" className="block text-sm font-medium text-text-secondary">Geofence Name</label>
          <input type="text" id="edit-geofenceName" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required />
        </div>
        <div>
          <label htmlFor="edit-color" className="block text-sm font-medium text-text-secondary">Zone Color</label>
           <select id="edit-color" value={color} onChange={(e) => setColor(e.target.value)} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required>
            <option value="rgba(239, 68, 68, 0.2)">Red</option>
            <option value="rgba(59, 130, 246, 0.2)">Blue</option>
            <option value="rgba(16, 185, 129, 0.2)">Green</option>
            <option value="rgba(245, 158, 11, 0.2)">Amber</option>
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

export default EditGeofenceModal;