export interface LatLng {
  lat: number;
  lng: number;
  address?: string;
}

export enum OrderStatus {
  UNASSIGNED = 'Unassigned',
  ASSIGNED = 'Assigned',
  AT_STORE = 'At Store',
  PICKED_UP = 'Picked Up',
  IN_PROGRESS = 'In Progress',
  SUCCESSFUL = 'Successful',
  FAILED = 'Failed',
}

export enum OrderPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  URGENT = 'Urgent',
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
}

export interface ActivityLog {
  status: OrderStatus;
  timestamp: string;
}

export interface Order {
  id: string;
  title: string;
  description: string;
  customerName: string;
  customerPhone: string;
  origin: LatLng;
  destination: LatLng;
  destinationAddress?: string;
  status: OrderStatus;
  priority: OrderPriority;
  orderType: 'PICKUP' | 'DELIVERY';
  driverId: string | null;
  vehicleId: string | null;
  storeId: string;
  createdAt: string;
  orderItems: OrderItem[];
  activityLog: ActivityLog[];
}

export enum DriverStatus {
  ON_DUTY = 'On Duty',
  AVAILABLE = 'Available',
  OFFLINE = 'Offline',
  MAINTENANCE = 'Maintenance',
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  location: LatLng;
  status: DriverStatus;
  vehicleId: string;
  teamId: string;
  points: number;
  rank: number;
}

export interface Store {
  id: string;
  name: string;
  location: LatLng;
  manager: string;
  hubId: string;
  status: 'ONLINE' | 'OFFLINE';
}

export enum AlertType {
  DRIVER_DELAYED = 'Driver Delayed',
  ORDER_FAILED = 'Order Failed',
  LOW_COVERAGE = 'Low Coverage',
  ORDER_STATUS_UPDATED = 'Order Status Updated',
  ENTERED_EXCLUSION_ZONE = 'Entered Exclusion Zone',
  CHALLENGE_COMPLETED = 'Challenge Completed',
}

export interface Alert {
  id: string;
  type: AlertType;
  message: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
}

export enum UserRole {
  ADMIN = 'Admin',
  MANAGER = 'Manager',
  TEAM_LEAD = 'Team Lead',
  DRIVER = 'Driver',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  lastLogin: string;
}

export type ViewType =
  | 'dashboard'
  | 'orders'
  | 'drivers'
  | 'stores'
  | 'teams'
  | 'hubs'
  | 'geofences'
  | 'exclusion_zones'
  | 'analytics'
  | 'challenges'
  | 'live_chat'
  | 'settings'
  | 'api_docs'
  | 'api_tester'
  | 'integrations'
  | 'financials'
  | 'driver_dashboard'
  | 'driver_detail'
  | 'store_detail'
  | 'team_detail'
  | 'hub_detail'
  | 'analytics_hub_detail'
  | 'analytics_team_detail'
  | 'analytics_driver_detail'
  | 'analytics_store_detail';


export interface Team {
  id: string;
  name: string;
  hubId: string;
  teamLeadId: string;
}

export interface Vehicle {
  id: string;
  name: string;
  type: string;
  licensePlate: string;
  status: 'Active' | 'Maintenance' | 'Decommissioned';
}

export interface Hub {
  id: string;
  name: string;
  location: LatLng;
  geofenceId: string;
}

export interface Geofence {
  id: string;
  name: string;
  coordinates: LatLng[];
  color: string;
}

export interface ExclusionZone {
  id: string;
  name: string;
  coordinates: LatLng[];
  type: 'No-go' | 'Slow-down';
}

export type ChallengeType = 'COMPLETE_ORDERS' | 'SUCCESS_RATE' | 'ON_TIME_DELIVERIES';

export interface Challenge {
  id: string;
  name: string;
  description: string;
  type: ChallengeType;
  goal: number;
  points: number;
  isActive: boolean;
}

export interface DriverChallenge {
  driverId: string;
  challengeId: string;
  progress: number;
}

export type WebhookEvent = 'order.created' | 'order.status_changed' | 'driver.status_changed' | 'driver.location_updated';

export interface Webhook {
  id: string;
  url: string;
  events: WebhookEvent[];
  isActive: boolean;
}

export interface Invoice {
  id: string;
  clientName: string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue';
}