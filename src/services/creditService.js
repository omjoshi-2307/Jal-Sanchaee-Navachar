/**
 * Calculates smart credits based on the advanced efficiency formula:
 * Efficiency (%) = (Remaining Water / Weekly Budget) × 100
 * Base Credits = Remaining Water / 50
 * Efficiency Bonus = Efficiency / 10
 * Smart Credits = Base Credits + Efficiency Bonus
 * 
 * @param {number} remainingWater - The current remaining water in litres.
 * @param {number} weeklyBudget - The total weekly budget in litres.
 * @returns {{efficiency: number, earnedCredits: number}}
 */
export function calculateSmartCredits(remainingWater, weeklyBudget) {
    const efficiency = (remainingWater / weeklyBudget) * 100;

    const baseCredits = remainingWater / 50;
    const efficiencyBonus = efficiency / 10;

    const totalCredits = Math.round(baseCredits + efficiencyBonus);

    return {
        efficiency: Math.round(efficiency),
        earnedCredits: Math.max(0, totalCredits)
    };
}
