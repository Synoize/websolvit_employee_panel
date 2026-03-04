import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    console.log('Connecting to Database...');
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // options are default in mongoose 6+
    });
    console.log(`Database Connected: ${conn.connection.host}`);

    mongoose.connection.on('error', (err) => {
      console.error(`Database connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('Database disconnected.');
    });
  } catch (error) {
    console.error(`Error connecting to Database: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
