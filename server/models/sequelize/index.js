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

// Import associations setup
import setupAssociations from './associations.js';

// Set up associations between models
setupAssociations();

// Export all models
export {
  User,
  Driver,
  Vehicle,
  Team,
  Hub,
  Store,
  Geofence,
  ExclusionZone,
  Order,
  OrderItem,
  ActivityLog,
  Alert,
  Challenge,
  DriverChallenge,
  Webhook,
  Invoice,
  LineItem
};