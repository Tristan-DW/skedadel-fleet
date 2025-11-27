import React, { useState } from 'react';
import { Order, OrderStatus } from '../../types';

interface TeamOrderHistoryProps {
  orders: Order[];
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

const TeamOrderHistory: React.FC<TeamOrderHistoryProps> = ({ orders }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter(order =>
    order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.destination?.address || '').toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="bg-surface border border-border rounded-lg shadow-sm">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-text-primary">Team Order History</h3>
        <input
          type="text"
          placeholder="Search team orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full mt-2 bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        />
      </div>
      <div className="overflow-x-auto max-h-96">
        <table className="w-full text-sm text-left text-text-secondary">
          <thead className="text-xs text-text-secondary uppercase bg-background border-b border-border sticky top-0">
            <tr>
              <th scope="col" className="px-6 py-3">Order ID</th>
              <th scope="col" className="px-6 py-3">Date</th>
              <th scope="col" className="px-6 py-3">Customer</th>
              <th scope="col" className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="bg-surface hover:bg-secondary">
                <th scope="row" className="px-6 py-4 font-medium text-text-primary whitespace-nowrap">
                  {order.title}
                </th>
                <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">{order.customerName}</td>
                <td className="px-6 py-4"><OrderStatusBadge status={order.status} /></td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center p-6 text-text-secondary">
                  No orders found for this team.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamOrderHistory;