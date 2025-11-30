/**
 * Database Reset Module
 *
 * Clears and reseeds the database with test data.
 * Used by:
 * - Dev reset API endpoint (POST /api/v1/dev/reset)
 * - Playwright tests
 */

import { Container } from '@azure/cosmos';
import * as fs from 'fs';
import * as path from 'path';
import { logger } from '../utils/logger';

// Fixture paths
const FIXTURES_PATH = path.join(__dirname, 'fixtures');

interface ResetOptions {
  usersContainer: Container;
  portfoliosContainer: Container;
  clearOnly?: boolean;
}

/**
 * Clear all data for a specific user
 */
export async function clearUserData(
  userId: string,
  options: ResetOptions
): Promise<void> {
  const { usersContainer, portfoliosContainer } = options;

  // Delete user
  try {
    await usersContainer.item(userId, userId).delete();
    logger.debug(`Deleted user: ${userId}`);
  } catch (error: any) {
    if (error.code !== 404) throw error;
  }

  // Delete user's snapshots
  const { resources: snapshots } = await portfoliosContainer.items
    .query({
      query: 'SELECT c.id FROM c WHERE c.userId = @userId',
      parameters: [{ name: '@userId', value: userId }],
    })
    .fetchAll();

  for (const snapshot of snapshots) {
    await portfoliosContainer.item(snapshot.id, userId).delete();
    logger.debug(`Deleted snapshot: ${snapshot.id}`);
  }
}

/**
 * Reset database to initial seed state
 *
 * 1. Clears all test data
 * 2. Reseeds with fixture data
 */
export async function resetDatabase(options: ResetOptions): Promise<{
  users: number;
  snapshots: number;
}> {
  const { usersContainer, portfoliosContainer, clearOnly = false } = options;

  logger.info('Resetting database...');

  // Load fixtures
  const usersData = JSON.parse(
    fs.readFileSync(path.join(FIXTURES_PATH, 'users.json'), 'utf-8')
  );

  const snapshotsData = JSON.parse(
    fs.readFileSync(path.join(FIXTURES_PATH, 'snapshots.json'), 'utf-8')
  );

  // Clear existing data for fixture users
  for (const user of usersData) {
    await clearUserData(user.id, options);
  }

  if (clearOnly) {
    logger.info('Database cleared (clearOnly mode)');
    return { users: 0, snapshots: 0 };
  }

  // Seed users
  for (const user of usersData) {
    const userDoc = {
      ...user,
      createdAt: user.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await usersContainer.items.upsert(userDoc);
    logger.debug(`Seeded user: ${user.id}`);
  }

  // Seed snapshots
  for (const snapshot of snapshotsData) {
    const snapshotDoc = {
      ...snapshot,
      createdAt: snapshot.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await portfoliosContainer.items.upsert(snapshotDoc);
    logger.debug(`Seeded snapshot: ${snapshot.id}`);
  }

  logger.info('Database reset complete', {
    users: usersData.length,
    snapshots: snapshotsData.length,
  });

  return {
    users: usersData.length,
    snapshots: snapshotsData.length,
  };
}
