
import React, { useState, useMemo } from 'react';
import { Store, Hub } from '../types';
import Button from '../components/ui/Button';
import ToggleSwitch from '../components/ui/ToggleSwitch';

// FIX: Add onAddStore and onEditStore to props for parent-controlled modal management.
interface StoresViewProps {
  stores: Store[];
  hubs: Hub[];
  onSelectStore: (storeId: string) => void;
  onUpdateStatus: (storeId: string, status: 'ONLINE' | 'OFFLINE') => void;
  onAddStore: () => void;
  onEditStore: (store: Store) => void;
}

const StoresView: React.FC<StoresViewProps> = ({ stores, hubs, onSelectStore, onUpdateStatus, onAddStore, onEditStore }) => {
  // FIX: Remove local modal state, as it's now handled by App.tsx.
  const [searchTerm, setSearchTerm] = useState('');
  const [hubFilter, setHubFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ONLINE' | 'OFFLINE'>('ALL');

  const filteredStores = useMemo(() => {
    return stores
      .filter(store => hubFilter === 'ALL' || store.hubId === hubFilter)
      .filter(store => statusFilter === 'ALL' || store.status === statusFilter)
      .filter(store =>
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.manager.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [stores, searchTerm, hubFilter, statusFilter]);

  // FIX: Remove mock handlers as parent now controls this logic.

  return (
    <div className="p-6">
      <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-text-primary">Stores</h3>
            {/* FIX: Use onAddStore prop to trigger modal in parent. */}
            <Button onClick={onAddStore}>Add Store</Button>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search by store or manager name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
            <select
              value={hubFilter}
              onChange={(e) => setHubFilter(e.target.value)}
              className="bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            >
              <option value="ALL">All Hubs</option>
              {hubs.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'ALL' | 'ONLINE' | 'OFFLINE')}
              className="bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            >
              <option value="ALL">All Statuses</option>
              <option value="ONLINE">Online</option>
              <option value="OFFLINE">Offline</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-text-secondary">
            <thead className="text-xs text-text-secondary uppercase bg-background border-b border-border">
              <tr>
                <th scope="col" className="px-6 py-3">Name</th>
                <th scope="col" className="px-6 py-3">Location</th>
                <th scope="col" className="px-6 py-3">Manager</th>
                <th scope="col" className="px-6 py-3">Hub</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStores.map((store) => {
                const hub = hubs.find(h => h.id === store.hubId);
                return (
                  <tr key={store.id} className="bg-surface border-b border-border last:border-b-0 hover:bg-secondary">
                    <th scope="row" className="px-6 py-4 font-medium text-text-primary whitespace-nowrap cursor-pointer hover:underline" onClick={() => onSelectStore(store.id)}>
                      {store.name}
                    </th>
                    <td className="px-6 py-4">{store.address || 'N/A'}</td>
                    <td className="px-6 py-4">{store.manager}</td>
                    <td className="px-6 py-4">{hub?.name || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <ToggleSwitch
                        checked={store.status === 'ONLINE'}
                        onChange={(isChecked) => onUpdateStatus(store.id, isChecked ? 'ONLINE' : 'OFFLINE')}
                      />
                    </td>
                    <td className="px-6 py-4">
                      {/* FIX: Use onEditStore prop to trigger modal in parent. */}
                      <Button variant="secondary" onClick={() => onEditStore(store)}>Edit</Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StoresView;
