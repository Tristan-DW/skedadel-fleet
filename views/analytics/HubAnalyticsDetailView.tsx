
import React, { useMemo } from 'react';
import { Hub, Order, Store, Team } from '../../types';
import Button from '../../components/ui/Button';
import StatCard from '../../components/ui/StatCard';
import { ICONS } from '../../constants';
import GenericTimeSeriesChart from '../../components/analytics/charts/GenericTimeSeriesChart';
import BreakdownBarChart from '../../components/analytics/charts/BreakdownBarChart';

interface HubAnalyticsDetailViewProps {
  hub: Hub;
  allOrders: Order[];
  allStores: Store[];
  allTeams: Team[];
  onBack: () => void;
}

const HubAnalyticsDetailView: React.FC<HubAnalyticsDetailViewProps> = ({ hub, allOrders, allStores, allTeams, onBack }) => {
    
    const { hubOrders, totalOrders, successfulOrders, successRate, associatedTeams, associatedStores } = useMemo(() => {
        const associatedStoreIds = allStores.filter(s => s.hubId === hub.id).map(s => s.id);
        const hubOrders = allOrders.filter(o => o.storeId && associatedStoreIds.includes(o.storeId));
        const totalOrders = hubOrders.length;
        const successfulOrders = hubOrders.filter(o => o.status === 'Successful').length;
        const successRate = totalOrders > 0 ? (successfulOrders / totalOrders * 100) : 0;
        const associatedTeams = allTeams.filter(t => t.hubId === hub.id);
        const associatedStores = allStores.filter(s => s.hubId === hub.id);
        return { hubOrders, totalOrders, successfulOrders, successRate, associatedTeams, associatedStores };
    }, [hub, allOrders, allStores, allTeams]);

    const teamPerformanceData = useMemo(() => {
        return associatedTeams.map(team => {
            const teamDriverIds = allOrders.filter(o => o.driverId && allTeams.find(t => t.id === team.id)?.id === team.id).map(o => o.driverId);
            const teamOrders = hubOrders.filter(o => o.driverId && teamDriverIds.includes(o.driverId));
            return {
                name: team.name,
                value: teamOrders.length
            };
        }).sort((a,b) => b.value - a.value);
    }, [associatedTeams, hubOrders, allOrders, allTeams]);

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center space-x-4">
                <button onClick={onBack} className="text-text-secondary hover:text-text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                </button>
                <h2 className="text-3xl font-bold text-text-primary">Analytics: {hub.name}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Orders" value={totalOrders} icon={ICONS.orders} iconBgColor="bg-blue-500/20 text-blue-400" />
                <StatCard title="Success Rate" value={`${successRate.toFixed(1)}%`} icon={ICONS.challenges} iconBgColor="bg-green-500/20 text-green-400" />
                <StatCard title="Associated Teams" value={associatedTeams.length} icon={ICONS.teams} iconBgColor="bg-purple-500/20 text-purple-400" />
                <StatCard title="Associated Stores" value={associatedStores.length} icon={ICONS.stores} iconBgColor="bg-yellow-500/20 text-yellow-400" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-surface border border-border rounded-lg p-4 h-80">
                     <h3 className="text-lg font-semibold text-text-primary mb-4">Order Volume (Last 30 Days)</h3>
                     <GenericTimeSeriesChart orders={hubOrders} />
                </div>
                 <div className="bg-surface border border-border rounded-lg p-4 h-80">
                     <h3 className="text-lg font-semibold text-text-primary mb-4">Orders by Team</h3>
                     <BreakdownBarChart data={teamPerformanceData} />
                </div>
            </div>
        </div>
    );
};

export default HubAnalyticsDetailView;