import { User, UserRole, Driver, DriverStatus, Vehicle, Team, Hub, Store, Geofence, ExclusionZone, Order, OrderStatus, OrderPriority, Alert, AlertType, Challenge, DriverChallenge, Webhook, Invoice } from './types';

const USERS: User[] = [
    { id: 'U001', name: 'Alex Johnson', email: 'alex.j@example.com', role: UserRole.ADMIN, lastLogin: new Date(Date.now() - 86400000 * 1).toISOString() },
    { id: 'U002', name: 'Maria Garcia', email: 'maria.g@example.com', role: UserRole.MANAGER, lastLogin: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: 'U003', name: 'Chen Wei', email: 'chen.w@example.com', role: UserRole.TEAM_LEAD, lastLogin: new Date(Date.now() - 3600000 * 5).toISOString() },
    { id: 'D001', name: 'John Smith', email: 'john.s@driver.com', role: UserRole.DRIVER, lastLogin: new Date(Date.now() - 3600000 * 1).toISOString() },
    { id: 'D002', name: 'Emily White', email: 'emily.w@driver.com', role: UserRole.DRIVER, lastLogin: new Date(Date.now() - 3600000 * 2).toISOString() },
];

const VEHICLES: Vehicle[] = [
    { id: 'V001', name: 'Ford Transit', type: 'Van', licensePlate: 'CY 123-456', status: 'Active' },
    { id: 'V002', name: 'Toyota Hilux', type: 'Truck', licensePlate: 'CJ 789-012', status: 'Active' },
    { id: 'V003', name: 'Honda PCX', type: 'Scooter', licensePlate: 'CA 345-678', status: 'Active' },
    { id: 'V004', name: 'Ford Transit', type: 'Van', licensePlate: 'CY 901-234', status: 'Maintenance' },
    { id: 'V005', name: 'Honda PCX', type: 'Scooter', licensePlate: 'CA 567-890', status: 'Active' },
];

const HUBS: Hub[] = [
    { id: 'H001', name: 'Sandton Central Hub', location: { lat: -26.1076, lng: 28.0567, address: '8 Rivonia Rd, Sandton' }, geofenceId: 'G001' },
    { id: 'H002', name: 'Rosebank Hub', location: { lat: -26.1469, lng: 28.0423, address: '50 Bath Ave, Rosebank' }, geofenceId: 'G002' },
];

const TEAMS: Team[] = [
    { id: 'T001', name: 'Sandton Eagles', hubId: 'H001', teamLeadId: 'U003' },
    { id: 'T002', name: 'Rosebank Rockets', hubId: 'H002', teamLeadId: 'U002' },
];

const DRIVERS: Driver[] = [
    { id: 'D001', name: 'John Smith', phone: '082-123-4567', email: 'john.s@driver.com', location: { lat: -26.105, lng: 28.05, address: 'Near Sandton City' }, status: DriverStatus.AVAILABLE, vehicleId: 'V001', teamId: 'T001', points: 1250, rank: 1 },
    { id: 'D002', name: 'Emily White', phone: '083-234-5678', email: 'emily.w@driver.com', location: { lat: -26.14, lng: 28.04, address: 'Rosebank Mall Area' }, status: DriverStatus.ON_DUTY, vehicleId: 'V003', teamId: 'T002', points: 1100, rank: 2 },
    { id: 'D003', name: 'David Chen', phone: '084-345-6789', email: 'david.c@driver.com', location: { lat: -26.11, lng: 28.06, address: 'Morningside' }, status: DriverStatus.AVAILABLE, vehicleId: 'V002', teamId: 'T001', points: 980, rank: 3 },
    { id: 'D004', name: 'Sarah Brown', phone: '082-456-7890', email: 'sarah.b@driver.com', location: { lat: -26.15, lng: 28.03, address: 'Parkhurst' }, status: DriverStatus.OFFLINE, vehicleId: 'V005', teamId: 'T002', points: 750, rank: 4 },
];

