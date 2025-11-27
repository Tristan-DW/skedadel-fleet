import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Challenge, ChallengeType } from '../../types';

interface AddChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddChallenge: (challenge: Omit<Challenge, 'id'>) => void;
}

const AddChallengeModal: React.FC<AddChallengeModalProps> = ({ isOpen, onClose, onAddChallenge }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ChallengeType>('COMPLETE_ORDERS');
  const [goal, setGoal] = useState(0);
  const [points, setPoints] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || goal <= 0 || points <= 0) return;
    
    onAddChallenge({ name, description, type, goal, points, isActive });

    onClose();
    setName('');
    setDescription('');
    setType('COMPLETE_ORDERS');
    setGoal(0);
    setPoints(0);
    setIsActive(true);
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Challenge">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="challenge-name" className="block text-sm font-medium text-text-secondary">Challenge Name</label>
          <input type="text" id="challenge-name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required />
        </div>
         <div>
          <label htmlFor="challenge-desc" className="block text-sm font-medium text-text-secondary">Description</label>
          <textarea id="challenge-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label htmlFor="challenge-type" className="block text-sm font-medium text-text-secondary">Type</label>
                <select id="challenge-type" value={type} onChange={(e) => setType(e.target.value as ChallengeType)} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required>
                    <option value="COMPLETE_ORDERS">Complete Orders</option>
                    <option value="SUCCESS_RATE">Success Rate</option>
                    <option value="ON_TIME_DELIVERIES">On-Time</option>
                </select>
            </div>
            <div>
                <label htmlFor="challenge-goal" className="block text-sm font-medium text-text-secondary">Goal</label>
                <input type="number" id="challenge-goal" value={goal} onChange={(e) => setGoal(parseInt(e.target.value, 10))} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required />
            </div>
            <div>
                <label htmlFor="challenge-points" className="block text-sm font-medium text-text-secondary">Points</label>
                <input type="number" id="challenge-points" value={points} onChange={(e) => setPoints(parseInt(e.target.value, 10))} className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required />
            </div>
        </div>
        <div className="flex items-center">
            <input id="challenge-active" type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4 text-primary bg-background border-border rounded focus:ring-primary" />
            <label htmlFor="challenge-active" className="ml-2 block text-sm text-text-primary">Activate this challenge immediately</label>
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">Create Challenge</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddChallengeModal;