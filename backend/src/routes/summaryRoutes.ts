/**
 * Summary Routes - Aggregated Page Endpoints
 *
 * Provides aggregated data endpoints for dashboard and detail pages.
 * These endpoints combine data from multiple sources and apply calculations
 * to generate page-ready response objects.
 *
 * Protected routes - require authentication via validateAuth middleware.
 */

import { Router, Request, Response, NextFunction, IRouter } from 'express';
import * as portfolioService from '../services/portfolioService';
import * as userService from '../services/userService';
import * as calc from '../services/calculationService';
import { compareDatesAsc } from '../utils/dateUtils';
import { MonthlySnapshot } from '../models/Portfolio';

const router: IRouter = Router();

/**
 * Sort snapshots by date (oldest first)
 * CosmosDB string sort on "dd.MM.yyyy" is incorrect, so we sort in JS
 */
function sortSnapshotsAsc(snapshots: MonthlySnapshot[]): MonthlySnapshot[] {
  return [...snapshots].sort((a, b) => compareDatesAsc(a.date, b.date));
}

/**
 * GET /api/v1/oversikt
 *
 * Dashboard overview with aggregated metrics
 *
 * Response:
 * {
 *   data: {
 *     netWorth: number
 *     monthlyChange: number (percentage)
 *     sumSavings: number
 *     totalDebt: number
 *     totalPension: number
 *     savingsRate: number (percentage)
 *     snapshotDate: string (dd.MM.yyyy)
 *   }
 * }
 */
router.get('/oversikt', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;

    const [rawSnapshots, user] = await Promise.all([
      portfolioService.getSnapshotsByUserId(userId),
      userService.getUserById(userId),
    ]);

    if (rawSnapshots.length === 0) {
      return res.json({
        data: {
          netWorth: 0,
          monthlyChange: 0,
          sumSavings: 0,
          totalDebt: 0,
          totalPension: 0,
          savingsRate: user?.profile ? calc.calculateSavingsRate(user.profile) : 0,
        },
        success: true,
      });
    }

    // Sort by date (oldest first) then get last two
    const sorted = sortSnapshotsAsc(rawSnapshots);
    const current = sorted[sorted.length - 1];
    const previous = sorted.length > 1 ? sorted[sorted.length - 2] : null;

    const netWorth = calc.calculateNetWorth(current.accounts);
    const sumSavings = calc.calculateSumByCategory(current.accounts, 'sparing');
    const totalDebt = calc.calculateSumByCategory(current.accounts, 'gjeld');
    const totalPension = calc.calculateSumByCategory(current.accounts, 'pensjon');

    const previousNetWorth = previous ? calc.calculateNetWorth(previous.accounts) : netWorth;
    const monthlyChange = calc.calculateMonthlyChange(netWorth, previousNetWorth);

    return res.json({
      data: {
        netWorth,
        monthlyChange,
        sumSavings,
        totalDebt,
        totalPension,
        savingsRate: user?.profile ? calc.calculateSavingsRate(user.profile) : 0,
        snapshotDate: current.date,
      },
      success: true,
    });
  } catch (error) {
    return next(error);
  }
});

/**
 * GET /api/v1/sparing
 *
 * Sparing & F.I.R.E. metrics with historical data
 *
 * Response:
 * {
 *   data: {
 *     sumSavings: number
 *     savingsRate: number (percentage)
 *     monthsFree: number
 *     fireNumber: number
 *     fireProgress: number (0-100+)
 *     history: Array<{ date: string, value: number }>
 *   }
 * }
 */
