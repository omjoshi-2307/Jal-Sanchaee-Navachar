/**
 * Water Credit System - Core Logic (Phase 1)
 * 
 * 1 Water Credit = 100 Litres
 * 
 * Usage:
 * import { calculateWeeklyWaterBudget, WATER_CREDIT_UNIT, CROP_WATER_FACTORS, SEASON_MULTIPLIERS } from './water_credit_system';
 */

// --- Constants ---

export const WATER_CREDIT_UNIT = 100; // Litres per credit

export const CROP_WATER_FACTORS = {
    'Wheat': 5,   // litres per sq.m per week
    'Rice': 8,    // litres per sq.m per week
    'Cotton': 6   // litres per sq.m per week
};

export const SEASON_MULTIPLIERS = {
    'Summer': 1.2,
    'Winter': 0.8,
    'Monsoon': 0.6
};

// --- Core Function ---

/**
 * Calculates the weekly water budget in litres and credits.
 * 
 * @param {number} plotArea - Area of the plot in square meters.
 * @param {string} cropType - Type of crop (Wheat, Rice, Cotton).
 * @param {string} season - Season (Summer, Winter, Monsoon).
 * @returns {object} Object containing budget_litres and budget_credits.
 * @throws {Error} If inputs are invalid.
 */
export function calculateWeeklyWaterBudget(plotArea, cropType, season) {
    // Input Validation
    if (typeof plotArea !== 'number' || plotArea < 0) {
        throw new Error("Invalid plot area: Must be a non-negative number.");
    }

    if (!CROP_WATER_FACTORS.hasOwnProperty(cropType)) {
        throw new Error(`Invalid crop type: '${cropType}'. Supported crops are: ${Object.keys(CROP_WATER_FACTORS).join(', ')}.`);
    }

    if (!SEASON_MULTIPLIERS.hasOwnProperty(season)) {
        throw new Error(`Invalid season: '${season}'. Supported seasons are: ${Object.keys(SEASON_MULTIPLIERS).join(', ')}.`);
    }

    // Calculation
    const cropFactor = CROP_WATER_FACTORS[cropType];
    const seasonMultiplier = SEASON_MULTIPLIERS[season];

    const budgetLitres = plotArea * cropFactor * seasonMultiplier;
    const budgetCredits = budgetLitres / WATER_CREDIT_UNIT;

    return {
        budget_litres: budgetLitres,
        budget_credits: budgetCredits
    };
}

// --- Example Test Logs (for development verification) ---
// These will run when the module is imported, which is useful for quick verification during dev.
// In a real production build, these might be removed or wrapped in a debug flag.

/*
try {
    console.log("--- Water Credit System Module Loaded ---");
    console.log("Test 1 (100sqm, Wheat, Winter):", calculateWeeklyWaterBudget(100, 'Wheat', 'Winter'));
    // Expect: 400 litres, 4 credits
} catch (e) {
    console.error("Water Credit System Test Failed:", e);
}
*/
