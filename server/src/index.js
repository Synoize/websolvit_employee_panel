import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import connectDB from './config/database.js';
import employeeRoutes from './routes/employee.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';
import expenseRoutes from './routes/expense.routes.js';
import leaveRoutes from './routes/leave.routes.js';

// load variables from server's own .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/leaves', leaveRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 4000;

connectDB().then(async () => {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});