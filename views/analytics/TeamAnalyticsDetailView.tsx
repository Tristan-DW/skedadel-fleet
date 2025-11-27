
import React, { useMemo } from 'react';
import { Team, Order, Driver } from '../../types';
import Button from '../../components/ui/Button';
import StatCard from '../../components/ui/StatCard';
import { ICONS } from '../../constants';
import GenericTimeSeriesChart from '../../components/analytics/charts/GenericTimeSeriesChart';
import BreakdownBarChart from '../../components/analytics/charts/BreakdownBarChart';

interface TeamAnalyticsDetailViewProps {
  team: Team;
  allOrders: Order[];
  allDrivers: Driver[];
  onBack: () => void;
}

const TeamAnalyticsDetailView: React.FC<TeamAnalyticsDetailViewProps> = ({ team, allOrders, allDrivers, onBack }) => {
    
    const { teamOrders, totalOrders, successfulOrders, successRate, teamDrivers } = useMemo(() => {
        const teamDrivers = allDrivers.filter(d => d.teamId === team.id);
        const teamDriverIds = teamDrivers.map(d => d.id);
        const teamOrders = allOrders.filter(o => o.driverId && teamDriverIds.includes(o.driverId));
        const totalOrders = teamOrders.length;
        const successfulOrders = teamOrders.filter(o => o.status === 'Successful').length;
        const successRate = totalOrders > 0 ? (successfulOrders / totalOrders * 100) : 0;
        return { teamOrders, totalOrders, successfulOrders, successRate, teamDrivers };
    }, [team, allOrders, allDrivers]);

    const driverPerformanceData = useMemo(() => {
        return teamDrivers.map(driver => {
            const driverOrders = teamOrders.filter(o => o.driverId === driver.id);
            return {
                name: driver.name.split(' ')[0], // First name
                value: driverOrders.length
            };
        }).sort((a,b) => b.value - a.value);
    }, [teamDrivers, teamOrders]);

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center space-x-4">
                <button onClick={onBack} className="text-text-secondary hover:text-text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                </button>
                <h2 className="text-3xl font-bold text-text-primary">Analytics: {team.name}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Orders" value={totalOrders} icon={ICONS.orders} iconBgColor="bg-blue-500/20 text-blue-400" />
                <StatCard title="Success Rate" value={`${successRate.toFixed(1)}%`} icon={ICONS.challenges} iconBgColor="bg-green-500/20 text-green-400" />
                <StatCard title="Active Drivers" value={teamDrivers.filter(d=>d.status !== 'Offline').length} icon={ICONS.drivers} iconBgColor="bg-purple-500/20 text-purple-400" />
                <StatCard title="Total Drivers" value={teamDrivers.length} icon={ICONS.teams} iconBgColor="bg-yellow-500/20 text-yellow-400" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-surface border border-border rounded-lg p-4 h-80">
                     <h3 className="text-lg font-semibold text-text-primary mb-4">Order Volume (Last 30 Days)</h3>
                     <GenericTimeSeriesChart orders={teamOrders} />
                </div>
                 <div className="bg-surface border border-border rounded-lg p-4 h-80">
                     <h3 className="text-lg font-semibold text-text-primary mb-4">Orders by Driver</h3>
                     <BreakdownBarChart data={driverPerformanceData} />
                </div>
            </div>
        </div>
    );
};

export default TeamAnalyticsDetailView;