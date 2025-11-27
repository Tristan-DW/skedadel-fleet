import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import modelFactory from '../config/modelFactory.js';

const router = express.Router();

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const userExists = await modelFactory.findOne('User', { 
      where: { email } 
    });
    
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Create user
    const user = await modelFactory.create('User', {
      name,
      email,
      password,
      role
    });

    // Generate token - handle both MongoDB and Sequelize models
    let token;
    if (typeof user.getSignedJwtToken === 'function') {
      // MongoDB model
      token = user.getSignedJwtToken();
    } else {
      // Sequelize model
      token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
      });
    }

    // Handle both MongoDB (_id) and Sequelize (id) identifier fields
    const userId = user.id || user._id;

    res.status(201).json({
      success: true,
      token,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide an email and password' });
    }

    // Check for user - handle both MongoDB and Sequelize models
    let user;
    const UserModel = modelFactory.getModel('User');
    
    if (process.env.USE_SQL_DATABASE === 'true') {
      // Sequelize model
      user = await UserModel.scope('withPassword').findOne({ where: { email } });
    } else {
      // MongoDB model
      user = await modelFactory.findOne('User', { 
        where: { email }
      });
      
      // In MongoDB, we need to explicitly select the password field
      if (user && !user.password) {
        user = await UserModel.findOne({ email }).select('+password');
      }
    }
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if password matches - handle both MongoDB and Sequelize models
    let isMatch;
    if (typeof user.matchPassword === 'function') {
      // MongoDB model
      isMatch = await user.matchPassword(password);
    } else {
      // Sequelize model
      isMatch = await bcrypt.compare(password, user.password);
    }
    
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = Date.now();
    
    if (typeof user.save === 'function') {
      // MongoDB model or Sequelize instance
      await user.save();
    } else {
      // Sequelize model without instance
      await modelFactory.update('User', 
        { lastLogin: Date.now() }, 
        { where: { id: user.id } }
      );
    }

    // Generate token - handle both MongoDB and Sequelize models
    let token;
    if (typeof user.getSignedJwtToken === 'function') {
      // MongoDB model
      token = user.getSignedJwtToken();
    } else {
      // Sequelize model
      token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
      });
    }

    // Handle both MongoDB (_id) and Sequelize (id) identifier fields
    const userId = user.id || user._id;

    res.status(200).json({
      success: true,
      token,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
router.get('/', async (req, res) => {
  try {
    const users = await modelFactory.findAll('User');
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
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

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
router.put('/:id', async (req, res) => {
  try {
    const { name, email, role } = req.body;
    
    // Check if user exists
    const user = await modelFactory.findByPk('User', req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Update user
    const updatedUser = await modelFactory.update('User', 
      { name, email, role },
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

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
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

export default router;