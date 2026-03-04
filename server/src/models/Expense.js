import { Schema, model } from 'mongoose';

const expenseSchema = new Schema({
  employeeId: { type: String, ref: 'Employee', required: true },
  title: String,
  amount: Number,
  category: String,
  description: String,
  date: Date,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  receipt: String,
});

export const Expense = model('Expense', expenseSchema);
