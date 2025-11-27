import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Order, Driver, ExclusionZone } from '../../types';
import { getRouteOptimizationSuggestions } from '../../services/geminiService';

interface RouteOptimizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  drivers: Driver[];
  exclusionZones: ExclusionZone[];
}

const RouteOptimizerModal: React.FC<RouteOptimizerModalProps> = ({ isOpen, onClose, orders, drivers, exclusionZones }) => {
  const [optimizationResult, setOptimizationResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const unassignedOrders = orders.filter(o => o.status === 'Unassigned');
  const availableDrivers = drivers.filter(d => d.status === 'Available');

  const handleOptimize = async () => {
    setIsLoading(true);
    // In a real app, this would be a much more complex prompt or a dedicated tool call.
    // For this demo, we'll use a simplified prompt.
    const prompt = `
      Given ${unassignedOrders.length} unassigned orders and ${availableDrivers.length} available drivers, 
      provide a simple, high-level suggestion for assigning orders to drivers to optimize routes.
      Consider batching orders that are geographically close.
      Also be aware of these exclusion zones to avoid: ${exclusionZones.map(z => z.name).join(', ')}.
      
      Orders: ${unassignedOrders.map(o => `${o.title} at ${o.destination.address}`).join(', ')}
      Drivers: ${availableDrivers.map(d => `${d.name} at ${d.location.address}`).join(', ')}

      Provide a short, bulleted list of assignment suggestions. For example: "Assign Order A and B to Driver X".
    `;
    
    try {
      // FIX: Use the centralized geminiService instead of re-initializing the client here.
      const result = await getRouteOptimizationSuggestions(prompt);
      setOptimizationResult(result);
    } catch (error) {
      console.error("Error optimizing routes:", error);
      setOptimizationResult("Failed to get optimization suggestions from Gemini.");
    }

    setIsLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Route Optimizer">
      <div className="space-y-4">
        <p className="text-sm text-text-secondary">
          Analyze unassigned orders and available drivers to suggest the most efficient routes and assignments. This feature uses Gemini to provide intelligent recommendations.
        </p>
        <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-background p-3 rounded-lg">
                <p className="text-2xl font-bold">{unassignedOrders.length}</p>
                <p className="text-sm text-text-secondary">Unassigned Orders</p>
            </div>
             <div className="bg-background p-3 rounded-lg">
                <p className="text-2xl font-bold">{availableDrivers.length}</p>
                <p className="text-sm text-text-secondary">Available Drivers</p>
            </div>
        </div>
        
        {optimizationResult && (
            <div className="bg-background p-4 rounded-lg border border-border">
                <h4 className="font-semibold text-text-primary mb-2">Optimization Suggestion:</h4>
                <div className="text-sm text-text-secondary whitespace-pre-wrap">{optimizationResult}</div>
            </div>
        )}

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="button" onClick={handleOptimize} disabled={isLoading || unassignedOrders.length === 0}>
            {isLoading ? 'Optimizing...' : 'Get Suggestions'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RouteOptimizerModal;