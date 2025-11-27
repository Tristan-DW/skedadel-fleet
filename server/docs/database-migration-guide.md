# Database Migration Guide: MongoDB to MySQL with Sequelize

This guide explains how to update route files to use the model factory, which abstracts away the database implementation details and allows the application to work with both MongoDB and MySQL/Sequelize.

## Overview

The application has been updated to support both MongoDB (NoSQL) and MySQL (SQL) databases. A model factory has been created to abstract away the database implementation details, allowing route handlers to use a consistent interface regardless of which database is being used.

The database to use is determined by the `USE_SQL_DATABASE` environment variable in the `.env` file:
- When `USE_SQL_DATABASE=true`, the application uses MySQL with Sequelize
- When `USE_SQL_DATABASE=false`, the application uses MongoDB with Mongoose

## Model Factory

The model factory (`server/config/modelFactory.js`) provides a unified interface for accessing models and performing database operations. It includes methods for common operations like finding, creating, updating, and deleting records.

### Key Methods

- `getModel(modelName)`: Get a model by name
- `findAll(modelName, options)`: Find all records of a model
- `findOne(modelName, options)`: Find a single record of a model
- `findByPk(modelName, id, options)`: Find a record by primary key
- `create(modelName, data)`: Create a new record
- `update(modelName, data, options)`: Update a record
- `delete(modelName, options)`: Delete a record

## Updating Route Files

To update a route file to use the model factory, follow these steps:

1. Import the model factory instead of the specific model:
   ```javascript
   // Before
   import User from '../models/userModel.js';
   
   // After
   import modelFactory from '../config/modelFactory.js';
   ```

2. Replace direct model operations with model factory methods:

   | MongoDB Operation | Model Factory Equivalent |
   |-------------------|--------------------------|
   | `Model.find()` | `modelFactory.findAll('ModelName')` |
   | `Model.findOne({ field: value })` | `modelFactory.findOne('ModelName', { where: { field: value } })` |
   | `Model.findById(id)` | `modelFactory.findByPk('ModelName', id)` |
   | `Model.create(data)` | `modelFactory.create('ModelName', data)` |
   | `Model.findByIdAndUpdate(id, data, options)` | `modelFactory.update('ModelName', data, { where: { id }, ...options })` |
   | `document.remove()` | `modelFactory.delete('ModelName', { where: { id: document.id } })` |

3. Handle differences between MongoDB and Sequelize models:

   - ID field: MongoDB uses `_id`, Sequelize uses `id`
   ```javascript
   const userId = user.id || user._id;
   ```

   - Instance methods: Check if a method exists before calling it
   ```javascript
   if (typeof user.someMethod === 'function') {
     await user.someMethod();
   } else {
     // Alternative implementation
   }
   ```

   - Password handling: MongoDB uses select('+password'), Sequelize uses scopes
   ```javascript
   let user;
   const UserModel = modelFactory.getModel('User');
   
   if (process.env.USE_SQL_DATABASE === 'true') {
     // Sequelize model
     user = await UserModel.scope('withPassword').findOne({ where: { email } });
   } else {
     // MongoDB model
     user = await UserModel.findOne({ email }).select('+password');
   }
   ```

## Example: User Routes

The `userRoutes.js` file has been updated to use the model factory. Here are some examples of the changes:

### Get All Users

```javascript
// Before
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// After
router.get('/', async (req, res) => {
  try {
    const users = await modelFactory.findAll('User');
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

### Get User by ID

```javascript
// Before
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// After
router.get('/:id', async (req, res) => {
  try {
    const user = await modelFactory.findByPk('User', req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

### Create User

```javascript
// Before
router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// After
router.post('/', async (req, res) => {
  try {
    const user = await modelFactory.create('User', req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

### Update User

```javascript
// Before
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// After
router.put('/:id', async (req, res) => {
  try {
    // Check if user exists
    const user = await modelFactory.findByPk('User', req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Update user
    const updatedUser = await modelFactory.update('User', 
      req.body,
      { 
        where: { id: req.params.id },
        returning: true
      }
    );
    
    res.status(200).json({ success: true, data: updatedUser || user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

### Delete User

```javascript
// Before
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    await user.remove();
    
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// After
router.delete('/:id', async (req, res) => {
  try {
    // Check if user exists
    const user = await modelFactory.findByPk('User', req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Delete user
    if (typeof user.remove === 'function') {
      // MongoDB model
      await user.remove();
    } else {
      // Sequelize model
      await modelFactory.delete('User', { 
        where: { id: req.params.id } 
      });
    }
    
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

## Conclusion

By using the model factory, the application can work with both MongoDB and MySQL databases without changing the route handlers. This allows for a smooth transition from MongoDB to MySQL, and provides flexibility for future database changes.

To update the remaining route files, follow the patterns shown in this guide and the examples in `userRoutes.js`.