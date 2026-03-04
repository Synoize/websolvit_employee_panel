import { Router } from 'express';
import { Employee } from '../models/Employee.js';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_USERNAME = (process.env.ADMIN_USERNAME || '').trim().toLowerCase();
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
const ADMIN_PASSWORD = String(process.env.ADMIN_PASSWORD || '').trim();

// login endpoint
router.post('/login', async (req, res) => {
  const { id, password } = req.body;
  try {
    const normalizedId = String(id || '').trim().toLowerCase();
    const normalizedPassword = String(password || '').trim();
    const isAdminId = normalizedId === ADMIN_USERNAME || (ADMIN_EMAIL && normalizedId === ADMIN_EMAIL);

    // admin login from environment configuration
    if (isAdminId && ADMIN_PASSWORD && normalizedPassword === ADMIN_PASSWORD) {
      const token = jwt.sign({ userId: 'admin', role: 'admin', userName: 'Admin' }, JWT_SECRET, {
        expiresIn: '1h',
      });
      return res.json({ user: { _id: 'admin', role: 'admin', name: 'Admin' }, token });
    }
    if (isAdminId) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Try to find employee by custom ID (EMP001) or MongoDB ObjectId
    let emp = await Employee.findOne({ _id: id });
    
    // If not found by _id, try by email
    if (!emp) {
      emp = await Employee.findOne({ email: id });
    }
    
    if (!emp || emp.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // create JWT
    const token = jwt.sign({ userId: emp._id, role: emp.role, userName: emp.name }, JWT_SECRET, {
      expiresIn: '1h',
    });
    res.json({ user: emp, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CRUD
router.get('/', async (_req, res) => {
  const list = await Employee.find();
  res.json(list);
});

router.post('/', async (req, res) => {
  try {
    const emp = new Employee(req.body);
    // If no _id provided, generate a simple string ID (EMP + count)
    if (!emp._id) {
      const count = await Employee.countDocuments();
      emp._id = 'EMP' + String(count + 1).padStart(3, '0');
    }
    await emp.save();
    res.json(emp);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
