import { db } from '../config/firebase.js';
import { collection, addDoc, getDocs, query, where, deleteDoc } from 'firebase/firestore';

const userId = "demo"; // Default demo user

const seedData = async () => {
  console.log("🚀 Starting seeding process...");

  try {
    // 1. Performance Metrics
    const metricsRef = collection(db, 'performance_metrics');
    const metrics = [
      { userId, metric: 'Water Consumption', oldPlan: '4,500 L/acre', newPlan: '3,200 L/acre', impact: '-28%', impactSaved: true },
      { userId, metric: 'Cost of Irrigation', oldPlan: '₹12,000', newPlan: '₹8,500', impact: 'Save ₹3,500', impactSaved: true },
      { userId, metric: 'Pump Usage', oldPlan: '150 Hours', newPlan: '110 Hours', impact: '-40 Hours', impactSaved: true }
    ];

    for (const m of metrics) {
      await addDoc(metricsRef, m);
    }
    console.log("✅ Performance metrics seeded.");

    // 2. Previous Plans
    const plansRef = collection(db, 'previous_plans');
    const plans = [
      { userId, crop: 'Wheat (Rabi)', date: '12 Jan 2024', status: 'Completed', season: 'Rabi' },
      { userId, crop: 'Maize (Kharif)', date: '15 June 2023', status: 'Archived', season: 'Kharif' },
      { userId, crop: 'Tomato (Zaid)', date: '10 March 2023', status: 'Archived', season: 'Zaid' }
    ];

    for (const p of plans) {
      await addDoc(plansRef, p);
    }
    console.log("✅ Previous plans seeded.");

    // 3. Irrigation Solutions
    const solutionsRef = collection(db, 'irrigation_solutions');
    const solution = {
      userId,
      availability: {
        status: 'Deficit',
        label: 'Low Availability',
        value: '450 mm/acre'
      },
      recommendation: {
        hoursPerDay: 4,
        daysPerWeek: 3,
        totalDays: 120,
        warning: 'Water shortage detected! Consider switching to Drip Irrigation for better efficiency.'
      }
    };

    await addDoc(solutionsRef, solution);
    console.log("✅ Irrigation solutions seeded.");

    console.log("\n🎉 Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