const STORES: Store[] = [
    { id: 'S001', name: 'KFC - Sandton City', location: { lat: -26.109, lng: 28.052, address: '123 Maude St, Sandton' }, manager: 'Alice Williams', hubId: 'H001', status: 'ONLINE' },
    { id: 'S002', name: 'Nandos - Rosebank', location: { lat: -26.145, lng: 28.041, address: 'The Zone, Rosebank' }, manager: 'Bob Miller', hubId: 'H002', status: 'ONLINE' },
    { id: 'S003', name: 'Pedros - Morningside', location: { lat: -26.106, lng: 28.055, address: 'The Wedge, Morningside' }, manager: 'Charlie Brown', hubId: 'H001', status: 'OFFLINE' },
    { id: 'S004', name: 'Medirite Pharmacy - Sandton', location: { lat: -26.108, lng: 28.054, address: 'Benmore Centre, Sandton' }, manager: 'Diana Prince', hubId: 'H001', status: 'ONLINE' },
    { id: 'S005', name: 'Mr D Food - Rosebank Hub', location: { lat: -26.146, lng: 28.043, address: '52 Bath Ave, Rosebank' }, manager: 'Edward Nigma', hubId: 'H002', status: 'ONLINE' },
];

const GEOFENCES: Geofence[] = [
    { id: 'G001', name: 'Sandton CBD', coordinates: [{ lat: -26.09, lng: 28.04 }, { lat: -26.09, lng: 28.07 }, { lat: -26.12, lng: 28.07 }, { lat: -26.12, lng: 28.04 }], color: 'rgba(59, 130, 246, 0.2)' },
    { id: 'G002', name: 'Rosebank District', coordinates: [{ lat: -26.13, lng: 28.03 }, { lat: -26.13, lng: 28.05 }, { lat: -26.15, lng: 28.05 }, { lat: -26.15, lng: 28.03 }], color: 'rgba(16, 185, 129, 0.2)' },
];

const EXCLUSION_ZONES: ExclusionZone[] = [
    { id: 'EZ001', name: 'M1 Highway Construction', type: 'Slow-down', coordinates: [{ lat: -26.13, lng: 28.06 }, { lat: -26.14, lng: 28.06 }, { lat: -26.14, lng: 28.061 }, { lat: -26.13, lng: 28.061 }] },
];

const ORDERS: Order[] = [
    { id: 'ORD001', title: '#KFC-1023', description: 'Streetwise 2, Zinger Wings', customerName: 'Jane Doe', customerPhone: '072-111-2222', origin: STORES[0].location, destination: { lat: -26.10, lng: 28.06, address: '100 Grayston Dr, Sandton' }, status: OrderStatus.IN_PROGRESS, priority: OrderPriority.HIGH, orderType: 'DELIVERY', driverId: 'D002', vehicleId: 'V003', storeId: 'S001', createdAt: new Date(Date.now() - 3600000 * 0.5).toISOString(), orderItems: [], activityLog: [{status: OrderStatus.ASSIGNED, timestamp: new Date(Date.now() - 3600000 * 0.4).toISOString()}, {status: OrderStatus.AT_STORE, timestamp: new Date(Date.now() - 3600000 * 0.3).toISOString()}, {status: OrderStatus.PICKED_UP, timestamp: new Date(Date.now() - 3600000 * 0.2).toISOString()}, {status: OrderStatus.IN_PROGRESS, timestamp: new Date(Date.now() - 3600000 * 0.1).toISOString()}] },
    { id: 'ORD002', title: '#Nandos-589', description: 'Full Chicken, Peri-Peri Fries', customerName: 'Peter Jones', customerPhone: '073-333-4444', origin: STORES[1].location, destination: { lat: -26.15, lng: 28.045, address: '25 Tyrwhitt Ave, Rosebank' }, status: OrderStatus.UNASSIGNED, priority: OrderPriority.URGENT, orderType: 'DELIVERY', driverId: null, vehicleId: null, storeId: 'S002', createdAt: new Date(Date.now() - 3600000 * 1).toISOString(), orderItems: [], activityLog: [{ status: OrderStatus.UNASSIGNED, timestamp: new Date(Date.now() - 3600000 * 1).toISOString()}] },
    { id: 'ORD003', title: '#Medirite-881', description: 'Prescription Meds', customerName: 'Susan Lee', customerPhone: '074-555-6666', origin: STORES[3].location, destination: { lat: -26.09, lng: 28.05, address: '15 Alice Ln, Sandton' }, status: OrderStatus.SUCCESSFUL, priority: OrderPriority.MEDIUM, orderType: 'DELIVERY', driverId: 'D001', vehicleId: 'V001', storeId: 'S003', createdAt: new Date(Date.now() - 86400000 * 1).toISOString(), orderItems: [], activityLog: [] },
    { id: 'ORD004', title: '#Pedros-1024', description: 'Half Chicken Meal', customerName: 'Mike Brown', customerPhone: '076-777-8888', origin: STORES[2].location, destination: { lat: -26.11, lng: 28.04, address: '22 Fredman Dr, Sandton' }, status: OrderStatus.FAILED, priority: OrderPriority.LOW, orderType: 'DELIVERY', driverId: 'D003', vehicleId: 'V002', storeId: 'S001', createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), orderItems: [], activityLog: [] },
];

