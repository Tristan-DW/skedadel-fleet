import express from 'express';
import modelFactory from '../config/modelFactory.js';

const router = express.Router();

// @desc    Get all teams
// @route   GET /api/teams
// @access  Private
router.get('/', async (req, res) => {
  try {
    const teams = await modelFactory.findAll('Team', {
      include: [
        { association: 'hub', attributes: ['name'] }
      ],
      order: [['name', 'ASC']]
    });

    res.status(200).json({ success: true, count: teams.length, data: teams });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get single team
// @route   GET /api/teams/:id
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const team = await modelFactory.findByPk('Team', req.params.id, {
      include: [
        { association: 'hub', attributes: ['name'] },
        { association: 'drivers', attributes: ['name', 'email', 'status', 'vehicleId'] }
      ]
    });

    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    res.status(200).json({ success: true, data: team });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

// @desc    Create new team
// @route   POST /api/teams
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { name, hubId } = req.body;

    const team = await modelFactory.create('Team', {
      name,
      hubId
    });

    res.status(201).json({ success: true, data: team });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update team
// @route   PUT /api/teams/:id
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { name, hubId } = req.body;

    const team = await modelFactory.update('Team',
      { name, hubId },
      { where: { id: req.params.id }, returning: true }
    );

    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    res.status(200).json({ success: true, data: team });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});