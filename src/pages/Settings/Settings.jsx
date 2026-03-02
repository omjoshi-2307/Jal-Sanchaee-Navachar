import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { useAuth } from '../../hooks/AuthContext';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { User, Languages, CheckCircle2, Shield, Bell, Lock } from 'lucide-react';

const Settings = () => {
    const { user } = useAuth();
    const { t, i18n } = useTranslation();
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const languages = [
        { code: 'en', label: 'English', flag: '🇺🇸' },
        { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
        { code: 'mr', label: 'मराठी', flag: '🇮🇳' }
    ];

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'transparent' }}>
            <Sidebar isOpen={isSidebarOpen} onToggle={() => setSidebarOpen(!isSidebarOpen)} />

            <main style={{
                flex: 1,
                marginLeft: isSidebarOpen ? '280px' : '0',
                transition: 'var(--transition)',
                minHeight: '100vh'
            }}>
                <Header onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />

                <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ marginBottom: '40px' }}
                    >
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--primary)', marginBottom: '8px' }}>
                            {t('settings.title')}
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: '500' }}>
                            Manage your personal information and application preferences.
                        </p>
                    </motion.div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        {/* Profile Settings Section */}
                        <motion.section 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="glass-card" 
                            style={{ padding: '32px' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                                <div style={{ 
                                    width: '48px', 
                                    height: '48px', 
                                    borderRadius: '12px', 
                                    background: 'rgba(56, 126, 162, 0.1)', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    color: 'var(--primary)' 
                                }}>
                                    <User size={24} />
                                </div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)' }}>
                                    {t('settings.profile.title')}
                                </h2>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                <div className="input-group">
                                    <label style={{ fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px', display: 'block', fontSize: '0.9rem' }}>
                                        {t('settings.profile.name')}
                                    </label>
                                    <input
                                        type="text"
                                        readOnly
                                        value={user?.displayName || 'Farmer User'}
                                        className="glass-input"
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.3)' }}
                                    />
                                </div>
                                <div className="input-group">
                                    <label style={{ fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px', display: 'block', fontSize: '0.9rem' }}>
                                        {t('settings.profile.email')}
                                    </label>
                                    <input
                                        type="email"
                                        readOnly
                                        value={user?.email || ''}
                                        className="glass-input"
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.3)' }}
                                    />
                                </div>
                            </div>
                        </motion.section>

                        {/* Language Selection Section */}
                        <motion.section 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="glass-card" 
                            style={{ padding: '32px' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                                <div style={{ 
                                    width: '48px', 
                                    height: '48px', 
                                    borderRadius: '12px', 
                                    background: 'rgba(56, 126, 162, 0.1)', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    color: 'var(--primary)' 
                                }}>
                                    <Languages size={24} />
                                </div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)' }}>
                                    {t('settings.language.title')}
                                </h2>
                            </div>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '0.95rem' }}>
                                {t('settings.language.description')}
                            </p>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                                {languages.map((lng) => (
                                    <button
                                        key={lng.code}
                                        onClick={() => changeLanguage(lng.code)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '16px 20px',
                                            borderRadius: '16px',
                                            border: i18n.language === lng.code ? '2px solid var(--primary)' : '1px solid var(--glass-border)',
                                            background: i18n.language === lng.code ? 'rgba(56, 126, 162, 0.1)' : 'rgba(255, 255, 255, 0.3)',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            textAlign: 'left'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <span style={{ fontSize: '1.5rem' }}>{lng.flag}</span>
                                            <span style={{ fontWeight: '700', color: i18n.language === lng.code ? 'var(--primary)' : 'var(--text-main)' }}>
                                                {lng.label}
                                            </span>
                                        </div>
                                        {i18n.language === lng.code && <CheckCircle2 size={20} color="var(--primary)" />}
                                    </button>
                                ))}
                            </div>
                        </motion.section>

                        {/* Other Placeholder Sections */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                            <motion.section 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="glass-card" 
                                style={{ padding: '24px', opacity: 0.7 }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                    <Bell size={20} color="var(--text-muted)" />
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-muted)' }}>Notifications</h3>
                                </div>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Configure push alerts and SMS notifications.</p>
                            </motion.section>

                            <motion.section 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="glass-card" 
                                style={{ padding: '24px', opacity: 0.7 }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                    <Lock size={20} color="var(--text-muted)" />
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-muted)' }}>Privacy & Security</h3>
                                </div>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Manage your password and security keys.</p>
                            </motion.section>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Settings;
