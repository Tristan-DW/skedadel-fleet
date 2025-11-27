import React from 'react';
import { Driver, Order, Vehicle, Team, Challenge, DriverChallenge } from '../types';
import Button from '../components/ui/Button';
import { ICONS } from '../constants';
import DriverOrderHistory from '../components/drivers/DriverOrderHistory';
import DriverChallengeProgress from '../components/challenges/DriverChallengeProgress';

interface DriverDetailViewProps {
    driver: Driver;
    orders: Order[];
    vehicle: Vehicle;
    team: Team | undefined;
    onBack: () => void;
    onEditDriver: (driver: Driver) => void;
    onSelectTeam: (teamId: string) => void;
    allChallenges: Challenge[];
    driverChallenges: DriverChallenge[];
}

const DetailItem: React.FC<{ label: string, value: React.ReactNode, isLink?: boolean, onClick?: () => void }> = ({ label, value, isLink, onClick }) => (
    <div>
        <p className="text-sm text-text-secondary">{label}</p>
        <p
            className={`font-medium text-text-primary ${isLink ? 'hover:underline cursor-pointer text-primary' : ''}`}
            onClick={onClick}
        >
            {value || 'N/A'}
        </p>
    </div>
);


const DriverDetailView: React.FC<DriverDetailViewProps> = ({ driver, orders, vehicle, team, onBack, onEditDriver, onSelectTeam, allChallenges, driverChallenges }) => {
    if (!driver) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-xl font-bold">Driver not found</h2>
                <Button onClick={onBack} variant="secondary" className="mt-4">Go Back</Button>
            </div>
        );
    }

    const totalOrders = orders.length;
    const successfulOrders = orders.filter(o => o.status === 'Successful').length;
    const successRate = totalOrders > 0 ? (successfulOrders / totalOrders) * 100 : 0;

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                    <button onClick={onBack} className="text-text-secondary hover:text-text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    </button>
                    <h2 className="text-3xl font-bold text-text-primary">{driver.name}</h2>
                </div>
                <Button onClick={() => onEditDriver(driver)}>Edit Driver</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-surface border border-border rounded-lg shadow-sm p-4">
                        <h3 className="text-lg font-semibold text-text-primary mb-4">Driver Profile</h3>
                        <div className="space-y-3">
                            <DetailItem label="Email" value={driver.email} />
                            <DetailItem label="Phone" value={driver.phone} />
                            <DetailItem label="Status" value={driver.status} />
                            <DetailItem label="Current Location" value={driver.address || 'Unknown'} />
                            <DetailItem label="Team" value={team?.name} isLink={!!team} onClick={() => team && onSelectTeam(team.id)} />
                        </div>
                    </div>
                    <div className="bg-surface border border-border rounded-lg shadow-sm p-4">
                        <h3 className="text-lg font-semibold text-text-primary mb-4">Assigned Vehicle</h3>
                        <div className="space-y-3">
                            <DetailItem label="Model" value={`${vehicle.name} (${vehicle.type})`} />
                            <DetailItem label="License Plate" value={vehicle.licensePlate} />
                            <DetailItem label="Status" value={vehicle.status} />
                        </div>
                    </div>
                    <div className="bg-surface border border-border rounded-lg shadow-sm p-4">
                        <h3 className="text-lg font-semibold text-text-primary mb-4">Performance</h3>
                        <div className="space-y-3">
                            <DetailItem label="Total Orders" value={totalOrders} />
                            <DetailItem label="Successful Deliveries" value={successfulOrders} />
                            <DetailItem label="Success Rate" value={`${successRate.toFixed(1)}%`} />
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-surface border border-border rounded-lg shadow-sm p-4">
                        <h3 className="text-lg font-semibold text-text-primary mb-4">Gamification</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <DetailItem label="Points" value={<span className="text-yellow-400 font-bold">{driver.points}</span>} />
                            <DetailItem label="Rank" value={`#${driver.rank}`} />
                        </div>
                        <DriverChallengeProgress driverChallenges={driverChallenges} allChallenges={allChallenges} />
                    </div>
                    <DriverOrderHistory orders={orders} />
                </div>
            </div>
        </div>
    );
};

export default DriverDetailView;