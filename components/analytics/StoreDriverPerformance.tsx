import React, { useMemo } from 'react';
import { Driver, Order } from '../../types';

interface StoreDriverPerformanceProps {
  drivers: Driver[];
  orders: Order[];
}

const StoreDriverPerformance: React.FC<StoreDriverPerformanceProps> = ({ drivers, orders }) => {

  const driverStats = useMemo(() => {
    return drivers.map(driver => {
      const driverOrders = orders.filter(o => o.driverId === driver.id);
      const successfulOrders = driverOrders.filter(o => o.status === 'Successful').length;
      const successRate = driverOrders.length > 0 ? (successfulOrders / driverOrders.length) * 100 : 0;
      
      return {
        id: driver.id,
        name: driver.name,
        totalOrders: driverOrders.length,
        successRate: successRate.toFixed(0),
      };
    });
  }, [drivers, orders]);


  return (
    <div className="bg-surface border border-border rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-text-primary p-4 border-b border-border">Associated Driver Performance</h3>
      <div className="overflow-x-auto max-h-96">
        <table className="w-full text-sm text-left text-text-secondary">
          <thead className="text-xs text-text-secondary uppercase bg-background border-b border-border sticky top-0">
            <tr>
              <th scope="col" className="px-6 py-3">Driver</th>
              <th scope="col" className="px-6 py-3 text-center">Orders from this Store</th>
              <th scope="col" className="px-6 py-3 text-center">Success Rate</th>
            </tr>
          </thead>
          <tbody>
            {driverStats.sort((a,b) => b.totalOrders - a.totalOrders).map((stat) => (
              <tr key={stat.id} className="bg-surface border-b border-border last:border-b-0 hover:bg-secondary">
                <th scope="row" className="px-6 py-4 font-medium text-text-primary whitespace-nowrap">
                  {stat.name}
                </th>
                <td className="px-6 py-4 text-center">{stat.totalOrders}</td>
                <td className="px-6 py-4 text-center">{stat.totalOrders > 0 ? `${stat.successRate}%` : 'N/A'}</td>
              </tr>
            ))}
             {driverStats.length === 0 && (
                <tr>
                    <td colSpan={3} className="text-center p-6 text-text-secondary">
                        No drivers have completed orders for this store yet.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StoreDriverPerformance;
