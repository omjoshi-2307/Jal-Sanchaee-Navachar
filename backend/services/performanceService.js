import { db } from '../config/firebase.js';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';

export const getPerformanceMetrics = async (userId) => {
  const q = query(collection(db, 'performance_metrics'), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return [];
  return snapshot.docs.map(doc => doc.data());
};

export const getPreviousPlans = async (userId) => {
  const q = query(collection(db, 'previous_plans'), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return [];
  return snapshot.docs.map(doc => doc.data());
};

export const getIrrigationSolution = async (userId) => {
  const q = query(collection(db, 'irrigation_solutions'), where('userId', '==', userId), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return snapshot.docs[0].data();
};
