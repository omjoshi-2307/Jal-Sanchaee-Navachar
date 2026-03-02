import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Droplets, 
  DollarSign, 
  Clock, 
  ChevronRight, 
  Calendar,
  AlertTriangle,
  ArrowUpRight,
  TrendingDown
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../hooks/AuthContext';
import './Analytics.css';

const Analytics = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState([]);
  const [plans, setPlans] = useState([]);
  const [solution, setSolution] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = user?.uid || 'demo';
        const [metricsRes, plansRes, solutionRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/performance/metrics/${userId}`),
          axios.get(`http://localhost:5000/api/performance/plans/${userId}`),
          axios.get(`http://localhost:5000/api/performance/solution/${userId}`)
        ]);

        setMetrics(metricsRes.data);
        setPlans(plansRes.data);
        setSolution(solutionRes.data);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return <div className="loading-container">Loading Analytics...</div>;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h1>Performance & Solution Analytics</h1>
        <div className="header-actions">
          <button className="contact-btn">Contact</button>
        </div>
      </div>

      <motion.div 
        className="analytics-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Performance Comparison Section */}
        <motion.div className="card performance-card" variants={cardVariants}>
          <div className="card-header">
            <h2>Performance Comparison</h2>
            <select className="period-select">
              <option>Current vs Last Season</option>
            </select>
          </div>
          <table className="performance-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Old Plan (2023)</th>
                <th>New Plan (2024)</th>
                <th>Impact</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((item, idx) => (
                <tr key={idx}>
                  <td className="metric-cell">
                    {item.metric === 'Water Consumption' && <Droplets size={16} className="blue-icon" />}
                    {item.metric === 'Cost of Irrigation' && <DollarSign size={16} className="green-icon" />}
                    {item.metric === 'Pump Usage' && <Clock size={16} className="orange-icon" />}
                    {item.metric}
                  </td>
                  <td>{item.oldPlan}</td>
                  <td>{item.newPlan}</td>
                  <td className="impact-cell">
                    <span className={`impact-badge ${item.impactSaved ? 'saved' : ''}`}>
                      {item.impact}
                      {item.impact.includes('-') && ' (Saved)'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Previous Plans Section */}
        <motion.div className="card plans-card" variants={cardVariants}>
          <div className="card-header">
            <h2>Previous Plans</h2>
            <div className="filter-chips">
              <span className="chip active">All</span>
              <span className="chip">Kharif</span>
              <span className="chip">Rabi</span>
            </div>
          </div>
          <div className="plans-list">
            {plans.map((plan, idx) => (
              <div className="plan-item" key={idx}>
                <div className="plan-icon">
                  {plan.crop.includes('Wheat') ? '🌾' : plan.crop.includes('Maize') ? '🌽' : '🍅'}
                </div>
                <div className="plan-info">
                  <h3>{plan.crop}</h3>
                  <span>{plan.date}</span>
                </div>
                <div className="plan-actions">
                  <span className={`status-tag ${plan.status.toLowerCase()}`}>{plan.status}</span>
                  <button className="open-btn">Open Plan</button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Water Availability Gauge Section */}
        <motion.div className="card deficit-card" variants={cardVariants}>
          <h2>Water Availability vs Requirement</h2>
          <div className="gauge-container">
            <div className="gauge">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" className="gauge-bg" />
                <circle cx="50" cy="50" r="45" className="gauge-progress" style={{ strokeDashoffset: '140' }} />
              </svg>
              <div className="gauge-text">
                <span className="deficit-label">{solution?.availability.status}</span>
                <span className="availability-label">{solution?.availability.label}</span>
              </div>
            </div>
          </div>
          <div className="availability-footer">
            <span>Current Availability</span>
            <span className="availability-value">{solution?.availability.value}</span>
          </div>
        </motion.div>

        {/* Recommended Schedule Section */}
        <motion.div className="card schedule-card" variants={cardVariants}>
          <h2>Recommended Schedule</h2>
          <div className="schedule-metrics">
            <div className="s-metric">
              <Clock size={24} />
              <div className="s-metric-info">
                <strong>{solution?.recommendation.hoursPerDay}</strong>
                <span>Hours/Day</span>
              </div>
            </div>
            <div className="s-metric">
              <Calendar size={24} />
              <div className="s-metric-info">
                <strong>{solution?.recommendation.daysPerWeek}</strong>
                <span>Days/Week</span>
              </div>
            </div>
            <div className="s-metric">
              <div className="timer-icon">⏳</div>
              <div className="s-metric-info">
                <strong>{solution?.recommendation.totalDays}</strong>
                <span>Total Days</span>
              </div>
            </div>
          </div>
          <div className="warning-box">
             <AlertTriangle size={18} />
             <p>{solution?.recommendation.warning}</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Analytics;
