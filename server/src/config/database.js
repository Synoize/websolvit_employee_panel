import mongoose from 'mongoose';
import { Employee } from '../models/Employee.js';

const seedEmployees = async () => {
  try {
    const count = await Employee.countDocuments();
    if (count === 0) {
      console.log('Seeding sample employees...');
      
      const sampleEmployees = [
        {
          _id: 'EMP001',
          name: 'John Doe',
          email: 'john@example.com',
          department: 'Engineering',
          designation: 'Software Developer',
          phone: '9876543210',
          joinDate: new Date('2024-01-15'),
          password: 'pass123',
          role: 'employee',
        },
        {
          _id: 'EMP002',
          name: 'Jane Smith',
          email: 'jane@example.com',
          department: 'HR',
          designation: 'HR Manager',
          phone: '9876543211',
          joinDate: new Date('2023-06-01'),
          password: 'pass123',
          role: 'employee',
        },
        {
          _id: 'EMP003',
          name: 'Bob Wilson',
          email: 'bob@example.com',
          department: 'Finance',
          designation: 'Accountant',
          phone: '9876543212',
          joinDate: new Date('2024-03-01'),
          password: 'pass123',
          role: 'employee',
        },
      ];

      await Employee.insertMany(sampleEmployees);
      console.log('Sample employees seeded successfully!');
    } else {
      console.log(`Found ${count} employees in database.`);
    }
  } catch (error) {
    console.error('Error seeding employees:', error.message);
  }
};

const connectDB = async () => {
  try {
    console.log('Connecting to Database...');
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // options are default in mongoose 6+
    });
    console.log(`Database Connected: ${conn.connection.host}`);

    // Seed sample employees
    await seedEmployees();

    mongoose.connection.on('error', (err) => {
      console.error(`Database connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('Database disconnected.');
    });
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
