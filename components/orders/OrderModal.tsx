import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Order, OrderStatus, Driver, Store, OrderPriority, Team } from '../../types';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Fix: Update type to omit properties that are set in the parent component.
  onAddOrder: (order: Omit<Order, 'id' | 'createdAt' | 'activityLog'>) => void;
  drivers: Driver[];
  stores: Store[];
  teams: Team[];
}

const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, onAddOrder, drivers, stores, teams }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [destination, setDestination] = useState('');
  const [assignedDriverId, setAssignedDriverId] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderType, setOrderType] = useState<'PICKUP' | 'DELIVERY'>('DELIVERY');
  const [priority, setPriority] = useState<OrderPriority>(OrderPriority.MEDIUM);
  const [storeId, setStoreId] = useState<string>(stores.find(s => s.status === 'ONLINE')?.id || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !destination || !customerName || !storeId) return;

    const driver = drivers.find(d => d.id === assignedDriverId);
    const store = stores.find(s => s.id === storeId);
    if (!store) return;

    const newOrder: Omit<Order, 'id' | 'createdAt' | 'activityLog'> = {
      title,
      description,
      customerName,
      customerPhone,
      orderType,
      priority,
      storeId,
      vehicleId: driver?.vehicleId || null,
      driverId: assignedDriverId,
      status: assignedDriverId ? OrderStatus.ASSIGNED : OrderStatus.UNASSIGNED,
      origin: { lat: store.latitude || 0, lng: store.longitude || 0, address: store.address || '' },
      destination: { lat: 0, lng: 0, address: destination }, // Dummy coords
      orderItems: [], // Default to empty
    };
    onAddOrder(newOrder);
    onClose();
    // Reset form
    setTitle('');
    setDescription('');
    setDestination('');
    setAssignedDriverId(null);
    setCustomerName('');
    setCustomerPhone('');
    setOrderType('DELIVERY');
    setPriority(OrderPriority.MEDIUM);
    setStoreId(stores.find(s => s.status === 'ONLINE')?.id || '');
  };

  const selectedStore = stores.find(s => s.id === storeId);
  const availableDrivers = selectedStore
    ? drivers.filter(driver => {
      const driverTeam = teams.find(t => t.id === driver.teamId);
      return driverTeam && driverTeam.hubId === selectedStore.hubId;
    })
    : [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Order">
      <form onSubmit={handleSubmit} className="space-y-4">

        <fieldset className="space-y-4">
          <legend className="sr-only">Order Details</legend>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-text-secondary">Title (e.g. Order #12345)</label>
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="orderType" className="block text-sm font-medium text-text-secondary">Order Type</label>
              <select id="orderType" value={orderType} onChange={(e) => setOrderType(e.target.value as 'PICKUP' | 'DELIVERY')} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                <option value="DELIVERY">Delivery</option>
                <option value="PICKUP">Pickup</option>
              </select>
            </div>
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-text-secondary">Priority</label>
              <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value as OrderPriority)} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                {/* Fix: Explicitly type `p` as OrderPriority to resolve TypeScript inference issue. */}
                {Object.values(OrderPriority).map((p: OrderPriority) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-text-secondary">Order Notes</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
          </div>
        </fieldset>

        <fieldset className="space-y-4 pt-2">
          <legend className="text-base font-medium text-text-primary">Customer &amp; Route</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium text-text-secondary">Customer Name</label>
              <input type="text" id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required />
            </div>
            <div>
              <label htmlFor="customerPhone" className="block text-sm font-medium text-text-secondary">Customer Phone</label>
              <input type="tel" id="customerPhone" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
            </div>
          </div>
          <div>
            <label htmlFor="destination" className="block text-sm font-medium text-text-secondary">Destination Address</label>
            <input type="text" id="destination" value={destination} onChange={(e) => setDestination(e.target.value)} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required />
          </div>
        </fieldset>

        <fieldset className="space-y-4 pt-2">
          <legend className="text-base font-medium text-text-primary">Assignment</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="store" className="block text-sm font-medium text-text-secondary">Assign Store</label>
              <select id="store" value={storeId} onChange={(e) => { setStoreId(e.target.value); setAssignedDriverId(null); }} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required>
                <option value="">Select a Store</option>
                {stores.map(store => (
                  <option key={store.id} value={store.id} disabled={store.status === 'OFFLINE'} className={store.status === 'OFFLINE' ? 'text-text-secondary' : ''}>
                    {store.name} {store.status === 'OFFLINE' && '(Offline)'}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="driver" className="block text-sm font-medium text-text-secondary">Assign Driver</label>
              <select id="driver" value={assignedDriverId || ''} onChange={(e) => setAssignedDriverId(e.target.value || null)} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" disabled={!storeId}>
                <option value="">Unassigned</option>
                {availableDrivers.map(driver => (
                  <option key={driver.id} value={driver.id}>{driver.name}</option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">Create Order</Button>
        </div>
      </form>
    </Modal>
  );
};

export default OrderModal;