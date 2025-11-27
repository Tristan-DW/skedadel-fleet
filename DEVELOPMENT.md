# Development Guide for Skedadel Fleet Management System

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Configure environment variables:
   - Copy `.env.example` to `.env` (if it doesn't exist already)
   - Update the database connection details
   - Set `USE_SQL_DATABASE` to `true` for MySQL or `false` for MongoDB

## Running the Application

The application consists of two parts:
- Frontend: A React application built with Vite
- Backend: An Express.js server

### Development Mode

To run both the frontend and backend servers simultaneously in development mode:

```
npm run dev
```

This will start:
- Frontend server at http://localhost:3000
- Backend API server at http://localhost:5000

You can also run each server separately:

```
# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend
```

### Production Build

To create a production build:

```
npm run build
```

## Available Scripts

- `npm run dev` - Start both frontend and backend servers in development mode
- `npm run dev:frontend` - Start only the frontend Vite development server
- `npm run dev:backend` - Start only the backend Express.js server with nodemon
- `npm run build` - Create a production build of the frontend

## Database Configuration

The system supports both MongoDB and MySQL databases:

```
# In .env file
USE_SQL_DATABASE=true  # Use MySQL
USE_SQL_DATABASE=false # Use MongoDB
```

## API Documentation

For detailed API documentation, see the [API Docs](./server/docs/api-docs.md) file.