import dotenv from 'dotenv';
import sequelize, { testConnection, syncDatabase } from './database.js';
import * as SequelizeModels from '../models/sequelize/index.js';
import bcrypt from 'bcryptjs';

// Load environment variables
dotenv.config();

// Mock data structure based on the frontend mockData.ts
const MOCK_DATA = {
  users: [
    { id: 'U001', name: 'Alex Johnson', email: 'alex.j@example.com', role: 'Admin', password: 'password123', lastLogin: new Date(Date.now() - 86400000 * 1) },
    { id: 'U002', name: 'Maria Garcia', email: 'maria.g@example.com', role: 'Manager', password: 'password123', lastLogin: new Date(Date.now() - 86400000 * 2) },
    { id: 'U003', name: 'Chen Wei', email: 'chen.w@example.com', role: 'Team Lead', password: 'password123', lastLogin: new Date(Date.now() - 3600000 * 5) },
    { id: 'D001', name: 'John Smith', email: 'john.s@driver.com', role: 'Driver', password: 'password123', lastLogin: new Date(Date.now() - 3600000 * 1) },
    { id: 'D002', name: 'Emily White', email: 'emily.w@driver.com', role: 'Driver', password: 'password123', lastLogin: new Date(Date.now() - 3600000 * 2) },
    { id: 'D003', name: 'David Chen', email: 'david.c@driver.com', role: 'Driver', password: 'password123', lastLogin: new Date(Date.now() - 3600000 * 3) },
    { id: 'D004', name: 'Sarah Brown', email: 'sarah.b@driver.com', role: 'Driver', password: 'password123', lastLogin: new Date(Date.now() - 3600000 * 4) },
  ],
  vehicles: [
    { id: 'V001', name: 'Ford Transit', type: 'Van', licensePlate: 'CY 123-456', status: 'Active' },
    { id: 'V002', name: 'Toyota Hilux', type: 'Truck', licensePlate: 'CJ 789-012', status: 'Active' },
    { id: 'V003', name: 'Honda PCX', type: 'Scooter', licensePlate: 'CA 345-678', status: 'Active' },
    { id: 'V004', name: 'Ford Transit', type: 'Van', licensePlate: 'CY 901-234', status: 'Maintenance' },
    { id: 'V005', name: 'Honda PCX', type: 'Scooter', licensePlate: 'CA 567-890', status: 'Active' },
  ],
  geofences: [
    { 
      id: 'G001', 
      name: 'Sandton CBD', 
      coordinates: [
        { lat: -26.09, lng: 28.04 }, 
        { lat: -26.09, lng: 28.07 }, 
        { lat: -26.12, lng: 28.07 }, 
        { lat: -26.12, lng: 28.04 }
      ], 
      color: 'rgba(59, 130, 246, 0.2)' 
    },
    { 
      id: 'G002', 
      name: 'Rosebank District', 
      coordinates: [
        { lat: -26.13, lng: 28.03 }, 
        { lat: -26.13, lng: 28.05 }, 
        { lat: -26.15, lng: 28.05 }, 
        { lat: -26.15, lng: 28.03 }
      ], 
      color: 'rgba(16, 185, 129, 0.2)' 
    },
  ],
  hubs: [
    { id: 'H001', name: 'Sandton Central Hub', latitude: -26.1076, longitude: 28.0567, address: '8 Rivonia Rd, Sandton', geofenceId: 'G001' },
    { id: 'H002', name: 'Rosebank Hub', latitude: -26.1469, longitude: 28.0423, address: '50 Bath Ave, Rosebank', geofenceId: 'G002' },
  ],
  teams: [
    { id: 'T001', name: 'Sandton Eagles', hubId: 'H001', teamLeadId: 'U003' },
    { id: 'T002', name: 'Rosebank Rockets', hubId: 'H002', teamLeadId: 'U002' },
  ],
  drivers: [
    { 
      id: 'D001', 
      name: 'John Smith', 
      phone: '082-123-4567', 
      email: 'john.s@driver.com', 
      latitude: -26.105, 
      longitude: 28.05, 
      address: 'Near Sandton City', 
      status: 'Available', 
      vehicleId: 'V001', 
      teamId: 'T001', 
      points: 1250, 
      rank: 1,
      userId: 'D001'
    },
    { 
      id: 'D002', 
      name: 'Emily White', 
      phone: '083-234-5678', 
      email: 'emily.w@driver.com', 
      latitude: -26.14, 
      longitude: 28.04, 
      address: 'Rosebank Mall Area', 
      status: 'On Duty', 
      vehicleId: 'V003', 
      teamId: 'T002', 
      points: 1100, 
      rank: 2,
      userId: 'D002'
    },
    { 
      id: 'D003', 
      name: 'David Chen', 
      phone: '084-345-6789', 
      email: 'david.c@driver.com', 
      latitude: -26.11, 
      longitude: 28.06, 
      address: 'Morningside', 
      status: 'Available', 
      vehicleId: 'V002', 
      teamId: 'T001', 
      points: 980, 
      rank: 3,
      userId: 'D003'
    },
    { 
      id: 'D004', 
      name: 'Sarah Brown', 
      phone: '082-456-7890', 
      email: 'sarah.b@driver.com', 
      latitude: -26.15, 
      longitude: 28.03, 
      address: 'Parkhurst', 
      status: 'Offline', 
      vehicleId: 'V005', 
      teamId: 'T002', 
      points: 750, 
      rank: 4,
      userId: 'D004'
    },
  ],
  stores: [
    { 
      id: 'S001', 
      name: 'KFC - Sandton City', 
      latitude: -26.109, 
      longitude: 28.052, 
      address: '123 Maude St, Sandton', 
      manager: 'Alice Williams', 
      hubId: 'H001', 
      status: 'ONLINE' 
    },
    { 
      id: 'S002', 
      name: 'Nandos - Rosebank', 
      latitude: -26.145, 
      longitude: 28.041, 
      address: 'The Zone, Rosebank', 
      manager: 'Bob Miller', 
      hubId: 'H002', 
      status: 'ONLINE' 
    },
    { 
      id: 'S003', 
      name: 'Pedros - Morningside', 
      latitude: -26.106, 
      longitude: 28.055, 
      address: 'The Wedge, Morningside', 
      manager: 'Charlie Brown', 
      hubId: 'H001', 
      status: 'OFFLINE' 
    },
    { 
      id: 'S004', 
      name: 'Medirite Pharmacy - Sandton', 
      latitude: -26.108, 
      longitude: 28.054, 
      address: 'Benmore Centre, Sandton', 
      manager: 'Diana Prince', 
      hubId: 'H001', 
      status: 'ONLINE' 
    },
    { 
      id: 'S005', 
      name: 'Mr D Food - Rosebank Hub', 
      latitude: -26.146, 
      longitude: 28.043, 
      address: '52 Bath Ave, Rosebank', 
      manager: 'Edward Nigma', 
      hubId: 'H002', 
      status: 'ONLINE' 
    },
  ],
  exclusionZones: [
    { 
      id: 'EZ001', 
      name: 'M1 Highway Construction', 
      type: 'Slow-down', 
      coordinates: [
        { lat: -26.13, lng: 28.06 }, 
        { lat: -26.14, lng: 28.06 }, 
        { lat: -26.14, lng: 28.061 }, 
        { lat: -26.13, lng: 28.061 }
      ]
    },
  ],
  orders: [
    { 
      id: 'ORD001', 
      title: '#KFC-1023', 
      description: 'Streetwise 2, Zinger Wings', 
      customerName: 'Jane Doe', 
      customerPhone: '072-111-2222', 
      originLat: -26.109, 
      originLng: 28.052, 
      originAddress: '123 Maude St, Sandton', 
      destinationLat: -26.10, 
      destinationLng: 28.06, 
      destinationAddress: '100 Grayston Dr, Sandton', 
      status: 'In Progress', 
      priority: 'High', 
      orderType: 'DELIVERY', 
      driverId: 'D002', 
      vehicleId: 'V003', 
      storeId: 'S001', 
      createdAt: new Date(Date.now() - 3600000 * 0.5)
    },
    { 
      id: 'ORD002', 
      title: '#Nandos-589', 
      description: 'Full Chicken, Peri-Peri Fries', 
      customerName: 'Peter Jones', 
      customerPhone: '073-333-4444', 
      originLat: -26.145, 
      originLng: 28.041, 
      originAddress: 'The Zone, Rosebank', 
      destinationLat: -26.15, 
      destinationLng: 28.045, 
      destinationAddress: '25 Tyrwhitt Ave, Rosebank', 
      status: 'Unassigned', 
      priority: 'Urgent', 
      orderType: 'DELIVERY', 
      driverId: null, 
      vehicleId: null, 
      storeId: 'S002', 
      createdAt: new Date(Date.now() - 3600000 * 1)
    },
    { 
      id: 'ORD003', 
      title: '#Medirite-881', 
      description: 'Prescription Meds', 
      customerName: 'Susan Lee', 
      customerPhone: '074-555-6666', 
      originLat: -26.108, 
      originLng: 28.054, 
      originAddress: 'Benmore Centre, Sandton', 
      destinationLat: -26.09, 
      destinationLng: 28.05, 
      destinationAddress: '15 Alice Ln, Sandton', 
      status: 'Successful', 
      priority: 'Medium', 
      orderType: 'DELIVERY', 
      driverId: 'D001', 
      vehicleId: 'V001', 
      storeId: 'S003', 
      createdAt: new Date(Date.now() - 86400000 * 1)
    },
    { 
      id: 'ORD004', 
      title: '#Pedros-1024', 
      description: 'Half Chicken Meal', 
      customerName: 'Mike Brown', 
      customerPhone: '076-777-8888', 
      originLat: -26.106, 
      originLng: 28.055, 
      originAddress: 'The Wedge, Morningside', 
      destinationLat: -26.11, 
      destinationLng: 28.04, 
      destinationAddress: '22 Fredman Dr, Sandton', 
      status: 'Failed', 
      priority: 'Low', 
      orderType: 'DELIVERY', 
      driverId: 'D003', 
      vehicleId: 'V002', 
      storeId: 'S001', 
      createdAt: new Date(Date.now() - 86400000 * 2)
    },
  ],
  activityLogs: [
    { orderId: 'ORD001', status: 'Assigned', timestamp: new Date(Date.now() - 3600000 * 0.4) },
    { orderId: 'ORD001', status: 'At Store', timestamp: new Date(Date.now() - 3600000 * 0.3) },
    { orderId: 'ORD001', status: 'Picked Up', timestamp: new Date(Date.now() - 3600000 * 0.2) },
    { orderId: 'ORD001', status: 'In Progress', timestamp: new Date(Date.now() - 3600000 * 0.1) },
    { orderId: 'ORD002', status: 'Unassigned', timestamp: new Date(Date.now() - 3600000 * 1) },
  ],
  alerts: [
    { 
      id: 'A001', 
      type: 'Driver Delayed', 
      message: 'Driver D002 delayed by 15 mins for order #KFC-1023.', 
      priority: 'high', 
      timestamp: new Date(Date.now() - 60000 * 2) 
    },
    { 
      id: 'A002', 
      type: 'Low Coverage', 
      message: 'Low driver availability in Sandton CBD.', 
      priority: 'medium', 
      timestamp: new Date(Date.now() - 60000 * 5) 
    },
  ],
  challenges: [
    { 
      id: 'C001', 
      name: 'Weekend Warrior', 
      description: 'Complete 10 orders over the weekend.', 
      type: 'COMPLETE_ORDERS', 
      goal: 10, 
      points: 100, 
      isActive: true 
    },
    { 
      id: 'C002', 
      name: 'Perfect Week', 
      description: 'Achieve a 100% success rate for all orders in a week.', 
      type: 'SUCCESS_RATE', 
      goal: 100, 
      points: 250, 
      isActive: true 
    },
  ],
  driverChallenges: [
    { driverId: 'D001', challengeId: 'C001', progress: 7, isCompleted: false },
    { driverId: 'D002', challengeId: 'C001', progress: 9, isCompleted: false },
    { driverId: 'D002', challengeId: 'C002', progress: 95, isCompleted: false },
  ],
  webhooks: [
    { 
      id: 'WH001', 
      url: 'https://api.example.com/order-updates', 
      events: ['order.created', 'order.status_changed'], 
      isActive: true,
      secret: 'webhook_secret_1',
      createdBy: 'U001'
    },
    { 
      id: 'WH002', 
      url: 'https://api.example.com/driver-tracking', 
      events: ['driver.location_updated'], 
      isActive: false,
      secret: 'webhook_secret_2',
      createdBy: 'U001'
    },
  ],
  invoices: [
    { 
      id: 'INV-2024-001', 
      invoiceNumber: 'INV-2024-001',
      clientName: 'KFC - Sandton City', 
      amount: 15400, 
      tax: 0,
      totalAmount: 15400,
      dueDate: new Date(Date.now() + 86400000 * 15), 
      status: 'Pending',
      createdBy: 'U001'
    },
    { 
      id: 'INV-2024-002', 
      invoiceNumber: 'INV-2024-002',
      clientName: 'Nandos - Rosebank', 
      amount: 22800, 
      tax: 0,
      totalAmount: 22800,
      dueDate: new Date(Date.now() + 86400000 * 10), 
      status: 'Pending',
      createdBy: 'U001'
    },
    { 
      id: 'INV-2023-12-088', 
      invoiceNumber: 'INV-2023-12-088',
      clientName: 'Pedros - Morningside', 
      amount: 8900, 
      tax: 0,
      totalAmount: 8900,
      dueDate: new Date(Date.now() - 86400000 * 5), 
      status: 'Overdue',
      createdBy: 'U001'
    },
    { 
      id: 'INV-2023-12-087', 
      invoiceNumber: 'INV-2023-12-087',
      clientName: 'KFC - Sandton City', 
      amount: 14950, 
      tax: 0,
      totalAmount: 14950,
      dueDate: new Date(Date.now() - 86400000 * 20), 
      status: 'Paid',
      paymentDate: new Date(Date.now() - 86400000 * 15),
      createdBy: 'U001'
    },
  ],
};

