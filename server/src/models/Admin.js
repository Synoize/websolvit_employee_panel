import { Schema, model } from 'mongoose';

const adminSchema = new Schema({
  _id: { type: String, required: true }, // e.g. ADMIN001
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin'], default: 'admin' },
}, { timestamps: true });

export const Admin = model('Admin', adminSchema);
