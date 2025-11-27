import React from 'react';
import { Challenge, DriverChallenge } from '../../types';

interface DriverChallengeProgressProps {
  driverChallenges: DriverChallenge[];
  allChallenges: Challenge[];
}

const ProgressBar: React.FC<{ progress: number, goal: number }> = ({ progress, goal }) => {
    const percentage = Math.min((progress / goal) * 100, 100);
    return (
        <div className="w-full bg-background rounded-full h-2.5">
            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
        </div>
    )
}

const DriverChallengeProgress: React.FC<DriverChallengeProgressProps> = ({ driverChallenges, allChallenges }) => {
  const activeDriverChallenges = driverChallenges.filter(dc => {
    const challenge = allChallenges.find(c => c.id === dc.challengeId);
    return challenge && challenge.isActive;
  });

  return (
    <div className="mt-4 space-y-4">
        <h4 className="text-md font-semibold text-text-primary">Active Challenges</h4>
        {activeDriverChallenges.length > 0 ? (
            activeDriverChallenges.map(dc => {
                const challenge = allChallenges.find(c => c.id === dc.challengeId);
                if (!challenge) return null;
                return (
                    <div key={dc.challengeId}>
                        <div className="flex justify-between items-end mb-1">
                            <div>
                                <p className="font-medium text-text-primary text-sm">{challenge.name}</p>
                                <p className="text-xs text-text-secondary">{challenge.description}</p>
                            </div>
                            <span className="text-sm font-semibold text-text-primary">{dc.progress} / {challenge.goal}</span>
                        </div>
                        <ProgressBar progress={dc.progress} goal={challenge.goal} />
                    </div>
                )
            })
        ) : (
            <p className="text-sm text-text-secondary">No active challenges for this driver.</p>
        )}
    </div>
  );
};

export default DriverChallengeProgress;