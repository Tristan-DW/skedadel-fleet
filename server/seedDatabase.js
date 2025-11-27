import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import { connectDB as connectMongoDB } from './config/db.js';
import sequelize, { testConnection as testSequelizeConnection, syncDatabase } from './config/database.js';
import { MOCK_DATA } from '../mockData.js';

// Load environment variables
dotenv.config();

// Database configuration
const USE_SQL_DATABASE = process.env.USE_SQL_DATABASE === 'true';

// Import models based on database type
let UserModel, DriverModel, VehicleModel, TeamModel, HubModel, StoreModel,
  GeofenceModel, ExclusionZoneModel, OrderModel, AlertModel, ChallengeModel,
  DriverChallengeModel, WebhookModel, InvoiceModel;

if (USE_SQL_DATABASE) {
  // Import SQL models
  const models = await import('./models/sequelize/index.js');
  ({
    User: UserModel,
    Driver: DriverModel,
    Vehicle: VehicleModel,
    Team: TeamModel,
    Hub: HubModel,
    Store: StoreModel,
    Geofence: GeofenceModel,
    ExclusionZone: ExclusionZoneModel,
    Order: OrderModel,
    Alert: AlertModel,
    Challenge: ChallengeModel,
    DriverChallenge: DriverChallengeModel,
    Webhook: WebhookModel,
    Invoice: InvoiceModel
  } = models);
} else {
  // Import MongoDB models
  UserModel = (await import('./models/userModel.js')).default;
  DriverModel = (await import('./models/driverModel.js')).default;
  VehicleModel = (await import('./models/vehicleModel.js')).default;
  TeamModel = (await import('./models/teamModel.js')).default;
  HubModel = (await import('./models/hubModel.js')).default;
  StoreModel = (await import('./models/storeModel.js')).default;
  GeofenceModel = (await import('./models/geofenceModel.js')).default;
  ExclusionZoneModel = (await import('./models/exclusionZoneModel.js')).default;
  OrderModel = (await import('./models/orderModel.js')).default;
  AlertModel = (await import('./models/alertModel.js')).default;
  ChallengeModel = (await import('./models/challengeModel.js')).default;
  DriverChallengeModel = (await import('./models/driverChallengeModel.js')).default;
  WebhookModel = (await import('./models/webhookModel.js')).default;
  InvoiceModel = (await import('./models/invoiceModel.js')).default;
}

// Connect to the appropriate database
async function connectToDatabase() {
  if (USE_SQL_DATABASE) {
    console.log('Using SQL database (MySQL with Sequelize)');
    const connected = await testSequelizeConnection();
    if (connected) {
      // Sync all models with the database with force: true to drop tables and recreate them
      await syncDatabase(true);
      return true;
    }
    return false;
  } else {
    console.log('Using NoSQL database (MongoDB)');
    await connectMongoDB();
    // Clear all collections
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
    return true;
  }
}

// Seed the database with mock data
async function seedDatabase() {
  try {
    // Connect to the database
    const connected = await connectToDatabase();
    if (!connected) {
      console.error('Failed to connect to the database');
      process.exit(1);
    }

    console.log('Connected to the database. Starting to seed data...');

    // Seed users
    console.log('Seeding users...');
    const users = await Promise.all(
      MOCK_DATA.users.map(user => UserModel.create(user))
    );
    console.log(`${users.length} users seeded`);

    // Seed vehicles
    console.log('Seeding vehicles...');
    const vehicles = await Promise.all(
      MOCK_DATA.vehicles.map(vehicle => VehicleModel.create(vehicle))
    );
    console.log(`${vehicles.length} vehicles seeded`);

    // Seed geofences
    console.log('Seeding geofences...');
    const geofences = await Promise.all(
      MOCK_DATA.geofences.map(geofence => GeofenceModel.create(geofence))
    );
    console.log(`${geofences.length} geofences seeded`);

    // Seed hubs
    console.log('Seeding hubs...');
    const hubs = await Promise.all(
      MOCK_DATA.hubs.map(hub => HubModel.create(hub))
    );
    console.log(`${hubs.length} hubs seeded`);

    // Seed teams
    console.log('Seeding teams...');
    const teams = await Promise.all(
      MOCK_DATA.teams.map(team => TeamModel.create(team))
    );
    console.log(`${teams.length} teams seeded`);

    // Seed drivers
    console.log('Seeding drivers...');
    const drivers = await Promise.all(
      MOCK_DATA.drivers.map(driver => DriverModel.create(driver))
    );
    console.log(`${drivers.length} drivers seeded`);

    // Seed stores
    console.log('Seeding stores...');
    const stores = await Promise.all(
      MOCK_DATA.stores.map(store => StoreModel.create(store))
    );
    console.log(`${stores.length} stores seeded`);

    // Seed exclusion zones
    console.log('Seeding exclusion zones...');
    const exclusionZones = await Promise.all(
      MOCK_DATA.exclusionZones.map(zone => ExclusionZoneModel.create(zone))
    );
    console.log(`${exclusionZones.length} exclusion zones seeded`);

    // Seed orders (without activity logs initially)
    console.log('Seeding orders...');
    const orders = await Promise.all(
      MOCK_DATA.orders.map(order => {
        const { activityLog, ...orderData } = order;
        return OrderModel.create(orderData);
      })
    );
    console.log(`${orders.length} orders seeded`);

    // Now seed activity logs for orders
    if (USE_SQL_DATABASE) {
      console.log('Seeding activity logs...');
      const ActivityLog = (await import('./models/sequelize/Order.js')).ActivityLog;
      let activityLogCount = 0;
      for (const order of MOCK_DATA.orders) {
        if (order.activityLog && order.activityLog.length > 0) {
          await Promise.all(
            order.activityLog.map(log =>
              ActivityLog.create({
                orderId: order.id,
                status: log.status,
                timestamp: log.timestamp
              })
            )
          );
          activityLogCount += order.activityLog.length;
        }
      }
      console.log(`${activityLogCount} activity logs seeded`);
    }

    // Seed alerts
    console.log('Seeding alerts...');
    const alerts = await Promise.all(
      MOCK_DATA.alerts.map(alert => AlertModel.create(alert))
    );
    console.log(`${alerts.length} alerts seeded`);

    // Seed challenges
    console.log('Seeding challenges...');
    const challenges = await Promise.all(
      MOCK_DATA.challenges.map(challenge => ChallengeModel.create(challenge))
    );
    console.log(`${challenges.length} challenges seeded`);

    // Seed driver challenges
    console.log('Seeding driver challenges...');
    const driverChallenges = await Promise.all(
      MOCK_DATA.driverChallenges.map(dc => DriverChallengeModel.create(dc))
    );
    console.log(`${driverChallenges.length} driver challenges seeded`);

    // Seed webhooks
    console.log('Seeding webhooks...');
    const webhooks = await Promise.all(
      MOCK_DATA.webhooks.map(webhook => WebhookModel.create(webhook))
    );
    console.log(`${webhooks.length} webhooks seeded`);

    // Seed invoices
    console.log('Seeding invoices...');
    const invoices = await Promise.all(
      MOCK_DATA.invoices.map(invoice => InvoiceModel.create(invoice))
    );
    console.log(`${invoices.length} invoices seeded`);

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeder
seedDatabase();