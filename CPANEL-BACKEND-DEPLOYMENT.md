# Backend Deployment Guide for Skedadel Fleet Management on cPanel

This guide provides detailed instructions for deploying the Express.js backend of the Skedadel Fleet Management System on a cPanel server.

## Prerequisites

- A cPanel hosting account with:
  - Node.js support (Node.js v16+)
  - SSH access (recommended)
  - Application Manager or Node.js Selector feature
- Database already set up (refer to [CPANEL-DATABASE-SETUP.md](./CPANEL-DATABASE-SETUP.md))
- Environment variables configured (refer to [.env.example](./.env.example))

## Step 1: Prepare Your Backend Code

1. Make sure your backend code is ready for production:
   - Remove any debugging code
   - Set appropriate error handling
   - Ensure all dependencies are listed in `package.json`
   - Configure CORS to allow only your frontend domain

2. Create a production-ready entry point:
   - Make sure your `server.js` file is properly configured
   - Set the correct port (cPanel often requires specific ports)
   - Configure database connections for production

## Step 2: Upload Backend Files to cPanel

### Method 1: Using File Manager in cPanel

1. Log in to your cPanel account
2. Navigate to "File Manager"
3. Create a directory for your backend (e.g., `backend` or `api`)
4. Upload your backend files:
   - `server` directory
   - `package.json` and `package-lock.json`
   - `.env` file with production settings
   - Any other necessary files

### Method 2: Using FTP

1. Connect to your cPanel server using an FTP client like FileZilla
2. Navigate to your desired directory
3. Upload your backend files
4. Make sure to maintain the directory structure

### Method 3: Using Git (if available)

1. Log in to your cPanel account
2. Navigate to "Git Version Control"
3. Set up a Git repository in your desired directory
4. Push your backend code to this repository

## Step 3: Set Up Node.js Application in cPanel

### Using Application Manager / Node.js Selector

1. Log in to your cPanel account
2. Navigate to "Setup Node.js App" or "Application Manager"
3. Click "Create Application"
4. Configure the application:
   - Application mode: Production
   - Node.js version: Select the latest available version (v16+)
   - Application root: Path to your backend directory (e.g., `/home/username/backend`)
   - Application URL: Your domain or subdomain with the API path (e.g., `https://yourdomain.com/api`)
   - Application startup file: `server/server.js`
   - Environment variables: Add any variables not in your `.env` file

5. Click "Create" to set up the Node.js application

### Using SSH and PM2 (Alternative Method)

If your cPanel doesn't have Application Manager or you prefer more control:

1. Connect to your server via SSH:
   ```
   ssh username@your-cpanel-server.com
   ```

2. Navigate to your backend directory:
   ```
   cd backend
   ```

3. Install dependencies:
   ```
   npm install --production
   ```

4. Install PM2 globally (if not already installed):
   ```
   npm install -g pm2
   ```

5. Start your application with PM2:
   ```
   pm2 start server/server.js --name "fleet-management-api"
   ```

6. Set PM2 to start on server reboot:
   ```
   pm2 startup
   pm2 save
   ```

## Step 4: Configure Proxy for API Requests

To route API requests to your Node.js application, you need to set up a proxy:

### Using .htaccess (Apache)

Create or edit the `.htaccess` file in your website's root directory:

```apache
# Proxy API requests to Node.js application
<IfModule mod_rewrite.c>
  RewriteEngine On
  
  # If your API is at /api
  RewriteRule ^api/(.*)$ http://localhost:YOUR_NODEJS_PORT/$1 [P,L]
  
  # If you're using a subdomain for API (api.yourdomain.com)
  # No RewriteRule needed, just configure the subdomain in cPanel
</IfModule>

# Set headers for proxy
<IfModule mod_headers.c>
  # For API routes
  <LocationMatch "^/api/">
    Header set Access-Control-Allow-Origin "https://yourdomain.com"
    Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type, Authorization"
    Header set Access-Control-Allow-Credentials "true"
  </LocationMatch>
</IfModule>
```

