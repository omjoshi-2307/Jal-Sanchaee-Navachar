import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { subscribeToUserCredits, saveWaterUsage, updateUserCredits } from '../services/firestoreService';
import { calculateSmartCredits } from '../services/creditService';
import { toast } from 'react-hot-toast';

const WaterCreditContext = createContext();

export function WaterCreditProvider({ children }) {
    const { user } = useAuth();
    const [wallet, setWallet] = useState(() => {
        // Initialize from localStorage if available
        const saved = localStorage.getItem('jal_sanchaee_wallet');
        if (saved) {
            const parsed = JSON.parse(saved);
            // Ensure any legacy fields or name changes are handled
            return {
                credits_balance: parsed.credits_balance ?? 100,
                weeklyBudget: parsed.weeklyBudget ?? 4000,
                remainingWater: parsed.remainingWater ?? (parsed.weeklyBudget || 4000),
                water_used_litres: 0,
                lastUpdated: parsed.lastUpdated || null
            };
        }
        return {
            credits_balance: 100,
            weeklyBudget: 4000,
            remainingWater: 4000,
            water_used_litres: 0,
            lastUpdated: null
        };
    });
    const [loading, setLoading] = useState(true);

    // Sync state with localStorage
    useEffect(() => {
        localStorage.setItem('jal_sanchaee_wallet', JSON.stringify(wallet));
    }, [wallet]);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const unsubscribe = subscribeToUserCredits(user.uid, (data) => {
            if (data) {
                setWallet(prev => ({ ...prev, ...data }));
            }
            setLoading(false);
        });

        const timeout = setTimeout(() => setLoading(false), 2000);
        return () => {
            unsubscribe && unsubscribe();
            clearTimeout(timeout);
        };
    }, [user]);

    const recordUsage = async (litres) => {
        if (!user) return;
        const value = Number(litres);
        if (!value || value <= 0) return;

        const currentRemaining = wallet.remainingWater !== undefined ? wallet.remainingWater : (wallet.weeklyBudget || 4000);

        // 1. Validate: usage must not exceed remaining balance
        if (value > currentRemaining) {
            toast.error(`Exceeds remaining balance (${currentRemaining}L)!`);
            return;
        }

        const newRemaining = currentRemaining - value;

        // 2. Calculate Efficiency and Credits
        const { earnedCredits } = calculateSmartCredits(newRemaining, wallet.weeklyBudget || 4000);

        try {
            const farmerId = user.uid;

            // Step 1: Update UI instantly (Show usage value briefly)
            setWallet(prev => ({
                ...prev,
                water_used_litres: value,
                remainingWater: newRemaining,
                credits_balance: earnedCredits,
                lastUpdated: new Date().toISOString()
            }));

            // Step 2: Sync with Firestore/Backend
            await saveWaterUsage({
                farmerId,
                waterUsed: value,
                date: new Date()
            });
            await updateUserCredits(farmerId, earnedCredits);

            // Step 3: Reset display to zero after 2 seconds (User requirement)
            // This satisfies "Water Consumed" 0 L display while keeping the total hidden
            setTimeout(() => {
                setWallet(prev => ({
                    ...prev,
                    water_used_litres: 0
                }));
            }, 2000);

            toast.success(`Usage recorded. Smart Credits: ${earnedCredits}`);

        } catch (error) {
            console.error("Error recording usage:", error);
            toast.error("Failed to record usage.");
        }
    };

    const value = {
        wallet,
        loading,
        recordUsage
    };

    return (
        <WaterCreditContext.Provider value={value}>
            {children}
        </WaterCreditContext.Provider>
    );
}

export function useWaterCredits() {
    const context = useContext(WaterCreditContext);
    if (!context) {
        throw new Error('useWaterCredits must be used within a WaterCreditProvider');
    }
    return context;
}
