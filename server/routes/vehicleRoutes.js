import express from 'express';
import modelFactory from '../config/modelFactory.js';

const router = express.Router();

// @desc    Get all vehicles
// @route   GET /api/vehicles
// @access  Private
router.get('/', async (req, res) => {
  try {
    const vehicles = await modelFactory.findAll('Vehicle', {
      order: [['name', 'ASC']]
    });

    res.status(200).json({ success: true, count: vehicles.length, data: vehicles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get single vehicle
// @route   GET /api/vehicles/:id
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const vehicle = await modelFactory.findByPk('Vehicle', req.params.id);

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    res.status(200).json({ success: true, data: vehicle });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create new vehicle
// @route   POST /api/vehicles
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { name, type, licensePlate, status } = req.body;

    const vehicle = await modelFactory.create('Vehicle', {
      name,
      type,
      licensePlate,
      status: status || 'Active'
    });

    res.status(201).json({ success: true, data: vehicle });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update vehicle
// @route   PUT /api/vehicles/:id
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { name, type, licensePlate, status } = req.body;

    const vehicle = await modelFactory.update('Vehicle',
      { name, type, licensePlate, status },
      { where: { id: req.params.id }, returning: true }
    );

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    res.status(200).json({ success: true, data: vehicle });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await modelFactory.delete('Vehicle', {
      where: { id: req.params.id }
    });

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;