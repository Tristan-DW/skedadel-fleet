import express from 'express';
import modelFactory from '../config/modelFactory.js';
import { transformOrder } from '../utils/responseHelpers.js';

const router = express.Router();

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
router.get('/', async (req, res) => {
  try {
    // Support pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const startIndex = (page - 1) * limit;

    // Support filtering by status
    const statusFilter = req.query.status ? { status: req.query.status } : {};

    // Support filtering by date range
    const dateFilter = {};
    if (req.query.startDate || req.query.endDate) {
      dateFilter.createdAt = {};
      if (req.query.startDate) {
        dateFilter.createdAt = {
          [modelFactory.getModel('Order').sequelize ? 'gte' : '$gte']: new Date(req.query.startDate)
        };
      }
      if (req.query.endDate) {
        const lteOperator = modelFactory.getModel('Order').sequelize ? 'lte' : '$lte';
        if (dateFilter.createdAt) {
          dateFilter.createdAt[lteOperator] = new Date(req.query.endDate);
        } else {
          dateFilter.createdAt = { [lteOperator]: new Date(req.query.endDate) };
        }
      }
    }

    // Combine filters
    const filter = { ...statusFilter, ...dateFilter };

    const orders = await modelFactory.findAll('Order', {
      where: filter,
      include: [
        { association: 'driver', attributes: ['name', 'status'] },
        { association: 'vehicle', attributes: ['name', 'licensePlate'] }
      ],
      order: [['createdAt', 'DESC']],
      offset: startIndex,
      limit: limit
    });

    const total = await modelFactory.getModel('Order').count({ where: filter });

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      data: orders.map(transformOrder)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const order = await modelFactory.findByPk('Order', req.params.id, {
      include: [
        { association: 'driver', attributes: ['name', 'phone', 'email', 'status', 'latitude', 'longitude', 'address'] },
        { association: 'vehicle', attributes: ['name', 'licensePlate', 'type'] }
      ]
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, data: transformOrder(order) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      customerName,
      customerPhone,
      origin,
      destination,
      status,
      priority,
      orderType,
      driverId,
      vehicleId,
      storeId,
      orderItems
    } = req.body;

    // Prepare order data with flattened location fields
    const orderData = {
      title,
      description,
      customerName,
      customerPhone,
      status: status || 'Unassigned',
      priority: priority || 'Medium',
      orderType: orderType || 'DELIVERY',
      driverId: driverId || null,
      vehicleId: vehicleId || null,
      storeId,
      orderItems: orderItems || [],
      activityLog: [{ status: status || 'Unassigned', timestamp: new Date() }]
    };

    // Handle origin
    if (origin) {
      orderData.originLat = origin.lat || origin.latitude || 0;
      orderData.originLng = origin.lng || origin.longitude || 0;
      orderData.originAddress = origin.address || '';
    }

    // Handle destination
    if (destination) {
      orderData.destinationLat = destination.lat || destination.latitude || 0;
      orderData.destinationLng = destination.lng || destination.longitude || 0;
      orderData.destinationAddress = destination.address || '';
    }

    // Create order
    const order = await modelFactory.create('Order', orderData);

    // Create alert for new order if needed (asynchronously)
    if (driverId) {
      // Don't await this operation, let it run in the background
      modelFactory.create('Alert', {
        type: 'Order Status Updated',
        message: `New order ${title} assigned to driver.`,
        priority: priority === 'Urgent' ? 'high' : 'medium',
        relatedEntityType: 'Order',
        relatedEntityId: order.id
      }).catch(err => console.error('Error creating alert:', err));
    }

    res.status(201).json({ success: true, data: transformOrder(order) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update order
// @route   PUT /api/orders/:id
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const {
      title,
      description,
      customerName,
      customerPhone,
      origin,
      destination,
      status,
      priority,
      orderType,
      driverId,
      vehicleId,
      storeId,
      orderItems
    } = req.body;

    let order = await modelFactory.findByPk('Order', req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check if status is being updated
    const statusChanged = status && status !== order.status;

    // Transform origin/destination objects to flattened fields
    const updateData = {
      title,
      description,
      customerName,
      customerPhone,
      status,
      priority,
      orderType,
      driverId,
      vehicleId,
      storeId,
      orderItems
    };

    // Handle origin if provided
    if (origin) {
      updateData.originLat = origin.lat || origin.latitude || 0;
      updateData.originLng = origin.lng || origin.longitude || 0;
      updateData.originAddress = origin.address || '';
    }

    // Handle destination if provided
    if (destination) {
      updateData.destinationLat = destination.lat || destination.latitude || 0;
      updateData.destinationLng = destination.lng || destination.longitude || 0;
      updateData.destinationAddress = destination.address || '';
    }

    // Update order
    order = await modelFactory.update('Order',
      updateData,
      {
        where: { id: req.params.id },
        returning: true,
        include: [
          { association: 'driver', attributes: ['name'] },
          { association: 'store', attributes: ['name'] }
        ]
      }
    );

    // Add to activity log if status changed
    if (statusChanged) {
      // The pre-save hook in the model will handle adding to activity log

      // Create alert for status change (asynchronously)
      // Don't await this operation, let it run in the background
      modelFactory.create('Alert', {
        type: 'Order Status Updated',
        message: `Order ${order.title} status changed to ${status}.`,
        priority: order.priority === 'Urgent' ? 'high' : 'medium',
        relatedEntityType: 'Order',
        relatedEntityId: order.id
      }).catch(err => console.error('Error creating status change alert:', err));

      // If status is Failed, create a failed order alert (asynchronously)
      if (status === 'Failed') {
        modelFactory.create('Alert', {
          type: 'Order Failed',
          message: `Order ${order.title} has failed.`,
          priority: 'high',
          relatedEntityType: 'Order',
          relatedEntityId: order.id
        }).catch(err => console.error('Error creating failed order alert:', err));
      }
    }

    res.status(200).json({ success: true, data: transformOrder(order) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Please provide a status' });
    }

    let order = await modelFactory.findByPk('Order', req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Update status
    order.status = status;

    // Add to activity log
    if (!order.activityLog) {
      order.activityLog = [];
    }

    order.activityLog.push({
      status,
      timestamp: new Date()
    });

    // Save the updated order
    await modelFactory.update('Order',
      { status, activityLog: order.activityLog },
      { where: { id: req.params.id } }
    );

    // Create alert for status change (asynchronously)
    // Don't await this operation, let it run in the background
    modelFactory.create('Alert', {
      type: 'Order Status Updated',
      message: `Order ${order.title} status changed to ${status}.`,
      priority: order.priority === 'Urgent' ? 'high' : 'medium',
      relatedEntityType: 'Order',
      relatedEntityId: order.id
    }).catch(err => console.error('Error creating status change alert:', err));

    // If status is Failed, create a failed order alert (asynchronously)
    if (status === 'Failed') {
      modelFactory.create('Alert', {
        type: 'Order Failed',
        message: `Order ${order.title} has failed.`,
        priority: 'high',
        relatedEntityType: 'Order',
        relatedEntityId: order.id
      }).catch(err => console.error('Error creating failed order alert:', err));
    }

    res.status(200).json({ success: true, data: transformOrder(order) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Assign driver to order
// @route   PATCH /api/orders/:id/assign
// @access  Private
router.patch('/:id/assign', async (req, res) => {
  try {
    const { driverId, vehicleId } = req.body;

    if (!driverId) {
      return res.status(400).json({ success: false, message: 'Please provide a driver ID' });
    }

    let order = await modelFactory.findByPk('Order', req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check if driver exists
    const driver = await modelFactory.findByPk('Driver', driverId);

    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }

    // Prepare update data
    const updateData = {
      driverId: driverId,
      vehicleId: vehicleId || driver.vehicleId
    };

    // Update status to Assigned if currently Unassigned
    if (order.status === 'Unassigned') {
      updateData.status = 'Assigned';

      // Initialize activityLog if it doesn't exist
      if (!order.activityLog) {
        order.activityLog = [];
      }

      // Add to activity log
      const updatedActivityLog = [...order.activityLog, {
        status: 'Assigned',
        timestamp: new Date()
      }];

      updateData.activityLog = updatedActivityLog;
    }

    // Update the order
    await modelFactory.update('Order', updateData, { where: { id: req.params.id } });

    // Get the updated order
    order = await modelFactory.findByPk('Order', req.params.id);

    // Create alert for assignment (asynchronously)
    // Don't await this operation, let it run in the background
    modelFactory.create('Alert', {
      type: 'Order Status Updated',
      message: `Order ${order.title} assigned to driver ${driver.name}.`,
      priority: order.priority === 'Urgent' ? 'high' : 'medium',
      relatedEntityType: 'Order',
      relatedEntityId: order.id
    }).catch(err => console.error('Error creating assignment alert:', err));

    res.status(200).json({ success: true, data: transformOrder(order) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
router.delete('/:id', async (req, res) => {
  try {
    const order = await modelFactory.findByPk('Order', req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    await modelFactory.delete('Order', { where: { id: req.params.id } });

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get orders by driver
// @route   GET /api/orders/driver/:driverId
// @access  Private
router.get('/driver/:driverId', async (req, res) => {
  try {
    // Support pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const startIndex = (page - 1) * limit;

    // Get orders with pagination using modelFactory
    const orders = await modelFactory.findAll('Order', {
      where: { driverId: req.params.driverId },
      include: [],
      order: [['createdAt', 'DESC']],
      offset: startIndex,
      limit: limit
    });

    // Get total count for pagination
    const total = await modelFactory.getModel('Order').count({
      where: { driverId: req.params.driverId }
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      data: orders.map(transformOrder)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get orders by store
// @route   GET /api/orders/store/:storeId
// @access  Private
router.get('/store/:storeId', async (req, res) => {
  try {
    // Support pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const startIndex = (page - 1) * limit;

    // Get orders with pagination using modelFactory
    const orders = await modelFactory.findAll('Order', {
      where: { storeId: req.params.storeId },
      include: [
        { association: 'driver', attributes: ['name', 'status'] }
      ],
      order: [['createdAt', 'DESC']],
      offset: startIndex,
      limit: limit
    });

    // Get total count for pagination
    const total = await modelFactory.getModel('Order').count({
      where: { storeId: req.params.storeId }
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      data: orders.map(transformOrder)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get orders by status
// @route   GET /api/orders/status/:status
// @access  Private
router.get('/status/:status', async (req, res) => {
  try {
    // Support pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const startIndex = (page - 1) * limit;

    // Get orders with pagination using modelFactory
    const orders = await modelFactory.findAll('Order', {
      where: { status: req.params.status },
      include: [
        { association: 'driver', attributes: ['name', 'status'] },
        { association: 'store', attributes: ['name'] }
      ],
      order: [['createdAt', 'DESC']],
      offset: startIndex,
      limit: limit
    });

    // Get total count for pagination
    const total = await modelFactory.getModel('Order').count({
      where: { status: req.params.status }
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      data: orders.map(transformOrder)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get orders by priority
// @route   GET /api/orders/priority/:priority
// @access  Private
router.get('/priority/:priority', async (req, res) => {
  try {
    // Support pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const startIndex = (page - 1) * limit;

    // Get orders with pagination using modelFactory
    const orders = await modelFactory.findAll('Order', {
      where: { priority: req.params.priority },
      include: [
        { association: 'driver', attributes: ['name', 'status'] },
        { association: 'store', attributes: ['name'] }
      ],
      order: [['createdAt', 'DESC']],
      offset: startIndex,
      limit: limit
    });

    // Get total count for pagination
    const total = await modelFactory.getModel('Order').count({
      where: { priority: req.params.priority }
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      data: orders.map(transformOrder)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get order statistics
// @route   GET /api/orders/stats
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    // Get date range from query params or default to last 30 days
    const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();
    const startDate = req.query.startDate
      ? new Date(req.query.startDate)
      : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Define the pending statuses
    const pendingStatuses = ['Unassigned', 'Assigned', 'At Store', 'Picked Up', 'In Progress'];

    // Use aggregation to calculate statistics efficiently
    const [orderCounts, ordersByPriority, ordersByStatus, avgDeliveryTime] = await Promise.all([
      // Count orders by status
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),

      // Count orders by priority
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: '$priority',
            count: { $sum: 1 }
          }
        }
      ]),

      // Count orders by status
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),

      // Calculate average delivery time for successful orders
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate },
            status: 'Successful',
            'activityLog.status': 'Successful'
          }
        },
        {
          $addFields: {
            successfulLog: {
              $filter: {
                input: '$activityLog',
                as: 'log',
                cond: { $eq: ['$$log.status', 'Successful'] }
              }
            }
          }
        },
        {
          $addFields: {
            completionTime: {
              $arrayElemAt: ['$successfulLog.timestamp', 0]
            }
          }
        },
        {
          $project: {
            deliveryTimeMinutes: {
              $divide: [
                { $subtract: ['$completionTime', '$createdAt'] },
                60000 // Convert milliseconds to minutes
              ]
            }
          }
        },
        {
          $group: {
            _id: null,
            avgDeliveryTimeMinutes: { $avg: '$deliveryTimeMinutes' },
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    // Process the aggregation results

    // Calculate total orders
    const totalOrders = orderCounts.reduce((sum, item) => sum + item.count, 0);

    // Find successful and failed orders
    const successfulOrders = orderCounts.find(item => item._id === 'Successful')?.count || 0;
    const failedOrders = orderCounts.find(item => item._id === 'Failed')?.count || 0;

    // Calculate pending orders
    const pendingOrders = orderCounts
      .filter(item => pendingStatuses.includes(item._id))
      .reduce((sum, item) => sum + item.count, 0);

    // Calculate success rate
    const successRate = totalOrders > 0 ? (successfulOrders / totalOrders) * 100 : 0;

    // Format orders by priority
    const ordersByPriorityFormatted = {
      Low: ordersByPriority.find(item => item._id === 'Low')?.count || 0,
      Medium: ordersByPriority.find(item => item._id === 'Medium')?.count || 0,
      High: ordersByPriority.find(item => item._id === 'High')?.count || 0,
      Urgent: ordersByPriority.find(item => item._id === 'Urgent')?.count || 0
    };

    // Format orders by status
    const ordersByStatusFormatted = {
      Unassigned: ordersByStatus.find(item => item._id === 'Unassigned')?.count || 0,
      Assigned: ordersByStatus.find(item => item._id === 'Assigned')?.count || 0,
      'At Store': ordersByStatus.find(item => item._id === 'At Store')?.count || 0,
      'Picked Up': ordersByStatus.find(item => item._id === 'Picked Up')?.count || 0,
      'In Progress': ordersByStatus.find(item => item._id === 'In Progress')?.count || 0,
      Successful: successfulOrders,
      Failed: failedOrders
    };

    // Get average delivery time
    const avgDeliveryTimeMinutes = avgDeliveryTime.length > 0
      ? Math.round(avgDeliveryTime[0].avgDeliveryTimeMinutes)
      : 0;

    const stats = {
      dateRange: {
        startDate,
        endDate
      },
      totalOrders,
      successfulOrders,
      failedOrders,
      pendingOrders,
      successRate: Math.round(successRate * 100) / 100, // Round to 2 decimal places
      ordersByPriority: ordersByPriorityFormatted,
      ordersByStatus: ordersByStatusFormatted,
      avgDeliveryTimeMinutes
    };

    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;