import express from 'express';
import modelFactory from '../config/modelFactory.js';

const router = express.Router();

// @desc    Get all exclusion zones
// @route   GET /api/exclusion-zones
// @access  Private
router.get('/', async (req, res) => {
  try {
    const zones = await modelFactory.findAll('ExclusionZone', {
      order: [['name', 'ASC']]
    });

    res.status(200).json({ success: true, count: zones.length, data: zones });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get single exclusion zone
// @route   GET /api/exclusion-zones/:id
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const zone = await modelFactory.findByPk('ExclusionZone', req.params.id);

    if (!zone) {
      return res.status(404).json({ success: false, message: 'Exclusion zone not found' });
    }

    res.status(200).json({ success: true, data: zone });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create new exclusion zone
// @route   POST /api/exclusion-zones
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { name, coordinates, type } = req.body;

    const zone = await modelFactory.create('ExclusionZone', {
      name,
      coordinates,
      type: type || 'Slow-down'
    });

    res.status(201).json({ success: true, data: zone });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update exclusion zone
// @route   PUT /api/exclusion-zones/:id
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { name, coordinates, type } = req.body;

    const zone = await modelFactory.update('ExclusionZone',
      { name, coordinates, type },
      { where: { id: req.params.id }, returning: true }
    );

    if (!zone) {
      return res.status(404).json({ success: false, message: 'Exclusion zone not found' });
    }

    res.status(200).json({ success: true, data: zone });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete exclusion zone
// @route   DELETE /api/exclusion-zones/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await modelFactory.delete('ExclusionZone', {
      where: { id: req.params.id }
    });

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Exclusion zone not found' });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;