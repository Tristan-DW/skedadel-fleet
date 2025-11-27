import express from 'express';
import modelFactory from '../config/modelFactory.js';

const router = express.Router();

// @desc    Get all driver challenges
// @route   GET /api/driver-challenges
// @access  Private
router.get('/', async (req, res) => {
  try {
    const driverChallenges = await modelFactory.findAll('DriverChallenge', {
      include: [
        { association: 'driver', attributes: ['name', 'email'] },
        { association: 'challenge', attributes: ['name', 'type', 'points'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ success: true, count: driverChallenges.length, data: driverChallenges });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;