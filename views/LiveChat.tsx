import React, { useState } from 'react';
import { Driver, DriverStatus } from '../types';
import Button from '../components/ui/Button';

interface LiveChatProps {
    drivers: Driver[];
}

const DriverListItem: React.FC<{ driver: Driver, isActive: boolean, onClick: () => void }> = ({ driver, isActive, onClick }) => {
    const statusStyles: Record<DriverStatus, string> = {
        [DriverStatus.ON_DUTY]: 'bg-red-500',
        [DriverStatus.AVAILABLE]: 'bg-green-500',
        [DriverStatus.OFFLINE]: 'bg-gray-500',
        [DriverStatus.MAINTENANCE]: 'bg-yellow-500',
    };
    return (
        <li onClick={onClick} className={`flex items-center p-3 cursor-pointer rounded-lg ${isActive ? 'bg-secondary' : 'hover:bg-secondary'}`}>
            <div className="relative mr-3">
                <div className={`w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center font-bold text-text-primary`}>
                    {driver.name.charAt(0)}
                </div>
                <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ${statusStyles[driver.status]} ring-2 ring-surface`}></span>
            </div>
            <div>
                <p className="font-semibold text-text-primary">{driver.name}</p>
                <p className="text-sm text-text-secondary">{driver.status}</p>
            </div>
        </li>
    );
};


const LiveChat: React.FC<LiveChatProps> = ({ drivers }) => {
    const [selectedDriver, setSelectedDriver] = useState<Driver | null>(drivers[0] || null);
    
    return (
        <div className="h-full flex p-6 space-x-6">
            {/* Driver List */}
            <div className="w-1/3 bg-surface border border-border rounded-lg flex flex-col">
                <h3 className="text-lg font-semibold p-4 border-b border-border">Driver Conversations</h3>
                <ul className="overflow-y-auto p-2 space-y-1">
                    {drivers.map(driver => (
                        <DriverListItem 
                            key={driver.id} 
                            driver={driver}
                            isActive={selectedDriver?.id === driver.id}
                            onClick={() => setSelectedDriver(driver)}
                        />
                    ))}
                </ul>
            </div>

            {/* Chat Window */}
            <div className="w-2/3 bg-surface border border-border rounded-lg flex flex-col">
                {selectedDriver ? (
                    <>
                        <div className="p-4 border-b border-border">
                            <h3 className="font-semibold text-lg text-text-primary">{selectedDriver.name}</h3>
                            <p className="text-sm text-text-secondary">{selectedDriver.status}</p>
                        </div>
                        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                            {/* Mock Chat Messages */}
                            <div className="flex justify-end">
                                <div className="bg-primary text-white rounded-lg p-3 max-w-lg">
                                    <p>Hi {selectedDriver.name}, what's your ETA for task T001?</p>
                                </div>
                            </div>
                             <div className="flex justify-start">
                                <div className="bg-secondary text-text-primary rounded-lg p-3 max-w-lg">
                                    <p>Hey, should be there in about 15 minutes. Hitting some traffic on the freeway.</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t border-border flex space-x-2">
                            <input type="text" placeholder={`Message ${selectedDriver.name}...`} className="w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" />
                            <Button>Send</Button>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-text-secondary">
                        <p>Select a driver to start a conversation.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LiveChat;