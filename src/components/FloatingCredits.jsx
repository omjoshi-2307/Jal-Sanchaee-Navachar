import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, ArrowRight } from 'lucide-react';
import { useWaterCredits } from '../hooks/WaterCreditContext';
import { useNavigate } from 'react-router-dom';

const FloatingCredits = () => {
    const [isHovered, setIsHovered] = useState(false);
    const { wallet, loading } = useWaterCredits();
    const navigate = useNavigate();

    return (
        <div
            style={{
                position: 'fixed',
                bottom: '100px',
                right: '30px',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '12px'
            }}
        >
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, x: 20, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.9 }}
                        style={{
                            padding: '12px 20px',
                            background: 'rgba(255, 255, 255, 0.4)',
                            backdropFilter: 'blur(16px)',
                            WebkitBackdropFilter: 'blur(16px)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '16px',
                            boxShadow: 'var(--shadow-xl)',
                            color: 'var(--text-main)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            minWidth: '180px'
                        }}
                    >
                        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            My Credits
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                            <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>
                                {loading ? '...' : (wallet?.credits_balance || 0).toFixed(0)}
                            </span>
                            <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-muted)' }}>CR</span>
                        </div>
                        <button
                            onClick={() => navigate('/credits')}
                            style={{
                                marginTop: '4px',
                                background: 'none',
                                border: 'none',
                                color: 'var(--primary)',
                                fontSize: '0.85rem',
                                fontWeight: '700',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                cursor: 'pointer',
                                padding: 0
                            }}
                        >
                            Open Details <ArrowRight size={14} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => navigate('/credits')}
                style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '30px',
                    background: '#fbbf24',
                    color: 'white',
                    border: 'none',
                    boxShadow: '0 8px 24px rgba(251, 191, 36, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                }}
            >
                <Coins size={28} />
            </motion.button>
        </div>
    );
};

export default FloatingCredits;
