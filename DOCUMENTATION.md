# Skedadel Fleet Management System Documentation

This document consolidates all the documentation for the Skedadel Fleet Management System, including fixes, improvements, and configuration details.

## Table of Contents

1. [System Overview](#system-overview)
2. [Database Configuration](#database-configuration)
3. [Service Method Fixes](#service-method-fixes)
4. [Database Fixes](#database-fixes)
5. [Performance Improvements](#performance-improvements)
6. [Production Readiness](#production-readiness)

## System Overview

The Skedadel Fleet Management System is a comprehensive solution for last-mile delivery operations. It provides real-time tracking, order management, driver assignment, geofencing, and analytics capabilities.

For a complete overview of the system, please refer to the [README.md](README.md) file.

## Database Configuration

### SQL-Only Configuration

The application has been configured to use MySQL exclusively as the database. MongoDB support has been disabled.

The application uses the following environment variables for database selection and configuration:

```
# Database selection (true = MySQL, false = MongoDB)
USE_SQL_DATABASE=true

# MySQL configuration
DB_HOST=195.35.53.7
DB_PORT=3306
DB_NAME=u682067506_fleet_system
DB_USER=u682067506_fleet_system
DB_PASSWORD=5napu6cLX|x
```

The MySQL connection is configured in `server/config/database.js` with the following settings:

- **Connection Timeout**: 60 seconds (60000ms)
- **Query Timeout**: 60 seconds (60000ms)
- **Connection Pool**:
  - Maximum connections: 10
  - Minimum connections: 2
  - Acquire timeout: 60 seconds (60000ms)
  - Idle timeout: 20 seconds (20000ms)

These settings provide robust timeout values that should prevent connection and query timeout issues.

### MongoDB Configuration (Legacy)

> **IMPORTANT NOTE**: This configuration is no longer relevant as the application has been configured to use MySQL exclusively.

The application was previously experiencing MongoDB operation timeouts with the following error:

```
Operation `[collection].find()` buffering timed out after 10000ms
```

This error was occurring for multiple collections, including:
- `alerts.find()`
- `orders.find()`
- `drivers.find()`

The root cause of the issue was that MongoDB operations were taking longer than the default timeout of 10000ms (10 seconds).

The MongoDB connection in `server/config/db.js` was modified to increase the timeout values:

```javascript
// Set MongoDB connection options with increased timeouts
const options = {
  serverSelectionTimeoutMS: 60000, // Increase from default 30000ms to 60000ms
  socketTimeoutMS: 45000, // Increase from default 30000ms to 45000ms
  // Increase operation timeout from default 10000ms to 30000ms
  // This addresses the "Operation buffering timed out after 10000ms" errors
  maxTimeMS: 30000
};

const conn = await mongoose.connect(process.env.MONGO_URI, options);
```

## Service Method Fixes

### Order Service Fix

The application was encountering the following error:

```
App.tsx:182  Error fetching data: TypeError: OrderService.getAllOrders is not a function
    at fetchAllData (App.tsx:144:34)
```

The root cause was an inconsistency in the naming conventions across service files:

- UserService had a method called `getAllUsers()` that returned an array of users.
- OrderService had a method called `getOrders()` that returned a paginated response with a data array.

To fix the issue, the following method was added to OrderService:

```javascript
// Get all orders without filtering (for compatibility with other services)
static async getAllOrders(): Promise<Order[]> {
  const response = await this.getOrders();
  return response.data;
}
```

### Alert Service Fix

The application was encountering the following error:

```
App.tsx:205  Error fetching alerts: TypeError: AlertService.getAllAlerts is not a function
    at fetchNewAlerts (App.tsx:195:57)
```

To fix the issue, the following method was added to AlertService:

```javascript
// Get all alerts without filtering (for compatibility with other services)
static async getAllAlerts(): Promise<Alert[]> {
  const response = await this.getAlerts();
  return response.data;
}
```

### Driver Challenge Service Fix

The application was encountering the following error:

```
App.tsx:182  Error fetching data: TypeError: ChallengeService.getAllDriverChallenges is not a function
    at fetchAllData (App.tsx:153:38)
```

To fix the issue, the following method was added to ChallengeService:

```typescript
// Get all driver challenges
static async getAllDriverChallenges(): Promise<DriverChallenge[]> {
  return ApiService.get<DriverChallenge[]>('/driver-challenges');
}
```

### Invoice Service Fix

The application was encountering the following error:

```
App.tsx:182  Error fetching data: TypeError: InvoiceService.getAllInvoices is not a function
    at fetchAllData (App.tsx:155:36)
```

To fix the issue, the following method was added to InvoiceService:

```typescript
// Get all invoices without filtering (for compatibility with other services)
static async getAllInvoices(): Promise<Invoice[]> {
  const response = await this.getInvoices();
  return response.data;
}
```

## Database Fixes

### Sequelize Column Naming Fix

When running the database seed script (`npm run seed`), the following errors occurred:

1. First error:
```
Error: Key column 'hubId' doesn't exist in table
```

2. After fixing the first error, a second error occurred:
```
Error: Table 'u682067506_fleet_system.drivers' doesn't exist
```

The root cause of the issue was a mismatch between the column naming conventions in the Sequelize model definitions and the database schema:

1. In the Sequelize configuration (`server/config/database.js`), the `underscored: true` setting was enabled, which automatically converts camelCase field names in the models to snake_case column names in the database.

2. However, in several model files, index definitions and hooks were still using camelCase field names instead of the snake_case column names that were actually in the database.

The solution was to modify the index definitions and hooks in the model files to use snake_case column names that match the database schema.

### Sequelize Index Fix

When running the database seed script (`npm run seed`), the following error occurred:

```
Error: Key column 'geofenceId' doesn't exist in table
```

The root cause of the issue was a mismatch between the column naming conventions in the Sequelize model and the database schema:

1. In the Sequelize configuration (`server/config/database.js`), the `underscored: true` setting was enabled, which automatically converts camelCase field names in the models to snake_case column names in the database.

2. In the Hub model (`server/models/sequelize/Hub.js`), the index was defined using the camelCase field name:

```javascript
indexes: [
  // Index for foreign keys to improve join performance
  { fields: ['geofenceId'] },
  // Spatial index for location-based queries
  { fields: ['latitude', 'longitude'] }
],
```

The solution was to modify the index definition in the Hub model to use the snake_case column name that matches the database schema:

```javascript
indexes: [
  // Index for foreign keys to improve join performance
  { fields: ['geofence_id'] },
  // Spatial index for location-based queries
  { fields: ['latitude', 'longitude'] }
],
```

## Performance Improvements

The application was experiencing several performance issues:

1. Database queries were timing out after 10 seconds
2. API endpoints were failing with 500 errors
3. The frontend would display a black screen when API calls failed
4. No fallback mechanism existed when the backend was unavailable

The following changes were implemented to address these issues:

### Database Optimizations

#### Connection Pool and Timeout Settings

The database connection pool settings and query timeouts in `server/config/database.js` were increased:

```javascript
dialectOptions: {
  connectTimeout: 60000, // 60 seconds connection timeout
  options: {
    requestTimeout: 60000 // 60 seconds query timeout
  }
},
pool: {
  max: 10, // Increased maximum number of connections in pool
  min: 2, // Increased minimum number of connections in pool
  acquire: 60000, // Increased to 60 seconds - maximum time that pool will try to get connection
  idle: 20000, // Increased to 20 seconds - maximum time a connection can be idle
}
```

#### Database Indexes

Missing indexes were added to improve query performance across multiple models:

- **Order Model**: Added indexes for foreign keys, status, and priority fields
- **Driver Model**: Added indexes for location, status, and team relationships
- **Store Model**: Added indexes for hub relationships and status
- **Team Model**: Added indexes for hub and team lead relationships
- **Hub Model**: Added indexes for geofence relationships and location
- **Geofence Model**: Added spatial indexes for coordinates
- **ExclusionZone Model**: Added indexes for type and coordinates

### API Optimizations

#### Asynchronous Alert Creation

Alert creation in API routes was modified to be asynchronous, preventing it from slowing down API responses:

```javascript
// Before
await Alert.default.create({
  type: 'Order Status Updated',
  message: `Order ${order.title} status changed to ${status}.`,
  priority: order.priority === 'Urgent' ? 'high' : 'medium',
  relatedEntityType: 'Order',
  relatedEntityId: order._id
});

// After
Alert.default.create({
  type: 'Order Status Updated',
  message: `Order ${order.title} status changed to ${status}.`,
  priority: order.priority === 'Urgent' ? 'high' : 'medium',
  relatedEntityType: 'Order',
  relatedEntityId: order._id
}).catch(err => console.error('Error creating alert:', err));
```

#### Pagination Implementation

All list endpoints were updated to support pagination to limit the amount of data returned in a single request:

```javascript
// Support pagination
const page = parseInt(req.query.page, 10) || 1;
const limit = parseInt(req.query.limit, 10) || 50;
const startIndex = (page - 1) * limit;

// Get orders with pagination
const orders = await Order.find({ driverId: req.params.driverId })
  .populate('storeId', 'name location')
  .sort({ createdAt: -1 })
  .skip(startIndex)
  .limit(limit);
```

### Frontend Resilience

#### Enhanced Error Handling

Robust error handling was implemented in the frontend to gracefully handle API timeouts:

1. **Retry Logic**: Added retry mechanism with exponential backoff for failed API calls

```javascript
const fetchWithRetry = async (fetchFn, retries = 3, delay = 1000) => {
  try {
    return await fetchFn();
  } catch (error) {
    if (retries <= 0) throw error;
    
    console.log(`Retrying... Attempts left: ${retries}`);
    await new Promise(resolve => setTimeout(resolve, delay));
    return fetchWithRetry(fetchFn, retries - 1, delay * 1.5); // Exponential backoff
  }
};
```

2. **Mock Data Fallbacks**: Added fallback to mock data when API calls fail even after retries

```javascript
const fetchWithFallback = async (fetchFn, mockData) => {
  try {
    return await fetchWithRetry(fetchFn);
  } catch (error) {
    console.warn(`Using mock data fallback due to error: ${error.message}`);
    return mockData;
  }
};
```

3. **Individual Error Handling**: Implemented error handling for each API call separately, allowing the application to continue functioning even if some API calls fail

4. **Detailed Error Messages**: Added more informative error messages that specify which data types failed to load

```javascript
if (failedDataTypes.length > 0) {
  setError(`Some data could not be loaded from the server (${failedDataTypes.join(', ')}). Using fallback data instead. Some features may be limited.`);
}
```

#### Live Alerts Resilience

The live alerts polling mechanism was enhanced to handle API timeouts:

1. Added retry logic for alert fetching
2. Implemented a consecutive failures counter
3. Added fallback to mock alerts after multiple consecutive failures
4. Ensured the alerts UI continues to function even when the backend is unavailable

## Production Readiness

The following changes were made to make the Skedadel Fleet Management System production-ready:

### API Route Fixes

The following routes in orderRoutes.js were updated to use the modelFactory abstraction instead of direct MongoDB model methods:

- **PATCH /api/orders/:id/status**: Updated to use modelFactory for finding, updating, and creating alerts.
- **PATCH /api/orders/:id/assign**: Updated to use modelFactory for finding drivers, updating orders, and creating alerts.
- **DELETE /api/orders/:id**: Updated to use modelFactory for finding and deleting orders.
- **GET /api/orders/driver/:driverId**: Updated to use modelFactory for finding orders by driver and counting results.
- **GET /api/orders/store/:storeId**: Updated to use modelFactory for finding orders by store and counting results.
- **GET /api/orders/status/:status**: Updated to use modelFactory for finding orders by status and counting results.
- **GET /api/orders/priority/:priority**: Updated to use modelFactory for finding orders by priority and counting results.

These changes ensure that the API routes work correctly with both MongoDB and MySQL databases, as determined by the USE_SQL_DATABASE environment variable.

### Service Method Fixes

The following service methods were verified to be correctly implemented:

- **ChallengeService.getAllDriverChallenges()**: Verified that this method exists and returns driver challenges from the API.
- **InvoiceService.getAllInvoices()**: Verified that this method exists and returns invoices from the API.
- **AlertService.getAllAlerts()**: Verified that this method exists and returns alerts from the API.
- **OrderService.getAllOrders()**: Verified that this method exists and returns orders from the API.

These methods are essential for the frontend to fetch data correctly from the backend.

### Deployment Recommendations

When deploying the system to production, ensure the following:

1. **Database Configuration**: Set the USE_SQL_DATABASE environment variable to 'true' to use MySQL, as recommended in the SQL-ONLY-CONFIGURATION.md file.

2. **Dependencies**: Install all required dependencies using `npm install` before starting the application.

3. **Environment Variables**: Configure all required environment variables in the .env file, including database connection details.

4. **Testing**: Run the test scripts to verify that everything is working correctly:
   - testMySQLConnection.js to verify database connectivity
   - testApiResilience.js to verify API resilience
   - testServices.js to verify service method functionality

5. **Monitoring**: Implement monitoring to track the performance and reliability of the application in production.