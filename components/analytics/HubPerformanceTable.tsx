
import React, { useMemo } from 'react';
import { Order, Store, Hub } from '../../types';

interface HubPerformanceTableProps {
  orders: Order[];
  stores: Store[];
  hubs: Hub[];
  onSelectHub: (hubId: string) => void;
}

const HubPerformanceTable: React.FC<HubPerformanceTableProps> = ({ orders, stores, hubs, onSelectHub }) => {
  const hubStats = useMemo(() => {
    return hubs.map(hub => {
      const hubStoreIds = stores.filter(s => s.hubId === hub.id).map(s => s.id);
      const hubOrders = orders.filter(o => o.storeId && hubStoreIds.includes(o.storeId));
      const successful = hubOrders.filter(o => o.status === 'Successful').length;
      const successRate = hubOrders.length > 0 ? (successful / hubOrders.length) * 100 : 0;
      
      return {
        id: hub.id,
        name: hub.name,
        totalOrders: hubOrders.length,
        successful,
        successRate: successRate.toFixed(0),
      };
    }).sort((a, b) => b.totalOrders - a.totalOrders);
  }, [orders, stores, hubs]);

  return (
    <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
        <h3 className="text-lg font-semibold text-text-primary p-4 border-b border-border">Hub Performance</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-text-secondary">
                <thead className="text-xs text-text-secondary uppercase bg-background border-b border-border">
                    <tr>
                        <th scope="col" className="px-6 py-3">Hub</th>
                        <th scope="col" className="px-6 py-3 text-center">Total Orders</th>
                        <th scope="col" className="px-6 py-3 text-center">Successful</th>
                        <th scope="col" className="px-6 py-3 text-center">Success Rate</th>
                    </tr>
                </thead>
                <tbody>
                    {hubStats.map((stat) => (
                        <tr key={stat.id} className="bg-surface border-b border-border last:border-b-0 hover:bg-secondary cursor-pointer" onClick={() => onSelectHub(stat.id)}>
                            <th scope="row" className="px-6 py-4 font-medium text-text-primary whitespace-nowrap">{stat.name}</th>
                            <td className="px-6 py-4 text-center">{stat.totalOrders}</td>
                            <td className="px-6 py-4 text-center text-success">{stat.successful}</td>
                            <td className="px-6 py-4 text-center font-semibold">{stat.totalOrders > 0 ? `${stat.successRate}%` : 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default HubPerformanceTable;