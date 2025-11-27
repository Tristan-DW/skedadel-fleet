
import React from 'react';
import { Challenge, Driver } from '../types';
import Tabs from '../components/ui/Tabs';
import Leaderboard from '../components/challenges/Leaderboard';
import ChallengeList from '../components/challenges/ChallengeList';
import Button from '../components/ui/Button';

interface ChallengesViewProps {
  challenges: Challenge[];
  drivers: Driver[];
  onAddChallenge: () => void;
  onEditChallenge: (challenge: Challenge) => void;
  onDeleteChallenge: (challengeId: string) => void;
}

type ChallengeTab = 'leaderboard' | 'manage';

const ChallengesView: React.FC<ChallengesViewProps> = ({ challenges, drivers, onAddChallenge, onEditChallenge, onDeleteChallenge }) => {
    const [activeTab, setActiveTab] = React.useState<ChallengeTab>('leaderboard');
    
    const TABS: {id: ChallengeTab, label: string}[] = [
        {id: 'leaderboard', label: 'Leaderboard'},
        {id: 'manage', label: 'Manage Challenges'},
    ]

    const renderContent = () => {
        switch(activeTab) {
            case 'leaderboard':
                return <Leaderboard drivers={drivers} />;
            case 'manage':
                return <ChallengeList 
                            challenges={challenges} 
                            onEditChallenge={onEditChallenge} 
                            onDeleteChallenge={onDeleteChallenge}
                        />;
            default:
                return null;
        }
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-text-primary">Gamification & Challenges</h2>
                {activeTab === 'manage' && <Button onClick={onAddChallenge}>Add Challenge</Button>}
            </div>
            <div className="bg-surface border border-border rounded-lg p-2">
                <Tabs tabs={TABS} activeTab={activeTab} onTabClick={(tabId) => setActiveTab(tabId)} />
            </div>
            <div className="mt-4">
                {renderContent()}
            </div>
        </div>
    )
}

export default ChallengesView;
