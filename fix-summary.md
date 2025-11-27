# Fix for Order API 500 Error

## Issue
The frontend was receiving a 500 Internal Server Error when trying to access the `/api/orders` endpoint, with the specific error message:
```
Association with alias "driverId" does not exist on order
```

## Root Cause
The issue was in how the modelFactory.js file was handling the conversion between Sequelize association aliases and MongoDB field names:

1. In the Sequelize implementation, associations are defined with aliases like 'driver', 'vehicle', and 'store' in associations.js:
   ```javascript
   Order.belongsTo(Driver, { foreignKey: 'driverId', as: 'driver' });
   Order.belongsTo(Vehicle, { foreignKey: 'vehicleId', as: 'vehicle' });
   Order.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });
   ```

2. In the MongoDB implementation, references are defined with field names like 'driverId', 'vehicleId', and 'storeId' in orderModel.js:
   ```javascript
   driverId: {
     type: mongoose.Schema.Types.ObjectId,
     ref: 'Driver',
     default: null
   }
   ```

3. The orderRoutes.js file was using Sequelize-style association aliases in the include options:
   ```javascript
   include: [
     { association: 'driver', attributes: ['name', 'status'] },
     { association: 'vehicle', attributes: ['name', 'licensePlate'] },
     { association: 'store', attributes: ['name', 'location'] }
   ]
   ```

4. The modelFactory.js file was trying to use these Sequelize association aliases directly with MongoDB's populate method, but MongoDB requires the actual field names for populate, not aliases.

## Solution
We modified the modelFactory.js file to correctly map Sequelize association aliases to MongoDB field names when using MongoDB:

1. Added a new method `getMongooseFieldName(modelName, associationAlias)` that maps Sequelize association aliases to MongoDB field names for specific models:
   ```javascript
   getMongooseFieldName(modelName, associationAlias) {
     // Define mappings for known models and their associations
     const mappings = {
       Order: {
         driver: 'driverId',
         vehicle: 'vehicleId',
         store: 'storeId',
         orderItems: 'orderItems',
         activityLog: 'activityLog'
       },
       // Add mappings for other models as needed
     };
     
     // Return the mapped field name if it exists, otherwise use the original alias
     if (mappings[modelName] && mappings[modelName][associationAlias]) {
       return mappings[modelName][associationAlias];
     }
     
     return associationAlias;
   }
   ```

2. Updated the include conversion logic in findAll, findOne, and findByPk methods to use this mapping function when determining the populate path:
   ```javascript
   const populates = options.include.map(include => {
     let populatePath;
     
     if (typeof include === 'string') {
       populatePath = include;
     } else if (include.association) {
       populatePath = this.getMongooseFieldName(modelName, include.association);
     } else if (include.as) {
       populatePath = this.getMongooseFieldName(modelName, include.as);
     } else {
       return null;
     }
     
     // If we have attributes, create a populate object with path and select
     if (include.attributes && Array.isArray(include.attributes)) {
       return {
         path: populatePath,
         select: include.attributes.join(' ')
       };
     }
     
     return populatePath;
   }).filter(Boolean);
   ```

3. Added support for including specific attributes in the populate by creating a populate object with path and select properties.

## Testing
A test script (test-orders-api.js) was created to verify that the API endpoint works correctly with these changes. The script makes a request to the /api/orders endpoint and checks if it returns the expected response with properly populated associations.

## Benefits of the Solution
1. **Maintainability**: The mapping approach allows us to keep using Sequelize-style association aliases in the routes, making the code more consistent and easier to maintain.
2. **Flexibility**: The solution works with both Sequelize and MongoDB, allowing the application to switch between database systems without changing the route code.
3. **Extensibility**: The mapping can be easily extended to support other models and associations as needed.

## Future Considerations
If additional models with associations are added to the system, their mappings should be added to the `getMongooseFieldName` method in modelFactory.js to ensure proper conversion between Sequelize association aliases and MongoDB field names.