import express from 'express';
import { generateSchedule } from '../controllers/irrigationController.js';

const router = express.Router();

router.post('/generate-schedule', generateSchedule);

export default router;
