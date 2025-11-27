import express from 'express';
import modelFactory from '../config/modelFactory.js';
import { transformHub } from '../utils/responseHelpers.js';

const router = express.Router();

// @desc    Get all hubs
// @route   GET /api/hubs
// @access  Private
router.get('/', async (req, res) => {
  try {
    const hubs = await modelFactory.findAll('Hub', {
      include: [
        { association: 'geofence', attributes: ['name'] }
      ],
      order: [['name', 'ASC']]
    });

    res.status(200).json({ success: true, count: hubs.length, data: hubs.map(transformHub) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get single hub
// @route   GET /api/hubs/:id
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const hub = await modelFactory.findByPk('Hub', req.params.id, {
      include: [
        { association: 'geofence', attributes: ['name', 'coordinates'] },
        { association: 'teams', attributes: ['name'] },
        { association: 'stores', attributes: ['name', 'status'] }
      ]
    });

    if (!hub) {
      return res.status(404).json({ success: false, message: 'Hub not found' });
    }

    res.status(200).json({ success: true, data: transformHub(hub) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

// @desc    Create new hub
// @route   POST /api/hubs
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { name, latitude, longitude, address, geofenceId, location } = req.body;

    const createData = { name, latitude, longitude, address, geofenceId };

    // Handle location object if provided
    if (location) {
      createData.latitude = location.lat || location.latitude || createData.latitude || 0;
      createData.longitude = location.lng || location.longitude || createData.longitude || 0;
      createData.address = location.address || createData.address || '';
    }

    const hub = await modelFactory.create('Hub', createData);

    res.status(201).json({ success: true, data: transformHub(hub) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update hub
// @route   PUT /api/hubs/:id
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { name, latitude, longitude, address, geofenceId, location } = req.body;

    const updateData = { name, latitude, longitude, address, geofenceId };

    // Handle location object if provided
    if (location) {
      updateData.latitude = location.lat || location.latitude || updateData.latitude || 0;
      updateData.longitude = location.lng || location.longitude || updateData.longitude || 0;
      updateData.address = location.address || updateData.address || '';
    }

    const hub = await modelFactory.update('Hub',
      updateData,
      { where: { id: req.params.id }, returning: true }
    );

    if (!hub) {
      return res.status(404).json({ success: false, message: 'Hub not found' });
    }

    res.status(200).json({ success: true, data: transformHub(hub) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});