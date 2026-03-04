import { Router } from 'express';
import { Leave } from '../models/Leave.js';

const router = Router();

router.get('/', async (_req, res) => {
  const list = await Leave.find();
  res.json(list);
});

router.post('/', async (req, res) => {
  try {
    const leave = new Leave(req.body);
    await leave.save();
    res.json(leave);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id/status', async (req, res) => {
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

router.delete('/:id', async (req, res) => {
  try {
    const leave = await Leave.findByIdAndDelete(req.params.id);
    if (!leave) return res.status(404).json({ message: 'Not found' });
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;
