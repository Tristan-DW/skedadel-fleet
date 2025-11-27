import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Challenge, ChallengeType } from '../../types';

interface EditChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateChallenge: (challenge: Challenge) => void;
  challenge: Challenge | null;
}

const EditChallengeModal: React.FC<EditChallengeModalProps> = ({ isOpen, onClose, onUpdateChallenge, challenge }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ChallengeType>('COMPLETE_ORDERS');
  const [goal, setGoal] = useState(0);
  const [points, setPoints] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (challenge) {
      setName(challenge.name);
      setDescription(challenge.description);
      setType(challenge.type);
      setGoal(challenge.goal);
      setPoints(challenge.points);
      setIsActive(challenge.isActive);
    }
  }, [challenge]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!challenge || !name || goal <= 0 || points <= 0) return;
    
    onUpdateChallenge({ ...challenge, name, description, type, goal, points, isActive });
    onClose();
  };
  
  if (!challenge) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit Challenge: ${challenge.name}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="edit-challenge-name" className="block text-sm font-medium text-text-secondary">Challenge Name</label>
          <input type="text" id="edit-challenge-name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required />
        </div>
         <div>
          <label htmlFor="edit-challenge-desc" className="block text-sm font-medium text-text-secondary">Description</label>
          <textarea id="edit-challenge-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label htmlFor="edit-challenge-type" className="block text-sm font-medium text-text-secondary">Type</label>
                <select id="edit-challenge-type" value={type} onChange={(e) => setType(e.target.value as ChallengeType)} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required>
                    <option value="COMPLETE_ORDERS">Complete Orders</option>
                    <option value="SUCCESS_RATE">Success Rate</option>
                    <option value="ON_TIME_DELIVERIES">On-Time</option>
                </select>
            </div>
            <div>
                <label htmlFor="edit-challenge-goal" className="block text-sm font-medium text-text-secondary">Goal</label>
                <input type="number" id="edit-challenge-goal" value={goal} onChange={(e) => setGoal(parseInt(e.target.value, 10))} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required />
            </div>
            <div>
                <label htmlFor="edit-challenge-points" className="block text-sm font-medium text-text-secondary">Points</label>
                <input type="number" id="edit-challenge-points" value={points} onChange={(e) => setPoints(parseInt(e.target.value, 10))} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required />
            </div>
        </div>
        <div className="flex items-center">
            <input id="edit-challenge-active" type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4 text-primary bg-background border-border rounded focus:ring-primary" />
            <label htmlFor="edit-challenge-active" className="ml-2 block text-sm text-text-primary">Activate this challenge</label>
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditChallengeModal;