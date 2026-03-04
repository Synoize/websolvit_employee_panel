import { Router } from 'express';
import { Attendance } from '../models/Attendance.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  const query = req.user.role === 'admin' ? {} : { employeeId: String(req.user.userId) };
  const list = await Attendance.find(query);
  res.json(list);
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const payload = { ...req.body };
    if (req.user.role !== 'admin') {
      payload.employeeId = String(req.user.userId);
    }
    const record = new Attendance(payload);
    await record.save();
    res.json(record);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id/punch-out', requireAuth, async (req, res) => {
  try {
    const rec = await Attendance.findById(req.params.id);
    if (!rec) return res.status(404).send({ message: 'Not found' });
    if (req.user.role !== 'admin' && String(rec.employeeId) !== String(req.user.userId)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    rec.outTime = req.body.outTime;
    await rec.save();
    res.json(rec);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
