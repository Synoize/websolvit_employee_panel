import { Router } from 'express';
import { Attendance } from '../models/Attendance.js';

const router = Router();

router.get('/', async (_req, res) => {
  const list = await Attendance.find();
  res.json(list);
});

router.post('/', async (req, res) => {
  try {
    const record = new Attendance(req.body);
    await record.save();
    res.json(record);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id/punch-out', async (req, res) => {
  try {
    const rec = await Attendance.findById(req.params.id);
    if (!rec) return res.status(404).send({ message: 'Not found' });
    rec.outTime = req.body.outTime;
    await rec.save();
    res.json(rec);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;