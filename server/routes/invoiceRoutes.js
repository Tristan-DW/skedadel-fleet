import express from 'express';
import modelFactory from '../config/modelFactory.js';

const router = express.Router();

// @desc    Get all invoices
// @route   GET /api/invoices
// @access  Private
router.get('/', async (req, res) => {
  try {
    const invoices = await modelFactory.findAll('Invoice', {
      include: [
        { association: 'store', attributes: ['name'] }
      ],
      order: [['issueDate', 'DESC']]
    });

    res.status(200).json({ success: true, count: invoices.length, data: invoices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get single invoice
// @route   GET /api/invoices/:id
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const invoice = await modelFactory.findByPk('Invoice', req.params.id, {
      include: [
        { association: 'store', attributes: ['name', 'address'] },
        { association: 'lineItems' }
      ]
    });

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    res.status(200).json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create new invoice
// @route   POST /api/invoices
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { clientName, amount, dueDate, status, storeId, lineItems } = req.body;

    const invoice = await modelFactory.create('Invoice', {
      clientName,
      amount,
      dueDate,
      status: status || 'Pending',
      storeId,
      lineItems: lineItems || []
    });

    res.status(201).json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update invoice
// @route   PUT /api/invoices/:id
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { clientName, amount, dueDate, status, storeId, lineItems } = req.body;

    const invoice = await modelFactory.update('Invoice',
      { clientName, amount, dueDate, status, storeId, lineItems },
      { where: { id: req.params.id }, returning: true }
    );

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    res.status(200).json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete invoice
// @route   DELETE /api/invoices/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await modelFactory.delete('Invoice', {
      where: { id: req.params.id }
    });

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;