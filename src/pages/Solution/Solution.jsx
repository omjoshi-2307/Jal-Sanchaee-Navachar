import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Droplets, 
  DollarSign, 
  Clock, 
  Calendar,
  AlertTriangle,
  Sprout,
  MapPin,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../hooks/AuthContext';
import { useTranslation } from 'react-i18next';
import { db } from '../../services/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import './Solution.css';

const Solution = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [scheduleData, setScheduleData] = useState(null);

  useEffect(() => {
    const fetchLatestSchedule = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, 'users', user.uid, 'irrigationSchedules'),
          orderBy('createdAt', 'desc'),
          limit(1)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setScheduleData(querySnapshot.docs[0].data());
        }
      } catch (error) {
        console.error('Error fetching schedule:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestSchedule();
  }, [user]);

  // Dynamic Growth Stage Names Mapping
  const stageNames = [
    t('solution.growthStages.initial'),
    t('solution.growthStages.vegetative'),
    t('solution.growthStages.flowering'),
    t('solution.growthStages.maturation')
  ];
  const stageColors = ['#0ea5e9', '#22c55e', '#f59e0b', '#a855f7'];

  const growthStages = scheduleData?.schedule?.map((week, i) => ({
    ...week,
    name: stageNames[i] || `Week ${week.week}`,
    days: `Week ${week.week}`,
    color: stageColors[i] || '#22c55e',
    method: scheduleData?.formData?.waterSources?.includes('drip') ? 'Drip Irrigation' : 
            scheduleData?.formData?.waterSources?.includes('sprinkler') ? 'Sprinkler' : 'Standard Irrigation'
  })) || [
    { name: t('solution.growthStages.initial'), days: 'Day 1 - 20', method: 'Sprinkler', color: '#0ea5e9', instructions: 'Keep soil moist but not waterlogged.' },
    { name: t('solution.growthStages.vegetative'), days: 'Day 21 - 60', method: 'Drip Irrigation', color: '#22c55e', instructions: 'High water demand. Ensure deep root watering.' },
    { name: t('solution.growthStages.flowering'), days: 'Day 61 - 90', method: 'Drip Irrigation', color: '#22c55e', instructions: 'Critical stage. Avoid water stress.' },
    { name: t('solution.growthStages.maturation'), days: 'Day 91 - 120', method: 'Controlled Manual', color: '#a855f7', instructions: 'Reduce watering gradually to prepare for harvest.' }
  ];


  // Dynamic Alternative Method Logic
  const getAlternativeMethod = () => {
    const selectedSources = scheduleData?.formData?.waterSources || [];
    if (selectedSources.includes('drip')) {
      return {
        title: 'Mulching + Drip',
        desc: 'Saves 30% more water by reducing evaporation from soil surface.',
        icon: <Sprout size={24} color="#22c55e" />
      };
    }
    return {
      title: 'Upgrade to Drip',
      desc: 'Convert to Drip Irrigation to save up to 40% water and improve yield.',
      icon: <Droplets size={24} color="#0ea5e9" />
    };
  };

  const altMethod = getAlternativeMethod();

  if (loading) {
    return (
      <div className="solution-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Loader2 className="animate-spin" size={48} color="var(--primary)" />
      </div>
    );
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
    <div className="solution-container">
      <div className="solution-header">
        <div className="logo-placeholder">Logo</div>
        <div className="nav-links">
          <span>Language</span>
        </div>
      </div>

      <div className="title-wrapper">
         <h1 className="main-title">{t('solution.title')}</h1>
      </div>

      <motion.div 
        className="solution-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="top-row-grid">
          {/* Solution - Deficit Gauge */}
          <motion.div className="white-card deficit-section" variants={cardVariants}>
            <h3 className="card-title">{t('solution.cards.gauge')}</h3>
            <div className="gauge-wrap">
              <div className="deficit-circle">
                <svg viewBox="0 0 36 36" className="circular-chart">
                  <path className="circle-bg" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="circle" fill="none" strokeDasharray="75, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="percentage">
                  <span className="p-top">{t('solution.gauge.deficit')}</span>
                  <span className="p-sub">{t('solution.gauge.low')}</span>
                </div>
              </div>
            </div>
            <div className="avail-footer">
              <span className="label">{t('solution.gauge.current')}</span>
              <span className="avail-val">450 mm/acre</span>
            </div>
          </motion.div>

          <motion.div className="white-card recommend-section" variants={cardVariants}>
            <h3 className="card-title">{t('solution.cards.recommendTitle')}</h3>
            <div className="schedule-box">
              <div className="s-item">
                 <div className="icon-wrap"><Clock size={24} color="#0ea5e9" /></div>
                 <div className="s-text">
                   <strong>{scheduleData?.summary?.averageFrequency?.split(' ')[0] || '4'}</strong>
                   <span>{scheduleData?.summary?.averageFrequency?.split(' ').slice(1).join(' ') || t('solution.recommend.hours')}</span>
                 </div>
              </div>
              <div className="s-item">
                 <div className="icon-wrap"><Calendar size={24} color="#0ea5e9" /></div>
                 <div className="s-text">
                   <strong>{scheduleData?.summary?.totalMonthlyWater?.toLocaleString() || '450,000'}</strong>
                   <span>{t('solution.recommend.liters')}</span>
                 </div>
              </div>
              <div className="s-item">
                 <div className="icon-wrap">⏳</div>
                 <div className="s-text">
                   <strong>{scheduleData?.summary?.cropName || 'Wheat'}</strong>
                   <span>{t('solution.recommend.target')}</span>
                 </div>
              </div>
            </div>
            <div className="alert-banner">
              <div className="alert-icon">⚠️</div>
              <p>{scheduleData?.summary?.weatherNotice || 'Water shortage detected! Consider switching to Drip Irrigation for better efficiency.'}</p>
            </div>
          </motion.div>
        </div>

        <div className="bottom-row-grid">
          <div className="left-column">
             {/* Irrigation Plan by Growth Stage */}
             <motion.div className="white-card growth-section" variants={cardVariants}>
                <h2 className="section-title">{t('solution.cards.instructionsTitle')}</h2>
                <div className="timeline">
                   {growthStages.map((stage, i) => (
                     <div className="timeline-item" key={i}>
                        <div className="timeline-marker-box">
                           <div className="timeline-marker" style={{ borderColor: stage.color }}></div>
                        </div>
                        <div className="timeline-content">
                           <h3>{stage.name}</h3>
                           <div className="stage-meta">
                               <span className="days">Week {stage.week || i + 1}</span>
                               <span className="method-pill" style={{ background: `${stage.color || '#22c55e'}15`, color: stage.color || '#22c55e' }}>
                                 {stage.method === 'Sprinkler' && <Droplets size={14} />}
                                 {stage.method?.includes('Drip') && <Sprout size={14} />}
                                 {stage.method?.includes('Manual') && <Clock size={14} />}
                                 {stage.method || 'Drip Irrigation'}
                               </span>
                            </div>
                            <p className="desc-text">{stage.instructions || stage.desc}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </motion.div>
          </div>

          <div className="right-column">
            {/* Alternative Method */}
            <motion.div className="white-card alt-method-card" variants={cardVariants}>
               <h3 className="card-title">{t('solution.cards.altMethod')}</h3>
               <div className="alt-content">
                  <div className="alt-icon-box">
                    {altMethod.icon}
                  </div>
                  <div className="alt-text">
                     <strong>{altMethod.title}</strong>
                     <span>{altMethod.desc}</span>
                  </div>
               </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Solution;
