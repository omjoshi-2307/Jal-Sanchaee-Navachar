/**
 * Water Wallet System - Phase 2
 * 
 * Manages farmer water budgets, usage tracking, and credit accumulation.
 * Currently uses an in-memory mock store.
 */

import { calculateWeeklyWaterBudget, WATER_CREDIT_UNIT } from './water_credit_system.js';

// --- In-Memory Store ---
const wallets = {};

/**
 * Wallet Structure:
 * {
 *   farmer_id: string,
 *   week_start_date: Date,
 *   weekly_budget_litres: number,
 *   weekly_budget_credits: number,
 *   water_used_litres: number,
 *   credits_earned_this_week: number,
 *   total_credit_balance: number
 * }
 */

// --- Core Functions ---

/**
 * Initializes or updates a farmer's water wallet for the week.
 * Preserves total_credit_balance if wallet already exists.
 * 
 * @param {object} farmer - Farmer object containing id, plotArea, cropType, season.
 * @returns {object} The initialized wallet object.
 */
export function initializeWaterWallet(farmer) {
    if (!farmer || !farmer.id) {
        throw new Error("Invalid farmer data: 'id' is required.");
    }

    const budget = calculateWeeklyWaterBudget(farmer.plotArea, farmer.cropType, farmer.season);

    // Check if wallet exists to preserve balance
    let existingBalance = 0;
    if (wallets[farmer.id]) {
        existingBalance = wallets[farmer.id].total_credit_balance;
    }

    const wallet = {
        farmer_id: farmer.id,
        week_start_date: new Date(),
        weekly_budget_litres: budget.budget_litres,
        weekly_budget_credits: budget.budget_credits,
        water_used_litres: 0,
        credits_earned_this_week: 0,
        total_credit_balance: existingBalance
    };

    wallets[farmer.id] = wallet;
    return wallet;
}

/**
 * Records water usage for a farmer.
 * Updates the wallet's water_used_litres.
 * 
 * @param {string} farmerId - The ID of the farmer.
 * @param {number} litresUsed - Amount of water used in litres.
 * @returns {object} The updated wallet object.
 * @throws {Error} If wallet not found or invalid input.
 */
export function recordWaterUsage(farmerId, litresUsed) {
    if (!wallets[farmerId]) {
        throw new Error(`Wallet not found for farmer ID: ${farmerId}`);
    }

    if (typeof litresUsed !== 'number' || litresUsed < 0) {
        throw new Error("Invalid litresUsed: Must be a non-negative number.");
    }

    const wallet = wallets[farmerId];
    wallet.water_used_litres += litresUsed;

    // Recalculate credits for the week based on new usage
    // We update this dynamically or wait for end of week. 
    // Requirement 4 implies a specific calculation step, usually at end of period.
    // However, keeping 'credits_earned_this_week' updated might be useful for display.
    // implementation of calculateWeeklyCredits will handle the finalization.

    return wallet;
}

/**
 * Calculates and finalizes weekly credits based on usage vs budget.
 * Adds earned credits to total_credit_balance.
 * 
 * @param {string} farmerId - The ID of the farmer.
 * @returns {object} The updated wallet object with new totals.
 */
export function calculateWeeklyCredits(farmerId) {
    if (!wallets[farmerId]) {
        throw new Error(`Wallet not found for farmer ID: ${farmerId}`);
    }

    const wallet = wallets[farmerId];
    let earnedCredits = 0;

    if (wallet.water_used_litres < wallet.weekly_budget_litres) {
        const savedLitres = wallet.weekly_budget_litres - wallet.water_used_litres;
        earnedCredits = savedLitres / WATER_CREDIT_UNIT;
    }

    // Update wallet
    wallet.credits_earned_this_week = earnedCredits;
    wallet.total_credit_balance += earnedCredits;

    return wallet;
}

/**
 * Returns the top 3 farmers based on total credit balance.
 * 
 * @returns {Array} Array of wallet objects sorted by credit balance descending.
 */
export function getTopFarmersByCredits() {
    const sortedWallets = Object.values(wallets).sort((a, b) => {
        return b.total_credit_balance - a.total_credit_balance;
    });

    return sortedWallets.slice(0, 3);
}

/**
 * Helper to get a wallet by ID.
 */
export function getWallet(farmerId) {
    return wallets[farmerId];
}

// --- Mock Data Initialization ---

export const mockFarmers = [
    { id: 'farmer_001', name: 'Ramesh', plotArea: 1000, cropType: 'Wheat', season: 'Winter' },
    { id: 'farmer_002', name: 'Suresh', plotArea: 1500, cropType: 'Rice', season: 'Summer' },
    { id: 'farmer_003', name: 'Mahesh', plotArea: 800, cropType: 'Cotton', season: 'Monsoon' }
];

// Note: To test, import initializeWaterWallet and mockFarmers in your React component.

