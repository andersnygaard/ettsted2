/**
 * Calculator Service
 *
 * Implements financial calculation logic:
 * - Monte Carlo retirement simulations
 * - Compound interest calculations
 * - F.I.R.E. (Financial Independence, Retire Early) calculations
 * - Loan amortization calculations
 */

/**
 * Parameters for Monte Carlo simulation
 */
export interface MonteCarloParams {
  portfolioValue: number;      // Starting portfolio value in NOK
  annualWithdrawal: number;    // Annual withdrawal amount in NOK
  years: number;               // Simulation period in years
  expectedReturn: number;      // Expected annual return (decimal, e.g., 0.07 for 7%)
  volatility: number;          // Return volatility (decimal, e.g., 0.15 for 15%)
  simulations: number;         // Number of simulations to run
}

/**
 * Result of Monte Carlo simulation
 */
export interface MonteCarloResult {
  successRate: number;         // Percentage of simulations that didn't run out of money
  percentile10: number;        // Final balance at 10th percentile
  percentile25: number;        // Final balance at 25th percentile
  percentile50: number;        // Final balance at 50th percentile (median)
  percentile75: number;        // Final balance at 75th percentile
  percentile90: number;        // Final balance at 90th percentile
  scenarios: number[][];       // Array of sample scenario paths (up to 100 scenarios)
  simulationsRun: number;      // Number of simulations actually run
}

/**
 * Generate a random number from normal distribution using Box-Muller transform
 * @param mean - Mean of the distribution
 * @param stdDev - Standard deviation of the distribution
 * @returns Random number from normal distribution
 */
function randomNormal(mean: number, stdDev: number): number {
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + z * stdDev;
}

/**
 * Run Monte Carlo retirement simulation
 *
 * Simulates portfolio growth/depletion over time with random returns.
 * Each simulation assumes:
 * - Annual returns follow a normal distribution
 * - Fixed annual withdrawal amount
 * - Portfolio stops growing once depleted
 *
 * @param params - Simulation parameters
 * @returns Simulation results with success rate and percentile bands
 */
export function runMonteCarloSimulation(params: MonteCarloParams): MonteCarloResult {
  const { portfolioValue, annualWithdrawal, years, expectedReturn, volatility, simulations } = params;

  const results: number[] = [];
  const scenarios: number[][] = [];

  // Run each simulation
  for (let sim = 0; sim < simulations; sim++) {
    let balance = portfolioValue;
    const yearlyBalances: number[] = [balance];

    // Simulate each year
    for (let year = 0; year < years; year++) {
      // Generate random return based on normal distribution
      const annualReturn = randomNormal(expectedReturn, volatility);

      // Apply return to balance
      balance = balance * (1 + annualReturn);

      // Apply withdrawal (only if balance is positive)
      if (balance > 0) {
        balance -= annualWithdrawal;
      }

      // Don't allow balance to go below zero
      balance = Math.max(0, balance);

      yearlyBalances.push(balance);

      // Stop simulation if balance depleted
      if (balance <= 0) {
        break;
      }
    }

    // Record final balance
    results.push(yearlyBalances[yearlyBalances.length - 1]);

    // Keep sample of scenarios (first 100) for frontend visualization
    if (sim < 100) {
      scenarios.push(yearlyBalances);
    }
  }

  // Calculate success rate (% of simulations that maintained positive balance)
  const successfulSimulations = results.filter(balance => balance > 0).length;
  const successRate = simulations > 0 ? (successfulSimulations / simulations) * 100 : 0;

  // Sort results for percentile calculation
  const sorted = [...results].sort((a, b) => a - b);

  // Calculate percentiles
  const percentile10 = sorted[Math.floor(simulations * 0.1)] || 0;
  const percentile25 = sorted[Math.floor(simulations * 0.25)] || 0;
  const percentile50 = sorted[Math.floor(simulations * 0.5)] || 0;
  const percentile75 = sorted[Math.floor(simulations * 0.75)] || 0;
  const percentile90 = sorted[Math.floor(simulations * 0.9)] || 0;

  return {
    successRate: Math.round(successRate * 100) / 100, // Round to 2 decimal places
    percentile10,
    percentile25,
    percentile50,
    percentile75,
    percentile90,
    scenarios,
    simulationsRun: simulations
  };
}

// ============================================================================
// COMPOUND INTEREST CALCULATOR
// ============================================================================

/**
 * Parameters for compound interest calculation
 */
export interface CompoundParams {
  principal: number;           // Initial investment in NOK
  annualRate: number;          // Annual interest rate (decimal, e.g., 0.07 for 7%)
  years: number;               // Investment period in years
  compoundingFrequency: number; // Times per year interest is compounded
  monthlyContribution: number; // Monthly contribution in NOK
}

