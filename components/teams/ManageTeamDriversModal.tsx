
import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Team, Driver } from '../../types';

interface ManageTeamDriversModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team | null;
  allDrivers: Driver[];
  onUpdateDrivers: (teamId: string, driverIds: string[]) => void;
}

const DriverItem: React.FC<{ driver: Driver, onAction: () => void, actionIcon: React.ReactNode }> = ({ driver, onAction, actionIcon }) => (
    <div className="flex items-center justify-between p-2 bg-background rounded-md">
        <span>{driver.name}</span>
        <button onClick={onAction} className="text-text-secondary hover:text-primary">{actionIcon}</button>
    </div>
);

const ManageTeamDriversModal: React.FC<ManageTeamDriversModalProps> = ({ isOpen, onClose, team, allDrivers, onUpdateDrivers }) => {
  const [teamDriverIds, setTeamDriverIds] = useState<string[]>([]);
  
  useEffect(() => {
    if (team) {
      const currentDriverIds = allDrivers.filter(d => d.teamId === team.id).map(d => d.id);
      setTeamDriverIds(currentDriverIds);
    }
  }, [team, allDrivers, isOpen]);

  const addDriver = (driverId: string) => {
    setTeamDriverIds(prev => [...prev, driverId]);
  };
  
  const removeDriver = (driverId: string) => {
    setTeamDriverIds(prev => prev.filter(id => id !== driverId));
  };
  
  const handleSubmit = () => {
    if (team) {
      onUpdateDrivers(team.id, teamDriverIds);
      onClose();
    }
  };

  if (!team) return null;
  
  const teamDrivers = allDrivers.filter(d => teamDriverIds.includes(d.id));
  const availableDrivers = allDrivers.filter(d => d.teamId !== team.id && !teamDriverIds.includes(d.id));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Manage Drivers for ${team.name}`}>
      <div className="grid grid-cols-2 gap-4 h-96">
        {/* Available Drivers */}
        <div className="border border-border rounded-lg p-2 flex flex-col">
            <h4 className="font-semibold text-center mb-2">Available Drivers</h4>
            <div className="overflow-y-auto space-y-2 flex-1 p-1">
                {availableDrivers.map(d => (
                    <DriverItem 
                        key={d.id} 
                        driver={d} 
                        onAction={() => addDriver(d.id)} 
                        actionIcon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414l-3-3z" clipRule="evenodd" /></svg>} 
                    />
                ))}
            </div>
        </div>
        {/* Team Drivers */}
        <div className="border border-border rounded-lg p-2 flex flex-col">
            <h4 className="font-semibold text-center mb-2">Team Roster ({teamDrivers.length})</h4>
            <div className="overflow-y-auto space-y-2 flex-1 p-1">
                {teamDrivers.map(d => (
                     <DriverItem 
                        key={d.id} 
                        driver={d} 
                        onAction={() => removeDriver(d.id)} 
                        actionIcon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>} 
                    />
                ))}
            </div>
        </div>
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Update Roster</Button>
      </div>
    </Modal>
  );
};

export default ManageTeamDriversModal;