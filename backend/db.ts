import mongoose from 'mongoose';

export const connectDB = async (): Promise<boolean> => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('⚠️  No MONGODB_URI provided in .env yet. Running in offline/hybrid mode.');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
    return true;
  } catch (error: any) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    return false;
  }
};
