import express from 'express';
import modelFactory from '../config/modelFactory.js';

const router = express.Router();

// @desc    Get all webhooks
// @route   GET /api/webhooks
// @access  Private
router.get('/', async (req, res) => {
  try {
    const webhooks = await modelFactory.findAll('Webhook', {
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ success: true, count: webhooks.length, data: webhooks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create new webhook
// @route   POST /api/webhooks
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { url, events, isActive } = req.body;

    const webhook = await modelFactory.create('Webhook', {
      url,
      events,
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json({ success: true, data: webhook });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update webhook
// @route   PUT /api/webhooks/:id
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { url, events, isActive } = req.body;

    const webhook = await modelFactory.update('Webhook',
      { url, events, isActive },
      { where: { id: req.params.id }, returning: true }
    );

    if (!webhook) {
      return res.status(404).json({ success: false, message: 'Webhook not found' });
    }

    res.status(200).json({ success: true, data: webhook });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete webhook
// @route   DELETE /api/webhooks/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await modelFactory.delete('Webhook', {
      where: { id: req.params.id }
    });

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Webhook not found' });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;