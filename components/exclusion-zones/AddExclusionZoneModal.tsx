
import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { ExclusionZone } from '../../types';

interface AddExclusionZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddZone: (zone: Omit<ExclusionZone, 'id' | 'coordinates'>) => void;
}

const AddExclusionZoneModal: React.FC<AddExclusionZoneModalProps> = ({ isOpen, onClose, onAddZone }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'No-go' | 'Slow-down'>('No-go');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    
    onAddZone({ name, type });

    onClose();
    setName('');
    setType('No-go');
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Exclusion Zone">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="zoneName" className="block text-sm font-medium text-text-secondary">Zone Name</label>
          <input type="text" id="zoneName" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required />
        </div>
        <div>
          <label htmlFor="zoneType" className="block text-sm font-medium text-text-secondary">Zone Type</label>
           <select id="zoneType" value={type} onChange={(e) => setType(e.target.value as 'No-go' | 'Slow-down')} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required>
            <option value="No-go">No-go Zone</option>
            <option value="Slow-down">Slow-down Zone</option>
          </select>
        </div>
        <p className="text-xs text-text-secondary">For this demo, zone boundaries will be pre-defined upon creation.</p>
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">Create Zone</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddExclusionZoneModal;
