# Skedadel API Testing Guide

## Application Status
✅ **Backend Server**: Running on `http://localhost:5000`
✅ **Frontend**: Running on `http://localhost:5173` (Vite dev server)

## Testing the API

### Option 1: Using Postman (Recommended)
1. **Import the Collection**:
   - Open Postman
   - Click "Import" → "File"
   - Select: `skedadel_api_collection.json`
   - The collection will load with all endpoints and example payloads

2. **Base URL**: Already configured as `http://localhost:5000/api`

3. **Test Flow** (Recommended Order):
   ```
   1. Create a Hub → Get the ID
   2. Create a Geofence → Get the ID
   3. Create a Store (use Hub ID) → Get the ID
   4. Create a Team (use Hub ID) → Get the ID
   5. Create a Vehicle → Get the ID
   6. Create a Driver (use Team ID, Vehicle ID) → Get the ID
   7. Create an Order (use Store ID, optionally Driver ID)
   ```

### Option 2: Using Thunder Client (VS Code Extension)
1. Install "Thunder Client" extension in VS Code
2. Import the `skedadel_api_collection.json` file
3. Same usage as Postman

### Option 3: Using cURL (Command Line)
```bash
# Example: Create a Geofence
curl -X POST http://localhost:5000/api/geofences \
  -H "Content-Type: application/json" \
  -d '{
    "name": "JHB Central",
    "color": "#ff0000",
    "coordinates": [
      {"lat": -26.2, "lng": 28.0},
      {"lat": -26.21, "lng": 28.0},
      {"lat": -26.21, "lng": 28.01},
      {"lat": -26.2, "lng": 28.01}
    ]
  }'
```

## Available Endpoints

### Core Resources (Full CRUD)
- **Orders**: `/api/orders`
- **Drivers**: `/api/drivers`
- **Stores**: `/api/stores`
- **Hubs**: `/api/hubs`
- **Teams**: `/api/teams`
- **Vehicles**: `/api/vehicles`
- **Users**: `/api/users`

### Supporting Resources (Full CRUD)
- **Geofences**: `/api/geofences`
- **Exclusion Zones**: `/api/exclusion-zones`
- **Challenges**: `/api/challenges`
- **Invoices**: `/api/invoices`
- **Webhooks**: `/api/webhooks`
- **Alerts**: `/api/alerts`

### Special Endpoints
- **Tookan-Compatible**: `/api/v2/create_task`, `/api/add_agent`, etc.

## Quick Test Examples

### 1. Create a Geofence (No Dependencies)
```json
POST http://localhost:5000/api/geofences
{
  "name": "Test Zone",
  "color": "#00ff00",
  "coordinates": [
    {"lat": -26.2, "lng": 28.0},
    {"lat": -26.21, "lng": 28.0},
    {"lat": -26.21, "lng": 28.01}
  ]
}
```

### 2. Get All Geofences
```
GET http://localhost:5000/api/geofences
```

### 3. Create a Hub (Use Geofence ID from step 1)
```json
POST http://localhost:5000/api/hubs
{
  "name": "Main Hub",
  "location": {
    "lat": -26.2041,
    "lng": 28.0473,
    "address": "Johannesburg"
  },
  "geofenceId": "PASTE_GEOFENCE_ID_HERE"
}
```

## Notes
- Replace placeholder IDs (e.g., `REPLACE_WITH_STORE_ID`) with actual IDs from created resources
- All location data uses nested objects: `{"lat": number, "lng": number, "address": string}`
- The API returns data in the format: `{"success": true, "data": {...}}`