router.get('/sparing', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;

    const [rawSnapshots, user] = await Promise.all([
      portfolioService.getSnapshotsByUserId(userId),
      userService.getUserById(userId),
    ]);

    if (rawSnapshots.length === 0 || !user) {
      return res.json({
        data: {
          sumSavings: 0,
          savingsRate: 0,
          monthsFree: 0,
          fireNumber: 0,
          fireProgress: 0,
          history: [],
        },
        success: true,
      });
    }

    // Sort by date (oldest first)
    const snapshots = sortSnapshotsAsc(rawSnapshots);
    const latest = snapshots[snapshots.length - 1];

    const sumSavings = calc.calculateSumByCategory(latest.accounts, 'sparing');
    const savingsRate = calc.calculateSavingsRate(user.profile);
    const fireNumber = calc.calculateFireNumber(user.profile);
    const monthsFree = calc.calculateMonthsFree(sumSavings, user.profile.annualExpenses);
    const fireProgress = fireNumber > 0 ? (sumSavings / fireNumber) * 100 : 0;

    // Build history for chart (already sorted oldest first)
    const history = snapshots.map((s) => ({
      date: s.date,
      value: calc.calculateSumByCategory(s.accounts, 'sparing'),
    }));

    return res.json({
      data: {
        sumSavings,
        savingsRate,
        monthsFree,
        fireNumber,
        fireProgress,
        history,
      },
      success: true,
    });
  } catch (error) {
    return next(error);
  }
});

/**
 * GET /api/v1/gjeld
 *
 * Debt & coverage metrics with historical data
 *
 * Response:
 * {
 *   data: {
 *     totalDebt: number
 *     coverage: number (percentage, 0-100+)
 *     remaining: number (debt not covered by savings)
 *     loans: Array<{ name: string, value: number }>
 *     history: Array<{ date: string, value: number }>
 *   }
 * }
 */
router.get('/gjeld', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;

    const rawSnapshots = await portfolioService.getSnapshotsByUserId(userId);

    if (rawSnapshots.length === 0) {
      return res.json({
        data: {
          totalDebt: 0,
          coverage: 100,
          remaining: 0,
          loans: [],
          history: [],
        },
        success: true,
      });
    }

    // Sort by date (oldest first)
    const snapshots = sortSnapshotsAsc(rawSnapshots);
    const latest = snapshots[snapshots.length - 1];

    const totalDebt = calc.calculateSumByCategory(latest.accounts, 'gjeld');
    const coverage = calc.calculateCoverage(latest.accounts);
    const sumSavings = calc.calculateSumByCategory(latest.accounts, 'sparing');
    const remaining = Math.max(0, totalDebt - sumSavings);

    // Get loan accounts (gjeld or lån assetClass)
    const loans = latest.accounts
      .filter((a) => ['gjeld', 'lån', 'loan', 'debt'].includes(a.assetClass.toLowerCase()))
      .map((a) => ({ name: a.name, value: a.value }));

    // Build history for chart (already sorted oldest first)
    const history = snapshots.map((s) => ({
      date: s.date,
      value: calc.calculateSumByCategory(s.accounts, 'gjeld'),
    }));

    return res.json({
      data: {
        totalDebt,
        coverage,
        remaining,
        loans,
        history,
      },
      success: true,
    });
  } catch (error) {
    return next(error);
  }
});

/**
 * GET /api/v1/pensjon
 *
 * Pension metrics with breakdown and historical data
 *
 * Response:
 * {
 *   data: {
 *     totalPension: number
 *     breakdown: Array<{ name: string, value: number }>
 *     history: Array<{ date: string, value: number }>
 *   }
 * }
 */
router.get('/pensjon', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;

    const rawSnapshots = await portfolioService.getSnapshotsByUserId(userId);

    if (rawSnapshots.length === 0) {
      return res.json({
        data: {
          totalPension: 0,
          breakdown: [],
          history: [],
        },
        success: true,
      });
    }

    // Sort by date (oldest first)
    const snapshots = sortSnapshotsAsc(rawSnapshots);
    const latest = snapshots[snapshots.length - 1];

    const totalPension = calc.calculateSumByCategory(latest.accounts, 'pensjon');

    // Get pension accounts breakdown
    const breakdown = latest.accounts
      .filter((a) => a.assetClass === 'pensjon')
      .map((a) => ({ name: a.name, value: a.value }));

    // Build history for chart (already sorted oldest first)
    const history = snapshots.map((s) => ({
      date: s.date,
      value: calc.calculateSumByCategory(s.accounts, 'pensjon'),
    }));

    return res.json({
      data: {
        totalPension,
        breakdown,
        history,
      },
      success: true,
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
