
import React, { useMemo } from 'react';
import { Order, Driver } from '../../types';

interface DriverPerformanceTableProps {
  orders: Order[];
  drivers: Driver[];
  onSelectDriver: (driverId: string) => void;
}

const DriverPerformanceTable: React.FC<DriverPerformanceTableProps> = ({ orders, drivers, onSelectDriver }) => {
  const driverStats = useMemo(() => {
    return drivers.map(driver => {
      const driverOrders = orders.filter(o => o.driverId === driver.id);
      const successful = driverOrders.filter(o => o.status === 'Successful').length;
      const failed = driverOrders.filter(o => o.status === 'Failed').length;
      const successRate = driverOrders.length > 0 ? (successful / (successful + failed)) * 100 : 0;
      
      return {
        id: driver.id,
        name: driver.name,
        totalOrders: driverOrders.length,
        successful,
        failed,
        successRate: successRate.toFixed(0),
      };
    }).sort((a, b) => b.totalOrders - a.totalOrders);
  }, [orders, drivers]);

  return (
    <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
        <h3 className="text-lg font-semibold text-text-primary p-4 border-b border-border">Driver Performance</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-text-secondary">
                <thead className="text-xs text-text-secondary uppercase bg-background border-b border-border">
                    <tr>
                        <th scope="col" className="px-6 py-3">Driver</th>
                        <th scope="col" className="px-6 py-3 text-center">Total Orders</th>
                        <th scope="col" className="px-6 py-3 text-center">Successful</th>
                        <th scope="col" className="px-6 py-3 text-center">Failed</th>
                        <th scope="col" className="px-6 py-3 text-center">Success Rate</th>
                    </tr>
                </thead>
                <tbody>
                    {driverStats.map((stat) => (
                        <tr key={stat.id} className="bg-surface border-b border-border last:border-b-0 hover:bg-secondary cursor-pointer" onClick={() => onSelectDriver(stat.id)}>
                            <th scope="row" className="px-6 py-4 font-medium text-text-primary whitespace-nowrap">{stat.name}</th>
                            <td className="px-6 py-4 text-center">{stat.totalOrders}</td>
                            <td className="px-6 py-4 text-center text-success">{stat.successful}</td>
                            <td className="px-6 py-4 text-center text-danger">{stat.failed}</td>
                            <td className="px-6 py-4 text-center font-semibold">{stat.totalOrders > 0 ? `${stat.successRate}%` : 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default DriverPerformanceTable;