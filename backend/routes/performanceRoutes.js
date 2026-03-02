import express from 'express';
import * as performanceService from '../services/performanceService.js';

const router = express.Router();

router.get('/metrics/:userId', async (req, res) => {
  try {
    const data = await performanceService.getPerformanceMetrics(req.params.userId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/plans/:userId', async (req, res) => {
  try {
    const data = await performanceService.getPreviousPlans(req.params.userId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/solution/:userId', async (req, res) => {
  try {
    const data = await performanceService.getIrrigationSolution(req.params.userId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
