

import React, { useMemo } from 'react';
import { Store, Order, OrderPriority } from '../../types';
import Button from '../../components/ui/Button';
import StatCard from '../../components/ui/StatCard';
import { ICONS } from '../../constants';
import GenericTimeSeriesChart from '../../components/analytics/charts/GenericTimeSeriesChart';
import BreakdownBarChart from '../../components/analytics/charts/BreakdownBarChart';

interface StoreAnalyticsDetailViewProps {
  store: Store;
  allOrders: Order[];
  onBack: () => void;
}

const StoreAnalyticsDetailView: React.FC<StoreAnalyticsDetailViewProps> = ({ store, allOrders, onBack }) => {
    
    const { storeOrders, totalOrders, successfulOrders, successRate } = useMemo(() => {
        const storeOrders = allOrders.filter(o => o.storeId === store.id);
        const totalOrders = storeOrders.length;
        const successfulOrders = storeOrders.filter(o => o.status === 'Successful').length;
        const successRate = totalOrders > 0 ? (successfulOrders / totalOrders * 100) : 0;
        return { storeOrders, totalOrders, successfulOrders, successRate };
    }, [store, allOrders]);
    
    const priorityBreakdownData = useMemo(() => {
        // FIX: Explicitly type the accumulator to ensure correct type inference for `value`.
        const priorityCounts = storeOrders.reduce((acc: Record<string, number>, order) => {
            acc[order.priority] = (acc[order.priority] || 0) + 1;
            return acc;
        }, {});
        
        return Object.entries(priorityCounts).map(([name, value]) => ({ name, value }));
    }, [storeOrders]);

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center space-x-4">
                <button onClick={onBack} className="text-text-secondary hover:text-text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                </button>
                <h2 className="text-3xl font-bold text-text-primary">Analytics: {store.name}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Orders" value={totalOrders} icon={ICONS.orders} iconBgColor="bg-blue-500/20 text-blue-400" />
                <StatCard title="Success Rate" value={`${successRate.toFixed(1)}%`} icon={ICONS.challenges} iconBgColor="bg-green-500/20 text-green-400" />
                <StatCard title="Manager" value={store.manager} icon={ICONS.teams} iconBgColor="bg-yellow-500/20 text-yellow-400" />
                <StatCard title="Status" value={store.status} icon={ICONS.geofences} iconBgColor="bg-purple-500/20 text-purple-400" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-surface border border-border rounded-lg p-4 h-80">
                     <h3 className="text-lg font-semibold text-text-primary mb-4">Order Volume (Last 30 Days)</h3>
                     <GenericTimeSeriesChart orders={storeOrders} />
                </div>
                 <div className="bg-surface border border-border rounded-lg p-4 h-80">
                     <h3 className="text-lg font-semibold text-text-primary mb-4">Priority Breakdown</h3>
                     <BreakdownBarChart data={priorityBreakdownData} />
                </div>
            </div>
        </div>
    );
};

export default StoreAnalyticsDetailView;