// Function to seed the database
const seedDatabase = async () => {
  try {
    console.log('Testing database connection...');
    const connected = await testConnection();
    
    if (!connected) {
      console.error('Failed to connect to the database. Aborting seed operation.');
      return;
    }
    
    console.log('Syncing database models...');
    // Force true will drop tables before recreating them
    await syncDatabase(true);
    
    console.log('Seeding database with initial data...');
    
    // Seed users
    console.log('Seeding users...');
    for (const userData of MOCK_DATA.users) {
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      await SequelizeModels.User.create({
        ...userData,
        password: hashedPassword
      });
    }
    
    // Seed vehicles
    console.log('Seeding vehicles...');
    for (const vehicleData of MOCK_DATA.vehicles) {
      await SequelizeModels.Vehicle.create(vehicleData);
    }
    
    // Seed geofences
    console.log('Seeding geofences...');
    for (const geofenceData of MOCK_DATA.geofences) {
      await SequelizeModels.Geofence.create(geofenceData);
    }
    
    // Seed hubs
    console.log('Seeding hubs...');
    for (const hubData of MOCK_DATA.hubs) {
      await SequelizeModels.Hub.create(hubData);
    }
    
    // Seed teams
    console.log('Seeding teams...');
    for (const teamData of MOCK_DATA.teams) {
      await SequelizeModels.Team.create(teamData);
    }
    
    // Seed drivers
    console.log('Seeding drivers...');
    for (const driverData of MOCK_DATA.drivers) {
      await SequelizeModels.Driver.create(driverData);
    }
    
    // Seed stores
    console.log('Seeding stores...');
    for (const storeData of MOCK_DATA.stores) {
      await SequelizeModels.Store.create(storeData);
    }
    
    // Seed exclusion zones
    console.log('Seeding exclusion zones...');
    for (const zoneData of MOCK_DATA.exclusionZones) {
      await SequelizeModels.ExclusionZone.create(zoneData);
    }
    
    // Seed orders with hooks disabled to prevent automatic activity log creation
    console.log('Seeding orders...');
    for (const orderData of MOCK_DATA.orders) {
      // Create order with hooks disabled to prevent automatic activity log creation
      await SequelizeModels.Order.create(orderData, { hooks: false });
    }
    
    // Seed activity logs after orders are created
    console.log('Seeding activity logs...');
    for (const logData of MOCK_DATA.activityLogs) {
      try {
        await SequelizeModels.ActivityLog.create(logData);
      } catch (error) {
        console.error(`Error creating activity log for order ${logData.orderId}: ${error.message}`);
      }
    }
    
    // Seed alerts
    console.log('Seeding alerts...');
    for (const alertData of MOCK_DATA.alerts) {
      await SequelizeModels.Alert.create(alertData);
    }
    
    // Seed challenges
    console.log('Seeding challenges...');
    for (const challengeData of MOCK_DATA.challenges) {
      await SequelizeModels.Challenge.create(challengeData);
    }
    
    // Seed driver challenges
    console.log('Seeding driver challenges...');
    for (const driverChallengeData of MOCK_DATA.driverChallenges) {
      await SequelizeModels.DriverChallenge.create(driverChallengeData);
    }
    
    // Seed webhooks
    console.log('Seeding webhooks...');
    for (const webhookData of MOCK_DATA.webhooks) {
      await SequelizeModels.Webhook.create(webhookData);
    }
    
    // Seed invoices
    console.log('Seeding invoices...');
    for (const invoiceData of MOCK_DATA.invoices) {
      await SequelizeModels.Invoice.create(invoiceData);
    }
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the database connection
    await sequelize.close();
  }
};

// Run the seed function
seedDatabase();