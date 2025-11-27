import React from 'react';
import { Challenge } from '../../types';
import Button from '../ui/Button';

interface ChallengeListProps {
  challenges: Challenge[];
  onEditChallenge: (challenge: Challenge) => void;
  onDeleteChallenge: (challengeId: string) => void;
}

const ChallengeList: React.FC<ChallengeListProps> = ({ challenges, onEditChallenge, onDeleteChallenge }) => {
  return (
    <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-text-secondary">
          <thead className="text-xs text-text-secondary uppercase bg-background border-b border-border">
            <tr>
              <th scope="col" className="px-6 py-3">Challenge Name</th>
              <th scope="col" className="px-6 py-3">Type</th>
              <th scope="col" className="px-6 py-3 text-center">Goal</th>
              <th scope="col" className="px-6 py-3 text-center">Points</th>
              <th scope="col" className="px-6 py-3 text-center">Status</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {challenges.map((challenge) => (
              <tr key={challenge.id} className="bg-surface border-b border-border last:border-b-0">
                <th scope="row" className="px-6 py-4 font-medium text-text-primary whitespace-nowrap">
                  {challenge.name}
                  <p className="text-xs font-normal text-text-secondary">{challenge.description}</p>
                </th>
                <td className="px-6 py-4 font-mono">{challenge.type}</td>
                <td className="px-6 py-4 text-center font-semibold">{challenge.goal}</td>
                <td className="px-6 py-4 text-center text-yellow-400 font-semibold">{challenge.points}</td>
                <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${challenge.isActive ? 'bg-success/20 text-success' : 'bg-secondary text-text-secondary'}`}>
                        {challenge.isActive ? 'Active' : 'Inactive'}
                    </span>
                </td>
                <td className="px-6 py-4">
                    <div className="flex space-x-2">
                        <Button variant="secondary" onClick={() => onEditChallenge(challenge)}>Edit</Button>
                        <Button variant="danger" onClick={() => onDeleteChallenge(challenge.id)}>Delete</Button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChallengeList;