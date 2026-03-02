import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Bell, User, Search, Menu, Settings, LogOut, UserCircle, CheckCircle2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NOTIFICATIONS_DATA = [
  { id: 1, icon: <CheckCircle2 size={16} color="#10b981" />, title: 'Irrigation Complete', time: '2 mins ago', desc: 'Sector A has been successfully irrigated.', isRead: false },
  { id: 2, icon: <Bell size={16} color="#3b82f6" />, title: 'Weather Alert', time: '1 hour ago', desc: 'Heavy rain expected this evening. Schedule adjusted.', isRead: false },
  { id: 3, icon: <Clock size={16} color="#f59e0b" />, title: 'Maintenance Due', time: '5 hours ago', desc: 'Pump #2 filter replacement scheduled for tomorrow.', isRead: true }
];

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [activeDropdown, setActiveDropdown] = useState(null); // 'notifications' | 'profile' | null
  const [notifications, setNotifications] = useState(NOTIFICATIONS_DATA);
  const headerRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (type) => {
    setActiveDropdown(activeDropdown === type ? null : type);
  };

  const markAllAsRead = (e) => {
    e.stopPropagation();
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const handleAction = (path, action) => {
    setActiveDropdown(null);
    if (action) action();
    if (path) navigate(path);
  };

  const dropdownAnimation = {
    initial: { opacity: 0, y: -10, x: '-50%' },
    animate: { opacity: 1, y: 0, x: '-50%' },
    exit: { opacity: 0, y: -10, x: '-50%' },
    transition: { duration: 0.2, ease: 'easeOut' }
  };

  return (
    <header 
      ref={headerRef}
      style={{
        height: '80px',
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--glass-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.05)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button 
          onClick={onMenuClick}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--text-main)',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Menu size={24} />
        </button>
        <div style={{ position: 'relative' }} className="search-container">
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search resources..."
            className="glass-input"
            style={{
              padding: '12px 20px 12px 48px',
              borderRadius: '24px',
              width: '320px',
              fontSize: '0.95rem',
              outline: 'none',
              background: 'rgba(255, 255, 255, 0.5)',
              border: 'none',
              transition: 'var(--transition)'
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <button 
            onClick={() => toggleDropdown('notifications')}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--primary)', 
              position: 'relative',
              cursor: 'pointer',
              padding: '10px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
          >
            <Bell size={24} />
            {unreadCount > 0 && (
              <span style={{ 
                position: 'absolute', 
                top: '10px', 
                right: '10px', 
                width: '8px', 
                height: '8px', 
                background: '#ff4d4f', 
                borderRadius: '50%',
                border: '1.5px solid white'
              }} />
            )}
          </button>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={() => toggleDropdown('profile')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '12px',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)' }}>
              {user?.displayName?.split(' ')[0] || 'Om'}
            </div>
            <div style={{ 
              width: '44px', 
              height: '44px', 
              borderRadius: '50%', 
              background: '#7fb3d5', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'white',
              fontWeight: '700',
              fontSize: '1.1rem',
              boxShadow: '0 4px 12px rgba(127, 179, 213, 0.3)'
            }}>
              {user?.displayName ? user.displayName[0] : 'O'}
            </div>
          </button>
        </div>
      </div>

      {/* Global Centered Dropdowns Container */}
      <AnimatePresence>
        {activeDropdown === 'notifications' && (
          <motion.div
            key="notifications-dropdown"
            {...dropdownAnimation}
            style={{
              position: 'absolute',
              top: '85px',
              left: '50%',
              width: '360px',
              maxWidth: '90vw',
              background: 'rgba(255, 255, 255, 0.4)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderRadius: '24px',
              boxShadow: 'var(--shadow-2xl)',
              zIndex: 40,
              overflow: 'hidden',
              border: '1px solid var(--glass-border)'
            }}
          >
            <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)' }}>Notifications</h3>
              <button 
                onClick={markAllAsRead}
                style={{ background: 'none', border: 'none', padding: 0, fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer' }}
              >
                Mark all as read
              </button>
            </div>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {notifications.map((item, idx) => (
                <div 
                  key={item.id} 
                  style={{ 
                    padding: '12px 16px', 
                    borderBottom: idx === notifications.length - 1 ? 'none' : '1px solid #f1f5f9', 
                    cursor: 'pointer', 
                    transition: 'background 0.2s',
                    background: item.isRead ? 'white' : 'rgba(0, 119, 182, 0.03)'
                  }} 
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'} 
                  onMouseLeave={(e) => e.currentTarget.style.background = item.isRead ? 'white' : 'rgba(0, 119, 182, 0.03)'}
                  onClick={() => handleAction('/notifications')}
                >
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ marginTop: '2px' }}>{item.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#1e293b' }}>{item.title}</div>
                        {!item.isRead && (
                          <div style={{ width: '6px', height: '6px', background: 'var(--primary)', borderRadius: '50%' }} />
                        )}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px', lineHeight: '1.4' }}>{item.desc}</div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px' }}>{item.time}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div 
              style={{ padding: '12px', background: '#f8fafc', textAlign: 'center', borderTop: '1px solid #f1f5f9', cursor: 'pointer' }}
              onClick={() => handleAction('/notifications')}
            >
              <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '600' }}>View All Notifications</span>
            </div>
          </motion.div>
        )}

        {activeDropdown === 'profile' && (
          <motion.div
            key="profile-dropdown"
            {...dropdownAnimation}
            style={{
              position: 'absolute',
              top: '85px',
              left: '50%',
              width: '280px',
              maxWidth: '90vw',
              background: 'rgba(255, 255, 255, 0.4)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderRadius: '24px',
              boxShadow: 'var(--shadow-2xl)',
              zIndex: 40,
              padding: '8px',
              border: '1px solid var(--glass-border)'
            }}
          >
            <div style={{ padding: '12px', borderBottom: '1px solid #f1f5f9', marginBottom: '4px' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)' }}>{user?.displayName || 'Farmer User'}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '1px' }}>{user?.email}</div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {[
                { icon: <UserCircle size={18} />, label: t('nav.myProfile'), path: '/profile' },
                { icon: <Settings size={18} />, label: t('nav.settings'), path: '/settings' },
                { icon: <LogOut size={18} />, label: t('nav.logout'), color: '#ef4444', action: logout }
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAction(item.path, item.action)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '10px 12px',
                    border: 'none',
                    background: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    color: item.color || '#475569',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.color = item.color || 'var(--primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'none';
                    e.currentTarget.style.color = item.color || '#475569';
                  }}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
