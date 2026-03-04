import { Router } from 'express';
import { Expense } from '../models/Expense.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  const query = req.user.role === 'admin' ? {} : { employeeId: String(req.user.userId) };
  const list = await Expense.find(query);
  res.json(list);
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const payload = { ...req.body };
    if (req.user.role !== 'admin') {
      payload.employeeId = String(req.user.userId);
      payload.status = 'pending';
    }
    const exp = new Expense(payload);
    await exp.save();
    res.json(exp);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id/status', requireAuth, requireAdmin, async (req, res) => {
  try {
    const exp = await Expense.findById(req.params.id);
    if (!exp) return res.status(404).send({ message: 'Not found' });
    exp.status = req.body.status;
    await exp.save();
    res.json(exp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const exp = await Expense.findByIdAndDelete(req.params.id);
    if (!exp) return res.status(404).json({ message: 'Not found' });
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;
