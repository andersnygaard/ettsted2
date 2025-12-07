/**
 * Demo Profile Loader
 *
 * Loads demo user and snapshot data from JSON fixtures.
 * Supports multiple profiles for testing different scenarios.
 */

import { User } from '../../../models/User';
import { MonthlySnapshot } from '../../../models/Portfolio';

import standardUser from './standard/user.json';
import standardSnapshots from './standard/snapshots.json';
import emptyUser from './empty/user.json';
import emptySnapshots from './empty/snapshots.json';
import debtHeavyUser from './debt-heavy/user.json';
import debtHeavySnapshots from './debt-heavy/snapshots.json';
import fireAchievedUser from './fire-achieved/user.json';
import fireAchievedSnapshots from './fire-achieved/snapshots.json';

export type DemoProfileName = 'standard' | 'empty' | 'debt-heavy' | 'fire-achieved';

export interface DemoProfile {
  user: User;
  snapshots: MonthlySnapshot[];
}

interface RawUser {
  id: string;
  nickname: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  profile: {
    monthlySalary: number;
    monthlySavings?: number;
    annualExpenses: number;
    birthYear: number;
    plannedRetirementAge: number;
    fireNumber?: number;
  };
  accounts: Array<{
    id: string;
    name: string;
    category: 'sparing' | 'gjeld' | 'pensjon';
    isActive: boolean;
    sortOrder: number;
    createdAt: string;
    loanDetails?: {
      interestRate: number;
      remainingYears: number;
      originalAmount?: number;
    };
  }>;
}

interface RawSnapshot {
  id: string;
  userId: string;
  date: string;
  accounts: Array<{
    id: string;
    name: string;
    assetClass: string;
    value: number;
    notes?: string;
  }>;
  totalNetWorth: number;
  createdAt: string;
  updatedAt: string;
}

function parseUser(raw: RawUser): User {
  return {
    ...raw,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
    accounts: raw.accounts.map((acc) => ({
      ...acc,
      createdAt: new Date(acc.createdAt),
    })),
  };
}

function parseSnapshots(raw: RawSnapshot[]): MonthlySnapshot[] {
  return raw.map((snap) => ({
    ...snap,
    createdAt: new Date(snap.createdAt),
    updatedAt: new Date(snap.updatedAt),
  }));
}

const profiles: Record<DemoProfileName, { user: RawUser; snapshots: RawSnapshot[] }> = {
  standard: { user: standardUser as RawUser, snapshots: standardSnapshots as RawSnapshot[] },
  empty: { user: emptyUser as RawUser, snapshots: emptySnapshots as RawSnapshot[] },
  'debt-heavy': { user: debtHeavyUser as RawUser, snapshots: debtHeavySnapshots as RawSnapshot[] },
  'fire-achieved': {
    user: fireAchievedUser as RawUser,
    snapshots: fireAchievedSnapshots as RawSnapshot[],
  },
};

export const DEMO_PROFILE_NAMES: DemoProfileName[] = [
  'standard',
  'empty',
  'debt-heavy',
  'fire-achieved',
];

export function loadDemoProfile(name: DemoProfileName): DemoProfile {
  const profile = profiles[name];
  if (!profile) {
    throw new Error(`Unknown demo profile: ${name}`);
  }

  return {
    user: parseUser(profile.user),
    snapshots: parseSnapshots(profile.snapshots),
  };
}

export function isValidDemoProfile(name: string): name is DemoProfileName {
  return DEMO_PROFILE_NAMES.includes(name as DemoProfileName);
}
