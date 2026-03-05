import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import connectDB from './config/database.js';
import employeeRoutes from './routes/employee.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';
import expenseRoutes from './routes/expense.routes.js';
import leaveRoutes from './routes/leave.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Local dev: load server/.env. On Vercel, runtime env vars are injected by the platform.
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();

const parseOrigins = (value = '') =>
  value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const allowedOrigins = new Set(parseOrigins(process.env.CORS_ORIGIN || ''));

const FRONTEND_URL = String(process.env.FRONTEND_URL || '').trim();
if (FRONTEND_URL) allowedOrigins.add(FRONTEND_URL);

const CORS_CREDENTIALS = String(process.env.CORS_CREDENTIALS || 'false').toLowerCase() === 'true';

const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.has('*')) return callback(null, true);
    if (allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: CORS_CREDENTIALS,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(async (_req, res, next) => {
  try {
    if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'Server is missing required environment variables.' });
    }
    await connectDB();
    return next();
  } catch (error) {
    return res.status(500).json({ message: `Database connection failed: ${error.message}` });
  }
});

app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/leaves', leaveRoutes);

app.get('/', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err, _req, res, _next) => {
  if (err && String(err.message || '').startsWith('CORS blocked')) {
    return res.status(403).json({ message: err.message });
  }
  return res.status(500).json({ message: err.message || 'Internal Server Error' });
});

export default app;
