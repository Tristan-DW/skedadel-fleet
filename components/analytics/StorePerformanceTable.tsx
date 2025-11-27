
import React, { useMemo } from 'react';
import { Order, Store } from '../../types';

interface StorePerformanceTableProps {
  orders: Order[];
  stores: Store[];
  onSelectStore: (storeId: string) => void;
}

const StorePerformanceTable: React.FC<StorePerformanceTableProps> = ({ orders, stores, onSelectStore }) => {
  const storeStats = useMemo(() => {
    return stores.map(store => {
      const storeOrders = orders.filter(o => o.storeId === store.id);
      const successful = storeOrders.filter(o => o.status === 'Successful').length;
      const successRate = storeOrders.length > 0 ? (successful / storeOrders.length) * 100 : 0;
      
      return {
        id: store.id,
        name: store.name,
        totalOrders: storeOrders.length,
        successful,
        successRate: successRate.toFixed(0),
      };
    }).sort((a, b) => b.totalOrders - a.totalOrders);
  }, [orders, stores]);

  return (
    <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
        <h3 className="text-lg font-semibold text-text-primary p-4 border-b border-border">Store Performance</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-text-secondary">
                <thead className="text-xs text-text-secondary uppercase bg-background border-b border-border">
                    <tr>
                        <th scope="col" className="px-6 py-3">Store</th>
                        <th scope="col" className="px-6 py-3 text-center">Total Orders</th>
                        <th scope="col" className="px-6 py-3 text-center">Successful</th>
                        <th scope="col" className="px-6 py-3 text-center">Success Rate</th>
                    </tr>
                </thead>
                <tbody>
                    {storeStats.map((stat) => (
                        <tr key={stat.id} className="bg-surface border-b border-border last:border-b-0 hover:bg-secondary cursor-pointer" onClick={() => onSelectStore(stat.id)}>
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

export default StorePerformanceTable;