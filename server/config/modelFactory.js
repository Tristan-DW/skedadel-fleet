import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import Sequelize models only
import * as SequelizeModels from '../models/sequelize/index.js';

// Model factory class - SQL only
class ModelFactory {
  constructor() {
    this.models = {};
    this.initialize();
  }

  initialize() {
    console.log('ModelFactory: Using SQL models (Sequelize)');
    // Set up Sequelize models
    this.models = {
      User: SequelizeModels.User,
      Driver: SequelizeModels.Driver,
      Vehicle: SequelizeModels.Vehicle,
      Team: SequelizeModels.Team,
      Hub: SequelizeModels.Hub,
      Store: SequelizeModels.Store,
      Geofence: SequelizeModels.Geofence,
      ExclusionZone: SequelizeModels.ExclusionZone,
      Order: SequelizeModels.Order,
      OrderItem: SequelizeModels.OrderItem,
      ActivityLog: SequelizeModels.ActivityLog,
      Alert: SequelizeModels.Alert,
      Challenge: SequelizeModels.Challenge,
      DriverChallenge: SequelizeModels.DriverChallenge,
      Webhook: SequelizeModels.Webhook,
      Invoice: SequelizeModels.Invoice,
      LineItem: SequelizeModels.LineItem
    };
  }

  // Get a model by name
  getModel(modelName) {
    if (!this.models[modelName]) {
      throw new Error(`Model ${modelName} not found`);
    }
    return this.models[modelName];
  }

  // Helper methods for Sequelize operations
  async findAll(modelName, options = {}) {
    const Model = this.getModel(modelName);
    return await Model.findAll(options);
  }

  async findOne(modelName, options = {}) {
    const Model = this.getModel(modelName);
    return await Model.findOne(options);
  }

  async findByPk(modelName, id, options = {}) {
    const Model = this.getModel(modelName);
    return await Model.findByPk(id, options);
  }

  async create(modelName, data) {
    const Model = this.getModel(modelName);
    return await Model.create(data);
  }

  async update(modelName, data, options) {
    const Model = this.getModel(modelName);

    // Remove returning: true as it's not supported in MySQL
    // Extract 'where' to use for finding the record later
    const { returning, where, ...otherOptions } = options;

    // We must pass 'where' to Model.update
    const updateOptions = { where, ...otherOptions };

    const [rowsUpdated] = await Model.update(data, updateOptions);

    if (rowsUpdated > 0 && where && where.id) {
      // Pass otherOptions (includes, attributes, etc.) to findByPk
      return await Model.findByPk(where.id, otherOptions);
    }

    return rowsUpdated > 0 ? { ...data } : null;
  }

  async delete(modelName, options) {
    const Model = this.getModel(modelName);
    return await Model.destroy(options);
  }
}

// Create and export a singleton instance
const modelFactory = new ModelFactory();
export default modelFactory;