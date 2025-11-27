import express from 'express';
import modelFactory from '../config/modelFactory.js';

const router = express.Router();

// @desc    Get all geofences
// @route   GET /api/geofences
// @access  Private
router.get('/', async (req, res) => {
  try {
    const geofences = await modelFactory.findAll('Geofence', {
      order: [['name', 'ASC']]
    });

    res.status(200).json({ success: true, count: geofences.length, data: geofences });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get single geofence
// @route   GET /api/geofences/:id
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const geofence = await modelFactory.findByPk('Geofence', req.params.id);

    if (!geofence) {
      return res.status(404).json({ success: false, message: 'Geofence not found' });
    }

    res.status(200).json({ success: true, data: geofence });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create new geofence
// @route   POST /api/geofences
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { name, coordinates, color } = req.body;

    const geofence = await modelFactory.create('Geofence', {
      name,
      coordinates,
      color
    });

    res.status(201).json({ success: true, data: geofence });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update geofence
// @route   PUT /api/geofences/:id
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { name, coordinates, color } = req.body;

    const geofence = await modelFactory.update('Geofence',
      { name, coordinates, color },
      { where: { id: req.params.id }, returning: true }
    );

    if (!geofence) {
      return res.status(404).json({ success: false, message: 'Geofence not found' });
    }

    res.status(200).json({ success: true, data: geofence });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete geofence
// @route   DELETE /api/geofences/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await modelFactory.delete('Geofence', {
      where: { id: req.params.id }
    });

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Geofence not found' });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;