
import React from 'react';
import { Store, Order, Driver, Hub } from '../types';
import Button from '../components/ui/Button';
import StoreOrderList from '../components/stores/StoreOrderList';
import StoreDriverPerformance from '../components/analytics/StoreDriverPerformance';
import StoreOrderTimings from '../components/analytics/StoreOrderTimings';
import ToggleSwitch from '../components/ui/ToggleSwitch';

interface StoreDetailViewProps {
  store: Store;
  orders: Order[];
  drivers: Driver[];
  hub: Hub;
  onBack: () => void;
  onEditStore: (store: Store) => void;
  onUpdateStatus: (storeId: string, status: 'ONLINE' | 'OFFLINE') => void;
  onSelectHub: (hubId: string) => void;
}

const DetailItem: React.FC<{ label: string, value: React.ReactNode, isLink?: boolean, onClick?: () => void }> = ({ label, value, isLink, onClick }) => (
  <div>
    <p className="text-sm text-text-secondary">{label}</p>
    <p
      className={`font-medium text-text-primary ${isLink ? 'hover:underline cursor-pointer text-primary' : ''}`}
      onClick={onClick}
    >
      {value || 'N/A'}
    </p>
  </div>
);

const StoreDetailView: React.FC<StoreDetailViewProps> = ({ store, orders, drivers, hub, onBack, onEditStore, onUpdateStatus, onSelectHub }) => {
  if (!store) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold">Store not found</h2>
        <Button onClick={onBack} variant="secondary" className="mt-4">Go Back</Button>
      </div>
    );
  }

  const totalOrders = orders.length;
  const successfulOrders = orders.filter(o => o.status === 'Successful').length;
  const successRate = totalOrders > 0 ? (successfulOrders / totalOrders) * 100 : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="text-text-secondary hover:text-text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <h2 className="text-3xl font-bold text-text-primary">{store.name}</h2>
        </div>
        <Button onClick={() => onEditStore(store)}>Edit Store</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-surface border border-border rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Store Information</h3>
            <div className="space-y-3">
              <DetailItem label="Manager" value={store.manager} />
              <DetailItem label="Address" value={store.address} />
              <DetailItem label="Status" value={
                <ToggleSwitch
                  checked={store.status === 'ONLINE'}
                  onChange={(isChecked) => onUpdateStatus(store.id, isChecked ? 'ONLINE' : 'OFFLINE')}
                  label={store.status}
                />
              } />
              <DetailItem label="Assigned Hub" value={hub.name} isLink={true} onClick={() => onSelectHub(hub.id)} />
            </div>
          </div>
          <div className="bg-surface border border-border rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Performance</h3>
            <div className="space-y-3">
              <DetailItem label="Total Orders" value={totalOrders} />
              <DetailItem label="Successful Deliveries" value={successfulOrders} />
              <DetailItem label="Success Rate" value={`${successRate.toFixed(1)}%`} />
            </div>
          </div>
          <StoreOrderTimings orders={orders} />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <StoreOrderList orders={orders} />
          <StoreDriverPerformance drivers={drivers} orders={orders} />
        </div>
      </div>
    </div>
  );
};

export default StoreDetailView;