Replace `YOUR_NODEJS_PORT` with the port your Node.js application is running on (usually provided by cPanel when you set up the application).

## Step 5: Test Your Backend Deployment

1. Test your API endpoints using a tool like Postman or curl:
   ```
   curl https://yourdomain.com/api/users
   ```

2. Check for any errors in the application logs:
   - cPanel Node.js App logs
   - Error logs in cPanel's "Error Log" section
   - PM2 logs if using PM2: `pm2 logs`

3. Verify database connections are working correctly

## Step 6: Set Up Continuous Integration/Deployment (Optional)

For easier updates, consider setting up a CI/CD pipeline:

1. Create a deployment script that:
   - Pulls the latest code from your repository
   - Installs dependencies
   - Restarts the Node.js application

2. Set up a webhook to trigger the deployment script when you push to your repository

Example deployment script (`deploy.sh`):
```bash
#!/bin/bash
cd /home/username/backend
git pull
npm install --production
pm2 restart fleet-management-api
```

## Troubleshooting Common Issues

### Application Not Starting

If your Node.js application fails to start:

1. Check the application logs for error messages
2. Verify that all dependencies are installed
3. Make sure the port is not already in use
4. Check that environment variables are correctly set
5. Ensure the Node.js version is compatible with your code

### Database Connection Issues

If your application can't connect to the database:

1. Verify database credentials in your `.env` file
2. Check if the database server is accessible from your application
3. Ensure your database user has the correct privileges
4. Check for any firewall or network restrictions

### API Endpoint Not Accessible

If your API endpoints return 404 or are not accessible:

1. Check your proxy configuration in `.htaccess`
2. Verify that your Node.js application is running
3. Make sure the routes are correctly defined in your Express application
4. Check for any path mismatches between your proxy and actual routes

### CORS Issues

If you're getting CORS errors when calling your API from the frontend:

1. Check your CORS configuration in your Express application:
   ```javascript
   import cors from 'cors';
   
   // Configure CORS
   app.use(cors({
     origin: 'https://yourdomain.com',
     credentials: true,
     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
     allowedHeaders: ['Content-Type', 'Authorization']
   }));
   ```

2. Verify that the headers in your `.htaccess` file are correctly set
3. Make sure your frontend is making requests from the allowed origin

## Performance Optimization

1. Enable compression for API responses:
   ```javascript
   import compression from 'compression';
   
   app.use(compression());
   ```

2. Implement caching where appropriate:
   ```javascript
   // Example caching middleware
   const cacheMiddleware = (req, res, next) => {
     const period = 60 * 5; // 5 minutes
     res.set('Cache-Control', `public, max-age=${period}`);
     next();
   };
   
   // Apply to specific routes
   app.get('/api/static-data', cacheMiddleware, (req, res) => {
     // Route handler
   });
   ```

3. Optimize database queries:
   - Use indexes for frequently queried fields
   - Limit the amount of data returned
   - Use pagination for large datasets

4. Consider using a CDN for static assets

## Security Best Practices

1. Always use HTTPS for your API
2. Implement rate limiting to prevent abuse:
   ```javascript
   import rateLimit from 'express-rate-limit';
   
   const apiLimiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100, // limit each IP to 100 requests per windowMs
     message: 'Too many requests from this IP, please try again later'
   });
   
   // Apply to all API routes
   app.use('/api/', apiLimiter);
   ```

3. Validate and sanitize all user inputs
4. Use helmet.js to set security headers:
   ```javascript
   import helmet from 'helmet';
   
   app.use(helmet());
   ```

5. Keep dependencies updated to patch security vulnerabilities
6. Implement proper authentication and authorization
7. Store sensitive information in environment variables, not in code
8. Regularly backup your database and application files

## Maintenance and Updates

1. Monitor your application's performance and logs
2. Set up alerts for critical errors
3. Regularly update dependencies to patch security vulnerabilities
4. Test updates thoroughly before deploying to production
5. Maintain a staging environment for testing changes
6. Document all configuration changes and deployments