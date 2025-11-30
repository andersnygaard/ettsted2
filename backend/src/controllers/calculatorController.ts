/**
 * Calculator Controller
 *
 * Handles financial calculator endpoints:
 * - POST /api/v1/calculators/monte-carlo - Run Monte Carlo simulation
 */

import { Request, Response } from 'express';
import { runMonteCarloSimulation } from '../services/calculatorService';
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
