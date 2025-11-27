// Import all models
import User from './User.js';
import Driver from './Driver.js';
import Vehicle from './Vehicle.js';
import Team from './Team.js';
import Hub from './Hub.js';
import Store from './Store.js';
import Geofence from './Geofence.js';
import ExclusionZone from './ExclusionZone.js';
import { Order, OrderItem, ActivityLog } from './Order.js';
import Alert from './Alert.js';
import Challenge from './Challenge.js';
import DriverChallenge from './DriverChallenge.js';
import Webhook from './Webhook.js';
import { Invoice, LineItem } from './Invoice.js';

// Define associations
const setupAssociations = () => {
  // User associations
  User.hasOne(Driver, { foreignKey: 'userId', as: 'driver' });
  User.hasMany(Webhook, { foreignKey: 'createdBy', as: 'webhooks' });
  User.hasMany(Invoice, { foreignKey: 'createdBy', as: 'invoices' });
  
  // Driver associations
  Driver.belongsTo(User, { foreignKey: 'userId' });
  Driver.belongsTo(Vehicle, { foreignKey: 'vehicleId' });
  Driver.belongsTo(Team, { foreignKey: 'teamId' });
  Driver.hasMany(Order, { foreignKey: 'driverId', as: 'orders' });
  Driver.hasMany(DriverChallenge, { foreignKey: 'driverId', as: 'challenges' });
  
  // Vehicle associations
  Vehicle.hasMany(Driver, { foreignKey: 'vehicleId', as: 'drivers' });
  Vehicle.hasMany(Order, { foreignKey: 'vehicleId', as: 'orders' });
  
  // Team associations
  Team.belongsTo(Hub, { foreignKey: 'hubId' });
  Team.belongsTo(User, { foreignKey: 'teamLeadId', as: 'teamLead' });
  Team.hasMany(Driver, { foreignKey: 'teamId', as: 'drivers' });
  
  // Hub associations
  Hub.belongsTo(Geofence, { foreignKey: 'geofenceId' });
  Hub.hasMany(Team, { foreignKey: 'hubId', as: 'teams' });
  Hub.hasMany(Store, { foreignKey: 'hubId', as: 'stores' });
  
  // Store associations
  Store.belongsTo(Hub, { foreignKey: 'hubId' });
  Store.hasMany(Order, { foreignKey: 'storeId', as: 'orders' });
  Store.hasMany(Invoice, { foreignKey: 'storeId', as: 'invoices' });
  
  // Geofence associations
  Geofence.hasMany(Hub, { foreignKey: 'geofenceId', as: 'hubs' });
  
  // Order associations
  Order.belongsTo(Driver, { foreignKey: 'driverId', as: 'driver' });
  Order.belongsTo(Vehicle, { foreignKey: 'vehicleId', as: 'vehicle' });
  Order.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });
  Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'orderItems', onDelete: 'CASCADE' });
  Order.hasMany(ActivityLog, { foreignKey: 'orderId', as: 'activityLog', onDelete: 'CASCADE' });
  
  // OrderItem associations
  OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
  
  // ActivityLog associations
  ActivityLog.belongsTo(Order, { foreignKey: 'orderId' });
  
  // Challenge associations
  Challenge.hasMany(DriverChallenge, { foreignKey: 'challengeId', as: 'driverChallenges' });
  
  // DriverChallenge associations
  DriverChallenge.belongsTo(Driver, { foreignKey: 'driverId' });
  DriverChallenge.belongsTo(Challenge, { foreignKey: 'challengeId' });
  
  // Webhook associations
  Webhook.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
  
  // Invoice associations
  Invoice.belongsTo(Store, { foreignKey: 'storeId' });
  Invoice.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
  Invoice.hasMany(LineItem, { foreignKey: 'invoiceId', as: 'lineItems', onDelete: 'CASCADE' });
  
  // LineItem associations
  LineItem.belongsTo(Invoice, { foreignKey: 'invoiceId' });
  
  console.log('Model associations have been set up');
};

export default setupAssociations;