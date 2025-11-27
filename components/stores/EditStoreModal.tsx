import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Store, Hub } from '../../types';

interface EditStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateStore: (store: Store) => void;
  store: Store | null;
  hubs: Hub[];
}

const EditStoreModal: React.FC<EditStoreModalProps> = ({ isOpen, onClose, onUpdateStore, store, hubs }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [manager, setManager] = useState('');
  const [hubId, setHubId] = useState('');

  useEffect(() => {
    if (store) {
      setName(store.name);
      setAddress(store.address || '');
      setManager(store.manager);
      setHubId(store.hubId);
    }
  }, [store]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!store || !name || !address || !manager || !hubId) return;

    onUpdateStore({
      ...store,
      name,
      address,
      manager,
      hubId,
    });

    onClose();
  };

  if (!store) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit Store: ${store.name}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="edit-storeName" className="block text-sm font-medium text-text-secondary">Store Name</label>
          <input type="text" id="edit-storeName" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required />
        </div>
        <div>
          <label htmlFor="edit-store-address" className="block text-sm font-medium text-text-secondary">Address</label>
          <input type="text" id="edit-store-address" value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="edit-manager" className="block text-sm font-medium text-text-secondary">Manager Name</label>
            <input type="text" id="edit-manager" value={manager} onChange={(e) => setManager(e.target.value)} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required />
          </div>
          <div>
            <label htmlFor="edit-hub" className="block text-sm font-medium text-text-secondary">Assign Hub</label>
            <select id="edit-hub" value={hubId} onChange={(e) => setHubId(e.target.value)} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required>
              {hubs.map(hub => <option key={hub.id} value={hub.id}>{hub.name}</option>)}
            </select>
          </div>
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditStoreModal;
