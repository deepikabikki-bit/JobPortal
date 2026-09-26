import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/jobportal_freshers';
    if (!process.env.MONGODB_URI && process.env.NODE_ENV === 'production') {
      console.warn('⚠️ Warning: MONGODB_URI is not set in environment variables! Attempting fallback to local MongoDB...');
    }
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    if (error.message.includes('ECONNREFUSED') || error.message.includes('127.0.0.1')) {
      console.error('💡 Hint for Render/Cloud: Set the MONGODB_URI environment variable in your Render dashboard to your MongoDB Atlas connection string (mongodb+srv://...). Also ensure IP 0.0.0.0/0 is allowed in Atlas Network Access.');
    }
    process.exit(1);
  }
};

export default connectDB;
