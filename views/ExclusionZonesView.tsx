
import React, { useState } from 'react';
import { ExclusionZone } from '../types';
import Button from '../components/ui/Button';

// FIX: Add props for handling modal opening and data deletion, controlled by App.tsx.
interface ExclusionZonesViewProps {
  zones: ExclusionZone[];
  onAddZone: () => void;
  onEditZone: (zone: ExclusionZone) => void;
  onDeleteZone: (id: string) => void;
}

const ExclusionZonesView: React.FC<ExclusionZonesViewProps> = ({ zones, onAddZone, onEditZone, onDeleteZone }) => {
  // FIX: Remove local state management for zones and modals.
  
  return (
    <div className="p-6">
      <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h3 className="text-lg font-semibold text-text-primary">Exclusion Zones</h3>
          {/* FIX: Use onAddZone prop to trigger modal in parent. */}
          <Button onClick={onAddZone}>Create Zone</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-text-secondary">
            <thead className="text-xs text-text-secondary uppercase bg-background border-b border-border">
              <tr>
                <th scope="col" className="px-6 py-3">Name</th>
                <th scope="col" className="px-6 py-3">Type</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {zones.map((zone) => (
                <tr key={zone.id} className="bg-surface border-b border-border last:border-b-0">
                  <th scope="row" className="px-6 py-4 font-medium text-text-primary whitespace-nowrap">
                    {zone.name}
                  </th>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      zone.type === 'No-go' ? 'bg-danger/20 text-danger' : 'bg-warning/20 text-warning'
                    }`}>
                      {zone.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      {/* FIX: Use onEditZone and onDeleteZone props from parent. */}
                      <Button variant="secondary" onClick={() => onEditZone(zone)}>Edit</Button>
                      <Button variant="danger" onClick={() => onDeleteZone(zone.id)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExclusionZonesView;
