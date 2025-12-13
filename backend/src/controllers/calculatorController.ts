/**
 * Calculator Controller
 *
 * Handles financial calculator endpoints:
 * - POST /api/v1/calculators/monte-carlo - Run Monte Carlo simulation
 */

import { Request, Response } from 'express';
import {
  runMonteCarloSimulation,
  calculateCompoundInterest,
  calculateFire,
  calculateLoan,
  calculateFlexiLoan
} from '../services/calculatorService';
import { asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

/**
 * POST /api/v1/calculators/monte-carlo
 * Run Monte Carlo retirement simulation
 *
 * @param req - Express request with validated body
 * @param res - Express response
 * @returns 200 with simulation results
 */
export const monteCarloSimulation = asyncHandler(async (req: Request, res: Response) => {
  const {
    portfolioValue,
    annualWithdrawal,
    years,
    expectedReturn = 7,
    volatility = 15,
    simulations = 1000,
    inflation = 2,
    showRealValues = false
  } = req.body;

  // Cap simulations at 10,000
  const cappedSimulations = Math.min(simulations, 10000);

  // Convert percentages to decimals
  const result = runMonteCarloSimulation({
    portfolioValue,
    annualWithdrawal,
    years,
    expectedReturn: expectedReturn / 100,
    volatility: volatility / 100,
    simulations: cappedSimulations,
    inflation: inflation / 100,
    showRealValues
  });

  logger.info('Monte Carlo simulation completed', {
    portfolioValue,
    annualWithdrawal,
    years,
    simulations: cappedSimulations,
    inflation,
    showRealValues,
    successRate: result.successRate
  });

  res.json({
    data: result,
    success: true
  });
});

/**
 * POST /api/v1/calculators/compound
 * Calculate compound interest with optional monthly contributions
 *
 * @param req - Express request with validated body
 * @param res - Express response
 * @returns 200 with compound interest results
 */
export const compoundCalculation = asyncHandler(async (req: Request, res: Response) => {
  const {
    principal,
    annualRate,
    years,
    compoundingFrequency = 12,
    monthlyContribution = 0
  } = req.body;

  const result = calculateCompoundInterest({
    principal,
    annualRate: annualRate / 100, // Convert percentage to decimal
    years,
    compoundingFrequency,
    monthlyContribution
  });

  logger.info('Compound interest calculation completed', {
    principal,
    annualRate,
    years,
    finalValue: result.finalValue
  });

  res.json({
    data: result,
    success: true
  });
});

/**
 * POST /api/v1/calculators/fire
 * Calculate F.I.R.E. metrics and projection
 *
 * @param req - Express request with validated body
 * @param res - Express response
 * @returns 200 with F.I.R.E. calculation results
 */
export const fireCalculation = asyncHandler(async (req: Request, res: Response) => {
  const {
    currentSavings,
    annualExpenses,
    annualIncome = 0,
    annualSavings,
    expectedReturn = 7,
    customFireNumber
  } = req.body;

  // Calculate annualSavings from income - expenses if not provided
  const calculatedAnnualSavings = annualSavings ?? (annualIncome - annualExpenses);

  const result = calculateFire({
    currentSavings,
    annualExpenses,
    annualSavings: calculatedAnnualSavings,
    expectedReturn: expectedReturn / 100, // Convert percentage to decimal
    customFireNumber
  });

  logger.info('F.I.R.E. calculation completed', {
    currentSavings,
    annualExpenses,
    fireNumber: result.fireNumber,
    yearsToFire: result.yearsToFire
  });

  res.json({
    data: result,
    success: true
  });
});

/**
 * POST /api/v1/calculators/loan
 * Calculate loan amortization schedule
 *
 * @param req - Express request with validated body
 * @param res - Express response
 * @returns 200 with loan calculation results
 */
export const loanCalculation = asyncHandler(async (req: Request, res: Response) => {
  const {
    principal,
    annualRate,
    years,
    extraPayment = 0
  } = req.body;

  const result = calculateLoan({
    principal,
    annualRate: annualRate / 100, // Convert percentage to decimal
    years,
    extraPayment
  });

  logger.info('Loan calculation completed', {
    principal,
    annualRate,
    years,
    monthlyPayment: result.monthlyPayment,
    effectiveYears: result.effectiveYears
  });

  res.json({
    data: result,
    success: true
  });
});

/**
 * POST /api/v1/calculators/flexi-loan
 * Calculate flexible loan payoff schedule
 *
 * @param req - Express request with validated body
 * @param res - Express response
 * @returns 200 with flexible loan calculation results
 */
export const flexiLoanCalculation = asyncHandler(async (req: Request, res: Response) => {
  const {
    outstandingBalance,
    annualRate,
    monthlyPayment,
    creditLimit
  } = req.body;

  const result = calculateFlexiLoan({
    outstandingBalance,
    annualRate: annualRate / 100, // Convert percentage to decimal
    monthlyPayment,
    creditLimit
  });

  logger.info('Flexible loan calculation completed', {
    outstandingBalance,
    annualRate,
    monthlyPayment,
    monthsToPayoff: result.monthsToPayoff
  });

  res.json({
    data: result,
    success: true
  });
});
