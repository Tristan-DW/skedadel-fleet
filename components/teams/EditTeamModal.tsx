import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Team, Hub, User } from '../../types';

interface EditTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateTeam: (team: Team) => void;
  team: Team | null;
  hubs: Hub[];
  users: User[];
}

const EditTeamModal: React.FC<EditTeamModalProps> = ({ isOpen, onClose, onUpdateTeam, team, hubs, users }) => {
  const [name, setName] = useState('');
  const [hubId, setHubId] = useState('');
  const [teamLeadId, setTeamLeadId] = useState('');

  useEffect(() => {
    if (team) {
      setName(team.name);
      setHubId(team.hubId);
      setTeamLeadId(team.teamLeadId);
    }
  }, [team]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!team || !name || !hubId || !teamLeadId) return;
    
    onUpdateTeam({ ...team, name, hubId, teamLeadId });

    onClose();
  };

  const potentialLeads = users.filter(u => u.role === 'Admin' || u.role === 'Manager' || u.role === 'Team Lead');
  
  if (!team) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit Team: ${team.name}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="edit-teamName" className="block text-sm font-medium text-text-secondary">Team Name</label>
          <input type="text" id="edit-teamName" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required />
        </div>
        <div>
          <label htmlFor="edit-team-hub" className="block text-sm font-medium text-text-secondary">Assign Hub</label>
          <select id="edit-team-hub" value={hubId} onChange={(e) => setHubId(e.target.value)} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required>
            {hubs.map(hub => <option key={hub.id} value={hub.id}>{hub.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="edit-teamLead" className="block text-sm font-medium text-text-secondary">Assign Team Lead</label>
          <select id="edit-teamLead" value={teamLeadId} onChange={(e) => setTeamLeadId(e.target.value)} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required>
            {potentialLeads.map(user => <option key={user.id} value={user.id}>{user.name} ({user.role})</option>)}
          </select>
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditTeamModal;
