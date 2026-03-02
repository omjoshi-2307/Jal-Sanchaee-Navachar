import React, { useState, useEffect } from 'react';
import {
    getTopFarmersByCredits
} from '../services/water_wallet_system';
import WaterUsageForm from './WaterUsageForm';
import Leaderboard from './Leaderboard';
import { useAuth } from '../hooks/AuthContext';
import { useWaterCredits } from '../hooks/WaterCreditContext';
import Sidebar from './Sidebar';
import Header from './Header';
import { Coins, Droplets, Info, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const WaterDashboard = () => {
    // State
    const { user } = useAuth();
    const { wallet, recordUsage, loading } = useWaterCredits();
    const [leaderboard, setLeaderboard] = useState([]);
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    // Initialize leaderboard on Mount
    useEffect(() => {
        const topFarmers = getTopFarmersByCredits();
        setLeaderboard(topFarmers);
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)' }}>
                <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%' }}></div>
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

                <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
                    <header style={{ marginBottom: '40px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                background: 'var(--primary)',
                                borderRadius: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                boxShadow: '0 4px 12px rgba(24, 78, 108, 0.2)'
                            }}>
                                <Coins size={24} />
                            </div>
                            <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--primary)' }}>
                                Water Credit Dashboard
                            </h1>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: '500' }}>
                            Monitor your water savings, earn credits, and compete with other farmers.
                        </p>
                    </header>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', marginBottom: '32px' }}>
                        {/* Water Wallet Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card"
                            style={{ padding: '32px' }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {/* 1. Weekly Budget */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.2)', border: '1px solid var(--glass-border)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <TrendingUp size={20} color="var(--primary)" />
                                        <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>Weekly Budget</span>
                                    </div>
                                    <span style={{ fontWeight: '800', color: 'var(--primary)' }}>{(wallet.weeklyBudget || 4000).toLocaleString()} L</span>
                                </div>

                                {/* 2. Water Consumed */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.2)', border: '1px solid var(--glass-border)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <Droplets size={20} color="var(--primary)" />
                                        <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>Water Consumed</span>
                                    </div>
                                    <span style={{ fontWeight: '800', color: 'var(--primary)' }}>{(wallet.water_used_litres || 0).toLocaleString()} L</span>
                                </div>

                                {/* 3. Smart Credits */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '16px', background: 'rgba(251, 191, 36, 0.15)', border: '1px solid #fbbf2440' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <Coins size={20} color="#fbbf24" />
                                        <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>Smart Credits</span>
                                    </div>
                                    <span style={{ fontWeight: '900', color: '#fbbf24', fontSize: '1.2rem' }}>
                                        {Math.round(wallet.credits_balance || 0)}
                                    </span>
                                </div>

                                {/* 4. Remaining Balance */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <TrendingUp size={20} color="var(--primary)" />
                                        <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>Remaining Balance</span>
                                    </div>
                                    <span style={{ fontWeight: '800', color: 'var(--primary)' }}>
                                        {Math.round(wallet.remainingWater || 0).toLocaleString()} L
                                    </span>
                                </div>
                            </div>

                        </motion.div>

                        {/* Usage Form Card */}
                        <div style={{ height: '100%' }}>
                            <WaterUsageForm />
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};



export default WaterDashboard;
