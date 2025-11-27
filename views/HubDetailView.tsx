
import React from 'react';
import { Hub, Store, Team } from '../types';
import Button from '../components/ui/Button';

interface HubDetailViewProps {
    hub: Hub;
    stores: Store[];
    teams: Team[];
    onBack: () => void;
    onSelectStore: (storeId: string) => void;
    onSelectTeam: (teamId: string) => void;
    onManageStores: () => void;
    onEditHub: (hub: Hub) => void;
}

const DetailItem: React.FC<{ label: string, value: React.ReactNode }> = ({ label, value }) => (
    <div>
        <p className="text-sm text-text-secondary">{label}</p>
        <p className="font-medium text-text-primary">{value || 'N/A'}</p>
    </div>
);

const HubDetailView: React.FC<HubDetailViewProps> = ({ hub, stores, teams, onBack, onSelectStore, onSelectTeam, onManageStores, onEditHub }) => {
    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                    <button onClick={onBack} className="text-text-secondary hover:text-text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    </button>
                    <h2 className="text-3xl font-bold text-text-primary">{hub.name}</h2>
                </div>
                <Button onClick={() => onEditHub(hub)}>Edit Hub</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-surface border border-border rounded-lg shadow-sm p-4">
                        <h3 className="text-lg font-semibold text-text-primary mb-4">Hub Information</h3>
                        <div className="space-y-3">
                            <DetailItem label="Address" value={hub.address} />
                            <DetailItem label="Geofence ID" value={hub.geofenceId} />
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-surface border border-border rounded-lg shadow-sm">
                        <div className="p-4 border-b border-border flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-text-primary">Associated Stores ({stores.length})</h3>
                            <Button variant="secondary" onClick={onManageStores}>Manage Stores</Button>
                        </div>
                        <ul className="divide-y divide-border max-h-64 overflow-y-auto">
                            {stores.map(store => (
                                <li key={store.id} onClick={() => onSelectStore(store.id)} className="p-3 hover:bg-secondary cursor-pointer">{store.name}</li>
                            ))}
                            {stores.length === 0 && <p className="p-4 text-center text-text-secondary">No stores assigned.</p>}
                        </ul>
                    </div>
                    <div className="bg-surface border border-border rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold text-text-primary p-4 border-b border-border">Associated Teams ({teams.length})</h3>
                        <ul className="divide-y divide-border max-h-64 overflow-y-auto">
                            {teams.map(team => (
                                <li key={team.id} onClick={() => onSelectTeam(team.id)} className="p-3 hover:bg-secondary cursor-pointer">{team.name}</li>
                            ))}
                            {teams.length === 0 && <p className="p-4 text-center text-text-secondary">No teams assigned.</p>}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HubDetailView;
