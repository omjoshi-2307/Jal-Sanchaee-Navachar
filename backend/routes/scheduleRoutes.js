import express from 'express';
import { generateDailySchedule } from '../services/scheduleService.js';
import { db } from '../config/firebase.js';
import { collection, getDocs, writeBatch, query, where, doc } from 'firebase/firestore';

const router = express.Router();

// POST /api/schedule/generate
router.post('/generate', async (req, res) => {
  try {
    // 1️⃣ Fetch all farmers from Firestore
    // Note: Assuming 'farmers' is the collection name based on previous request
    const farmersRef = collection(db, 'farmers');
    const snapshot = await getDocs(farmersRef);

    if (snapshot.empty) {
      return res.status(400).json({ error: "No farmers found" });
    }

    const farmers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // 2️⃣ Generate schedule
    const schedule = generateDailySchedule(farmers);

    // 3️⃣ Save schedule to Firestore
    const batch = writeBatch(db);

    schedule.forEach(entry => {
      const ref = doc(collection(db, 'schedule'));
      batch.set(ref, entry);
    });

    await batch.commit();

    res.json({
      message: "Schedule generated successfully",
      totalFarmersScheduled: schedule.length
    });

  } catch (err) {
    console.error("Error in /generate:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/schedule/farmer/:id
router.get('/farmer/:id', async (req, res) => {
  try {
    const farmerId = req.params.id;

    const scheduleRef = collection(db, 'schedule');
    const q = query(scheduleRef, where('farmerId', '==', farmerId));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return res.status(404).json({ error: "No schedule found for this farmer" });
    }

    const scheduleData = snapshot.docs.map(doc => doc.data());
    res.json(scheduleData);

  } catch (err) {
    console.error("Error in /farmer/:id:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;