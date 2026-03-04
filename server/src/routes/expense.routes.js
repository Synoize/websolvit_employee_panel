import { Router } from 'express';
import { Expense } from '../models/Expense.js';

const router = Router();

router.get('/', async (_req, res) => {
  const list = await Expense.find();
  res.json(list);
});

router.post('/', async (req, res) => {
  try {
    const exp = new Expense(req.body);
    await exp.save();
    res.json(exp);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id/status', async (req, res) => {
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

router.delete('/:id', async (req, res) => {
  try {
    const exp = await Expense.findByIdAndDelete(req.params.id);
    if (!exp) return res.status(404).json({ message: 'Not found' });
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;
