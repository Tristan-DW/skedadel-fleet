import React from 'react';
import { Order } from '../../types';

interface StoreOrderTimingsProps {
  orders: Order[];
}

const StoreOrderTimings: React.FC<StoreOrderTimingsProps> = ({ orders }) => {
  // This is a placeholder component for more advanced analytics.
  // A real implementation would calculate average prep time, wait time, and delivery time.
  return (
    <div className="bg-surface border border-border rounded-lg shadow-sm p-4">
      <h3 className="text-lg font-semibold text-text-primary mb-2">Order Timings</h3>
      <p className="text-sm text-text-secondary">
        This section can be used to display analytics about average order lifecycle times,
        such as driver wait time at the store or average time to delivery.
      </p>
      {/* Example of what could be here: */}
      <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="p-3 bg-background rounded-lg">
              <p className="text-sm text-text-secondary">Avg. Driver Wait Time</p>
              <p className="text-xl font-bold">7.2 min</p>
          </div>
          <div className="p-3 bg-background rounded-lg">
              <p className="text-sm text-text-secondary">Avg. Time to Delivery</p>
              <p className="text-xl font-bold">28.5 min</p>
          </div>
      </div>
    </div>
  );
};

export default StoreOrderTimings;