const ALERTS: Alert[] = [
    { id: 'A001', type: AlertType.DRIVER_DELAYED, message: 'Driver D002 delayed by 15 mins for order #KFC-1023.', priority: 'high', timestamp: new Date(Date.now() - 60000 * 2).toISOString() },
    { id: 'A002', type: AlertType.LOW_COVERAGE, message: 'Low driver availability in Sandton CBD.', priority: 'medium', timestamp: new Date(Date.now() - 60000 * 5).toISOString() },
];

export const MOCK_ALERT_POOL: Omit<Alert, 'id' | 'timestamp'>[] = [
    { type: AlertType.DRIVER_DELAYED, message: `Driver ${DRIVERS[1].name} is experiencing unexpected traffic.`, priority: 'medium' },
    { type: AlertType.ORDER_FAILED, message: `Order #Nandos-588 failed: Customer unavailable.`, priority: 'high' },
    { type: AlertType.LOW_COVERAGE, message: 'Low driver availability in Rosebank District.', priority: 'medium'},
    { type: AlertType.ORDER_STATUS_UPDATED, message: `Order ${ORDERS[0].title} status changed to 'At Store'.`, priority: 'low'},
    { type: AlertType.ENTERED_EXCLUSION_ZONE, message: `Driver ${DRIVERS[2].name} entered zone 'M1 Highway Construction'.`, priority: 'high'},
    { type: AlertType.CHALLENGE_COMPLETED, message: `${DRIVERS[0].name} completed the 'Weekend Warrior' challenge!`, priority: 'low'},
];

const CHALLENGES: Challenge[] = [
    { id: 'C001', name: 'Weekend Warrior', description: 'Complete 10 orders over the weekend.', type: 'COMPLETE_ORDERS', goal: 10, points: 100, isActive: true },
    { id: 'C002', name: 'Perfect Week', description: 'Achieve a 100% success rate for all orders in a week.', type: 'SUCCESS_RATE', goal: 100, points: 250, isActive: true },
];

const DRIVER_CHALLENGES: DriverChallenge[] = [
    { driverId: 'D001', challengeId: 'C001', progress: 7 },
    { driverId: 'D002', challengeId: 'C001', progress: 9 },
    { driverId: 'D002', challengeId: 'C002', progress: 95 },
];

const WEBHOOKS: Webhook[] = [
    { id: 'WH001', url: 'https://api.example.com/order-updates', events: ['order.created', 'order.status_changed'], isActive: true },
    { id: 'WH002', url: 'https://api.example.com/driver-tracking', events: ['driver.location_updated'], isActive: false },
]

const INVOICES: Invoice[] = [
    { id: 'INV-2024-001', clientName: 'KFC - Sandton City', amount: 15400, dueDate: new Date(Date.now() + 86400000 * 15).toISOString(), status: 'Pending' },
    { id: 'INV-2024-002', clientName: 'Nandos - Rosebank', amount: 22800, dueDate: new Date(Date.now() + 86400000 * 10).toISOString(), status: 'Pending' },
    { id: 'INV-2023-12-088', clientName: 'Pedros - Morningside', amount: 8900, dueDate: new Date(Date.now() - 86400000 * 5).toISOString(), status: 'Overdue' },
    { id: 'INV-2023-12-087', clientName: 'KFC - Sandton City', amount: 14950, dueDate: new Date(Date.now() - 86400000 * 20).toISOString(), status: 'Paid' },
];

export const MOCK_DATA = {
    users: USERS,
    drivers: DRIVERS,
    vehicles: VEHICLES,
    teams: TEAMS,
    hubs: HUBS,
    stores: STORES,
    geofences: GEOFENCES,
    exclusionZones: EXCLUSION_ZONES,
    orders: ORDERS,
    alerts: ALERTS,
    challenges: CHALLENGES,
    driverChallenges: DRIVER_CHALLENGES,
    webhooks: WEBHOOKS,
    invoices: INVOICES,
};