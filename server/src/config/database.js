import mongoose from 'mongoose';

let cachedConnectionPromise;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!cachedConnectionPromise) {
    cachedConnectionPromise = mongoose.connect(process.env.MONGODB_URI).then((conn) => {
      console.log(`Database Connected: ${conn.connection.host}`);

      mongoose.connection.on('error', (err) => {
        console.error(`Database connection error: ${err}`);
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('Database disconnected.');
      });

      return mongoose.connection;
    });
  }

  return cachedConnectionPromise;
};

export default connectDB;
