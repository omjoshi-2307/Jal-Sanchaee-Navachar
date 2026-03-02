import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/AuthContext';
import { getFarmerHistory } from './historyService';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Droplets, Leaf, CircleDollarSign, ShieldCheck,
    TrendingUp, AlertTriangle, Timer, Wallet, Menu, X, Loader2
} from 'lucide-react';

export default function HistoryDashboard() {
    const { user } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState('All');
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user?.uid) {
            fetchHistory();
        }
    }, [user?.uid]);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const data = await getFarmerHistory(user.uid);
            setHistory(data);
        } catch (err) {
            console.error("Failed to fetch history:", err);
            setError("Failed to load history");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return "Unknown Date";
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000);
        return date.toLocaleDateString("en-US", { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const getCropEmoji = (crop) => {
        const c = crop?.toLowerCase() || '';
        if (c.includes('wheat')) return '🌾';
        if (c.includes('maize') || c.includes('corn')) return '🌽';
        if (c.includes('tomato')) return '🍅';
        if (c.includes('rice')) return '🍚';
        return '🌱';
    };

    const toggleMenu = () => setMenuOpen(!menuOpen);

    const filteredHistory = history.filter(item => 
        activeFilter === 'All' || item.season === activeFilter
    );

    return (
        <div style={{ padding: '0 0 40px 0', minHeight: '100vh', background: 'transparent', position: 'relative' }}>
            {/* Main Content */}
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--primary)', marginBottom: '32px' }}>
                    {t('history.title')}
                </h1>

                {/* Stats Overview */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                    gap: '24px', 
                    marginBottom: '40px' 
                }}>
                    <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(56, 126, 162, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                            <Droplets size={28} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '4px' }}>{t('history.stats.waterAvailability')}
