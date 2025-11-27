# Skedadel Fleet Management System API Documentation

This document provides detailed information about the API endpoints available in the Skedadel Fleet Management System.

## Table of Contents

- [Authentication](#authentication)
- [Users](#users)
- [Drivers](#drivers)
- [Vehicles](#vehicles)
- [Teams](#teams)
- [Hubs](#hubs)
- [Stores](#stores)
- [Geofences](#geofences)
- [Exclusion Zones](#exclusion-zones)
- [Orders](#orders)
- [Alerts](#alerts)
- [Challenges](#challenges)
- [Driver Challenges](#driver-challenges)
- [Webhooks](#webhooks)
- [Invoices](#invoices)

## Authentication

The API uses JWT (JSON Web Token) for authentication. To access protected endpoints, you need to include the JWT token in the Authorization header of your requests.

### Register a new user

```
POST /api/users/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "Admin"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Admin",
    "lastLogin": "2023-06-22T10:00:00.000Z"
  }
}
```

### Login

```
POST /api/users/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Admin",
    "lastLogin": "2023-06-22T10:00:00.000Z"
  }
}
```

## Users

### Get all users

```
GET /api/users
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "60d21b4667d0d8992e610c85",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "Admin",
      "lastLogin": "2023-06-22T10:00:00.000Z"
    },
    {
      "id": "60d21b4667d0d8992e610c86",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "Manager",
      "lastLogin": "2023-06-21T10:00:00.000Z"
    }
  ]
}
```

### Get a single user

```
GET /api/users/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Admin",
    "lastLogin": "2023-06-22T10:00:00.000Z"
  }
}
```

### Update a user

```
PUT /api/users/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "email": "john.updated@example.com",
  "role": "Manager"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "John Doe Updated",
    "email": "john.updated@example.com",
    "role": "Manager",
    "lastLogin": "2023-06-22T10:00:00.000Z"
  }
}
```

### Delete a user

```
DELETE /api/users/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {}
}
```

## Drivers

### Get all drivers

```
GET /api/drivers
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "60d21b4667d0d8992e610c87",
      "name": "Driver One",
      "phone": "123-456-7890",
      "email": "driver1@example.com",
      "location": {
        "lat": 37.7749,
        "lng": -122.4194,
        "address": "San Francisco, CA"
      },
      "status": "Available",
      "vehicleId": "60d21b4667d0d8992e610c90",
      "teamId": "60d21b4667d0d8992e610c95",
      "points": 100,
      "rank": 1
    },
    {
      "id": "60d21b4667d0d8992e610c88",
      "name": "Driver Two",
      "phone": "123-456-7891",
      "email": "driver2@example.com",
      "location": {
        "lat": 37.7749,
        "lng": -122.4194,
        "address": "San Francisco, CA"
      },
      "status": "On Duty",
      "vehicleId": "60d21b4667d0d8992e610c91",
      "teamId": "60d21b4667d0d8992e610c95",
      "points": 90,
      "rank": 2
    }
  ]
}
```

### Get a single driver

```
GET /api/drivers/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "60d21b4667d0d8992e610c87",
    "name": "Driver One",
    "phone": "123-456-7890",
    "email": "driver1@example.com",
    "location": {
      "lat": 37.7749,
      "lng": -122.4194,
      "address": "San Francisco, CA"
    },
    "status": "Available",
    "vehicleId": {
      "id": "60d21b4667d0d8992e610c90",
      "name": "Vehicle One",
      "type": "Van",
      "licensePlate": "ABC123",
      "status": "Active"
    },
    "teamId": {
      "id": "60d21b4667d0d8992e610c95",
      "name": "Team One",
      "hubId": "60d21b4667d0d8992e610c99"
    },
    "points": 100,
    "rank": 1,
    "orders": [
      {
        "id": "60d21b4667d0d8992e610c80",
        "title": "Order #123",
        "status": "In Progress",
        "priority": "High",
        "createdAt": "2023-06-22T10:00:00.000Z"
      }
    ],
    "challenges": [
      {
        "id": "60d21b4667d0d8992e610c70",
        "challengeId": {
          "id": "60d21b4667d0d8992e610c60",
          "name": "Complete 10 Orders",
          "description": "Complete 10 orders in a day",
          "type": "COMPLETE_ORDERS",
          "goal": 10,
          "points": 100
        },
        "progress": 5,
        "isCompleted": false
      }
    ]
  }
}
```

### Create a new driver

```
POST /api/drivers
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Driver Three",
  "phone": "123-456-7892",
  "email": "driver3@example.com",
  "vehicleId": "60d21b4667d0d8992e610c92",
  "teamId": "60d21b4667d0d8992e610c95"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "60d21b4667d0d8992e610c89",
    "name": "Driver Three",
    "phone": "123-456-7892",
    "email": "driver3@example.com",
    "location": {
      "lat": 0,
      "lng": 0,
      "address": "Offline"
    },
    "status": "Offline",
    "vehicleId": "60d21b4667d0d8992e610c92",
    "teamId": "60d21b4667d0d8992e610c95",
    "points": 0,
    "rank": 0
  }
}
```

### Update a driver

```
PUT /api/drivers/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Driver Three Updated",
  "phone": "123-456-7893",
  "email": "driver3.updated@example.com",
  "status": "Available",
  "vehicleId": "60d21b4667d0d8992e610c92",
  "teamId": "60d21b4667d0d8992e610c95",
  "location": {
    "lat": 37.7749,
    "lng": -122.4194,
    "address": "San Francisco, CA"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "60d21b4667d0d8992e610c89",
    "name": "Driver Three Updated",
    "phone": "123-456-7893",
    "email": "driver3.updated@example.com",
    "location": {
      "lat": 37.7749,
      "lng": -122.4194,
      "address": "San Francisco, CA"
    },
    "status": "Available",
    "vehicleId": "60d21b4667d0d8992e610c92",
    "teamId": "60d21b4667d0d8992e610c95",
    "points": 0,
    "rank": 0
  }
}
```

### Update driver location

```
PATCH /api/drivers/:id/location
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "lat": 37.7749,
  "lng": -122.4194,
  "address": "San Francisco, CA"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "60d21b4667d0d8992e610c89",
    "location": {
      "lat": 37.7749,
      "lng": -122.4194,
      "address": "San Francisco, CA"
    }
  }
}
```

### Update driver status

```
PATCH /api/drivers/:id/status
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "On Duty"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "60d21b4667d0d8992e610c89",
    "status": "On Duty"
  }
}
```

### Delete a driver

```
DELETE /api/drivers/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {}
}
```

### Get drivers by team

```
GET /api/drivers/team/:teamId
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "60d21b4667d0d8992e610c87",
      "name": "Driver One",
      "phone": "123-456-7890",
      "email": "driver1@example.com",
      "status": "Available",
      "vehicleId": {
        "id": "60d21b4667d0d8992e610c90",
        "name": "Vehicle One",
        "type": "Van",
        "licensePlate": "ABC123",
        "status": "Active"
      }
    },
    {
      "id": "60d21b4667d0d8992e610c88",
      "name": "Driver Two",
      "phone": "123-456-7891",
      "email": "driver2@example.com",
      "status": "On Duty",
      "vehicleId": {
        "id": "60d21b4667d0d8992e610c91",
        "name": "Vehicle Two",
        "type": "Van",
        "licensePlate": "DEF456",
        "status": "Active"
      }
    }
  ]
}
```

### Get available drivers

```
GET /api/drivers/status/available
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "60d21b4667d0d8992e610c87",
      "name": "Driver One",
      "phone": "123-456-7890",
      "email": "driver1@example.com",
      "status": "Available",
      "vehicleId": {
        "id": "60d21b4667d0d8992e610c90",
        "name": "Vehicle One",
        "type": "Van",
        "licensePlate": "ABC123",
        "status": "Active"
      },
      "teamId": {
        "id": "60d21b4667d0d8992e610c95",
        "name": "Team One"
      }
    }
  ]
}
```

## Additional Endpoints

For brevity, this document doesn't include detailed documentation for all endpoints. The pattern for other resources (Vehicles, Teams, Hubs, etc.) follows a similar RESTful structure:

- `GET /api/<resource>` - Get all resources
- `GET /api/<resource>/:id` - Get a single resource
- `POST /api/<resource>` - Create a new resource
- `PUT /api/<resource>/:id` - Update a resource
- `DELETE /api/<resource>/:id` - Delete a resource

Each resource may also have additional specialized endpoints, such as:

- `GET /api/orders/driver/:driverId` - Get orders for a specific driver
- `GET /api/stores/hub/:hubId` - Get stores for a specific hub
- `PATCH /api/orders/:id/status` - Update order status
- `POST /api/webhooks/trigger` - Trigger a webhook event

## Error Responses

All endpoints return a consistent error format:

```json
{
  "success": false,
  "message": "Error message describing what went wrong"
}
```

Common HTTP status codes:

- `200 OK` - Request succeeded
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Missing or invalid authentication
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Pagination

Many endpoints that return lists of resources support pagination:

```
GET /api/orders?page=2&limit=10
```

The response includes pagination information:

```json
{
  "success": true,
  "count": 10,
  "total": 45,
  "pagination": {
    "page": 2,
    "limit": 10,
    "totalPages": 5
  },
  "data": [
    {
      "id": "60d21b4667d0d8992e610c80",
      "title": "Order #123",
      "status": "In Progress",
      "priority": "High"
    },
    {
      "id": "60d21b4667d0d8992e610c81",
      "title": "Order #124",
      "status": "Assigned",
      "priority": "Medium"
    }
  ]
}
```

Note: The actual response would contain more items in the data array.

## Filtering

Many endpoints support filtering by various parameters:

```
GET /api/orders?status=In%20Progress&priority=High
GET /api/drivers?status=Available
GET /api/alerts?priority=high&isRead=false
```

## Conclusion

This API documentation provides an overview of the available endpoints in the Skedadel Fleet Management System. For more detailed information about specific endpoints or for any questions, please contact the development team.