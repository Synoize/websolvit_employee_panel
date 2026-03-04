import { Router } from 'express';
import { Leave } from '../models/Leave.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  const query = req.user.role === 'admin' ? {} : { employeeId: String(req.user.userId) };
  const list = await Leave.find(query);
  res.json(list);
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const payload = { ...req.body };
    if (req.user.role !== 'admin') {
      payload.employeeId = String(req.user.userId);
      payload.status = 'pending';
    }
    const leave = new Leave(payload);
    await leave.save();
    res.json(leave);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id/status', requireAuth, requireAdmin, async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).send({ message: 'Not found' });
    leave.status = req.body.status;
    await leave.save();
    res.json(leave);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const leave = await Leave.findByIdAndDelete(req.params.id);
    if (!leave) return res.status(404).json({ message: 'Not found' });
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;
