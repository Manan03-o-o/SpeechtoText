import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Set a timeout of 5 seconds so it fails quickly if MongoDB is not running
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    process.env.USE_MOCK_DB = 'false';
  } catch (error) {
    console.warn(`[WARNING] MongoDB Connection failed: ${error.message}`);
    console.warn(`[INFO] Falling back to a Local JSON File Database storage (db_fallback.json) for runtime.`);
    process.env.USE_MOCK_DB = 'true';
  }
};

export default connectDB;

