# Deploying Skedadel Fleet Management System on cPanel

This guide provides step-by-step instructions for deploying the Skedadel Fleet Management System on a cPanel server.

## Prerequisites

- A cPanel hosting account with:
  - Node.js support (Node.js v16+)
  - SSH access (recommended)
  - MySQL database (if using SQL option)
  - MongoDB access (if using NoSQL option)
- Domain or subdomain for your application
- FTP client (like FileZilla) or Git access

## Step 1: Prepare Your Local Project

1. Build the frontend for production:
   ```
   npm run build
   ```
   This will create a `dist` directory with optimized static files.

2. Prepare your project for deployment:
   - Make sure all dependencies are listed in `package.json`
   - Create a `.env` file with production settings (see Environment Variables section below)
   - Update any hardcoded URLs to match your production domain

## Step 2: Set Up Database on cPanel

### Option A: MySQL Database (if USE_SQL_DATABASE=true)

1. Log in to your cPanel account
2. Navigate to "MySQL Databases"
3. Create a new database (e.g., `fleet_management`)
4. Create a new database user with a strong password
5. Add the user to the database with all privileges
6. Note the database name, username, password, and host for your `.env` file

### Option B: MongoDB Database (if USE_SQL_DATABASE=false)

1. If your cPanel provider offers MongoDB:
   - Navigate to MongoDB Database section in cPanel
   - Create a new MongoDB database
   - Note the connection URI for your `.env` file
2. If your cPanel provider doesn't offer MongoDB:
   - Use a cloud MongoDB service like MongoDB Atlas
   - Create a new cluster and database
   - Configure network access to allow connections from your cPanel server
   - Note the connection URI for your `.env` file

## Step 3: Upload Files to cPanel

### Method 1: Using FTP

1. Connect to your cPanel server using an FTP client
2. Create a directory for your application (e.g., `fleet_management`)
3. Upload the following files and directories:
   - `server` directory (backend code)
   - `dist` directory (built frontend)
   - `package.json` and `package-lock.json`
   - `.env` file with production settings
   - Create a `public` directory and move the contents of `dist` into it

### Method 2: Using Git (if available)

1. Log in to your cPanel account
2. Navigate to "Git Version Control"
3. Create a new Git repository
4. Clone your project repository
5. Build the frontend and set up the `.env` file
6. Push changes to the cPanel Git repository

## Step 4: Configure Environment Variables

Create or update your `.env` file in the root directory with the following variables:

```
# Node environment
NODE_ENV=production
PORT=8080  # Or the port provided by your cPanel host

# Database selection
USE_SQL_DATABASE=true  # Set to 'true' for MySQL or 'false' for MongoDB

# MySQL Database Configuration (if USE_SQL_DATABASE=true)
DB_HOST=localhost  # Or the MySQL host provided by cPanel
DB_USER=your_cpanel_mysql_username
DB_PASSWORD=your_cpanel_mysql_password
DB_NAME=your_cpanel_mysql_database
DB_PORT=3306  # Default MySQL port, may vary by host

# MongoDB Configuration (if USE_SQL_DATABASE=false)
MONGO_URI=mongodb://username:password@host:port/database

# Other application settings
JWT_SECRET=your_secure_jwt_secret
```

## Step 5: Set Up Node.js Application in cPanel

1. Log in to your cPanel account
2. Navigate to "Setup Node.js App"
3. Click "Create Application"
4. Configure the application:
   - Application mode: Production
   - Node.js version: Select the latest available version (v16+)
   - Application root: Path to your application directory (e.g., `/home/username/fleet_management`)
   - Application URL: Your domain or subdomain
   - Application startup file: `server/server.js`
   - Environment variables: Add any additional variables not in your `.env` file

5. Click "Create" to set up the Node.js application

## Step 6: Install Dependencies and Start the Application

1. Connect to your server via SSH:
   ```
   ssh username@your-cpanel-server.com
   ```

2. Navigate to your application directory:
   ```
   cd fleet_management
   ```

3. Install dependencies:
   ```
   npm install --production
   ```

4. Start the application:
   - If using cPanel's Node.js App interface, restart the application from there
   - If using a custom setup, you may need to use PM2:
     ```
     npm install -g pm2
     pm2 start server/server.js --name "fleet-management"
     pm2 save
     ```

## Step 7: Configure Domain and Web Server

1. Log in to your cPanel account
2. Navigate to "Domains" or "Subdomains"
3. Set up your domain or subdomain to point to your application directory
4. If needed, configure Apache or Nginx to proxy requests to your Node.js application:

   Example Apache configuration in `.htaccess`:
   ```
   RewriteEngine On
   RewriteRule ^$ http://localhost:8080/ [P,L]
   RewriteRule ^(.*)$ http://localhost:8080/$1 [P,L]
   ```

## Step 8: Test Your Deployment

1. Open your browser and navigate to your domain
2. Verify that the application loads correctly
3. Test key functionality to ensure everything works as expected
4. Check server logs if you encounter any issues:
   - cPanel Node.js App logs
   - Error logs in cPanel's "Error Log" section
   - PM2 logs if using PM2: `pm2 logs`

## Troubleshooting

### Application Not Starting
- Check if Node.js is properly set up in cPanel
- Verify that all dependencies are installed
- Check environment variables are correctly set
- Look for errors in the application logs

### Database Connection Issues
- Verify database credentials in your `.env` file
- Check if the database server is accessible from your application
- For MongoDB, ensure network access is properly configured

### Frontend Not Loading
- Make sure the `dist` directory is properly uploaded
- Check if the server is correctly serving static files
- Verify that API endpoints are accessible

## Maintenance and Updates

### Updating Your Application
1. Build a new version of the frontend locally
2. Upload the updated files to your cPanel server
3. Restart the Node.js application

### Monitoring
- Use cPanel's built-in resource monitoring
- Consider setting up external monitoring services
- Regularly check application logs for errors

## Security Considerations

- Keep your Node.js version updated
- Regularly update dependencies with `npm update`
- Use HTTPS for your domain
- Set up proper firewall rules
- Implement rate limiting for API endpoints
- Regularly backup your database and application files