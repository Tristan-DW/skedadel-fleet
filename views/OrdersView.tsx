import React, { useState, useMemo } from 'react';
import { Order, Driver, Store, OrderStatus, OrderPriority, ExclusionZone } from '../types';
import Button from '../components/ui/Button';
import RouteOptimizerModal from '../components/orders/RouteOptimizerModal';

interface OrdersViewProps {
  orders: Order[];
  drivers: Driver[];
  stores: Store[];
  exclusionZones: ExclusionZone[];
  onSelectOrder: (order: Order) => void;
}

const OrderStatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const statusStyles: Record<OrderStatus, string> = {
    [OrderStatus.UNASSIGNED]: 'bg-gray-600 text-gray-100',
    [OrderStatus.ASSIGNED]: 'bg-blue-600 text-blue-100',
    [OrderStatus.AT_STORE]: 'bg-yellow-600 text-yellow-100',
    [OrderStatus.PICKED_UP]: 'bg-purple-600 text-purple-100',
    [OrderStatus.IN_PROGRESS]: 'bg-indigo-600 text-indigo-100',
    [OrderStatus.SUCCESSFUL]: 'bg-green-600 text-green-100',
    [OrderStatus.FAILED]: 'bg-red-600 text-red-100',
  };
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[status]}`}>
      {status}
    </span>
  );
};

const OrdersView: React.FC<OrdersViewProps> = ({ orders, drivers, stores, exclusionZones, onSelectOrder }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<OrderPriority | 'ALL'>('ALL');
  const [isOptimizerOpen, setOptimizerOpen] = useState(false);

  const filteredOrders = useMemo(() => {
    return orders
      .filter(order => priorityFilter === 'ALL' || order.priority === priorityFilter)
      .filter(order =>
        order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.destination?.address || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (drivers.find(d => d.id === order.driverId)?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [orders, drivers, searchTerm, priorityFilter]);

  return (
    <>
      <div className="p-6">
        <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-text-primary">All Orders</h3>
              <Button onClick={() => setOptimizerOpen(true)}>Optimize Routes</Button>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Search by order ID, customer, address, driver..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as OrderPriority | 'ALL')}
                className="bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
                <option value="ALL">All Priorities</option>
                {/* FIX: Explicitly type `p` as OrderPriority to resolve TypeScript inference issue. */}
                {Object.values(OrderPriority).map((p: OrderPriority) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-text-secondary">
              <thead className="text-xs text-text-secondary uppercase bg-background border-b border-border">
                <tr>
                  <th scope="col" className="px-6 py-3">Order ID</th>
                  <th scope="col" className="px-6 py-3">Customer</th>
                  <th scope="col" className="px-6 py-3">Destination</th>
                  <th scope="col" className="px-6 py-3">Driver</th>
                  <th scope="col" className="px-6 py-3">Store</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3">Priority</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const driver = drivers.find(d => d.id === order.driverId);
                  const store = stores.find(s => s.id === order.storeId);
                  return (
                    <tr key={order.id} className="bg-surface border-b border-border last:border-b-0 hover:bg-secondary cursor-pointer" onClick={() => onSelectOrder(order)}>
                      <th scope="row" className="px-6 py-4 font-medium text-text-primary whitespace-nowrap">{order.title}</th>
                      <td className="px-6 py-4">{order.customerName}</td>
                      <td className="px-6 py-4 truncate max-w-xs">{order.destination?.address || order.destinationAddress || 'No address'}</td>
                      <td className="px-6 py-4">{driver?.name || 'Unassigned'}</td>
                      <td className="px-6 py-4">{store?.name || 'N/A'}</td>
                      <td className="px-6 py-4"><OrderStatusBadge status={order.status} /></td>
                      <td className="px-6 py-4">{order.priority}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <RouteOptimizerModal
        isOpen={isOptimizerOpen}
        onClose={() => setOptimizerOpen(false)}
        orders={orders}
        drivers={drivers}
        exclusionZones={exclusionZones}
      />
    </>
  );
};

export default OrdersView;