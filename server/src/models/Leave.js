import { Schema, model } from 'mongoose';

const leaveSchema = new Schema({
  employeeId: { type: String, ref: 'Employee', required: true },
  type: { type: String, enum: ['casual', 'sick', 'earned', 'unpaid'] },
  startDate: Date,
  endDate: Date,
  reason: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  appliedOn: Date,
});

export const Leave = model('Leave', leaveSchema);
