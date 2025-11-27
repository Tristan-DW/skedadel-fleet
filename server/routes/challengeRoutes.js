import express from 'express';
import modelFactory from '../config/modelFactory.js';

const router = express.Router();

// @desc    Get all challenges
// @route   GET /api/challenges
// @access  Private
router.get('/', async (req, res) => {
  try {
    const challenges = await modelFactory.findAll('Challenge', {
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ success: true, count: challenges.length, data: challenges });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get single challenge
// @route   GET /api/challenges/:id
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const challenge = await modelFactory.findByPk('Challenge', req.params.id);

    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }

    res.status(200).json({ success: true, data: challenge });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create new challenge
// @route   POST /api/challenges
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { name, description, type, goal, points, isActive } = req.body;

    const challenge = await modelFactory.create('Challenge', {
      name,
      description,
      type,
      goal,
      points,
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json({ success: true, data: challenge });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update challenge
// @route   PUT /api/challenges/:id
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { name, description, type, goal, points, isActive } = req.body;

    const challenge = await modelFactory.update('Challenge',
      { name, description, type, goal, points, isActive },
      { where: { id: req.params.id }, returning: true }
    );

    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }

    res.status(200).json({ success: true, data: challenge });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete challenge
// @route   DELETE /api/challenges/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await modelFactory.delete('Challenge', {
      where: { id: req.params.id }
    });

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;