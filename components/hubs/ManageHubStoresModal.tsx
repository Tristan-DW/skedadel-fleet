
import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Hub, Store } from '../../types';

interface ManageHubStoresModalProps {
  isOpen: boolean;
  onClose: () => void;
  hub: Hub | null;
  allStores: Store[];
  onUpdateStores: (hubId: string, storeIds: string[]) => void;
}

const StoreItem: React.FC<{ store: Store, onAction: () => void, actionIcon: React.ReactNode }> = ({ store, onAction, actionIcon }) => (
    <div className="flex items-center justify-between p-2 bg-background rounded-md">
        <span>{store.name}</span>
        <button onClick={onAction} className="text-text-secondary hover:text-primary">{actionIcon}</button>
    </div>
);

const ManageHubStoresModal: React.FC<ManageHubStoresModalProps> = ({ isOpen, onClose, hub, allStores, onUpdateStores }) => {
  const [hubStoreIds, setHubStoreIds] = useState<string[]>([]);
  
  useEffect(() => {
    if (hub) {
      const currentStoreIds = allStores.filter(s => s.hubId === hub.id).map(s => s.id);
      setHubStoreIds(currentStoreIds);
    }
  }, [hub, allStores, isOpen]);

  const addStore = (storeId: string) => {
    setHubStoreIds(prev => [...prev, storeId]);
  };
  
  const removeStore = (storeId: string) => {
    setHubStoreIds(prev => prev.filter(id => id !== storeId));
  };
  
  const handleSubmit = () => {
    if (hub) {
      onUpdateStores(hub.id, hubStoreIds);
      onClose();
    }
  };

  if (!hub) return null;
  
  const hubStores = allStores.filter(s => hubStoreIds.includes(s.id));
  const availableStores = allStores.filter(s => s.hubId !== hub.id && !hubStoreIds.includes(s.id));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Manage Stores for ${hub.name}`}>
      <div className="grid grid-cols-2 gap-4 h-96">
        <div className="border border-border rounded-lg p-2 flex flex-col">
            <h4 className="font-semibold text-center mb-2">Available Stores</h4>
            <div className="overflow-y-auto space-y-2 flex-1 p-1">
                {availableStores.map(s => (
                    <StoreItem 
                        key={s.id} 
                        store={s} 
                        onAction={() => addStore(s.id)} 
                        actionIcon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414l-3-3z" clipRule="evenodd" /></svg>} 
                    />
                ))}
            </div>
        </div>
        <div className="border border-border rounded-lg p-2 flex flex-col">
            <h4 className="font-semibold text-center mb-2">Assigned Stores ({hubStores.length})</h4>
            <div className="overflow-y-auto space-y-2 flex-1 p-1">
                {hubStores.map(s => (
                     <StoreItem 
                        key={s.id} 
                        store={s} 
                        onAction={() => removeStore(s.id)} 
                        actionIcon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>} 
                    />
                ))}
            </div>
        </div>
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Update Stores</Button>
      </div>
    </Modal>
  );
};

export default ManageHubStoresModal;