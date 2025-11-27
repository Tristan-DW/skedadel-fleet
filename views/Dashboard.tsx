import React from 'react';
import { Order, Driver, Store, Alert, ExclusionZone } from '../types';
import MapView from '../components/dashboard/MapView';
import DriversPanel from '../components/dashboard/DriversPanel';
import AlertsPanel from '../components/dashboard/AlertsPanel';
import OrderListPanel from '../components/dashboard/OrderListPanel';

interface DashboardProps {
  orders: Order[];
  drivers: Driver[];
  stores: Store[];
  alerts: Alert[];
  exclusionZones: ExclusionZone[];
  onSelectOrder: (order: Order) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ orders, drivers, stores, alerts, onSelectOrder, exclusionZones }) => {
    return (
        <div className="relative h-full w-full">
            {/* Map Background */}
            <div className="absolute inset-0 z-0">
                <MapView drivers={drivers} orders={orders} exclusionZones={exclusionZones} />
            </div>

            {/* Left Panel: Orders */}
            <div className="absolute top-6 left-6 bottom-6 w-96 z-10">
                <OrderListPanel orders={orders} stores={stores} onSelectOrder={onSelectOrder} />
            </div>

            {/* Right Panels: Alerts & Drivers */}
            <div className="absolute top-6 right-6 w-96 z-10">
                <AlertsPanel alerts={alerts} />
            </div>
            <div className="absolute bottom-6 right-6 w-96 z-10">
                <DriversPanel drivers={drivers} />
            </div>
        </div>
    );
};

export default Dashboard;