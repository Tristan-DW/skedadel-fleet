# Starting the Backend Server for Skedadel Fleet Management System

Follow these steps to start the backend server for local development:

## 1. Set up environment variables

1. Copy the `.env.example` file to create a new `.env` file in the project root:
   ```
   copy .env.example .env
   ```

2. Edit the `.env` file to configure your database:
   - For MySQL: Set `USE_SQL_DATABASE=true` and fill in the MySQL connection details
   - For MongoDB: Set `USE_SQL_DATABASE=false` and provide the MongoDB URI
   - Set `NODE_ENV=development` for local development
   - Set `PORT=5000` (or your preferred port)

## 2. Install dependencies

If you haven't already installed the project dependencies:
```
npm install
```

## 3. Start the backend server

Since the package.json doesn't have the `dev:backend` script mentioned in the documentation, you can run the server directly using Node:
```
node server/server.js
```

If you have nodemon installed globally, you can use it for auto-reloading during development:
```
nodemon server/server.js
```

## 4. Verify the server is running

- The console should display: `Server running on port 5000`
- You should also see database connection messages:
  - For MySQL: `Database connection has been established successfully.`
  - For MongoDB: `MongoDB Connected: [hostname]`
- Test the API by opening http://localhost:5000 in your browser, which should display "Fleet Management API is running..."

## 5. Test API endpoints

Once the server is running, you can test the API endpoints:

### Using a browser
- Open http://localhost:5000/api/users to see if the users endpoint responds
- Other endpoints are available at paths like `/api/drivers`, `/api/vehicles`, etc.

### Using Postman or similar tools
1. Create a new GET request to http://localhost:5000/api/users
2. Send the request and verify you receive a response
3. Try other endpoints as needed

### Using curl
```
curl http://localhost:5000/api/users
```

If the API requires authentication, you may need to:
1. Create a user account first
2. Obtain a JWT token by logging in
3. Include the token in subsequent requests in the Authorization header

## Troubleshooting

### Database Connection Issues

#### MySQL Issues
- Ensure MySQL server is running on your machine or remote host
- Verify the credentials in your `.env` file match your MySQL setup
- Check that the database exists (create it if needed)
- Default values if not specified in `.env`:
  - Host: localhost
  - User: root
  - Password: (empty)
  - Database: fleet_management
  - Port: 3306

#### MongoDB Issues
- Ensure MongoDB server is running locally or your Atlas cluster is accessible
- Verify your MONGO_URI in the `.env` file is correct
- Check network connectivity if using a remote MongoDB instance
- The system uses extended timeout settings (60s) for MongoDB connections

### Port Already in Use

If port 5000 is already in use, you can:
1. Change the PORT in your `.env` file
2. Kill the process using port 5000:
   - Windows: `netstat -ano | findstr :5000` then `taskkill /PID <PID> /F`
   - Mac/Linux: `lsof -i :5000` then `kill -9 <PID>`

### Module Import Errors

If you encounter ES module import errors:
- Ensure you're using Node.js version 14 or higher
- The project uses ES modules (import/export) syntax
- Run with the `--experimental-modules` flag if using an older Node version