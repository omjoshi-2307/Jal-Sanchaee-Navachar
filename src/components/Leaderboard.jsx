import React from 'react';
import { Trophy, Medal, User } from 'lucide-react';
import { motion } from 'framer-motion';

const Leaderboard = ({ farmers }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card"
            style={{ padding: '32px', width: '100%' }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ padding: '10px', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '12px', color: '#fbbf24' }}>
                    <Trophy size={24} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>Water Savers Leaderboard</h3>
            </div>

            {farmers.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No leaderboard data available yet.
                </div>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'left', padding: '12px 16px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Rank</th>
                                <th style={{ textAlign: 'left', padding: '12px 16px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Farmer</th>
                                <th style={{ textAlign: 'right', padding: '12px 16px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Credits Earned</th>
                            </tr>
                        </thead>
                        <tbody>
                            {farmers.map((farmer, index) => (
                                <motion.tr
                                    key={farmer.farmer_id}
                                    whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.1)' }}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        borderRadius: '12px',
                                        transition: 'var(--transition)'
                                    }}
                                >
                                    <td style={{ padding: '16px', borderRadius: '12px 0 0 12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', background: index < 3 ? 'rgba(251, 191, 36, 0.2)' : 'rgba(0,0,0,0.05)', color: index < 3 ? '#fbbf24' : 'var(--text-muted)', fontWeight: '800' }}>
                                            {index + 1}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--accent)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>
                                                {index === 0 ? <Medal size={18} /> : <User size={18} />}
                                            </div>
                                            <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{farmer.farmer_id}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'right', color: 'var(--primary)', fontWeight: '800', fontSize: '1.1rem', borderRadius: '0 12px 12px 0' }}>
                                        {farmer.total_credit_balance.toFixed(0)} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>CR</span>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </motion.div>
    );
};



export default Leaderboard;
