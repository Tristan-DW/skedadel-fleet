import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Webhook, WebhookEvent } from '../../types';

interface AddWebhookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWebhook: (webhook: Omit<Webhook, 'id'>) => void;
}

const ALL_EVENTS: WebhookEvent[] = ['order.created', 'order.status_changed', 'driver.status_changed', 'driver.location_updated'];

const AddWebhookModal: React.FC<AddWebhookModalProps> = ({ isOpen, onClose, onAddWebhook }) => {
  const [url, setUrl] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<WebhookEvent[]>([]);
  const [isActive, setIsActive] = useState(true);

  const handleEventToggle = (event: WebhookEvent) => {
    setSelectedEvents(prev => 
      prev.includes(event) ? prev.filter(e => e !== event) : [...prev, event]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || selectedEvents.length === 0) return;
    
    onAddWebhook({ url, events: selectedEvents, isActive });

    onClose();
    setUrl('');
    setSelectedEvents([]);
    setIsActive(true);
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Webhook Endpoint">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="webhook-url" className="block text-sm font-medium text-text-secondary">Endpoint URL</label>
          <input type="url" id="webhook-url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://api.example.com/webhook" className="mt-1 block w-full bg-background border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required />
        </div>
        
        <div>
            <label className="block text-sm font-medium text-text-secondary">Events to send</label>
            <div className="mt-2 grid grid-cols-2 gap-2">
                {ALL_EVENTS.map(event => (
                    <label key={event} className="flex items-center space-x-2 p-2 bg-background rounded-md border border-border has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                        <input
                            type="checkbox"
                            checked={selectedEvents.includes(event)}
                            onChange={() => handleEventToggle(event)}
                            className="h-4 w-4 rounded border-gray-500 bg-surface text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-text-primary font-mono">{event}</span>
                    </label>
                ))}
            </div>
        </div>
        
        <div className="flex items-center">
            <input id="webhook-active" type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4 text-primary bg-background border-border rounded focus:ring-primary" />
            <label htmlFor="webhook-active" className="ml-2 block text-sm text-text-primary">Enable this endpoint</label>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">Add Webhook</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddWebhookModal;