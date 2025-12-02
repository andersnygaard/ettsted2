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
  calculateLoan
} from '../services/calculatorService';
import { logger } from '../utils/logger';

/**
 * POST /api/v1/calculators/monte-carlo
 * Run Monte Carlo retirement simulation
 *
 * @param req - Express request with validated body
 * @param res - Express response
 * @returns 200 with simulation results
 */
export async function monteCarloSimulation(req: Request, res: Response): Promise<void> {
  try {
    const {
      portfolioValue,
      annualWithdrawal,
      years,
      expectedReturn = 7,
      volatility = 15,
      simulations = 1000
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
      simulations: cappedSimulations
    });

    logger.info('Monte Carlo simulation completed', {
      portfolioValue,
      annualWithdrawal,
      years,
      simulations: cappedSimulations,
      successRate: result.successRate
    });

    res.status(200).json({
      data: result,
      success: true
    });

  } catch (error) {
    logger.error('Monte Carlo simulation failed', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    res.status(500).json({
      error: {
        message: 'Monte Carlo simulation failed',
        code: 'MONTE_CARLO_FAILED'
      },
      success: false
    });
  }
}

/**
 * POST /api/v1/calculators/compound
 * Calculate compound interest with optional monthly contributions
 *
 * @param req - Express request with validated body
 * @param res - Express response
 * @returns 200 with compound interest results
 */
export async function compoundCalculation(req: Request, res: Response): Promise<void> {
  try {
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

    res.status(200).json({
      data: result,
      success: true
    });

  } catch (error) {
    logger.error('Compound interest calculation failed', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    res.status(500).json({
      error: {
        message: 'Compound interest calculation failed',
        code: 'COMPOUND_CALCULATION_FAILED'
      },
      success: false
    });
  }
}

/**
 * POST /api/v1/calculators/fire
 * Calculate F.I.R.E. metrics and projection
 *
 * @param req - Express request with validated body
 * @param res - Express response
 * @returns 200 with F.I.R.E. calculation results
 */
export async function fireCalculation(req: Request, res: Response): Promise<void> {
  try {
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

    res.status(200).json({
      data: result,
      success: true
    });

  } catch (error) {
    logger.error('F.I.R.E. calculation failed', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    res.status(500).json({
      error: {
        message: 'F.I.R.E. calculation failed',
        code: 'FIRE_CALCULATION_FAILED'
      },
      success: false
    });
  }
}

/**
 * POST /api/v1/calculators/loan
 * Calculate loan amortization schedule
 *
 * @param req - Express request with validated body
 * @param res - Express response
 * @returns 200 with loan calculation results
 */
export async function loanCalculation(req: Request, res: Response): Promise<void> {
  try {
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

    res.status(200).json({
      data: result,
      success: true
    });

  } catch (error) {
    logger.error('Loan calculation failed', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    res.status(500).json({
      error: {
        message: 'Loan calculation failed',
        code: 'LOAN_CALCULATION_FAILED'
      },
      success: false
    });
  }
}
