# Skedadel Fleet Management System - cPanel Quick Start Guide

This quick start guide provides a concise overview of the steps required to deploy the Skedadel Fleet Management System on a cPanel server. For detailed instructions, refer to the specific deployment guides.

## Prerequisites

- cPanel hosting account with Node.js support (v16+)
- MySQL database or MongoDB access
- Domain or subdomain for your application
- FTP client or SSH access

## Step 1: Prepare Your Local Project

1. Build the frontend for production:
   ```
   npm run build
   ```

2. Create a production `.env` file based on `.env.example`

## Step 2: Set Up Database

### For MySQL (if USE_SQL_DATABASE=true)

1. In cPanel, go to "MySQL Databases"
2. Create a new database and user
3. Grant all privileges to the user
4. Note connection details for your `.env` file

### For MongoDB (if USE_SQL_DATABASE=false)

1. Use cPanel's MongoDB feature if available, or
2. Set up MongoDB Atlas and note the connection URI

## Step 3: Upload Files to cPanel

1. Create directories for your application:
   - Frontend files in `public_html` (or subdirectory)
   - Backend files in a separate directory (e.g., `backend`)

2. Upload files via File Manager or FTP:
   - Frontend: Upload `dist` contents to `public_html`
   - Backend: Upload `server` directory, `package.json`, and `.env`

## Step 4: Configure Node.js Application

1. In cPanel, go to "Setup Node.js App"
2. Create a new application:
   - Application root: Path to your backend directory
   - Application URL: Your domain/subdomain
   - Application startup file: `server/server.js`
   - Environment variables: Add any not in `.env`

## Step 5: Configure Web Server

1. For frontend (SPA routing), create `.htaccess` in `public_html`:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule ^ index.html [QSA,L]
   </IfModule>
   ```

2. For backend API proxy, add to root `.htaccess`:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteRule ^api/(.*)$ http://localhost:YOUR_NODEJS_PORT/$1 [P,L]
   </IfModule>
   ```

## Step 6: Install Dependencies and Start Application

1. Connect via SSH:
   ```
   ssh username@your-cpanel-server.com
   ```

2. Navigate to backend directory and install dependencies:
   ```
   cd backend
   npm install --production
   ```

3. Start the application:
   - If using cPanel's Node.js App: Restart from cPanel interface
   - If using PM2:
     ```
     npm install -g pm2
     pm2 start server/server.js --name "fleet-management"
     pm2 save
     ```

## Step 7: Test Your Deployment

1. Open your browser and navigate to your domain
2. Test key functionality
3. Check for any errors in the logs

## Troubleshooting

- **Frontend issues**: Check browser console, `.htaccess` configuration
- **Backend issues**: Check Node.js application logs, database connection
- **Database issues**: Verify credentials, connection settings
- **CORS issues**: Check CORS configuration in Express and `.htaccess`

## Detailed Documentation

For more detailed instructions, refer to:

- [CPANEL-DEPLOYMENT.md](./CPANEL-DEPLOYMENT.md) - Complete deployment guide
- [CPANEL-DATABASE-SETUP.md](./CPANEL-DATABASE-SETUP.md) - Database setup guide
- [CPANEL-FRONTEND-DEPLOYMENT.md](./CPANEL-FRONTEND-DEPLOYMENT.md) - Frontend deployment guide
- [CPANEL-BACKEND-DEPLOYMENT.md](./CPANEL-BACKEND-DEPLOYMENT.md) - Backend deployment guide