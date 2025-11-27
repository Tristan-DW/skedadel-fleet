# Skedadel Fleet Management System

A comprehensive fleet management solution for last-mile delivery operations. This system provides real-time tracking, order management, driver assignment, geofencing, and analytics capabilities.

## Features

- **Real-time Dashboard**: Monitor drivers, orders, and alerts in real-time
- **Order Management**: Create, assign, and track delivery orders
- **Driver Management**: Track driver locations, status, and performance
- **Team Management**: Organize drivers into teams with team leads
- **Hub & Store Management**: Manage delivery hubs and store locations
- **Geofencing**: Create geofences and exclusion zones for operational boundaries
- **Analytics**: View performance metrics for drivers, teams, hubs, and stores
- **Challenge System**: Create and track driver challenges to boost performance
- **Webhook Integration**: Connect with external systems via webhooks
- **Financial Management**: Generate and track invoices for clients

## System Architecture

The system consists of:

- **Frontend**: React-based web application with real-time updates
- **Backend**: Express.js API server with RESTful endpoints
- **Database**: Supports both MongoDB (NoSQL) and MySQL (SQL) databases
- **AI Integration**: Uses Google's Gemini AI for operational insights and route optimization

## Database Configuration

The system supports two database options:

1. **MongoDB** (NoSQL): Default option, good for rapid development and flexible schema
2. **MySQL** (SQL): Structured option with relational data model, good for complex queries

You can switch between these options by setting the `USE_SQL_DATABASE` environment variable in the `.env` file:

```
# Use MySQL with Sequelize (true) or MongoDB (false)
USE_SQL_DATABASE=true
```

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- MongoDB or MySQL database server
- Git

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/Tristan-DW/Skedadel-Fleet-Management-system.git
   cd skedadel-fleet-management
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the database connection details
   - Set `USE_SQL_DATABASE` to `true` for MySQL or `false` for MongoDB
   - Set other required environment variables

4. Database setup:
   - For MongoDB: Make sure MongoDB is running and accessible
   - For MySQL: Create a database and update the connection details in `.env`

5. Start the development server:
   ```
   npm run dev
   ```

6. Access the application at `http://localhost:3000`

### Deployment

For deploying the application on different environments:

- **cPanel Deployment**: See the [cPanel Deployment Guides](#cpanel-deployment) section below
- **Local Development**: Follow the [Development Guide](./DEVELOPMENT.md)

## cPanel Deployment

To deploy the Skedadel Fleet Management System on a cPanel server, refer to the following guides:

1. **Quick Start Guide**: [CPANEL-QUICKSTART.md](./CPANEL-QUICKSTART.md) - Concise overview of the deployment process
2. **Complete Deployment Guide**: [CPANEL-DEPLOYMENT.md](./CPANEL-DEPLOYMENT.md) - Comprehensive instructions for the entire deployment process
3. **Database Setup Guide**: [CPANEL-DATABASE-SETUP.md](./CPANEL-DATABASE-SETUP.md) - Detailed instructions for setting up MySQL or MongoDB on cPanel
4. **Frontend Deployment Guide**: [CPANEL-FRONTEND-DEPLOYMENT.md](./CPANEL-FRONTEND-DEPLOYMENT.md) - Specific instructions for deploying the React frontend
5. **Backend Deployment Guide**: [CPANEL-BACKEND-DEPLOYMENT.md](./CPANEL-BACKEND-DEPLOYMENT.md) - Specific instructions for deploying the Express.js backend

## API Documentation

The system provides a comprehensive set of RESTful API endpoints:

- `/api/users` - User management
- `/api/drivers` - Driver management
- `/api/vehicles` - Vehicle management
- `/api/teams` - Team management
- `/api/hubs` - Hub management
- `/api/stores` - Store management
- `/api/geofences` - Geofence management
- `/api/exclusion-zones` - Exclusion zone management
- `/api/orders` - Order management
- `/api/alerts` - Alert management
- `/api/challenges` - Challenge management
- `/api/driver-challenges` - Driver challenge progress
- `/api/webhooks` - Webhook management
- `/api/invoices` - Invoice management

For detailed API documentation, see the [API Docs](./server/docs/api-docs.md) file.

## Database Migration

If you want to migrate from MongoDB to MySQL or vice versa, refer to the [Database Migration Guide](./server/docs/database-migration-guide.md).

## Development

### Project Structure

- `/components` - React components
- `/views` - React views/pages
- `/services` - Frontend services
- `/server` - Backend API server
  - `/config` - Server configuration
  - `/models` - Database models
  - `/routes` - API routes
  - `/docs` - Documentation

### Running Tests

```
npm test
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Google Gemini AI for operational insights
- React for the frontend framework
- Express.js for the backend API
- MongoDB and MySQL for database options
- Sequelize for SQL ORM
