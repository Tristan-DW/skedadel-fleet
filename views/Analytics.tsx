
import React, { useState, useMemo } from 'react';
import { Order, Driver, Store, Hub, Team } from '../types';
import StatCard from '../components/ui/StatCard';
import { ICONS } from '../constants';
import PerformanceChart from '../components/reports/PerformanceChart';
import PriorityDistributionChart from '../components/analytics/PriorityDistributionChart';
import DriverPerformanceTable from '../components/analytics/DriverPerformanceTable';
import StorePerformanceTable from '../components/analytics/StorePerformanceTable';
import HubPerformanceTable from '../components/analytics/HubPerformanceTable';
import TeamPerformanceTable from '../components/analytics/TeamPerformanceTable';
import { getOperationalInsights, generateOrderSummary } from '../services/geminiService';
import Button from '../components/ui/Button';

interface AnalyticsProps {
  orders: Order[];
  drivers: Driver[];
  stores: Store[];
  hubs: Hub[];
  teams: Team[];
  onSelectHub: (hubId: string) => void;
  onSelectTeam: (teamId: string) => void;
  onSelectDriver: (driverId: string) => void;
  onSelectStore: (storeId: string) => void;
}

const Analytics: React.FC<AnalyticsProps> = ({ orders, drivers, stores, hubs, teams, onSelectHub, onSelectTeam, onSelectDriver, onSelectStore }) => {
    const [insights, setInsights] = useState<string>('');
    const [summary, setSummary] = useState<string>('');
    const [isLoadingInsights, setIsLoadingInsights] = useState(false);
    const [isLoadingSummary, setIsLoadingSummary] = useState(false);

    const successfulOrders = useMemo(() => orders.filter(o => o.status === 'Successful').length, [orders]);
    const failedOrders = useMemo(() => orders.filter(o => o.status === 'Failed').length, [orders]);
    const inProgressOrders = useMemo(() => orders.filter(o => o.status === 'In Progress').length, [orders]);
    const availableDrivers = useMemo(() => drivers.filter(d => d.status === 'Available').length, [drivers]);

    const handleGenerateInsights = async () => {
        setIsLoadingInsights(true);
        const result = await getOperationalInsights(orders, drivers, stores);
        setInsights(result);
        setIsLoadingInsights(false);
    };

    const handleGenerateSummary = async () => {
        setIsLoadingSummary(true);
        const result = await generateOrderSummary(orders);
        setSummary(result);
        setIsLoadingSummary(false);
    };

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold text-text-primary">Fleet Analytics</h2>
            
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Successful Orders" value={successfulOrders} icon={ICONS.orders} iconBgColor="bg-green-500/20 text-green-400" />
                <StatCard title="Failed/Returned" value={failedOrders} icon={ICONS.alert} iconBgColor="bg-red-500/20 text-red-400" />
                <StatCard title="In Progress" value={inProgressOrders} icon={ICONS.geofences} iconBgColor="bg-blue-500/20 text-blue-400" />
                <StatCard title="Available Drivers" value={availableDrivers} icon={ICONS.drivers} iconBgColor="bg-yellow-500/20 text-yellow-400" />
            </div>

            {/* Gemini Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div className="bg-surface border border-border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-text-primary">Daily Summary</h3>
                        <Button onClick={handleGenerateSummary} disabled={isLoadingSummary}>
                            {isLoadingSummary ? "Generating..." : "Generate Summary"}
                        </Button>
                    </div>
                    {summary ? (
                         <p className="text-sm text-text-secondary whitespace-pre-wrap">{summary}</p>
                    ) : (
                        <p className="text-sm text-text-secondary">Click the button to generate a daily summary of fleet activity using Gemini.</p>
                    )}
                </div>
                <div className="bg-surface border border-border rounded-lg p-4">
                     <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-text-primary">AI Operational Insights</h3>
                         <Button onClick={handleGenerateInsights} disabled={isLoadingInsights}>
                            {isLoadingInsights ? "Analyzing..." : "Get Insights"}
                        </Button>
                    </div>
                    {insights ? (
                        <div className="text-sm text-text-secondary whitespace-pre-wrap" dangerouslySetInnerHTML={{__html: insights.replace(/\*/g, '').replace(/\n/g, '<br />')}}></div>
                    ) : (
                         <p className="text-sm text-text-secondary">Click the button to get actionable insights and detect patterns from your fleet data using Gemini.</p>
                    )}
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-surface border border-border rounded-lg p-4 h-80">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">Order Performance Over Time</h3>
                    <PerformanceChart orders={orders} />
                </div>
                <div className="bg-surface border border-border rounded-lg p-4 h-80">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">Priority Distribution</h3>
                    <PriorityDistributionChart orders={orders} />
                </div>
            </div>

            {/* Tables */}
            <div className="space-y-6">
                <p className="text-sm text-text-secondary text-center">Click on a row in any table to drill down into detailed analytics.</p>
                <DriverPerformanceTable orders={orders} drivers={drivers} onSelectDriver={onSelectDriver} />
                <StorePerformanceTable orders={orders} stores={stores} onSelectStore={onSelectStore} />
                <TeamPerformanceTable orders={orders} drivers={drivers} teams={teams} onSelectTeam={onSelectTeam} />
                <HubPerformanceTable orders={orders} stores={stores} hubs={hubs} onSelectHub={onSelectHub} />
            </div>
        </div>
    );
};

export default Analytics;