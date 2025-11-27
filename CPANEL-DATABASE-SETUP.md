# Database Setup Guide for Skedadel Fleet Management on cPanel

This guide provides detailed instructions for setting up and configuring databases for the Skedadel Fleet Management System on a cPanel server. The system supports both MySQL and MongoDB databases.

## MySQL Database Setup (if USE_SQL_DATABASE=true)

### Step 1: Create a MySQL Database in cPanel

1. Log in to your cPanel account
2. Navigate to the "MySQL Databases" section
3. Under "Create New Database":
   - Enter a name for your database (e.g., `username_fleetmgmt`)
   - Click "Create Database"
   - Note: cPanel automatically prefixes the database name with your cPanel username

### Step 2: Create a Database User

1. In the same "MySQL Databases" section, scroll down to "Add New User"
2. Enter a username (e.g., `fleetuser`)
3. Enter a strong password (or use the password generator)
4. Click "Create User"
5. Note: cPanel automatically prefixes the username with your cPanel username

### Step 3: Add User to Database

1. Scroll down to "Add User To Database"
2. Select the user you created from the dropdown
3. Select the database you created from the dropdown
4. Click "Add"
5. On the privileges page, select "ALL PRIVILEGES"
6. Click "Make Changes"

### Step 4: Get Database Connection Details

Note down the following information for your `.env` file:

- **DB_HOST**: Usually `localhost` for cPanel MySQL databases
- **DB_USER**: Your full database username (including cPanel prefix)
- **DB_PASSWORD**: The password you created for the database user
- **DB_NAME**: Your full database name (including cPanel prefix)
- **DB_PORT**: Usually `3306` (default MySQL port)

Example `.env` configuration:
```
USE_SQL_DATABASE=true
DB_HOST=localhost
DB_USER=cpanelusername_fleetuser
DB_PASSWORD=your_strong_password
DB_NAME=cpanelusername_fleetmgmt
DB_PORT=3306
```

### Step 5: Import Initial Database Schema (Optional)

If you have a database schema or initial data:

1. Go to "phpMyAdmin" in cPanel
2. Select your database from the left sidebar
3. Click on the "Import" tab
4. Choose the SQL file containing your schema/data
5. Click "Go" to import the file

## MongoDB Setup (if USE_SQL_DATABASE=false)

### Option 1: Using cPanel's MongoDB (if available)

Some cPanel hosts offer MongoDB as a feature. If your host provides MongoDB:

1. Log in to your cPanel account
2. Navigate to the "MongoDB Databases" section (if available)
3. Create a new database
4. Create a new user and assign it to the database
5. Note the connection details for your `.env` file

### Option 2: Using External MongoDB Service (MongoDB Atlas)

If your cPanel host doesn't provide MongoDB, you can use MongoDB Atlas:

1. Create a MongoDB Atlas account at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (the free tier is sufficient for starting)
3. Set up a database user with a username and password
4. Configure network access:
   - Add your cPanel server's IP address to the IP Access List
   - Alternatively, allow access from anywhere (less secure, not recommended for production)
5. Get your connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user's password
   - Replace `myFirstDatabase` with your desired database name

Example `.env` configuration:
```
USE_SQL_DATABASE=false
MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/fleet_management?retryWrites=true&w=majority
```

## Database Migration

If you need to migrate from one database type to another (MySQL to MongoDB or vice versa), follow these steps:

1. Export data from your current database
2. Transform the data to match the schema of the target database
3. Import the transformed data into the new database
4. Update your `.env` file to use the new database

For detailed migration instructions, refer to the [Database Migration Guide](./server/docs/database-migration-guide.md).

## Troubleshooting Database Connections

### MySQL Connection Issues

1. Verify your database credentials in the `.env` file
2. Check if the MySQL server is running
3. Ensure your cPanel user has the correct privileges
4. Check if your hosting has any restrictions on external MySQL connections

Common error: "SQLSTATE[HY000] [1045] Access denied for user"
- Solution: Double-check your username and password

Common error: "SQLSTATE[HY000] [2002] Connection refused"
- Solution: Verify the hostname and port

### MongoDB Connection Issues

1. Verify your MongoDB URI in the `.env` file
2. Check if the MongoDB server is accessible from your cPanel server
3. Ensure your IP address is whitelisted if using MongoDB Atlas
4. Check if your hosting has any restrictions on external MongoDB connections

Common error: "MongoNetworkError: failed to connect to server"
- Solution: Check network connectivity and firewall settings

Common error: "MongoError: Authentication failed"
- Solution: Verify your username and password in the connection string

## Backup and Restore

### MySQL Backup

1. In cPanel, go to "Backup Wizard" or "Backup"
2. Choose "Backup" and select "MySQL Databases"
3. Select your database and download the backup file

### MongoDB Backup

If using MongoDB Atlas:
1. Go to your cluster in MongoDB Atlas
2. Click on the "..." menu and select "Back Up"
3. Follow the prompts to create a backup

For manual backups using mongodump (requires SSH access):
```
mongodump --uri="your_mongodb_uri" --out=/path/to/backup/directory
```

## Performance Optimization

### MySQL Optimization

1. In cPanel, go to "MySQL Database Wizard"
2. Select your database
3. Click on "Optimize" to optimize the database tables

### MongoDB Optimization

1. Create appropriate indexes for frequently queried fields
2. Consider using MongoDB Atlas which automatically handles many optimization tasks

## Security Best Practices

1. Use strong, unique passwords for database users
2. Limit database user privileges to only what's necessary
3. Regularly update your database software
4. Enable SSL/TLS for database connections when possible
5. Regularly backup your database
6. Monitor database access logs for suspicious activity