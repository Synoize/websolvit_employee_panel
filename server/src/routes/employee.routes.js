import { Router } from 'express';
import { Employee } from '../models/Employee.js';
import jwt from 'jsonwebtoken';

const router = Router();

// login endpoint
router.post('/login', async (req, res) => {
  const { id, password } = req.body;
  try {
    const jwtSecret = process.env.JWT_SECRET;
    const adminUsername = String(process.env.ADMIN_USERNAME || '').trim().toLowerCase();
    const adminEmail = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    const adminPassword = String(process.env.ADMIN_PASSWORD || '').trim();

    const rawId = String(id || '').trim();
    const normalizedId = String(id || '').trim().toLowerCase();
    const normalizedPassword = String(password || '').trim();
    const isAdminId = normalizedId === adminUsername || (adminEmail && normalizedId === adminEmail);

    // admin login from environment configuration
    if (isAdminId && adminPassword && normalizedPassword === adminPassword) {
      const token = jwt.sign({ userId: 'admin', role: 'admin', userName: 'Admin' }, jwtSecret, {
        expiresIn: '1h',
      });
      return res.json({ user: { _id: 'admin', role: 'admin', name: 'Admin' }, token });
    }
    if (isAdminId) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Try to find employee by custom ID (EMP001) or MongoDB ObjectId
    let emp = await Employee.findOne({ _id: rawId });
    
    // If not found by _id, try by email
    if (!emp) {
      emp = await Employee.findOne({ email: rawId });
    }
    
    if (!emp || emp.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // create JWT
    const token = jwt.sign({ userId: emp._id, role: emp.role, userName: emp.name }, jwtSecret, {
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

router.put('/:id', async (req, res) => {
  try {
    const updates = { ...req.body };
    delete updates._id;
    const emp = await Employee.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!emp) return res.status(404).json({ message: 'Not found' });
    res.json(emp);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const emp = await Employee.findByIdAndDelete(req.params.id);
    if (!emp) return res.status(404).json({ message: 'Not found' });
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
