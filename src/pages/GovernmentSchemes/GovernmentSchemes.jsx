import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Landmark, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './GovernmentSchemes.css';

const schemes = [
  {
    title: 'Pradhan Mantri Krishi Sinchayee Yojana – Per Drop More Crop (PMKSY‑PDMC)',
    description: 'Focuses on enhancing water use efficiency at farm level through Micro Irrigation (Drip and Sprinkler Irrigation systems).',
    link: 'https://www.myscheme.gov.in/schemes/pmksypdmc',
    category: 'Micro Irrigation'
  },
  {
    title: 'Micro Irrigation Fund (MIF) – NABARD',
    description: 'A dedicated fund established with NABARD to provide subsidized loans to states for expanding micro irrigation coverage.',
    link: 'https://www.nabard.org/microirrigationfund',
    category: 'Finance & Subsidies'
  },
  {
    title: 'Assistance for Installation of Sprinkler / Drip Micro Irrigation Systems (AISPMIS)',
    description: 'Financial assistance provided to farmers for purchasing and installing efficient irrigation hardware.',
    link: 'https://www.myscheme.gov.in/schemes/aispmis',
    category: 'Equipment Support'
  },
  {
    title: 'Application for Assistance under Micro Irrigation (Central Portal)',
    description: 'Direct portal for farmers to apply for subsidies on drip and sprinkler systems across India.',
    link: 'https://services.india.gov.in/service/detail/application-for-assistance-under-micro-irrigation',
    category: 'Direct Application'
  },
  {
    title: 'Major Schemes for Farmers – National Government Services Portal',
    description: 'A comprehensive overview and centralized directory for all irrigation and agricultural related schemes.',
    link: 'https://services.india.gov.in/service/detail/major-schemes-for-farmers-1',
    category: 'Overview'
  }
];

const GovernmentSchemes = () => {
  const { t } = useTranslation();
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
    <div className="schemes-container">
      <div className="schemes-header">
        <Landmark size={40} color="#0369a1" />
        <div>
          <h1>{t('schemes.title')}</h1>
          <p>{t('schemes.subtitle')}</p>
        </div>
      </div>

      <motion.div 
        className="schemes-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {schemes.map((scheme, index) => (
          <motion.a
            key={index}
            href={scheme.link}
            target="_blank"
            rel="noopener noreferrer"
            className="scheme-card"
            variants={cardVariants}
            whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
          >
            <div className="scheme-tag">{scheme.category}</div>
            <h3 className="scheme-link-title">{scheme.title}</h3>
            <p className="scheme-desc">{scheme.description}</p>
            <div className="scheme-footer">
              <span className="visit-text">{t('schemes.card.visit')}</span>
              <div className="link-icon-box">
                <ExternalLink size={18} />
              </div>
            </div>
          </motion.a>
        ))}
      </motion.div>
    </div>
  );
};

export default GovernmentSchemes;
