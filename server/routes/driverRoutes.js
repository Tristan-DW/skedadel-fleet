import express from 'express';
import modelFactory from '../config/modelFactory.js';
import { transformDriver } from '../utils/responseHelpers.js';

const router = express.Router();

// @desc    Get all drivers
// @route   GET /api/drivers
// @access  Private
router.get('/', async (req, res) => {
  try {
    const drivers = await modelFactory.findAll('Driver', {
      include: [
        { association: 'user', attributes: ['name', 'email'] },
        { association: 'vehicle', attributes: ['name', 'licensePlate', 'type'] },
        { association: 'team', attributes: ['name'] }
      ],
      order: [['rank', 'ASC']]
    });

    res.status(200).json({ success: true, count: drivers.length, data: drivers.map(transformDriver) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get single driver
// @route   GET /api/drivers/:id
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const driver = await modelFactory.findByPk('Driver', req.params.id, {
      include: [
        { association: 'user', attributes: ['name', 'email', 'role'] },
        { association: 'vehicle', attributes: ['name', 'licensePlate', 'type', 'status'] },
        { association: 'team', attributes: ['name'] }
      ]
    });

    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }

    res.status(200).json({ success: true, data: transformDriver(driver) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create new driver
// @route   POST /api/drivers
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, status, vehicleId, teamId, latitude, longitude, address, location } = req.body;

    const createData = {
      name,
      phone,
      email,
      status: status || 'Available',
      vehicleId,
      teamId,
      latitude: latitude || 0,
      longitude: longitude || 0,
      address: address || ''
    };

    // Handle location object if provided
    if (location) {
      createData.latitude = location.lat || location.latitude || createData.latitude || 0;
      createData.longitude = location.lng || location.longitude || createData.longitude || 0;
      createData.address = location.address || createData.address || '';
    }

    const driver = await modelFactory.create('Driver', createData);

    res.status(201).json({ success: true, data: transformDriver(driver) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update driver
// @route   PUT /api/drivers/:id
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { name, phone, email, status, vehicleId, teamId, latitude, longitude, address, location } = req.body;

    const updateData = { name, phone, email, status, vehicleId, teamId, latitude, longitude, address };

    // Handle location object if provided (legacy frontend support)
    if (location) {
      updateData.latitude = location.lat || location.latitude || updateData.latitude || 0;
      updateData.longitude = location.lng || location.longitude || updateData.longitude || 0;
      updateData.address = location.address || updateData.address || '';
    }

    const driver = await modelFactory.update('Driver',
      updateData,
      { where: { id: req.params.id }, returning: true }
    );

    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }

    res.status(200).json({ success: true, data: transformDriver(driver) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update driver location
// @route   PATCH /api/drivers/:id/location
// @access  Private
router.patch('/:id/location', async (req, res) => {
  try {
    const { latitude, longitude, address, location } = req.body;

    const updateData = { latitude, longitude, address: address || '' };

    // Handle location object if provided
    if (location) {
      updateData.latitude = location.lat || location.latitude || updateData.latitude || 0;
      updateData.longitude = location.lng || location.longitude || updateData.longitude || 0;
      updateData.address = location.address || updateData.address || '';
    }

    const driver = await modelFactory.update('Driver',
      updateData,
      { where: { id: req.params.id }, returning: true }
    );

    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }

    res.status(200).json({ success: true, data: transformDriver(driver) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update driver status
// @route   PATCH /api/drivers/:id/status
// @access  Private
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    const driver = await modelFactory.update('Driver',
      { status },
      { where: { id: req.params.id }, returning: true }
    );

    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }

    res.status(200).json({ success: true, data: transformDriver(driver) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;