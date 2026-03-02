import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Book, Phone, Send } from 'lucide-react';

const Support = () => {
  const { t } = useTranslation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Support request submitted:', { email, message });
    // In a real app, this would call an API
    alert(t('support.expert.success'));
    setEmail('');
    setMessage('');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'transparent' }}>
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setSidebarOpen(!isSidebarOpen)} />

      <main style={{
        flex: 1,
        marginLeft: isSidebarOpen ? '280px' : '0',
        transition: 'var(--transition)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Header onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />

        <div style={{
          padding: '60px 80px',
          flex: 1,
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%'
        }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: '48px' }}
          >
            <h1 style={{ 
              fontSize: '3.5rem', 
              fontWeight: '800', 
              color: 'var(--text-main)', 
              marginBottom: '12px',
              letterSpacing: '-0.02em'
            }}>{t('support.title')}</h1>
            <p style={{ 
              fontSize: '1.25rem', 
              color: 'var(--text-muted)', 
              fontWeight: '500' 
            }}>
              {t('support.subtitle')}
            </p>
          </motion.div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1.2fr 1fr', 
            gap: '32px',
            alignItems: 'start'
          }}>
            {/* Contact Form Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card"
              style={{ padding: '40px', borderRadius: '32px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                <div style={{ 
                  padding: '12px', 
                  borderRadius: '12px', 
                  background: 'rgba(255,255,255,0.4)',
                  color: 'var(--primary)'
                }}>
                  <MessageSquare size={24} />
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)' }}>{t('support.expert.title')}</h2>
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.9rem', 
                    fontWeight: '700', 
                    color: 'var(--text-main)', 
                    marginBottom: '8px' 
                  }}>{t('support.expert.emailLabel')}</label>
                  <input
                    type="email"
                    required
                    placeholder={t('support.expert.emailPlaceholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="glass-input"
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      borderRadius: '16px',
                      fontSize: '1rem',
                      outline: 'none',
                      border: 'none'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '32px' }}>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.9rem', 
                    fontWeight: '700', 
                    color: 'var(--text-main)', 
                    marginBottom: '8px' 
                  }}>{t('support.expert.messageLabel')}</label>
                  <textarea
                    required
                    placeholder={t('support.expert.messagePlaceholder')}
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="glass-input"
                    style={{
                      width: '100%',
                      padding: '20px',
                      borderRadius: '16px',
                      fontSize: '1rem',
                      outline: 'none',
                      border: 'none',
                      resize: 'none',
                      lineHeight: '1.5',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '18px',
                    borderRadius: '16px',
                    background: 'var(--primary)',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: '700',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    boxShadow: '0 8px 24px rgba(24, 78, 108, 0.2)'
                  }}
                >
                  <Send size={20} />
                  {t('support.expert.send')}
                </button>
              </form>
            </motion.div>

            {/* Side Info Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Knowledge Base Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card"
                style={{ padding: '32px', borderRadius: '32px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ color: 'var(--secondary)' }}>
                    <Book size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>{t('support.kb.title')}</h3>
                </div>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {t('support.kb.articles', { returnObjects: true }).map((item, i) => (
                    <li key={i} style={{ 
                      marginBottom: '16px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      fontSize: '1rem',
                      color: 'var(--text-main)',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}>
                      <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Direct Contact Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card"
                style={{ padding: '32px', borderRadius: '32px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ color: 'var(--secondary)' }}>
                    <Phone size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>{t('support.direct.title')}</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '1rem', fontWeight: '600', color: 'var(--primary)', marginBottom: '4px' }}>
                      {t('support.direct.helpline')}
                    </span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      {t('support.direct.hours')}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default Support;
