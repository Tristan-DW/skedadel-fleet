import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Store, Hub } from '../../types';

interface AddStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStore: (store: Omit<Store, 'id'>) => void;
  hubs: Hub[];
}

const AddStoreModal: React.FC<AddStoreModalProps> = ({ isOpen, onClose, onAddStore, hubs }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [manager, setManager] = useState('');
  const [hubId, setHubId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address || !manager || !hubId) return;
    
    onAddStore({
      name,
      location: { lat: -26.1, lng: 28.05, address }, // Mock lat/lng
      manager,
      hubId,
      status: 'ONLINE',
    });

    onClose();
    // Reset form
    setName('');
    setAddress('');
    setManager('');
    setHubId('');
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Store">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="storeName" className="block text-sm font-medium text-text-secondary">Store Name</label>
          <input type="text" id="storeName" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-text-secondary">Address</label>
          <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="manager" className="block text-sm font-medium text-text-secondary">Manager Name</label>
            <input type="text" id="manager" value={manager} onChange={(e) => setManager(e.target.value)} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required />
          </div>
          <div>
            <label htmlFor="hub" className="block text-sm font-medium text-text-secondary">Assign Hub</label>
            <select id="hub" value={hubId} onChange={(e) => setHubId(e.target.value)} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required>
              <option value="">Select a hub</option>
              {hubs.map(hub => <option key={hub.id} value={hub.id}>{hub.name}</option>)}
            </select>
          </div>
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">Create Store</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddStoreModal;