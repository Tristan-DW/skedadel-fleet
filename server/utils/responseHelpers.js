/**
 * Response Helper Utilities
 * Transforms flat Sequelize model instances to nested JSON objects for API responses
 */

/**
 * Transform Order model to API response format
 * Nests originLat/Lng/Address into origin object
 * Nests destinationLat/Lng/Address into destination object
 */
export const transformOrder = (order) => {
  if (!order) return null;

  // Convert to plain object if it's a Sequelize instance
  const orderJson = order.toJSON ? order.toJSON() : { ...order };

  // Transform origin
  if (orderJson.originLat !== undefined) {
    orderJson.origin = {
      lat: orderJson.originLat,
      lng: orderJson.originLng,
      address: orderJson.originAddress
    };
    // Remove flat fields
    delete orderJson.originLat;
    delete orderJson.originLng;
    delete orderJson.originAddress;
  }

  // Transform destination
  if (orderJson.destinationLat !== undefined) {
    orderJson.destination = {
      lat: orderJson.destinationLat,
      lng: orderJson.destinationLng,
      address: orderJson.destinationAddress
    };
    // Remove flat fields
    delete orderJson.destinationLat;
    delete orderJson.destinationLng;
    delete orderJson.destinationAddress;
  }

  return orderJson;
};

/**
 * Transform Driver model to API response format
 * Nests latitude/longitude/address into location object
 */
export const transformDriver = (driver) => {
  if (!driver) return null;

  const driverJson = driver.toJSON ? driver.toJSON() : { ...driver };

  if (driverJson.latitude !== undefined) {
    driverJson.location = {
      lat: driverJson.latitude,
      lng: driverJson.longitude,
      address: driverJson.address
    };
    // Remove flat fields if desired, but keeping them might be safer for some legacy code
    // delete driverJson.latitude;
    // delete driverJson.longitude;
    // delete driverJson.address;
  }

  return driverJson;
};

/**
 * Transform Store model to API response format
 * Nests latitude/longitude/address into location object
 */
export const transformStore = (store) => {
  if (!store) return null;

  const storeJson = store.toJSON ? store.toJSON() : { ...store };

  if (storeJson.latitude !== undefined) {
    storeJson.location = {
      lat: storeJson.latitude,
      lng: storeJson.longitude,
      address: storeJson.address
    };
  }

  return storeJson;
};

/**
 * Transform Hub model to API response format
 * Nests latitude/longitude/address into location object
 */
export const transformHub = (hub) => {
  if (!hub) return null;

  const hubJson = hub.toJSON ? hub.toJSON() : { ...hub };

  if (hubJson.latitude !== undefined) {
    hubJson.location = {
      lat: hubJson.latitude,
      lng: hubJson.longitude,
      address: hubJson.address
    };
  }

  return hubJson;
};
