import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Driver, Vehicle, Team } from '../../types';

interface EditDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateDriver: (driver: Driver) => void;
  driver: Driver | null;
  vehicles: Vehicle[];
  teams: Team[];
}

const EditDriverModal: React.FC<EditDriverModalProps> = ({ isOpen, onClose, onUpdateDriver, driver, vehicles, teams }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [teamId, setTeamId] = useState('');

  useEffect(() => {
    if (driver) {
      setName(driver.name);
      setPhone(driver.phone);
      setEmail(driver.email);
      setVehicleId(driver.vehicleId);
      setTeamId(driver.teamId);
    }
  }, [driver]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!driver || !name || !phone || !email || !vehicleId || !teamId) return;
    
    onUpdateDriver({
      ...driver,
      name,
      phone,
      email,
      vehicleId,
      teamId,
    });

    onClose();
  };
  
  if (!driver) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit Driver: ${driver.name}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="edit-name" className="block text-sm font-medium text-text-secondary">Full Name</label>
          <input type="text" id="edit-name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="edit-phone" className="block text-sm font-medium text-text-secondary">Phone Number</label>
            <input type="tel" id="edit-phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required />
          </div>
          <div>
            <label htmlFor="edit-email" className="block text-sm font-medium text-text-secondary">Email Address</label>
            <input type="email" id="edit-email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="edit-team" className="block text-sm font-medium text-text-secondary">Assign Team</label>
            <select id="edit-team" value={teamId} onChange={(e) => setTeamId(e.target.value)} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required>
              {teams.map(team => <option key={team.id} value={team.id}>{team.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="edit-vehicle" className="block text-sm font-medium text-text-secondary">Assign Vehicle</label>
            <select id="edit-vehicle" value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required>
              {vehicles.map(vehicle => <option key={vehicle.id} value={vehicle.id}>{vehicle.name} - {vehicle.licensePlate}</option>)}
            </select>
          </div>
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditDriverModal;
