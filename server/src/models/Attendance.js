import { Schema, model } from 'mongoose';

const attendanceSchema = new Schema({
  employeeId: { type: String, ref: 'Employee', required: true },
  date: { type: Date, required: true },
  inTime: String,
  outTime: String,
  location: {
    lat: Number,
    lng: Number,
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'half-day', 'leave'],
    default: 'present',
  },
});

export const Attendance = model('Attendance', attendanceSchema);
