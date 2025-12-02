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

const router: IRouter = Router();

/**
 * GET /api/v1/dashboard
 *
 * Dashboard overview with aggregated metrics
 *
 * Response:
 * {
 *   data: {
 *     netWorth: number
 *     monthlyChange: number (percentage)
 *     sumSparing: number
 *     sumGjeld: number
 *     sumPensjon: number
 *     sparerate: number (percentage)
 *     snapshotDate: string (dd.MM.yyyy)
 *   }
 * }
 */
router.get('/dashboard', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;

    // Get latest 2 snapshots for comparison
    const snapshots = await portfolioService.getSnapshotsByUserId(userId, {
      orderBy: 'date',
      ascending: false,
      limit: 2,
    });

    const user = await userService.getUserById(userId);

    if (snapshots.length === 0) {
      res.json({
        data: {
          netWorth: 0,
          monthlyChange: 0,
          sumSparing: 0,
          sumGjeld: 0,
          sumPensjon: 0,
          sparerate: user?.profile ? calc.calculateSparerate(user.profile) : 0,
        },
        success: true,
      });
      return;
    }

    const current = snapshots[0];
    const previous = snapshots[1];

    const netWorth = calc.calculateNetWorth(current.accounts);
    const sumSparing = calc.calculateSumByCategory(current.accounts, 'sparing');
    const sumGjeld = calc.calculateSumByCategory(current.accounts, 'gjeld');
    const sumPensjon = calc.calculateSumByCategory(current.accounts, 'pensjon');

    const previousNetWorth = previous ? calc.calculateNetWorth(previous.accounts) : netWorth;
    const monthlyChange = calc.calculateMonthlyChange(netWorth, previousNetWorth);

    res.json({
      data: {
        netWorth,
        monthlyChange,
        sumSparing,
        sumGjeld,
        sumPensjon,
        sparerate: user?.profile ? calc.calculateSparerate(user.profile) : 0,
        snapshotDate: current.date,
      },
      success: true,
    });
  } catch (error) {
    next(error);
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
 *     sumSparing: number
 *     sparerate: number (percentage)
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

    const [snapshots, user] = await Promise.all([
      portfolioService.getSnapshotsByUserId(userId, {
        orderBy: 'date',
        ascending: true,
      }),
      userService.getUserById(userId),
    ]);

    if (snapshots.length === 0 || !user) {
      res.json({
        data: {
          sumSparing: 0,
          sparerate: 0,
          monthsFree: 0,
          fireNumber: 0,
          fireProgress: 0,
          history: [],
        },
        success: true,
      });
      return;
    }

    const latest = snapshots[snapshots.length - 1];
    const sumSparing = calc.calculateSumByCategory(latest.accounts, 'sparing');
    const sparerate = calc.calculateSparerate(user.profile);
    const fireNumber = calc.calculateFireNumber(user.profile);
    const monthsFree = calc.calculateMonthsFree(sumSparing, user.profile.annualExpenses);
    const fireProgress = fireNumber > 0 ? (sumSparing / fireNumber) * 100 : 0;

    // Build history for chart
    const history = snapshots.map((s) => ({
      date: s.date,
      value: calc.calculateSumByCategory(s.accounts, 'sparing'),
    }));

    res.json({
      data: {
        sumSparing,
        sparerate,
        monthsFree,
        fireNumber,
        fireProgress,
        history,
      },
      success: true,
    });
  } catch (error) {
    next(error);
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
 *     sumGjeld: number
 *     dekning: number (percentage, 0-100+)
 *     remaining: number (debt not covered by savings)
 *     loans: Array<{ name: string, value: number }>
 *     history: Array<{ date: string, value: number }>
 *   }
 * }
 */
router.get('/gjeld', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;

    const snapshots = await portfolioService.getSnapshotsByUserId(userId, {
      orderBy: 'date',
      ascending: true,
    });

    if (snapshots.length === 0) {
      res.json({
        data: {
          sumGjeld: 0,
          dekning: 100,
          remaining: 0,
          loans: [],
          history: [],
        },
        success: true,
      });
      return;
    }

    const latest = snapshots[snapshots.length - 1];
    const sumGjeld = calc.calculateSumByCategory(latest.accounts, 'gjeld');
    const dekning = calc.calculateDekning(latest.accounts);
    const sumSparing = calc.calculateSumByCategory(latest.accounts, 'sparing');
    const remaining = Math.max(0, sumGjeld - sumSparing);

    // Get loan accounts
    const loans = latest.accounts
      .filter((a) => a.assetClass === 'lån')
      .map((a) => ({ name: a.name, value: a.value }));

    // Build history for chart
    const history = snapshots.map((s) => ({
      date: s.date,
      value: calc.calculateSumByCategory(s.accounts, 'gjeld'),
    }));

    res.json({
      data: {
        sumGjeld,
        dekning,
        remaining,
        loans,
        history,
      },
      success: true,
    });
  } catch (error) {
    next(error);
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
 *     sumPensjon: number
 *     breakdown: Array<{ name: string, value: number }>
 *     history: Array<{ date: string, value: number }>
 *   }
 * }
 */
router.get('/pensjon', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;

    const snapshots = await portfolioService.getSnapshotsByUserId(userId, {
      orderBy: 'date',
      ascending: true,
    });

    if (snapshots.length === 0) {
      res.json({
        data: {
          sumPensjon: 0,
          breakdown: [],
          history: [],
        },
        success: true,
      });
      return;
    }

    const latest = snapshots[snapshots.length - 1];
    const sumPensjon = calc.calculateSumByCategory(latest.accounts, 'pensjon');

    // Get pension accounts breakdown
    const breakdown = latest.accounts
      .filter((a) => a.assetClass === 'pensjon')
      .map((a) => ({ name: a.name, value: a.value }));

    // Build history for chart
    const history = snapshots.map((s) => ({
      date: s.date,
      value: calc.calculateSumByCategory(s.accounts, 'pensjon'),
    }));

    res.json({
      data: {
        sumPensjon,
        breakdown,
        history,
      },
      success: true,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
