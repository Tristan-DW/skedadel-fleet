
import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { ExclusionZone } from '../../types';

interface EditExclusionZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateZone: (zone: ExclusionZone) => void;
  zone: ExclusionZone | null;
}

const EditExclusionZoneModal: React.FC<EditExclusionZoneModalProps> = ({ isOpen, onClose, onUpdateZone, zone }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'No-go' | 'Slow-down'>('No-go');

  useEffect(() => {
    if (zone) {
      setName(zone.name);
      setType(zone.type);
    }
  }, [zone]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zone || !name) return;
    
    onUpdateZone({ ...zone, name, type });

    onClose();
  };
  
  if (!zone) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit Zone: ${zone.name}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="edit-zoneName" className="block text-sm font-medium text-text-secondary">Zone Name</label>
          <input type="text" id="edit-zoneName" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required />
        </div>
        <div>
          <label htmlFor="edit-zoneType" className="block text-sm font-medium text-text-secondary">Zone Type</label>
           <select id="edit-zoneType" value={type} onChange={(e) => setType(e.target.value as 'No-go' | 'Slow-down')} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required>
            <option value="No-go">No-go Zone</option>
            <option value="Slow-down">Slow-down Zone</option>
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

export default EditExclusionZoneModal;
