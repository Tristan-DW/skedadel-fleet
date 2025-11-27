import React from 'react';
import { Alert } from '../../types';
import AlertItem from '../shared/AlertItem';

const AlertsPanel: React.FC<{ alerts: Alert[] }> = ({ alerts }) => {
  return (
    <div className="bg-surface/70 backdrop-blur-sm border border-border rounded-lg shadow-xl flex flex-col max-h-[45vh]">
      <h3 className="text-base font-semibold text-text-primary p-3 border-b border-border flex-shrink-0">
        Live Alerts
      </h3>
      {alerts.length > 0 ? (
        <ul className="space-y-px overflow-y-auto flex-1">
            {alerts.map(alert => <AlertItem key={alert.id} alert={alert} />)}
        </ul>
      ) : (
        <div className="p-4 text-center text-sm text-text-secondary">
          No active alerts.
        </div>
      )}
    </div>
  );
};

export default AlertsPanel;