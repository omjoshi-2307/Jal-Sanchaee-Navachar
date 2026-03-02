import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';
import { 
  Table as TableIcon, 
  Calendar, 
  Droplets, 
  Clock, 
  ChevronRight,
  Filter,
  Download,
  RefreshCw,
  Search
} from "lucide-react";
import axios from "axios";
import "./WaterTable.css";

const WaterTable = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Mock data for initial WOW effect, then attempt to fetch
    const mockData = [
      { farmerId: "f1", name: "Rajesh Kumar", litres: 5200, startTime: "06:00", endTime: "11:12" },
      { farmerId: "f2", name: "Suresh Patel", litres: 3400, startTime: "11:12", endTime: "14:36" },
      { farmerId: "f3", name: "Anita Devi", litres: 4100, startTime: "14:36", endTime: "18:42" },
      { farmerId: "f4", name: "Vikram Singh", litres: 2800, startTime: "18:42", endTime: "21:30" },
    ];

    const fetchSchedule = async () => {
      try {
        setLoading(true);
        // Attempt to fetch real data
        const response = await axios.get("http://localhost:5000/api/schedule/farmer/demo");
        if (response.data && response.data.length > 0) {
          setSchedule(response.data);
        } else {
          setSchedule(mockData);
        }
      } catch (error) {
        console.warn("Real API failed, using mock data for demo", error);
        setSchedule(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  const filteredSchedule = schedule.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="water-table-container">
      <motion.div 
        className="water-table-header"
        initial={{ opacity: 0, filter: "blur(10px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.8 }}
      >
        <div className="header-info">
          <h1>
            <Droplets className="header-icon" />
            {t('watertable.title')}
          </h1>
          <p>{t('watertable.subtitle')}</p>
        </div>
        
        <div className="header-stats">
          <div className="stat-card">
            <span className="stat-label">{t('watertable.stats.totalVolume')}</span>
            <span className="stat-value">15,500 L</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">{t('watertable.stats.farmersToday')}</span>
            <span className="stat-value">{schedule.length}</span>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="table-controls"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="search-bar">
          <Search className="search-icon" size={18} />
          <input 
            type="text" 
            placeholder={t('watertable.controls.searchPlaceholder')} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="action-buttons">
          <button className="btn-secondary"><Filter size={18} /> {t('watertable.controls.filter')}</button>
          <button className="btn-secondary"><Download size={18} /> {t('watertable.controls.export')}</button>
          <button className="btn-primary" onClick={() => window.location.reload()}>
            <RefreshCw size={18} /> {t('watertable.controls.refresh')}
          </button>
        </div>
      </motion.div>

      <motion.div 
        className="table-wrapper"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <table className="glass-table">
          <thead>
            <tr>
              <th><TableIcon size={16} /> {t('watertable.table.farmerId')}</th>
              <th>{t('watertable.table.farmerName')}</th>
              <th><Droplets size={16} /> {t('watertable.table.volume')}</th>
              <th><Clock size={16} /> {t('watertable.table.startTime')}</th>
              <th><Clock size={16} /> {t('watertable.table.endTime')}</th>
              <th>{t('watertable.table.status')}</th>
              <th>{t('watertable.table.action')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredSchedule.map((item, index) => (
              <motion.tr key={item.farmerId + index} variants={itemVariants}>
                <td className="id-cell">#{item.farmerId}</td>
                <td className="name-cell">{item.name}</td>
                <td className="vol-cell">{item.litres.toLocaleString()} L</td>
                <td className="time-cell start">{item.startTime}</td>
                <td className="time-cell end">{item.endTime}</td>
                <td>
                  <span className={`status-pill ${index === 0 ? 'active' : 'pending'}`}>
                    {index === 0 ? t('watertable.table.state.irrigating') : t('watertable.table.state.scheduled')}
                  </span>
                </td>
                <td className="action-cell">
                  <button className="icon-btn"><ChevronRight size={18} /></button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        
        {loading && (
          <div className="loading-overlay">
            <RefreshCw className="spinner" />
            <span>{t('watertable.loading')}</span>
          </div>
        )}
      </motion.div>

      <div className="decoration-blob-1"></div>
      <div className="decoration-blob-2"></div>
    </div>
  );
};

export default WaterTable;
