
import React, { useState, useMemo } from 'react';
import { Team, Hub, User, Driver } from '../types';
import Button from '../components/ui/Button';

// FIX: Add onAddTeam and onEditTeam to props for parent-controlled modal management.
interface TeamsViewProps {
  teams: Team[];
  hubs: Hub[];
  users: User[];
  drivers: Driver[];
  onSelectTeam: (teamId: string) => void;
  onAddTeam: () => void;
  onEditTeam: (team: Team) => void;
}

const TeamsView: React.FC<TeamsViewProps> = ({ teams, hubs, users, drivers, onSelectTeam, onAddTeam, onEditTeam }) => {
  // FIX: Remove local modal state, as it's now handled by App.tsx.
  const [searchTerm, setSearchTerm] = useState('');
  const [hubFilter, setHubFilter] = useState<string>('ALL');

  const filteredTeams = useMemo(() => {
    return teams
      .filter(team => hubFilter === 'ALL' || team.hubId === hubFilter)
      .filter(team => team.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [teams, searchTerm, hubFilter]);

  // FIX: Remove mock handlers as parent now controls this logic.
  
  return (
    <div className="p-6">
      <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-text-primary">Teams</h3>
            {/* FIX: Use onAddTeam prop to trigger modal in parent. */}
            <Button onClick={onAddTeam}>Add Team</Button>
          </div>
          <div className="flex items-center space-x-2">
              <input
                  type="text"
                  placeholder="Search by team name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
              <select
                  value={hubFilter}
                  onChange={(e) => setHubFilter(e.target.value)}
                  className="bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
                  <option value="ALL">All Hubs</option>
                  {hubs.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
              </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-text-secondary">
            <thead className="text-xs text-text-secondary uppercase bg-background border-b border-border">
              <tr>
                <th scope="col" className="px-6 py-3">Team Name</th>
                <th scope="col" className="px-6 py-3">Team Lead</th>
                <th scope="col" className="px-6 py-3">Hub</th>
                <th scope="col" className="px-6 py-3">Driver Count</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeams.map((team) => {
                const hub = hubs.find(h => h.id === team.hubId);
                const lead = users.find(u => u.id === team.teamLeadId);
                const driverCount = drivers.filter(d => d.teamId === team.id).length;
                return (
                  <tr key={team.id} className="bg-surface border-b border-border last:border-b-0 hover:bg-secondary">
                    <th scope="row" className="px-6 py-4 font-medium text-text-primary whitespace-nowrap cursor-pointer hover:underline" onClick={() => onSelectTeam(team.id)}>
                      {team.name}
                    </th>
                    <td className="px-6 py-4">{lead?.name || 'N/A'}</td>
                    <td className="px-6 py-4">{hub?.name || 'N/A'}</td>
                    <td className="px-6 py-4">{driverCount}</td>
                    <td className="px-6 py-4">
                      {/* FIX: Use onEditTeam prop to trigger modal in parent. */}
                      <Button variant="secondary" onClick={() => onEditTeam(team)}>Edit</Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeamsView;
