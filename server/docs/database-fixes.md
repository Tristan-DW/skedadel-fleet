# Database Fixes Documentation

This document outlines recent fixes applied to resolve database synchronization and seeding issues.

## Fix 1: DriverChallenge Model Index Issue

### Issue Description

The database synchronization was failing with the following error:

```
Error: Key column 'driverId' doesn't exist in table
```

This error occurred when trying to add a unique index to the `driver_challenges` table for the columns `driverId` and `challengeId`. The error indicates that the `driverId` column doesn't exist in the table, even though it's defined in the model.

### Root Cause Analysis

The issue was in the Sequelize DriverChallenge model definition (`server/models/sequelize/DriverChallenge.js`). The model defined a unique index on the `driverId` and `challengeId` columns, but for some reason, these columns were not being created in the database before the index creation was attempted.

This is similar to the issue we previously fixed with the Alert model, where an index was being created before the columns existed in the database.

### Fix Applied

The fix was to temporarily remove the problematic index from the DriverChallenge model definition:

```javascript
// Before:
indexes: [
  // Compound index to ensure a driver can only have one instance of each challenge
  {
    unique: true,
    fields: ['driverId', 'challengeId']
  }
],

// After:
indexes: [
  // Temporarily removed the compound index on driverId and challengeId
  // Will add back after table is properly created
  // {
  //   unique: true,
  //   fields: ['driverId', 'challengeId']
  // }
],
```

This allows the database synchronization to proceed without errors. The columns themselves are still defined in the model, so they should be created in the database table.

## Fix 2: Geofence Coordinates Format Issue

### Issue Description

During database seeding, the following error was occurring:

```
Error seeding database: ValidationError [SequelizeValidationError]: Validation error: Invalid coordinates format
```

This error occurred when trying to seed geofence data into the database.

### Root Cause Analysis

The issue was in the way coordinates were being passed to the Geofence model. In the seed data (`server/config/seedDatabase.js`), the coordinates were being pre-stringified using `JSON.stringify()` before being passed to the model:

```javascript
coordinates: JSON.stringify([
  { lat: -26.09, lng: 28.04 }, 
  { lat: -26.09, lng: 28.07 }, 
  { lat: -26.12, lng: 28.07 }, 
  { lat: -26.12, lng: 28.04 }
]),
```

However, the Geofence model's setter for coordinates expects an array of coordinates, not a pre-stringified JSON string:

```javascript
set(value) {
  if (Array.isArray(value)) {
    // Validate that we have at least 3 coordinates for a valid polygon
    if (value.length < 3) {
      throw new Error('A geofence must have at least 3 coordinates');
    }
    this.setDataValue('coordinates', JSON.stringify(value));
  } else {
    this.setDataValue('coordinates', '[]');
  }
},
```

When a pre-stringified JSON string is passed, it's not recognized as an array, so the model sets the coordinates to '[]'. Then, when the validation function runs, it tries to parse this string and validate it, but it fails because '[]' doesn't represent a valid geofence (needs at least 3 coordinates).

### Fix Applied

The fix was to remove the `JSON.stringify()` calls in the seed data, so that arrays are passed directly to the Geofence model:

```javascript
// Before:
coordinates: JSON.stringify([
  { lat: -26.09, lng: 28.04 }, 
  { lat: -26.09, lng: 28.07 }, 
  { lat: -26.12, lng: 28.07 }, 
  { lat: -26.12, lng: 28.04 }
]),

// After:
coordinates: [
  { lat: -26.09, lng: 28.04 }, 
  { lat: -26.09, lng: 28.07 }, 
  { lat: -26.12, lng: 28.07 }, 
  { lat: -26.12, lng: 28.04 }
],
```

This change was applied to all geofences and exclusion zones in the seed data.

## Recommendations for Preventing Similar Issues

### For Index Issues:

1. **Use migrations for schema changes**: Instead of relying on automatic synchronization, consider using Sequelize migrations for schema changes. This gives you more control over the process and makes it easier to track and revert changes.

2. **Add indexes after table creation**: If you continue to use automatic synchronization, consider adding indexes in a separate step after ensuring the tables and columns exist:

   ```javascript
   // First sync without indexes
   await sequelize.sync({ force: true });
   
   // Then add indexes
   await queryInterface.addIndex('driver_challenges', ['driverId', 'challengeId'], {
     unique: true,
     name: 'driver_challenges_driver_id_challenge_id'
   });
   ```

3. **Verify database schema**: Regularly check that your model definitions match the actual database schema, especially after making changes to models.

### For Data Format Issues:

1. **Match data format to model expectations**: Ensure that the data format matches what the model expects. For example, if a model setter expects an array, don't pass a string.

2. **Add clear documentation**: Document the expected format for complex data types like coordinates to avoid confusion.

3. **Add robust validation**: Enhance validation to handle different input formats gracefully, providing clear error messages.

4. **Use type checking**: Add explicit type checking in setters and validation functions to prevent type-related issues.

## Future Considerations

Once the database tables are properly created with all columns, you can add back the indexes that were temporarily removed:

```javascript
// For DriverChallenge model
indexes: [
  // Compound index to ensure a driver can only have one instance of each challenge
  {
    unique: true,
    fields: ['driverId', 'challengeId']
  }
],

// For Alert model (previously fixed)
indexes: [
  // Index for faster queries
  {
    fields: ['timestamp']
  },
  // Index for polymorphic associations
  {
    fields: ['relatedEntityType', 'relatedEntityId']
  }
],
```

Consider implementing a more robust database initialization process that:

1. Creates tables without indexes first
2. Verifies that all required columns exist
3. Adds indexes in a separate step
4. Provides clear error messages for any issues encountered

This approach would be more resilient to the types of issues we've encountered.