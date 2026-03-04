import { Router } from 'express';
import { Employee } from '../models/Employee.js';
import { Admin } from '../models/Admin.js';
import jwt from 'jsonwebtoken';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();
const toSafeEmployee = (emp) => ({
  _id: emp._id,
  name: emp.name,
  email: emp.email,
  department: emp.department,
  designation: emp.designation,
  phone: emp.phone,
  joinDate: emp.joinDate,
  role: emp.role,
});

// login endpoint
router.post('/login', async (req, res) => {
  const { id, password } = req.body;
  try {
    const jwtSecret = process.env.JWT_SECRET;

    const rawId = String(id || '').trim();
    const normalizedPassword = String(password || '').trim();
    const normalizedId = rawId.toLowerCase();

    let admin = await Admin.findOne({ _id: rawId });
    if (!admin) {
      admin = await Admin.findOne({ email: normalizedId });
    }

    if (admin && admin.password === normalizedPassword) {
      const token = jwt.sign({ userId: admin._id, role: 'admin', userName: admin.name }, jwtSecret, {
        expiresIn: '1h',
      });
      const safeAdmin = {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role || 'admin',
      };
      return res.json({ user: safeAdmin, token });
    }

    // Try to find employee by custom ID (EMP001) or MongoDB ObjectId
    let emp = await Employee.findOne({ _id: rawId });
    
    // If not found by _id, try by email
    if (!emp) {
      emp = await Employee.findOne({ email: rawId });
    }
    
    if (!emp || emp.password !== normalizedPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // create JWT
    const token = jwt.sign({ userId: emp._id, role: emp.role, userName: emp.name }, jwtSecret, {
      expiresIn: '1h',
    });
    const safeUser = toSafeEmployee(emp);
    res.json({ user: safeUser, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const admin = await Admin.findById(req.user.userId);
      if (!admin) return res.status(404).json({ message: 'Admin not found' });
      return res.json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: 'admin',
      });
    }

    const emp = await Employee.findById(req.user.userId);
    if (!emp) return res.status(404).json({ message: 'Employee not found' });
    return res.json(toSafeEmployee(emp));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// CRUD
router.get('/', requireAuth, requireAdmin, async (_req, res) => {
  const list = await Employee.find();
  res.json(list);
});

router.post('/', requireAuth, requireAdmin, async (req, res) => {
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

router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
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

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const emp = await Employee.findByIdAndDelete(req.params.id);
    if (!emp) return res.status(404).json({ message: 'Not found' });
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
