import mongoose from 'mongoose';
import { Employee } from '../models/Employee.js';
import { Admin } from '../models/Admin.js';

let cachedConnectionPromise;

const migrateLegacyAdmin = async () => {
  const existingAdmin = await Admin.findOne();
  if (existingAdmin) return;

  const legacyAdmin = await Employee.findOne({ role: 'admin' });
  if (!legacyAdmin) return;

  await Admin.create({
    _id: String(legacyAdmin._id || 'ADMIN001'),
    name: legacyAdmin.name || 'Admin',
    email: String(legacyAdmin.email || '').toLowerCase(),
    password: legacyAdmin.password,
    role: 'admin',
  });
  console.log('Migrated legacy admin from Employee collection to Admin collection.');
};

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

      return migrateLegacyAdmin().then(() => mongoose.connection);
    });
  }

  return cachedConnectionPromise;
};

export default connectDB;
