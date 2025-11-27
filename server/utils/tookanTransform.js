/**
 * Tookan API Transformation Utilities
 * Converts between Skedadel internal format and Tookan API format
 */

/**
 * Transform Tookan task payload to internal Order format
 */
export const tookanTaskToOrder = (tookanPayload) => {
  const {
    order_id,
    job_description,
    job_pickup_phone,
    job_pickup_name,
    job_pickup_address,
    job_pickup_latitude,
    job_pickup_longitude,
    job_delivery_phone,
    customer_name,
    customer_email,
    job_delivery_address,
    job_delivery_latitude,
    job_delivery_longitude,
    layout_type,
    fleet_id,
    team_id,
    auto_assignment
  } = tookanPayload;

  // Determine order type from layout_type
  const orderTypeMap = {
    0: 'PICKUP',
    1: 'DELIVERY',
    2: 'DELIVERY' // Pickup and delivery
  };

  return {
    title: order_id || `Order-${Date.now()}`,
    description: job_description || '',
    customerName: customer_name || job_pickup_name || '',
    customerPhone: job_delivery_phone || job_pickup_phone || '',
    customerEmail: customer_email || '',
    originLat: parseFloat(job_pickup_latitude) || 0,
    originLng: parseFloat(job_pickup_longitude) || 0,
    originAddress: job_pickup_address || '',
    destinationLat: parseFloat(job_delivery_latitude) || 0,
    destinationLng: parseFloat(job_delivery_longitude) || 0,
    destinationAddress: job_delivery_address || '',
    orderType: orderTypeMap[layout_type] || 'DELIVERY',
    status: auto_assignment ? 'Assigned' : 'Unassigned',
    priority: 'Medium',
    driverId: fleet_id || null,
    teamId: team_id || null,
    storeId: null // Will need to be determined based on pickup location
  };
};

/**
 * Transform internal Order to Tookan task response
 */
export const orderToTookanTask = (order, trackingLink = false) => {
  return {
    job_id: parseInt(order.id.replace(/\D/g, '')) || Math.floor(Math.random() * 1000000),
    job_token: order.id,
    order_id: order.title,
    tracking_link: trackingLink ? `https://track.skedadel.com/${order.id}` : null,
    fleet_id: order.driverId,
    team_id: order.teamId,
    job_status: getJobStatusCode(order.status)
  };
};

/**
 * Transform Tookan agent payload to internal Driver format
 */
export const tookanAgentToDriver = (tookanPayload) => {
  const {
    email,
    phone,
    username,
    first_name,
    last_name,
    fleet_type,
    transport_type,
    transport_desc,
    license,
    team_ids
  } = tookanPayload;

  // Map transport_type to vehicle type
  const transportTypeMap = {
    1: 'Car',
    2: 'Motor Cycle',
    3: 'Bicycle',
    4: 'Scooter',
    5: 'Foot',
    6: 'Truck'
  };

  return {
    name: `${first_name || ''} ${last_name || ''}`.trim() || username,
    email: email || '',
    phone: phone || '',
    status: 'Available',
    vehicleType: transportTypeMap[transport_type] || 'Car',
    vehicleDescription: transport_desc || '',
    license: license || '',
    teamId: team_ids ? team_ids.split(',')[0] : null,
    latitude: 0,
    longitude: 0,
    address: ''
  };
};

/**
 * Transform internal Driver to Tookan agent response
 */
export const driverToTookanAgent = (driver) => {
  return {
    fleet_id: parseInt(driver.id.replace(/\D/g, '')) || Math.floor(Math.random() * 1000000),
    username: driver.email.split('@')[0],
    email: driver.email,
    phone: driver.phone,
    first_name: driver.name.split(' ')[0] || '',
    last_name: driver.name.split(' ').slice(1).join(' ') || '',
    fleet_type: 1, // Captive agent
    transport_type: getTransportTypeCode(driver.vehicleType),
    team_id: driver.teamId
  };
};

/**
 * Map internal order status to Tookan job status codes
 */
const getJobStatusCode = (status) => {
  const statusMap = {
    'Unassigned': 0,
    'Assigned': 1,
    'At Store': 2,
    'Picked Up': 3,
    'In Progress': 4,
    'Successful': 6,
    'Failed': 9,
    'Cancelled': 10
  };
  return statusMap[status] || 0;
};

/**
 * Map Tookan job status codes to internal status
 */
export const getTookanJobStatus = (statusCode) => {
  const statusMap = {
    0: 'Unassigned',
    1: 'Assigned',
    2: 'At Store',
    3: 'Picked Up',
    4: 'In Progress',
    6: 'Successful',
    9: 'Failed',
    10: 'Cancelled'
  };
  return statusMap[statusCode] || 'Unassigned';
};

/**
 * Map vehicle type to Tookan transport type code
 */
const getTransportTypeCode = (vehicleType) => {
  const typeMap = {
    'Car': 1,
    'Motor Cycle': 2,
    'Motorcycle': 2,
    'Bicycle': 3,
    'Scooter': 4,
    'Foot': 5,
    'Truck': 6
  };
  return typeMap[vehicleType] || 1;
};

/**
 * Create Tookan-style success response
 */
export const tookanSuccessResponse = (data, message = 'Success') => {
  return {
    status: 200,
    message: message,
    data: data
  };
};

/**
 * Create Tookan-style error response
 */
export const tookanErrorResponse = (message, statusCode = 400) => {
  return {
    status: statusCode,
    message: message,
    data: null
  };
};
