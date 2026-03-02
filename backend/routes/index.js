import express from 'express';
import irrigationRoutes from './irrigationRoutes.js';
import scheduleRoutes from './scheduleRoutes.js';
import performanceRoutes from './performanceRoutes.js';

const router = express.Router();

router.use('/irrigation', irrigationRoutes);
router.use('/schedule', scheduleRoutes);
router.use('/performance', performanceRoutes);

// Health check route moved here
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

export default router;
