# Quick Start Guide for Skedadel Fleet Management System

## Setting Up Live Data

To use the system with live data in the SQL database, follow these steps:

### 1. Verify Database Configuration

Make sure your `.env` file has the following settings:

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

### 2. Seed the Database

Run the following command to populate the SQL database with initial data:

```
npm run seed
```

This will:
- Connect to the SQL database
- Create all necessary tables
- Populate the tables with sample data

### 3. Start the Application

Run the following command to start both the frontend and backend servers:

```
npm run dev
```

This will start:
- Frontend server at http://localhost:3000
- Backend API server at http://localhost:5000

### 4. Verify Live Data

1. Open your browser and navigate to http://localhost:3000
2. You should now see live data from the SQL database in the application

## Troubleshooting

If you don't see any data in the application:

1. Check the terminal output for any errors during the seeding process
2. Verify that the database connection details in `.env` are correct
3. Make sure both frontend and backend servers are running
4. Check the browser console for any API errors

## Switching Between Databases

To switch between SQL and MongoDB:

1. Edit the `.env` file
2. Change `USE_SQL_DATABASE=true` to `USE_SQL_DATABASE=false` for MongoDB
3. Restart the application with `npm run dev`

Note: When switching databases, you may need to seed the new database if it's empty.