import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Team, Hub, User } from '../../types';

interface AddTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTeam: (team: Omit<Team, 'id'>) => void;
  hubs: Hub[];
  users: User[];
}

const AddTeamModal: React.FC<AddTeamModalProps> = ({ isOpen, onClose, onAddTeam, hubs, users }) => {
  const [name, setName] = useState('');
  const [hubId, setHubId] = useState('');
  const [teamLeadId, setTeamLeadId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !hubId || !teamLeadId) return;
    
    onAddTeam({ name, hubId, teamLeadId });

    onClose();
    // Reset form
    setName('');
    setHubId('');
    setTeamLeadId('');
  };

  const potentialLeads = users.filter(u => u.role === 'Admin' || u.role === 'Manager' || u.role === 'Team Lead');
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Team">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="teamName" className="block text-sm font-medium text-text-secondary">Team Name</label>
          <input type="text" id="teamName" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required />
        </div>
        <div>
          <label htmlFor="hub" className="block text-sm font-medium text-text-secondary">Assign Hub</label>
          <select id="hub" value={hubId} onChange={(e) => setHubId(e.target.value)} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required>
            <option value="">Select a hub</option>
            {hubs.map(hub => <option key={hub.id} value={hub.id}>{hub.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="teamLead" className="block text-sm font-medium text-text-secondary">Assign Team Lead</label>
          <select id="teamLead" value={teamLeadId} onChange={(e) => setTeamLeadId(e.target.value)} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required>
            <option value="">Select a team lead</option>
            {potentialLeads.map(user => <option key={user.id} value={user.id}>{user.name} ({user.role})</option>)}
          </select>
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">Create Team</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddTeamModal;