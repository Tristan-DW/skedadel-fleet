import React from 'react';
import { Order, OrderStatus, Driver, User } from '../types';
import { ICONS } from '../constants';
import Button from '../components/ui/Button';
import UserSwitcher from '../components/layout/UserSwitcher';

interface DriverDashboardProps {
  driver: Driver;
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onSwitchUser: (user: User) => void;
  allUsers: User[];
}

const OrderCard: React.FC<{ order: Order; onUpdateStatus: (orderId: string, status: OrderStatus) => void; }> = ({ order, onUpdateStatus }) => {
  const getNextStatus = (): OrderStatus | null => {
    switch (order.status) {
      case OrderStatus.ASSIGNED:
        return OrderStatus.AT_STORE;
      case OrderStatus.AT_STORE:
        return OrderStatus.PICKED_UP;
      case OrderStatus.PICKED_UP:
        return OrderStatus.IN_PROGRESS;
      case OrderStatus.IN_PROGRESS:
        return OrderStatus.SUCCESSFUL;
      default:
        return null;
    }
  };

  const nextStatus = getNextStatus();

  return (
    <div className="bg-surface border border-border rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg text-text-primary">{order.title}</h3>
          <p className="text-sm text-text-secondary">To: {order.destination?.address || 'Unknown Destination'}</p>
        </div>
        <span className="text-sm font-semibold text-primary">{order.status}</span>
      </div>
      <div>
        <h4 className="font-semibold text-text-primary text-sm">Order Items:</h4>
        <ul className="list-disc list-inside text-text-secondary text-sm">
          {order.orderItems?.map((item, index) => (
            <li key={index}>{item.name} x {item.quantity}</li>
          ))}
        </ul>
      </div>
      {nextStatus && (
        <Button onClick={() => onUpdateStatus(order.id, nextStatus)} className="w-full">
          {
            {
              [OrderStatus.AT_STORE]: "I'm at the Store",
              [OrderStatus.PICKED_UP]: "I've Picked Up the Order",
              [OrderStatus.IN_PROGRESS]: "Start Delivery",
              [OrderStatus.SUCCESSFUL]: "Complete Delivery",
            }[nextStatus]
          }
        </Button>
      )}
      {order.status === OrderStatus.SUCCESSFUL && (
        <p className="text-center text-success font-semibold">Order Delivered!</p>
      )}
    </div>
  );
};

const DriverDashboard: React.FC<DriverDashboardProps> = ({ driver, orders, onUpdateStatus, onSwitchUser, allUsers }) => {
  return (
    <div className="min-h-screen bg-background text-text-primary p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Welcome, {driver.name.split(' ')[0]}</h1>
            <p className="text-text-secondary">Here are your assigned orders for today.</p>
          </div>
          <div className="w-48">
            <UserSwitcher currentUser={driver as unknown as User} allUsers={allUsers} setCurrentUser={onSwitchUser} />
          </div>
        </header>

        <main className="space-y-4">
          {orders.length > 0 ? (
            orders
              .filter(o => o.status !== OrderStatus.SUCCESSFUL && o.status !== OrderStatus.FAILED)
              .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
              .map(order => <OrderCard key={order.id} order={order} onUpdateStatus={onUpdateStatus} />)
          ) : (
            <div className="text-center py-16 bg-surface rounded-lg">
              <div className="mx-auto h-16 w-16 text-text-secondary">{ICONS.orders}</div>
              <h3 className="mt-4 text-xl font-medium text-text-primary">No Active Orders</h3>
              <p className="mt-1 text-text-secondary">You have no assigned orders right now. Check back soon!</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DriverDashboard;
