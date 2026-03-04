import { Schema, model } from 'mongoose';

const employeeSchema = new Schema({
  _id: { type: String, required: true },  // Custom string ID (e.g., EMP001)
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: String,
  designation: String,
  phone: String,
  joinDate: Date,
  password: { type: String, required: true }, // store hashed password in real app
  role: { type: String, enum: ['admin', 'employee'], default: 'employee' },
});

export const Employee = model('Employee', employeeSchema);