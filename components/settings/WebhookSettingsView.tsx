import React, { useState } from 'react';
import { Webhook } from '../../types';
import Button from '../ui/Button';
import AddWebhookModal from './AddWebhookModal';
import EditWebhookModal from './EditWebhookModal';

interface WebhookSettingsViewProps {
  webhooks: Webhook[];
  setWebhooks: React.Dispatch<React.SetStateAction<Webhook[]>>;
}

const WebhookSettingsView: React.FC<WebhookSettingsViewProps> = ({ webhooks, setWebhooks }) => {
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [editingWebhook, setEditingWebhook] = useState<Webhook | null>(null);

    const handleAddWebhook = (webhook: Omit<Webhook, 'id'>) => {
        const newWebhook = { ...webhook, id: `WH-${Date.now()}`};
        setWebhooks(prev => [...prev, newWebhook]);
    };

    const handleUpdateWebhook = (updatedWebhook: Webhook) => {
        setWebhooks(prev => prev.map(wh => wh.id === updatedWebhook.id ? updatedWebhook : wh));
    };

    const handleDeleteWebhook = (webhookId: string) => {
        if (window.confirm('Are you sure you want to delete this webhook?')) {
            setWebhooks(prev => prev.filter(wh => wh.id !== webhookId));
        }
    };

    return (
        <>
        <div className="bg-surface border border-border rounded-lg shadow-sm">
            <div className="p-4 border-b border-border flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold text-text-primary">Webhook Endpoints</h3>
                    <p className="text-sm text-text-secondary">Manage endpoints for receiving event notifications.</p>
                </div>
                <Button onClick={() => setAddModalOpen(true)}>Add Endpoint</Button>
            </div>
            <ul className="divide-y divide-border">
                {webhooks.map(webhook => (
                    <li key={webhook.id} className="p-4">
                       <div className="flex justify-between items-start">
                            <div>
                                <p className="font-mono text-text-primary text-sm">{webhook.url}</p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {webhook.events.map(event => (
                                        <span key={event} className="px-2 py-0.5 text-xs bg-secondary text-text-secondary rounded-full font-mono">{event}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 flex-shrink-0">
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${webhook.isActive ? 'bg-success/20 text-success' : 'bg-secondary text-text-secondary'}`}>
                                    {webhook.isActive ? 'Active' : 'Inactive'}
                                </span>
                                <Button variant="secondary" onClick={() => setEditingWebhook(webhook)}>Edit</Button>
                                <Button variant="danger" onClick={() => handleDeleteWebhook(webhook.id)}>Delete</Button>
                            </div>
                       </div>
                    </li>
                ))}
                {webhooks.length === 0 && <p className="text-center p-6 text-text-secondary">No webhooks configured.</p>}
            </ul>
        </div>
        <AddWebhookModal 
            isOpen={isAddModalOpen}
            onClose={() => setAddModalOpen(false)}
            onAddWebhook={handleAddWebhook}
        />
        <EditWebhookModal 
            isOpen={!!editingWebhook}
            onClose={() => setEditingWebhook(null)}
            onUpdateWebhook={handleUpdateWebhook}
            webhook={editingWebhook}
        />
        </>
    );
};

export default WebhookSettingsView;