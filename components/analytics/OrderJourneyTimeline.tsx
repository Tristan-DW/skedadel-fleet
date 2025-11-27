import React from 'react';
import { Order, OrderStatus } from '../../types';

interface OrderJourneyTimelineProps {
  order: Order;
}

const journeySteps = [
  OrderStatus.ASSIGNED,
  OrderStatus.AT_STORE,
  OrderStatus.PICKED_UP,
  OrderStatus.IN_PROGRESS,
  OrderStatus.SUCCESSFUL,
];

const OrderJourneyTimeline: React.FC<OrderJourneyTimelineProps> = ({ order }) => {
  const currentStepIndex = journeySteps.indexOf(order.status);

  const getTimestampForStatus = (status: OrderStatus) => {
    const log = order.activityLog?.find(a => a.status === status);
    return log ? new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null;
  }

  return (
    <div className="flex items-start justify-between">
      {journeySteps.map((step, index) => {
        const timestamp = getTimestampForStatus(step);
        const isActive = !!timestamp || (order.status === step);
        const isCompleted = index < currentStepIndex || order.status === OrderStatus.SUCCESSFUL;
        const isFailed = order.status === OrderStatus.FAILED && journeySteps.indexOf(order.activityLog?.[order.activityLog.length - 2]?.status) >= index;

        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center text-center w-20">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300
                  ${isFailed ? 'bg-danger/20 border-danger text-danger' : ''}
                  ${isActive ? 'bg-primary/20 border-primary text-primary' : 'bg-surface border-border text-text-secondary'}
                `}
              >
                {isCompleted || isFailed ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d={isFailed ? "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" : "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"} clipRule="evenodd" />
                  </svg>
                ) : (
                  <span className="text-xs font-bold">{index + 1}</span>
                )}
              </div>
              <p className={`text-xs mt-2 font-medium ${isActive ? 'text-text-primary' : 'text-text-secondary'}`}>{step}</p>
              <p className="text-xs text-text-secondary">{timestamp}</p>
            </div>
            {index < journeySteps.length - 1 && (
              <div className={`flex-1 h-1 mt-4 mx-2 rounded-full ${isCompleted ? 'bg-primary' : 'bg-border'}`}></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default OrderJourneyTimeline;