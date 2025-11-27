import express from 'express';
import modelFactory from '../config/modelFactory.js';

const router = express.Router();

// @desc    Get all alerts
// @route   GET /api/alerts
// @access  Private
router.get('/', async (req, res) => {
  try {
    // Support pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;
    
    // Support filtering by priority
    const priorityFilter = req.query.priority ? { priority: req.query.priority } : {};
    
    // Support filtering by type
    const typeFilter = req.query.type ? { type: req.query.type } : {};
    
    // Support filtering by read status
    const readFilter = {};
    if (req.query.isRead === 'true') {
      readFilter.isRead = true;
    } else if (req.query.isRead === 'false') {
      readFilter.isRead = false;
    }
    
    // Support filtering by date range
    const dateFilter = {};
    if (req.query.startDate || req.query.endDate) {
      dateFilter.timestamp = {};
      if (req.query.startDate) {
        dateFilter.timestamp = { 
          [modelFactory.getModel('Alert').sequelize ? 'gte' : '$gte']: new Date(req.query.startDate) 
        };
      }
      if (req.query.endDate) {
        const lteOperator = modelFactory.getModel('Alert').sequelize ? 'lte' : '$lte';
        if (dateFilter.timestamp) {
          dateFilter.timestamp[lteOperator] = new Date(req.query.endDate);
        } else {
          dateFilter.timestamp = { [lteOperator]: new Date(req.query.endDate) };
        }
      }
    }
    
    // Combine filters
    const filter = { ...priorityFilter, ...typeFilter, ...readFilter, ...dateFilter };
    
    const alerts = await modelFactory.findAll('Alert', {
      where: filter,
      order: [['timestamp', 'DESC']],
      offset: startIndex,
      limit: limit
    });
    
    const total = await modelFactory.getModel('Alert').count({ where: filter });
    
    res.status(200).json({ 
      success: true, 
      count: alerts.length, 
      total,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      data: alerts 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get single alert
// @route   GET /api/alerts/:id
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const alert = await modelFactory.findByPk('Alert', req.params.id);
    
    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }
    
    res.status(200).json({ success: true, data: alert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create new alert
// @route   POST /api/alerts
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { type, message, priority, relatedEntityType, relatedEntityId } = req.body;
    
    // Create alert
    const alert = await modelFactory.create('Alert', {
      type,
      message,
      priority: priority || 'medium',
      isRead: false,
      relatedEntityType,
      relatedEntityId,
      timestamp: new Date()
    });
    
    res.status(201).json({ success: true, data: alert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Mark alert as read
// @route   PATCH /api/alerts/:id/read
// @access  Private
router.patch('/:id/read', async (req, res) => {
  try {
    const alert = await modelFactory.update('Alert',
      { isRead: true },
      { 
        where: { id: req.params.id },
        returning: true
      }
    );
    
    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }
    
    res.status(200).json({ success: true, data: alert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Mark all alerts as read
// @route   PATCH /api/alerts/read-all
// @access  Private
router.patch('/read-all', async (req, res) => {
  try {
    await modelFactory.update('Alert',
      { isRead: true },
      { where: { isRead: false } }
    );
    
    res.status(200).json({ success: true, message: 'All alerts marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete alert
// @route   DELETE /api/alerts/:id
// @access  Private/Admin
router.delete('/:id', async (req, res) => {
  try {
    const alert = await modelFactory.findByPk('Alert', req.params.id);
    
    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }
    
    await modelFactory.delete('Alert', { where: { id: req.params.id } });
    
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete all read alerts
// @route   DELETE /api/alerts/read
// @access  Private/Admin
router.delete('/read', async (req, res) => {
  try {
    const result = await modelFactory.delete('Alert', { where: { isRead: true } });
    
    res.status(200).json({ 
      success: true, 
      message: `${typeof result === 'number' ? result : (result.deletedCount || 0)} read alerts deleted` 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get alerts by priority
// @route   GET /api/alerts/priority/:priority
// @access  Private
router.get('/priority/:priority', async (req, res) => {
  try {
    if (!['high', 'medium', 'low'].includes(req.params.priority)) {
      return res.status(400).json({ success: false, message: 'Invalid priority. Use high, medium, or low.' });
    }
    
    const alerts = await modelFactory.findAll('Alert', {
      where: { priority: req.params.priority },
      order: [['timestamp', 'DESC']]
    });
      
    res.status(200).json({ success: true, count: alerts.length, data: alerts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get alerts by type
// @route   GET /api/alerts/type/:type
// @access  Private
router.get('/type/:type', async (req, res) => {
  try {
    const alerts = await modelFactory.findAll('Alert', {
      where: { type: req.params.type },
      order: [['timestamp', 'DESC']]
    });
      
    res.status(200).json({ success: true, count: alerts.length, data: alerts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get alerts by related entity
// @route   GET /api/alerts/entity/:type/:id
// @access  Private
router.get('/entity/:type/:id', async (req, res) => {
  try {
    const alerts = await modelFactory.findAll('Alert', {
      where: { 
        relatedEntityType: req.params.type,
        relatedEntityId: req.params.id
      },
      order: [['timestamp', 'DESC']]
    });
      
    res.status(200).json({ success: true, count: alerts.length, data: alerts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get alert statistics
// @route   GET /api/alerts/stats
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    // Get date range from query params or default to last 7 days
    const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();
    const startDate = req.query.startDate 
      ? new Date(req.query.startDate) 
      : new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Get all alerts in date range
    const timestampOperator = modelFactory.getModel('Alert').sequelize ? { gte: startDate, lte: endDate } : { $gte: startDate, $lte: endDate };
    const alerts = await modelFactory.findAll('Alert', {
      where: {
        timestamp: timestampOperator
      }
    });
    
    // Calculate statistics
    const totalAlerts = alerts.length;
    const readAlerts = alerts.filter(alert => alert.isRead).length;
    const unreadAlerts = totalAlerts - readAlerts;
    
    // Count by priority
    const highPriorityAlerts = alerts.filter(alert => alert.priority === 'high').length;
    const mediumPriorityAlerts = alerts.filter(alert => alert.priority === 'medium').length;
    const lowPriorityAlerts = alerts.filter(alert => alert.priority === 'low').length;
    
    // Count by type
    const alertsByType = {};
    alerts.forEach(alert => {
      alertsByType[alert.type] = (alertsByType[alert.type] || 0) + 1;
    });
    
    // Group by day
    const alertsByDay = {};
    alerts.forEach(alert => {
      const day = new Date(alert.timestamp).toISOString().split('T')[0];
      alertsByDay[day] = (alertsByDay[day] || 0) + 1;
    });
    
    const stats = {
      dateRange: {
        startDate,
        endDate
      },
      totalAlerts,
      readAlerts,
      unreadAlerts,
      byPriority: {
        high: highPriorityAlerts,
        medium: mediumPriorityAlerts,
        low: lowPriorityAlerts
      },
      byType: alertsByType,
      byDay: alertsByDay
    };
    
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;