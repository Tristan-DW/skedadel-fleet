import React from 'react';
import { Driver } from '../../types';

interface LeaderboardProps {
  drivers: Driver[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ drivers }) => {
  const sortedDrivers = [...drivers].sort((a, b) => b.points - a.points);

  return (
    <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-text-secondary">
          <thead className="text-xs text-text-secondary uppercase bg-background border-b border-border">
            <tr>
              <th scope="col" className="px-6 py-3 text-center">Rank</th>
              <th scope="col" className="px-6 py-3">Driver</th>
              <th scope="col" className="px-6 py-3 text-center">Team</th>
              <th scope="col" className="px-6 py-3 text-center">Points</th>
            </tr>
          </thead>
          <tbody>
            {sortedDrivers.map((driver, index) => (
              <tr key={driver.id} className={`bg-surface border-b border-border last:border-b-0 ${index < 3 ? 'bg-yellow-500/5' : ''}`}>
                <td className="px-6 py-4 text-center">
                  <span className={`font-bold text-lg ${index < 3 ? 'text-yellow-400' : 'text-text-primary'}`}>
                    {index + 1}
                  </span>
                </td>
                <th scope="row" className="px-6 py-4 font-medium text-text-primary whitespace-nowrap">
                  {driver.name}
                </th>
                <td className="px-6 py-4 text-center font-mono">{driver.teamId}</td>
                <td className="px-6 py-4 text-center text-yellow-400 font-bold text-base">{driver.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;