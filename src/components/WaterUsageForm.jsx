import React, { useState } from 'react';
import { useWaterCredits } from '../hooks/WaterCreditContext';
import { Droplets, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const WaterUsageForm = () => {
    const [litres, setLitres] = useState('');
    const { recordUsage, wallet } = useWaterCredits();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const usageNum = Number(litres);

        if (!litres || usageNum <= 0) {
            toast.error("Please enter a valid amount.");
            return;
        }


        await recordUsage(usageNum);
        setLitres('');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card"
            style={{ padding: '32px', height: '100%' }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ padding: '10px', background: 'rgba(0, 119, 182, 0.1)', borderRadius: '12px', color: 'var(--primary)' }}>
                    <Droplets size={24} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>Record Water Usage</h3>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-muted)' }}>Usage in Litres</label>
                    <input
                        type="number"
                        placeholder="e.g. 500"
                        value={litres}
                        onChange={(e) => setLitres(e.target.value)}
                        className="glass-input"
                        style={{
                            padding: '12px 16px',
                            borderRadius: '12px',
                            fontSize: '1rem',
                            width: '100%',
                            outline: 'none'
                        }}
                        min="1"
                        required
                    />
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    style={{
                        padding: '14px',
                        background: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontWeight: '700',
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 12px rgba(24, 78, 108, 0.2)',
                        cursor: 'pointer'
                    }}
                >
                    <Send size={18} /> Record Usage
                </motion.button>
            </form>
        </motion.div>
    );
};



export default WaterUsageForm;