</h3>
                            <p style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)' }}>450 <small style={{ fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-muted)' }}>mm/acre</small></p>
                            <div style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: '700', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <TrendingUp size={14} /> 12% vs last year
                            </div>
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(56, 126, 162, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                            <Leaf size={28} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '4px' }}>{t('history.stats.waterSaved')}
</h3>
                            <p style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)' }}>12,500 <small style={{ fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-muted)' }}>Liters</small></p>
                            <div style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: '700', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <TrendingUp size={14} /> 8% vs last season
                            </div>
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(56, 126, 162, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                            <CircleDollarSign size={28} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '4px' }}>{t('history.stats.costEfficiency')}
</h3>
                            <p style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)' }}>₹15,000 <small style={{ fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-muted)' }}>Saved</small></p>
                            <div style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: '700', marginTop: '4px' }}>Through Drip/Sprinkler</div>
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                            <ShieldCheck size={28} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '4px' }}>{t('history.stats.bufferStock')}
</h3>
                            <p style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)' }}>5,000 <small style={{ fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-muted)' }}>Liters</small></p>
                            <div style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: '700', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <AlertTriangle size={14} /> Heatwave Alert
                            </div>
                        </div>
                    </div>
                </div>

                {/* Layout Split: History List & Comparison */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1.5fr 1fr', 
                    gap: '32px',
                    alignItems: 'start'
                }}>

                    {/* Left: Comparison Table */}
                    <section className="glass-card" style={{ padding: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)' }}>{t('history.comparison.title')}
</h2>
                            <select className="glass-input" style={{ padding: '10px 16px', borderRadius: '12px', fontSize: '0.9rem', color: 'var(--text-main)', border: 'none', background: 'rgba(255, 255, 255, 0.4)' }}>
                                <option>Current vs Last Season</option>
                                <option>Wheat 2024 vs Wheat 2023</option>
                            </select>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                                <thead>
                                    <tr>
                                        <th style={{ textAlign: 'left', padding: '12px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '700' }}>{t('history.comparison.metric')}
</th>
                                        <th style={{ textAlign: 'left', padding: '12px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '700' }}>{t('history.comparison.oldPlan')}
</th>
                                        <th style={{ textAlign: 'left', padding: '12px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '700' }}>{t('history.comparison.newPlan')}
</th>
                                        <th style={{ textAlign: 'left', padding: '12px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '700' }}>{t('history.comparison.impact')}
</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { metric: 'Water Consumption', icon: Droplets, old: '4,500 L/acre', new: '3,200 L/acre', impact: '-28% (Saved)', color: '#0ea5e9' },
                                        { metric: 'Cost of Irrigation', icon: Wallet, old: '₹12,000', new: '₹8,500', impact: 'Save ₹3,500', color: '#10b981' },
                                        { metric: 'Pump Usage', icon: Timer, old: '150 Hours', new: '110 Hours', impact: '-40 Hours', color: '#f59e0b' }
                                    ].map((row, idx) => (
                                        <tr key={idx} style={{ background: 'rgba(255, 255, 255, 0.2)', transition: 'all 0.2s ease' }}>
                                            <td style={{ padding: '16px 12px', borderRadius: '12px 0 0 12px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '600', color: 'var(--text-main)' }}>
                                                    <row.icon size={18} color={row.color} /> {row.metric}
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px 12px', fontWeight: '600', color: 'var(--text-main)' }}>{row.old}</td>
                                            <td style={{ padding: '16px 12px', fontWeight: '600', color: 'var(--text-main)' }}>{row.new}</td>
                                            <td style={{ padding: '16px 12px', borderRadius: '0 12px 12px 0' }}>
                                                <span style={{ 
                                                    background: 'rgba(16, 185, 129, 0.1)', 
                                                    color: '#059669', 
                                                    padding: '6px 12px', 
                                                    borderRadius: '20px', 
                                                    fontSize: '0.75rem', 
                                                    fontWeight: '700' 
                                                }}>
                                                    {row.impact}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Right: History List */}
                    <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)' }}>{t('history.list.title')}
</h2>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {['All', 'Kharif', 'Rabi'].map(filter => (
                                    <button
                                        key={filter}
                                        onClick={() => setActiveFilter(filter)}
                                        style={{
                                            padding: '6px 16px',
                                            borderRadius: '20px',
                                            fontSize: '0.75rem',
                                            fontWeight: '700',
                                            border: 'none',
                                            background: activeFilter === filter ? 'var(--primary)' : 'rgba(255, 255, 255, 0.4)',
                                            color: activeFilter === filter ? 'white' : 'var(--text-muted)',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {filter === 'All' ? t('history.list.all') : filter === 'Kharif' ? t('history.list.kharif') : t('history.list.rabi')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {loading ? (
                                <div style={{ display: 'flex', justifyContent: 'center', py: '40px' }}>
                                    <Loader2 className="animate-spin" size={32} color="var(--primary)" />
                                </div>
                            ) : error ? (
                                <div style={{ textAlign: 'center', padding: '32px', color: '#ef4444', fontWeight: '600' }}>
                                    {error}
                                </div>
                            ) : filteredHistory.length === 0 ? (
                                <div className="glass-card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                    No history found for this category.
                                </div>
                            ) : (
                                filteredHistory.map((record) => (
                                    <motion.div 
                                        key={record.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="glass-card"
                                        style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(56, 126, 162, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                                                {getCropEmoji(record.crop)}
                                            </div>
                                            <div>
                                                <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)' }}>
                                                    {record.crop} ({record.season || 'N/A'})
                                                </h3>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                                                    {formatDate(record.date)}
                                                </span>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                                            <span style={{ 
                                                background: record.status === 'Completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(56, 126, 162, 0.1)', 
                                                color: record.status === 'Completed' ? '#059669' : 'var(--primary)', 
                                                padding: '4px 10px', 
                                                borderRadius: '8px', 
                                                fontSize: '0.7rem', 
                                                fontWeight: '800' 
                                            }}>
                                                {record.status}
                                            </span>
                                            <button style={{ 
                                                background: 'none', 
                                                border: '1.5px solid var(--primary)', 
                                                color: 'var(--primary)', 
                                                padding: '6px 12px', 
                                                borderRadius: '10px', 
                                                fontSize: '0.75rem', 
                                                fontWeight: '700' 
                                            }}>
                                                {t('history.list.openPlan')}
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
