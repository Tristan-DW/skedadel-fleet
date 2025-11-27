import React from 'react';
import { ICONS } from '../constants';

const Integrations: React.FC = () => {
  return (
    <div className="p-6">
       <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center">
            <div className="mx-auto h-16 w-16 text-text-secondary">{ICONS.integrations}</div>
            <h3 className="mt-4 text-2xl font-bold text-text-primary">Integrations</h3>
            <p className="mt-2 text-md text-text-secondary">
                This section is for managing third-party integrations.
            </p>
            <p className="mt-2 text-sm text-text-secondary max-w-md">
                Connect Skedadel with other tools you use, such as accounting software, communication platforms, and more. Webhooks and API access are managed under "API & Webhooks" and "Financials".
            </p>
        </div>
    </div>
  );
};

export default Integrations;