/**
 * Result of compound interest calculation
 */
export interface CompoundResult {
  finalValue: number;          // Final portfolio value
  totalContributions: number;  // Total amount contributed (principal + monthly)
  totalInterest: number;       // Total interest earned
  yearlyBreakdown: {           // Year-by-year breakdown
    year: number;
    balance: number;
    contributions: number;
    interest: number;
  }[];
}

/**
 * Calculate compound interest with optional monthly contributions
 * Formula: A = P(1 + r/n)^(nt) + PMT * (((1 + r/n)^(nt) - 1) / (r/n))
 */
export function calculateCompoundInterest(params: CompoundParams): CompoundResult {
  const { principal, annualRate, years, compoundingFrequency, monthlyContribution } = params;

  const yearlyBreakdown: CompoundResult['yearlyBreakdown'] = [];
  let balance = principal;
  let totalContributions = principal;
  let totalInterest = 0;

  const periodicRate = compoundingFrequency > 0 ? annualRate / compoundingFrequency : 0;
  const contributionPerPeriod = compoundingFrequency > 0 ? monthlyContribution * (12 / compoundingFrequency) : 0;

  for (let year = 1; year <= years; year++) {
    const startBalance = balance;
    const yearlyContribution = monthlyContribution * 12;

    // Calculate compound growth for each period in the year
    for (let period = 0; period < compoundingFrequency; period++) {
      const interestEarned = balance * periodicRate;
      balance += interestEarned;
      balance += contributionPerPeriod;
    }

    totalContributions += yearlyContribution;
    const yearlyInterest = balance - startBalance - yearlyContribution;
    totalInterest += yearlyInterest;

    yearlyBreakdown.push({
      year,
      balance: Math.round(balance * 100) / 100,
      contributions: Math.round(totalContributions * 100) / 100,
      interest: Math.round(totalInterest * 100) / 100
    });
  }

  return {
    finalValue: Math.round(balance * 100) / 100,
    totalContributions: Math.round(totalContributions * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    yearlyBreakdown
  };
}

// ============================================================================
// F.I.R.E. CALCULATOR
// ============================================================================

/**
 * Parameters for F.I.R.E. calculation
 */
export interface FireParams {
  currentSavings: number;      // Current savings in NOK
  annualExpenses: number;      // Annual expenses in NOK
  annualSavings: number;       // Annual savings in NOK
  expectedReturn: number;      // Expected annual return (decimal, e.g., 0.07)
  customFireNumber?: number;   // Override default 25x calculation
}

/**
 * Result of F.I.R.E. calculation
 */
export interface FireResult {
  fireNumber: number;          // Target wealth for FI (25x expenses or custom)
  currentProgress: number;     // Current progress percentage (0-100+)
  yearsToFire: number;         // Years until reaching FIRE number
  savingsRate: number;         // Savings rate percentage
  annualWithdrawal: number;    // Safe annual withdrawal at 4% rule
  monthsFree: number;          // Months of expenses covered by current savings
  yearlyProjection: {          // Year-by-year projection
    year: number;
    balance: number;
    progress: number;
  }[];
}

/**
 * Calculate F.I.R.E. metrics and projection
 * Uses 4% rule (25x annual expenses) by default
 */
export function calculateFire(params: FireParams): FireResult {
  const { currentSavings, annualExpenses, annualSavings, expectedReturn, customFireNumber } = params;

  // Calculate FIRE number (25x expenses or custom)
  const fireNumber = customFireNumber || annualExpenses * 25;

  // Current progress
  const currentProgress = fireNumber > 0 ? (currentSavings / fireNumber) * 100 : 0;

  // Savings rate (annual savings / annual income, approximated as expenses + savings)
  const annualIncome = annualExpenses + annualSavings;
  const savingsRate = annualIncome > 0 ? (annualSavings / annualIncome) * 100 : 0;

  // Annual withdrawal at 4% rule
  const annualWithdrawal = currentSavings * 0.04;

  // Months of freedom
  const monthlyExpenses = annualExpenses / 12;
  const monthsFree = monthlyExpenses > 0 ? Math.floor(currentSavings / monthlyExpenses) : 0;

  // Calculate years to FIRE
  const yearlyProjection: FireResult['yearlyProjection'] = [];
  let balance = currentSavings;
  let yearsToFire = 0;
  const maxYears = 100;

  for (let year = 0; year <= maxYears; year++) {
    const progress = fireNumber > 0 ? (balance / fireNumber) * 100 : 0;

    yearlyProjection.push({
      year,
      balance: Math.round(balance * 100) / 100,
      progress: Math.round(progress * 100) / 100
    });

    if (balance >= fireNumber && yearsToFire === 0) {
      yearsToFire = year;
    }

    // Project next year: growth + contributions
    balance = balance * (1 + expectedReturn) + annualSavings;

    // Stop after reaching FIRE + 10 years or maxYears
    if (yearsToFire > 0 && year >= yearsToFire + 10) {
      break;
    }
  }

  // If never reached, set to max
  if (yearsToFire === 0 && balance < fireNumber) {
    yearsToFire = maxYears;
  }

  return {
    fireNumber: Math.round(fireNumber * 100) / 100,
    currentProgress: Math.round(currentProgress * 100) / 100,
    yearsToFire,
    savingsRate: Math.round(savingsRate * 100) / 100,
    annualWithdrawal: Math.round(annualWithdrawal * 100) / 100,
    monthsFree,
    yearlyProjection
  };
}

// ============================================================================
// LOAN CALCULATOR
// ============================================================================

/**
 * Parameters for loan calculation
 */
export interface LoanParams {
  principal: number;           // Loan amount in NOK
  annualRate: number;          // Annual interest rate (decimal, e.g., 0.05)
  years: number;               // Loan term in years
  extraPayment: number;        // Additional monthly payment towards principal
}

/**
 * Result of loan calculation
 */
export interface LoanResult {
  monthlyPayment: number;      // Standard monthly payment
  totalPayment: number;        // Total amount paid over loan term
  totalInterest: number;       // Total interest paid
  effectiveYears: number;      // Actual years to pay off (with extra payments)
  amortizationSchedule: {      // Monthly breakdown (first 12 + yearly summaries)
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
  }[];
  yearlySummary: {             // Yearly summary
    year: number;
    principalPaid: number;
    interestPaid: number;
    endingBalance: number;
  }[];
}

/**
 * Calculate loan amortization
 * Standard formula: M = P * (r(1+r)^n) / ((1+r)^n - 1)
 */
export function calculateLoan(params: LoanParams): LoanResult {
  const { principal, annualRate, years, extraPayment } = params;

  const monthlyRate = annualRate / 12;
  const totalMonths = years * 12;

  // Calculate standard monthly payment
  let monthlyPayment: number;
  if (monthlyRate === 0 || totalMonths === 0) {
    monthlyPayment = totalMonths > 0 ? principal / totalMonths : 0;
  } else {
    const factor = Math.pow(1 + monthlyRate, totalMonths);
    monthlyPayment = (factor - 1) !== 0
      ? (principal * monthlyRate * factor) / (factor - 1)
      : 0;
  }

  // Round to 2 decimal places
  monthlyPayment = Math.round(monthlyPayment * 100) / 100;

  const amortizationSchedule: LoanResult['amortizationSchedule'] = [];
  const yearlySummary: LoanResult['yearlySummary'] = [];

  let balance = principal;
  let totalInterest = 0;
  let totalPayment = 0;
  let month = 0;
  let yearlyPrincipal = 0;
  let yearlyInterest = 0;

  // Calculate amortization until balance is paid off
  while (balance > 0.01 && month < totalMonths * 2) { // Safety limit
    month++;

    const interestPayment = balance * monthlyRate;
    const totalMonthlyPayment = Math.min(balance + interestPayment, monthlyPayment + extraPayment);
    const principalPayment = totalMonthlyPayment - interestPayment;

    balance -= principalPayment;
    if (balance < 0) balance = 0;

    totalInterest += interestPayment;
    totalPayment += totalMonthlyPayment;
    yearlyPrincipal += principalPayment;
    yearlyInterest += interestPayment;

    // Store first 12 months + every 12th month
    if (month <= 12 || month % 12 === 0 || balance <= 0.01) {
      amortizationSchedule.push({
        month,
        payment: Math.round(totalMonthlyPayment * 100) / 100,
        principal: Math.round(principalPayment * 100) / 100,
        interest: Math.round(interestPayment * 100) / 100,
        balance: Math.round(balance * 100) / 100
      });
    }

    // Yearly summary
    if (month % 12 === 0 || balance <= 0.01) {
      yearlySummary.push({
        year: Math.ceil(month / 12),
        principalPaid: Math.round(yearlyPrincipal * 100) / 100,
        interestPaid: Math.round(yearlyInterest * 100) / 100,
        endingBalance: Math.round(balance * 100) / 100
      });
      yearlyPrincipal = 0;
      yearlyInterest = 0;
    }
  }

  const effectiveYears = Math.round((month / 12) * 100) / 100;

  return {
    monthlyPayment,
    totalPayment: Math.round(totalPayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    effectiveYears,
    amortizationSchedule,
    yearlySummary
  };
}
