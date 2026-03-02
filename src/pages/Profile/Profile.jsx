import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { useAuth } from '../../hooks/AuthContext';
import { authService } from '../../services/authService';
import { locationService } from '../../services/locationService';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Layers, 
  Droplets, 
  Save, 
  Loader2, 
  Calendar,
  Shield
} from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    village: '',
    farmSize: '',
    irrigationType: 'Drip'
  });

  const navigate = useNavigate();

  const handleLocateMe = async () => {
    setLocating(true);
    try {
      if (!window.isSecureContext) {
        throw new Error('Geolocation requires a secure context (HTTPS or localhost)');
      }
      const position = await locationService.getCurrentPosition();
      const { latitude, longitude } = position.coords;
      const areaName = await locationService.resolveAreaName(latitude, longitude);
      
      setProfileData(prev => ({ ...prev, village: areaName }));
      toast.success(`Located: ${areaName}`);
    } catch (error) {
      console.error('[Profile] Location Error:', error);
      toast.error(error.message || 'Failed to resolve location name');
    } finally {
      setLocating(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const data = await authService.getUserProfile(user.uid);
        if (data) {
          setProfileData({
            fullName: data.fullName || '',
            email: data.email || '',
            phone: data.phone || '',
            village: data.village || '',
            farmSize: data.farmSize || '',
            irrigationType: data.irrigationType || 'Drip',
            role: data.role || 'user',
            createdAt: data.createdAt
          });
        }
      } catch (error) {
        toast.error(t('profile.loadError'));
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await authService.updateUserProfile(user.uid, {
        fullName: profileData.fullName,
        phone: profileData.phone,
        village: profileData.village,
        farmSize: profileData.farmSize,
        irrigationType: profileData.irrigationType
      });
      toast.success(t('profile.success'));
    } catch (error) {
      toast.error(t('profile.error'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-main)' }}>
        <Loader2 className="animate-spin" size={40} color="var(--primary)" />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'transparent' }}>
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setSidebarOpen(!isSidebarOpen)} />
      
      <main style={{ 
        flex: 1, 
        marginLeft: isSidebarOpen ? '280px' : '0',
        transition: 'var(--transition)',
        minHeight: '100vh',
        width: '100%'
      }}>
        <Header onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />
        
        <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
          <header style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--primary)', marginBottom: '10px' }}>
              {t('profile.title')}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: '500' }}>
              {t('profile.subtitle')}
            </p>
          </header>

          <form onSubmit={handleSubmit}>
            <div 
              className="glass-card"
              style={{ 
                padding: '40px', 
                borderRadius: '24px',
                marginBottom: '32px',
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(16px)',
                border: '1px solid var(--glass-border)',
                WebkitBackdropFilter: 'blur(16px)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '40px', paddingBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ width: '88px', height: '88px', borderRadius: '28px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', shadow: '0 10px 15px -3px rgba(0, 119, 182, 0.4)' }}>
                  <User size={44} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '6px' }}>{profileData.fullName}</h2>
                  <div style={{ display: 'flex', gap: '20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Shield size={16} /> {profileData.role === 'user' ? t('profile.status.member') : t('profile.status.admin')}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={16} /> {t('profile.status.joined')} {profileData.createdAt ? new Date(profileData.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="input-group">
                  <label className="input-label" style={{ marginBottom: '8px', display: 'block' }}>{t('profile.labels.fullName')}</label>
                  <div className="input-wrapper">
                    <User className="input-icon" size={18} />
                    <input 
                      name="fullName"
                      value={profileData.fullName}
                      onChange={handleChange}
                      className="auth-input glass-input"
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label" style={{ marginBottom: '8px', display: 'block' }}>{t('profile.labels.email')}</label>
                  <div className="input-wrapper">
                    <Mail className="input-icon" size={18} />
                    <input 
                      value={profileData.email}
                      disabled
                      className="auth-input"
                      style={{ background: 'rgba(0,0,0,0.05)', color: 'var(--text-muted)', cursor: 'not-allowed' }}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label" style={{ marginBottom: '8px', display: 'block' }}>{t('profile.labels.phone')}</label>
                  <div className="input-wrapper">
                    <Phone className="input-icon" size={18} />
                    <input 
                      name="phone"
                      value={profileData.phone}
                      onChange={handleChange}
                      className="auth-input glass-input"
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label" style={{ marginBottom: '8px', display: 'block' }}>{t('profile.labels.location')}</label>
                  <div className="input-wrapper">
                    <MapPin className="input-icon" size={18} />
                    <input 
                      name="village"
                      value={profileData.village}
                      onChange={handleChange}
                      placeholder={t('profile.labels.villagePlaceholder')}
                      className="auth-input glass-input"
                      style={{ paddingRight: '44px' }}
                    />
                    <button
                      type="button"
                      onClick={handleLocateMe}
                      disabled={locating}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'var(--primary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '4px',
                        zIndex: 10
                      }}
                      title={t('profile.buttons.locate')}
                    >
                      {locating ? <Loader2 size={18} className="animate-spin" /> : <MapPin size={18} />}
                    </button>
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label" style={{ marginBottom: '8px', display: 'block' }}>{t('profile.labels.farmSize')}</label>
                  <div className="input-wrapper">
                    <Layers className="input-icon" size={18} />
                    <input 
                      name="farmSize"
                      type="number"
                      step="0.1"
                      value={profileData.farmSize}
                      onChange={handleChange}
                      className="auth-input glass-input"
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label" style={{ marginBottom: '8px', display: 'block' }}>{t('profile.labels.irrigationType')}</label>
                  <div className="input-wrapper">
                    <Droplets className="input-icon" size={18} />
                    <select 
                      name="irrigationType"
                      value={profileData.irrigationType}
                      onChange={handleChange}
                      className="auth-input glass-input"
                      style={{ appearance: 'none' }}
                    >
                      <option value="Drip">Drip</option>
                      <option value="Sprinkler">Sprinkler</option>
                      <option value="Flood">Flood</option>
                      <option value="Manual">Manual</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  type="submit"
                  disabled={saving}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px', 
                    padding: '14px 40px', 
                    borderRadius: '14px', 
                    background: 'var(--primary)', 
                    color: 'white', 
                    fontWeight: '800', 
                    border: 'none', 
                    cursor: 'pointer', 
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 14px 0 rgba(0, 119, 182, 0.39)',
                    fontSize: '1rem'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 119, 182, 0.45)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(0, 119, 182, 0.39)';
                  }}
                >
                  {saving ? <Loader2 className="animate-spin" size={22} /> : <><Save size={20} /> {t('profile.buttons.save')}</>}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Profile;
