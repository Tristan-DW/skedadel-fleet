
import React, { useMemo } from 'react';
import { Order, Driver, Team } from '../../types';

interface TeamPerformanceTableProps {
  orders: Order[];
  drivers: Driver[];
  teams: Team[];
  onSelectTeam: (teamId: string) => void;
}

const TeamPerformanceTable: React.FC<TeamPerformanceTableProps> = ({ orders, drivers, teams, onSelectTeam }) => {
  const teamStats = useMemo(() => {
    return teams.map(team => {
      const teamDriverIds = drivers.filter(d => d.teamId === team.id).map(d => d.id);
      const teamOrders = orders.filter(o => o.driverId && teamDriverIds.includes(o.driverId));
      const successful = teamOrders.filter(o => o.status === 'Successful').length;
      const successRate = teamOrders.length > 0 ? (successful / teamOrders.length) * 100 : 0;
      
      return {
        id: team.id,
        name: team.name,
        totalOrders: teamOrders.length,
        successful,
        successRate: successRate.toFixed(0),
      };
    }).sort((a, b) => b.totalOrders - a.totalOrders);
  }, [orders, drivers, teams]);

  return (
    <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
        <h3 className="text-lg font-semibold text-text-primary p-4 border-b border-border">Team Performance</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-text-secondary">
                <thead className="text-xs text-text-secondary uppercase bg-background border-b border-border">
                    <tr>
                        <th scope="col" className="px-6 py-3">Team</th>
                        <th scope="col" className="px-6 py-3 text-center">Total Orders</th>
                        <th scope="col" className="px-6 py-3 text-center">Successful</th>
                        <th scope="col" className="px-6 py-3 text-center">Success Rate</th>
                    </tr>
                </thead>
                <tbody>
                    {teamStats.map((stat) => (
                        <tr key={stat.id} className="bg-surface border-b border-border last:border-b-0 hover:bg-secondary cursor-pointer" onClick={() => onSelectTeam(stat.id)}>
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

export default TeamPerformanceTable;