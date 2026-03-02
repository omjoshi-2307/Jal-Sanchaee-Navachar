import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase.js";
import { calculateIrrigation } from "../services/irrigationService.js";

export const generateSchedule = async (req, res) => {
  const { userId, formData } = req.body;

  console.log(`Received request for user: ${userId}`);

  if (!userId || !formData) {
    return res.status(400).json({ error: 'Missing userId or formData' });
  }

  try {
    const result = calculateIrrigation(formData);
    
    // Return result immediately
    res.json({
      success: true,
      schedule: result
    });

    // Store in Firestore asynchronously (background task)
    (async () => {
      try {
        const scheduleCollectionRef = collection(db, 'users', userId, 'irrigationSchedules');
        const docRef = await addDoc(scheduleCollectionRef, {
          ...result,
          formData,
          createdAt: serverTimestamp()
        });
        console.log(`[Background] Schedule saved successfully with ID: ${docRef.id}`);
      } catch (dbError) {
        console.error('[Background] Firestore write failed:', dbError.message);
      }
    })();

  } catch (error) {
    console.error('Error generating schedule:', error);
    res.status(500).json({ error: `Internal Server Error: ${error.message}` });
  }
};
