import express from 'express';
import modelFactory from '../config/modelFactory.js';
import {
  tookanTaskToOrder,
  orderToTookanTask,
  tookanAgentToDriver,
  driverToTookanAgent,
  getTookanJobStatus,
  tookanSuccessResponse,
  tookanErrorResponse
} from '../utils/tookanTransform.js';

const router = express.Router();

// @desc    Create task (Tookan-compatible)
// @route   POST /api/v2/create_task
// @access  Public (with API key)
router.post('/v2/create_task', async (req, res) => {
  try {
    const { api_key, tracking_link, ...tookanPayload } = req.body;

    // TODO: Validate API key
    if (!api_key) {
      return res.status(400).json(tookanErrorResponse('API key is required', 400));
    }

    // Transform Tookan payload to internal Order format
    const orderData = tookanTaskToOrder(tookanPayload);

    // Find nearest store based on pickup location (simplified - use first store for now)
    const stores = await modelFactory.findAll('Store', { limit: 1 });
    if (stores && stores.length > 0) {
      orderData.storeId = stores[0].id;
    }

    // Create order in database
    const order = await modelFactory.create('Order', orderData);

    // Transform response to Tookan format
    const tookanResponse = orderToTookanTask(order, tracking_link === 1);

    res.status(200).json(tookanSuccessResponse(tookanResponse, 'Task created successfully'));
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json(tookanErrorResponse(error.message, 500));
  }
});

// @desc    Add agent (Tookan-compatible)
// @route   POST /api/add_agent
// @access  Public (with API key)
router.post('/add_agent', async (req, res) => {
  try {
    const { api_key, ...tookanPayload } = req.body;

    // TODO: Validate API key
    if (!api_key) {
      return res.status(400).json(tookanErrorResponse('API key is required', 400));
    }

    // Validate required fields
    if (!tookanPayload.email || !tookanPayload.phone || !tookanPayload.username) {
      return res.status(400).json(tookanErrorResponse('Email, phone, and username are required', 400));
    }

    // Transform Tookan payload to internal Driver format
    const driverData = tookanAgentToDriver(tookanPayload);

    // Create driver in database
    const driver = await modelFactory.create('Driver', driverData);

    // Transform response to Tookan format
    const tookanResponse = driverToTookanAgent(driver);

    res.status(200).json(tookanSuccessResponse(tookanResponse, 'Agent added successfully'));
  } catch (error) {
    console.error('Add agent error:', error);
    res.status(500).json(tookanErrorResponse(error.message, 500));
  }
});

// @desc    Edit agent (Tookan-compatible)
// @route   POST /api/edit_agent
// @access  Public (with API key)
router.post('/edit_agent', async (req, res) => {
  try {
    const { api_key, fleet_id, ...tookanPayload } = req.body;

    // TODO: Validate API key
    if (!api_key) {
      return res.status(400).json(tookanErrorResponse('API key is required', 400));
    }

    if (!fleet_id) {
      return res.status(400).json(tookanErrorResponse('Fleet ID is required', 400));
    }

    // Find driver by fleet_id (need to map to internal ID)
    // For now, assume fleet_id matches driver ID pattern
    const driverId = `D${String(fleet_id).padStart(3, '0')}`;

    // Transform Tookan payload to internal Driver format
    const driverData = tookanAgentToDriver(tookanPayload);

    // Update driver in database
    const updatedDriver = await modelFactory.update('Driver', driverData, {
      where: { id: driverId },
      returning: true
    });

    if (!updatedDriver) {
      return res.status(404).json(tookanErrorResponse('Agent not found', 404));
    }

    // Transform response to Tookan format
    const tookanResponse = driverToTookanAgent(updatedDriver);

    res.status(200).json(tookanSuccessResponse(tookanResponse, 'Agent updated successfully'));
  } catch (error) {
    console.error('Edit agent error:', error);
    res.status(500).json(tookanErrorResponse(error.message, 500));
  }
});

// @desc    Assign agent to task (Tookan-compatible)
// @route   POST /api/assign_agent
// @access  Public (with API key)
router.post('/assign_agent', async (req, res) => {
  try {
    const { api_key, fleet_id, job_id, job_status, notify, geofence } = req.body;

    // TODO: Validate API key
    if (!api_key) {
      return res.status(400).json(tookanErrorResponse('API key is required', 400));
    }

    if (!fleet_id || !job_id) {
      return res.status(400).json(tookanErrorResponse('Fleet ID and Job ID are required', 400));
    }

    // Map fleet_id and job_id to internal IDs
    const driverId = `D${String(fleet_id).padStart(3, '0')}`;
    const orderId = `ORD${String(job_id).padStart(3, '0')}`;

    // Update order with driver assignment
    const updateData = {
      driverId: driverId,
      status: job_status ? getTookanJobStatus(job_status) : 'Assigned'
    };

    const updatedOrder = await modelFactory.update('Order', updateData, {
      where: { id: orderId },
      returning: true
    });

    if (!updatedOrder) {
      return res.status(404).json(tookanErrorResponse('Task not found', 404));
    }

    // Transform response to Tookan format
    const tookanResponse = orderToTookanTask(updatedOrder, false);

    res.status(200).json(tookanSuccessResponse(tookanResponse, 'Agent assigned successfully'));
  } catch (error) {
    console.error('Assign agent error:', error);
    res.status(500).json(tookanErrorResponse(error.message, 500));
  }
});

// @desc    Get task details (Tookan-compatible)
// @route   POST /api/get_job_details
// @access  Public (with API key)
router.post('/get_job_details', async (req, res) => {
  try {
    const { api_key, job_id } = req.body;

    if (!api_key) {
      return res.status(400).json(tookanErrorResponse('API key is required', 400));
    }

    if (!job_id) {
      return res.status(400).json(tookanErrorResponse('Job ID is required', 400));
    }

    // Map job_id to internal order ID
    const orderId = `ORD${String(job_id).padStart(3, '0')}`;

    const order = await modelFactory.findByPk('Order', orderId, {
      include: [
        { association: 'driver', attributes: ['name', 'phone', 'email'] },
        { association: 'store', attributes: ['name', 'address'] }
      ]
    });

    if (!order) {
      return res.status(404).json(tookanErrorResponse('Task not found', 404));
    }

    // Transform to Tookan format with additional details
    const tookanResponse = {
      ...orderToTookanTask(order, true),
      job_description: order.description,
      customer_name: order.customerName,
      customer_phone: order.customerPhone,
      job_pickup_address: order.originAddress,
      job_delivery_address: order.destinationAddress,
      fleet_name: order.driver?.name,
      fleet_phone: order.driver?.phone
    };

    res.status(200).json(tookanSuccessResponse(tookanResponse, 'Task details retrieved'));
  } catch (error) {
    console.error('Get job details error:', error);
    res.status(500).json(tookanErrorResponse(error.message, 500));
  }
});

export default router;
