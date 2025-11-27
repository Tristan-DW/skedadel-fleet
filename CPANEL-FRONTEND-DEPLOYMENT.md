# Frontend Deployment Guide for Skedadel Fleet Management on cPanel

This guide provides detailed instructions for deploying the React frontend of the Skedadel Fleet Management System on a cPanel server.

## Prerequisites

- Access to your cPanel account
- Node.js installed on your local development machine
- FTP client (like FileZilla) or Git access to cPanel

## Step 1: Build the Frontend for Production

Before uploading to cPanel, you need to create a production build of the React frontend:

1. On your local development machine, navigate to the project root directory
2. Make sure all environment variables are set correctly for production in your `.env` file
3. Run the build command:
   ```
   npm run build
   ```
4. This will create a `dist` directory containing optimized static files

## Step 2: Prepare the Frontend for cPanel

The production build needs some adjustments for cPanel:

1. If your application will be hosted at the root of your domain (e.g., `https://yourdomain.com`):
   - No changes needed to the build files

2. If your application will be hosted in a subdirectory (e.g., `https://yourdomain.com/fleet-management`):
   - Update the `vite.config.ts` file before building:
     ```typescript
     export default defineConfig({
       // ... other config
       base: '/fleet-management/', // Add this line with your subdirectory path
       // ... rest of config
     });
     ```
   - Rebuild the application after making this change

3. Check for any hardcoded API URLs in your frontend code:
   - Make sure all API calls use relative paths or environment variables
   - Update any hardcoded URLs to point to your production API endpoint

## Step 3: Upload Frontend Files to cPanel

### Method 1: Using File Manager in cPanel

1. Log in to your cPanel account
2. Navigate to "File Manager"
3. Go to the public_html directory (or the subdirectory where you want to host the application)
4. Click "Upload" and upload all files from your local `dist` directory
5. Make sure to maintain the directory structure from the `dist` folder

### Method 2: Using FTP

1. Connect to your cPanel server using an FTP client like FileZilla
2. Navigate to the `public_html` directory (or your desired subdirectory)
3. Upload all files from your local `dist` directory
4. Maintain the directory structure from the `dist` folder

### Method 3: Using Git (if available)

1. Log in to your cPanel account
2. Navigate to "Git Version Control"
3. Set up a Git repository in your desired directory
4. Push your production build to this repository
5. Make sure to include the `dist` directory in your repository

## Step 4: Configure Web Server for Single-Page Application (SPA)

React is a single-page application (SPA) that uses client-side routing. To ensure all routes work correctly, you need to configure the web server to redirect all requests to index.html:

### For Apache (most common on cPanel)

Create or edit the `.htaccess` file in your frontend directory with the following content:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  # If in subdirectory, change the line above to: RewriteBase /your-subdirectory/
  
  # Redirect all requests to index.html except for actual files and directories
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^ index.html [QSA,L]
</IfModule>

# Set correct MIME types
<IfModule mod_mime.c>
  AddType application/javascript .js
  AddType text/css .css
</IfModule>

# Enable GZIP compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css application/javascript application/json
</IfModule>

# Set caching headers
<IfModule mod_expires.c>
  ExpiresActive On
  
  # Cache HTML for 1 hour
  ExpiresByType text/html "access plus 1 hour"
  
  # Cache CSS, JavaScript, and media files for 1 week
  ExpiresByType text/css "access plus 1 week"
  ExpiresByType application/javascript "access plus 1 week"
  ExpiresByType image/jpeg "access plus 1 week"
  ExpiresByType image/png "access plus 1 week"
  ExpiresByType image/svg+xml "access plus 1 week"
  
  # Cache fonts for 1 month
  ExpiresByType application/font-woff "access plus 1 month"
  ExpiresByType application/font-woff2 "access plus 1 month"
  ExpiresByType application/vnd.ms-fontobject "access plus 1 month"
  ExpiresByType application/x-font-ttf "access plus 1 month"
</IfModule>
```

## Step 5: Connect Frontend to Backend API

Ensure your frontend is correctly configured to communicate with your backend API:

1. If your backend API is hosted on the same domain:
   - Use relative paths for API calls (e.g., `/api/users`)
   - Make sure your backend is properly set up to handle these requests

2. If your backend API is hosted on a different domain or port:
   - Update the API base URL in your frontend code
   - Ensure CORS is properly configured on your backend
   - Consider using a proxy in your web server configuration

Example of setting API URL in your frontend code:

```javascript
// In your API service file
const API_URL = process.env.REACT_APP_API_URL || '/api';

export const fetchData = async (endpoint) => {
  const response = await fetch(`${API_URL}/${endpoint}`);
  return response.json();
};
```

## Step 6: Test the Deployment

After deploying your frontend, thoroughly test it to ensure everything works correctly:

1. Open your browser and navigate to your domain
2. Test navigation between different pages
3. Test all major features of the application
4. Check for any console errors
5. Verify that API calls to the backend are working
6. Test on different browsers and devices

## Troubleshooting Common Issues

### 404 Errors When Refreshing Pages

If you get 404 errors when refreshing pages or accessing routes directly:
- Make sure your `.htaccess` file is correctly configured
- Check that the file is in the correct directory
- Verify that mod_rewrite is enabled on your server

### API Connection Issues

If your frontend can't connect to the backend API:
- Check the API URL configuration
- Verify that your backend server is running
- Check for CORS issues in the browser console
- Ensure your backend is correctly configured to accept requests from your frontend domain

### Static Assets Not Loading

If images, CSS, or JavaScript files aren't loading:
- Check the network tab in browser developer tools for 404 errors
- Verify that all paths in your HTML are correct
- Make sure all assets were uploaded to the correct location

### Performance Issues

If your application is loading slowly:
- Enable GZIP compression in your `.htaccess` file
- Set appropriate caching headers
- Consider using a CDN for static assets
- Optimize your images and other assets

## Maintenance and Updates

When you need to update your frontend:

1. Make changes to your code locally
2. Test thoroughly in your development environment
3. Build a new production version with `npm run build`
4. Upload the new files to your cPanel server, replacing the old files
5. Clear your browser cache and test the updated application

## Security Best Practices

1. Always use HTTPS for your domain
2. Set appropriate security headers in your `.htaccess` file:
   ```apache
   # Security headers
   <IfModule mod_headers.c>
     # Prevent clickjacking
     Header set X-Frame-Options "SAMEORIGIN"
     # Prevent MIME-type sniffing
     Header set X-Content-Type-Options "nosniff"
     # Enable XSS protection
     Header set X-XSS-Protection "1; mode=block"
     # Enforce HTTPS
     Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
   </IfModule>
   ```
3. Regularly update your dependencies to patch security vulnerabilities
4. Don't expose sensitive information in your frontend code
5. Implement proper authentication and authorization