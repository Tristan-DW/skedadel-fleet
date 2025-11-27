import express from 'express';
import modelFactory from '../config/modelFactory.js';
import { transformStore } from '../utils/responseHelpers.js';

const router = express.Router();

// @desc    Get all stores
// @route   GET /api/stores
// @access  Private
router.get('/', async (req, res) => {
  try {
    const stores = await modelFactory.findAll('Store', {
      include: [
        { association: 'hub', attributes: ['name'] }
      ],
      order: [['name', 'ASC']]
    });

    res.status(200).json({ success: true, count: stores.length, data: stores.map(transformStore) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get single store
// @route   GET /api/stores/:id
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const store = await modelFactory.findByPk('Store', req.params.id, {
      include: [
        { association: 'hub', attributes: ['name', 'latitude', 'longitude', 'address'] }
      ]
    });

    if (!store) {
      return res.status(404).json({ success: false, message: 'Store not found' });
    }

    res.status(200).json({ success: true, data: transformStore(store) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create new store
// @route   POST /api/stores
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { name, latitude, longitude, address, manager, hubId, status, location } = req.body;

    const createData = {
      name,
      latitude,
      longitude,
      address,
      manager,
      hubId,
      status: status || 'ONLINE'
    };

    // Handle location object if provided
    if (location) {
      createData.latitude = location.lat || location.latitude || createData.latitude || 0;
      createData.longitude = location.lng || location.longitude || createData.longitude || 0;
      createData.address = location.address || createData.address || '';
    }

    const store = await modelFactory.create('Store', createData);

    res.status(201).json({ success: true, data: transformStore(store) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update store
// @route   PUT /api/stores/:id
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { name, latitude, longitude, address, manager, hubId, status, location } = req.body;

    const updateData = { name, latitude, longitude, address, manager, hubId, status };

    // Handle location object if provided (legacy frontend support)
    if (location) {
      updateData.latitude = location.lat || location.latitude || updateData.latitude || 0;
      updateData.longitude = location.lng || location.longitude || updateData.longitude || 0;
      updateData.address = location.address || updateData.address || '';
    }

    const store = await modelFactory.update('Store',
      updateData,
      { where: { id: req.params.id }, returning: true }
    );

    if (!store) {
      return res.status(404).json({ success: false, message: 'Store not found' });
    }

    res.status(200).json({ success: true, data: transformStore(store) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete store
// @route   DELETE /api/stores/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await modelFactory.delete('Store', {
      where: { id: req.params.id }
    });

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Store not found' });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;