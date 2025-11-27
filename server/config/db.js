import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    // Set MongoDB connection options with increased timeouts
    const options = {
      serverSelectionTimeoutMS: 60000, // Increase from default 30000ms to 60000ms
      socketTimeoutMS: 45000, // Increase from default 30000ms to 45000ms
      // Increase operation timeout from default 10000ms to 30000ms
      // This addresses the "Operation buffering timed out after 10000ms" errors
      maxTimeMS: 30000
    };
    
    const conn = await mongoose.connect(process.env.MONGO_URI, options);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};