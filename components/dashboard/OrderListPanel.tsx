import React, { useState } from 'react';
import { Order, OrderStatus, OrderPriority, Store } from '../../types';
import Tabs from '../ui/Tabs';

interface OrderListPanelProps {
  orders: Order[];
  stores: Store[];
  onSelectOrder: (order: Order) => void;
}

const PriorityIndicator: React.FC<{ priority: OrderPriority }> = ({ priority }) => {
  const priorityColors: Record<OrderPriority, string> = {
    [OrderPriority.URGENT]: 'bg-red-500',
    [OrderPriority.HIGH]: 'bg-orange-500',
    [OrderPriority.MEDIUM]: 'bg-yellow-500',
    [OrderPriority.LOW]: 'bg-blue-500',
  };
  return <span className={`w-2.5 h-2.5 rounded-full ${priorityColors[priority]}`} title={`Priority: ${priority}`}></span>;
}

const OrderListItem: React.FC<{ order: Order; onSelect: () => void }> = ({ order, onSelect }) => {
  return (
    <li onClick={onSelect} className="p-3 border-b border-border hover:bg-secondary cursor-pointer transition-colors">
      <div className="flex justify-between items-start">
        <div className="flex items-start space-x-3">
          <PriorityIndicator priority={order.priority} />
          <div>
            <p className="font-semibold text-text-primary">{order.title}</p>
            <p className="text-sm text-text-secondary">To: {order.destination?.address || order.destinationAddress || 'Unknown'}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-text-secondary">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          <p className="text-xs text-text-secondary">{order.orderType}</p>
        </div>
      </div>
    </li>
  );
};

type StatusFilter = OrderStatus | 'ALL';

const OrderListPanel: React.FC<OrderListPanelProps> = ({ orders, stores, onSelectOrder }) => {
  const [activeTab, setActiveTab] = useState<StatusFilter>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [selectedStore, setSelectedStore] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');


  const TABS: { id: StatusFilter, label: string }[] = [
    { id: 'ALL', label: 'All' },
    { id: OrderStatus.UNASSIGNED, label: 'Unassigned' },
    { id: OrderStatus.IN_PROGRESS, label: 'In Progress' },
    { id: OrderStatus.SUCCESSFUL, label: 'Successful' },
  ];

  const filteredOrders = orders
    .filter(order => activeTab === 'ALL' || order.status === activeTab)
    .filter(order => selectedStore === 'ALL' || order.storeId === selectedStore)
    .filter(order => selectedPriority === 'ALL' || order.priority === selectedPriority)
    .filter(order =>
      order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.destination?.address || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

  const tabsWithCounts = TABS.map(tab => ({
    ...tab,
    count: tab.id === 'ALL' ? orders.length : orders.filter(t => t.status === tab.id).length
  }));

  const resetFilters = () => {
    setSelectedStore('ALL');
    setSelectedPriority('ALL');
  }

  return (
    <div className="h-full bg-surface/70 backdrop-blur-sm border border-border rounded-lg shadow-xl flex flex-col">
      <div className="p-4 border-b border-border space-y-3">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
          <button onClick={() => setFilterVisible(!isFilterVisible)} className={`px-3 py-2 rounded-md ${isFilterVisible ? 'bg-primary' : 'bg-secondary'} hover:bg-primary/80`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
          </button>
        </div>
        {isFilterVisible && (
          <div className="grid grid-cols-2 gap-2 p-2 bg-background rounded-md">
            <div>
              <label htmlFor="storeFilter" className="text-xs text-text-secondary">Store</label>
              <select id="storeFilter" value={selectedStore} onChange={e => setSelectedStore(e.target.value)} className="mt-1 block w-full bg-surface border-border rounded-md shadow-sm py-1.5 px-2 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                <option value="ALL">All Stores</option>
                {stores.map(store => <option key={store.id} value={store.id}>{store.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="priorityFilter" className="text-xs text-text-secondary">Priority</label>
              <select id="priorityFilter" value={selectedPriority} onChange={e => setSelectedPriority(e.target.value)} className="mt-1 block w-full bg-surface border-border rounded-md shadow-sm py-1.5 px-2 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                <option value="ALL">All Priorities</option>
                {/* Fix: Explicitly type `p` as OrderPriority to resolve TypeScript inference issue. */}
                {Object.values(OrderPriority).map((p: OrderPriority) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <button onClick={resetFilters} className="col-span-2 text-xs text-primary hover:underline mt-1">Reset Filters</button>
          </div>
        )}
      </div>
      <div className="px-4">
        <Tabs tabs={tabsWithCounts} activeTab={activeTab} onTabClick={(tabId) => setActiveTab(tabId)} />
      </div>
      <ul className="flex-1 overflow-y-auto">
        {filteredOrders.map(order => (
          <OrderListItem key={order.id} order={order} onSelect={() => onSelectOrder(order)} />
        ))}
        {filteredOrders.length === 0 && (
          <p className="text-center text-text-secondary p-6">No orders match the current filters.</p>
        )}
      </ul>
    </div>
  );
};

export default OrderListPanel;