import React from 'react';
import Drawer from '../ui/Drawer';
import { Order, Driver, Store } from '../../types';
import { ICONS } from '../../constants';
import OrderJourneyTimeline from '../analytics/OrderJourneyTimeline';

interface OrderDetailsDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order | null;
    driver: Driver | undefined | null;
    store: Store | undefined | null;
    drivers?: Driver[];
    onAssignDriver?: (orderId: string, driverId: string) => void;
}

const DetailItem: React.FC<{ icon?: React.ReactNode, label: string, value: React.ReactNode }> = ({ icon, label, value }) => (
    <div className="flex items-start space-x-3">
        {icon && <div className="flex-shrink-0 text-text-secondary w-5 h-5 mt-0.5">{icon}</div>}
        <div>
            <p className="text-sm text-text-secondary">{label}</p>
            <p className="font-medium text-text-primary">{value || 'N/A'}</p>
        </div>
    </div>
);

const OrderDetailsDrawer: React.FC<OrderDetailsDrawerProps> = ({ isOpen, onClose, order, driver, store, onUpdateStatus, drivers, onAssignDriver }) => {
    if (!order) return null;

    return (
        <Drawer isOpen={isOpen} onClose={onClose} title={`Order Details: ${order.title}`}>
            <div className="space-y-6">
                <div className="p-4 bg-background rounded-lg border border-border grid grid-cols-2 gap-4">
                    {onUpdateStatus ? (
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 text-text-secondary w-5 h-5 mt-0.5">{ICONS.dashboard}</div>
                            <div className="flex-1">
                                <p className="text-sm text-text-secondary">Status</p>
                                <select
                                    value={order.status}
                                    onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                                    className="mt-1 block w-full bg-surface border-border rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-text-primary"
                                >
                                    {['Unassigned', 'Assigned', 'At Store', 'Picked Up', 'In Progress', 'Successful', 'Failed'].map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ) : (
                        <DetailItem icon={ICONS.dashboard} label="Status" value={order.status} />
                    )}
                    <DetailItem icon={ICONS.alert} label="Priority" value={order.priority} />
                    <DetailItem icon={ICONS.orders} label="Type" value={order.orderType} />
                    <DetailItem icon={ICONS.settings} label="Created At" value={new Date(order.createdAt).toLocaleString()} />
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-text-primary border-b border-border pb-2 mb-4">Journey Timeline</h3>
                    <OrderJourneyTimeline order={order} />
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-text-primary border-b border-border pb-2">Customer & Route</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DetailItem icon={ICONS.teams} label="Customer Name" value={order.customerName} />
                        <DetailItem icon={ICONS.bell} label="Customer Phone" value={order.customerPhone} />
                        <DetailItem icon={ICONS.stores} label="Origin (Store)" value={store?.name} />
                        <DetailItem icon={ICONS.hubs} label="Destination" value={order.destination?.address || order.destinationAddress || 'Unknown'} />
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-text-primary border-b border-border pb-2">Assignment</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {onAssignDriver && drivers ? (
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 text-text-secondary w-5 h-5 mt-0.5">{ICONS.drivers}</div>
                                <div className="flex-1">
                                    <p className="text-sm text-text-secondary">Assigned Driver</p>
                                    <select
                                        value={order.driverId || ''}
                                        onChange={(e) => onAssignDriver(order.id, e.target.value)}
                                        className="mt-1 block w-full bg-surface border-border rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-text-primary"
                                    >
                                        <option value="">Select Driver</option>
                                        {drivers.map(d => (
                                            <option key={d.id} value={d.id}>{d.name} ({d.status})</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        ) : (
                            <DetailItem icon={ICONS.drivers} label="Assigned Driver" value={driver?.name} />
                        )}
                        <DetailItem icon={ICONS.api} label="Vehicle ID" value={order.vehicleId} />
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-text-primary border-b border-border pb-2">Order Items</h3>
                    {order.orderItems?.length > 0 ? (
                        <ul className="list-disc list-inside bg-background p-3 rounded-md border border-border">
                            {order.orderItems?.map(item => (
                                <li key={item.id}>{item.name} x {item.quantity}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-text-secondary">No items listed for this order.</p>
                    )}
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-text-primary border-b border-border pb-2">Notes</h3>
                    <p className="text-text-secondary p-3 bg-background rounded-lg border border-border">
                        {order.description || "No special instructions for this order."}
                    </p>
                </div>

            </div>
        </Drawer>
    );
};

export default OrderDetailsDrawer;