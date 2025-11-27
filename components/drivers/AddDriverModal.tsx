import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Driver, Vehicle, Team } from '../../types';

interface AddDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Fix: Update type to omit properties that are set in the parent component.
  onAddDriver: (driver: Omit<Driver, 'id' | 'status' | 'location' | 'points' | 'rank'>) => void;
  vehicles: Vehicle[];
  teams: Team[];
}

const AddDriverModal: React.FC<AddDriverModalProps> = ({ isOpen, onClose, onAddDriver, vehicles, teams }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [teamId, setTeamId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email || !vehicleId || !teamId) return;
    
    onAddDriver({
      name,
      phone,
      email,
      vehicleId,
      teamId,
    });

    onClose();
    // Reset form
    setName('');
    setPhone('');
    setEmail('');
    setVehicleId('');
    setTeamId('');
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Driver">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text-secondary">Full Name</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-text-secondary">Phone Number</label>
            <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-secondary">Email Address</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="team" className="block text-sm font-medium text-text-secondary">Assign Team</label>
            <select id="team" value={teamId} onChange={(e) => setTeamId(e.target.value)} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required>
              <option value="">Select a team</option>
              {teams.map(team => <option key={team.id} value={team.id}>{team.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="vehicle" className="block text-sm font-medium text-text-secondary">Assign Vehicle</label>
            <select id="vehicle" value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required>
              <option value="">Select a vehicle</option>
              {vehicles.map(vehicle => <option key={vehicle.id} value={vehicle.id}>{vehicle.name} - {vehicle.licensePlate}</option>)}
            </select>
          </div>
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">Add Driver</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddDriverModal;