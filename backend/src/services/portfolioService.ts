/**
 * Portfolio Service
 *
 * Provides CRUD operations for MonthlySnapshot documents in CosmosDB.
 * All snapshots are partitioned by userId for efficient queries.
 */

import { getPortfoliosContainer } from '../config/cosmosdb';
import { MonthlySnapshot } from '../models/Portfolio';
import { logger } from '../utils/logger';
import {
  handleCosmosError,
  isNotFoundError,
  buildParameterizedQuery,
} from '../utils/cosmosHelpers';

/**
 * Create a new monthly snapshot
 *
 * @param snapshot - MonthlySnapshot document to create
 * @returns Created snapshot document
 * @throws ConflictError if snapshot with same id already exists
 * @throws DatabaseError if operation fails
 */
export async function createSnapshot(snapshot: MonthlySnapshot): Promise<MonthlySnapshot> {
  try {
    const container = getPortfoliosContainer();
    const { resource } = await container.items.create(snapshot);
    logger.info('Snapshot created successfully', {
      snapshotId: snapshot.id,
      userId: snapshot.userId,
      date: snapshot.date,
      totalNetWorth: snapshot.totalNetWorth,
    });
    return resource as MonthlySnapshot;
  } catch (error) {
    logger.error('Failed to create snapshot', { snapshotId: snapshot.id, userId: snapshot.userId, error });
    throw handleCosmosError(error);
  }
}

/**
 * Get snapshot by ID
 *
 * @param userId - User ID (partition key)
 * @param snapshotId - Snapshot ID
 * @returns Snapshot document or null if not found
 * @throws DatabaseError if operation fails
 */
export async function getSnapshotById(
  userId: string,
  snapshotId: string
): Promise<MonthlySnapshot | null> {
  try {
    const container = getPortfoliosContainer();
    const { resource } = await container.item(snapshotId, userId).read<MonthlySnapshot>();
    return resource || null;
  } catch (error) {
    if (isNotFoundError(error)) {
      return null;
    }
    logger.error('Failed to get snapshot by ID', { userId, snapshotId, error });
    throw handleCosmosError(error);
  }
}

/**
 * Get all snapshots for a user
 *
 * Efficient partition-scoped query (all snapshots for user in same partition).
 * Uses parameterized query to prevent NoSQL injection.
 *
 * @param userId - User ID (partition key)
 * @param options - Query options
 * @param options.orderBy - Sort order ('date' or 'createdAt', default: 'date')
 * @param options.ascending - Sort direction (default: true)
 * @param options.limit - Maximum number of results (optional)
 * @returns Array of snapshot documents (may be empty)
 * @throws DatabaseError if operation fails
 */
export async function getSnapshotsByUserId(
  userId: string,
  options?: {
    orderBy?: 'date' | 'createdAt';
    ascending?: boolean;
    limit?: number;
  }
): Promise<MonthlySnapshot[]> {
  try {
    const container = getPortfoliosContainer();

    // Build query with options
    const orderBy = options?.orderBy || 'date';
    const direction = options?.ascending === false ? 'DESC' : 'ASC';
    let query = `SELECT * FROM portfolios p WHERE p.userId = @userId ORDER BY p.${orderBy} ${direction}`;

    const querySpec = buildParameterizedQuery(query, { userId });

    const { resources } = await container.items
      .query<MonthlySnapshot>(querySpec, {
        partitionKey: userId, // Partition-scoped query (efficient)
        maxItemCount: options?.limit,
      })
      .fetchAll();

    logger.info('Retrieved snapshots for user', { userId, count: resources.length });
    return resources;
  } catch (error) {
    logger.error('Failed to get snapshots by user ID', { userId, error });
    throw handleCosmosError(error);
  }
}

/**
 * Get snapshots for a user within a date range
 *
 * @param userId - User ID (partition key)
 * @param startDate - Start date (dd.MM.yyyy format)
 * @param endDate - End date (dd.MM.yyyy format)
 * @returns Array of snapshot documents (may be empty)
 * @throws DatabaseError if operation fails
 */
export async function getSnapshotsByDateRange(
  userId: string,
  startDate: string,
  endDate: string
): Promise<MonthlySnapshot[]> {
  try {
    const container = getPortfoliosContainer();

    const querySpec = buildParameterizedQuery(
      'SELECT * FROM portfolios p WHERE p.userId = @userId AND p.date >= @startDate AND p.date <= @endDate ORDER BY p.date ASC',
      { userId, startDate, endDate }
    );

    const { resources } = await container.items
      .query<MonthlySnapshot>(querySpec, {
        partitionKey: userId, // Partition-scoped query
      })
      .fetchAll();

    logger.info('Retrieved snapshots by date range', {
      userId,
      startDate,
      endDate,
      count: resources.length,
    });
    return resources;
  } catch (error) {
    logger.error('Failed to get snapshots by date range', { userId, startDate, endDate, error });
    throw handleCosmosError(error);
  }
}

/**
 * Update snapshot
 *
 * @param userId - User ID (partition key)
 * @param snapshotId - Snapshot ID
 * @param updates - Partial snapshot object with fields to update
 * @returns Updated snapshot document
 * @throws NotFoundError if snapshot doesn't exist
 * @throws DatabaseError if operation fails
 */
export async function updateSnapshot(
  userId: string,
  snapshotId: string,
  updates: Partial<Omit<MonthlySnapshot, 'id' | 'userId' | 'createdAt'>>
): Promise<MonthlySnapshot> {
  try {
    const container = getPortfoliosContainer();

    // Read existing snapshot
    const { resource: existingSnapshot } = await container
      .item(snapshotId, userId)
      .read<MonthlySnapshot>();
    if (!existingSnapshot) {
      throw new Error('Snapshot not found');
    }

    // Merge updates (preserve id, userId, createdAt, update updatedAt)
    const updatedSnapshot: MonthlySnapshot = {
      ...existingSnapshot,
      ...updates,
      id: existingSnapshot.id, // Ensure id is not changed
      userId: existingSnapshot.userId, // Ensure userId is not changed
      createdAt: existingSnapshot.createdAt, // Ensure createdAt is not changed
      updatedAt: new Date(), // Update timestamp
    };

    // Replace the document
    const { resource } = await container.item(snapshotId, userId).replace(updatedSnapshot);
    logger.info('Snapshot updated successfully', {
      snapshotId,
      userId,
      updates: Object.keys(updates),
    });
    return resource as MonthlySnapshot;
  } catch (error) {
    logger.error('Failed to update snapshot', { userId, snapshotId, error });
    throw handleCosmosError(error);
  }
}

/**
 * Delete snapshot
 *
 * @param userId - User ID (partition key)
 * @param snapshotId - Snapshot ID
 * @throws NotFoundError if snapshot doesn't exist
 * @throws DatabaseError if operation fails
 */
export async function deleteSnapshot(userId: string, snapshotId: string): Promise<void> {
  try {
    const container = getPortfoliosContainer();
    await container.item(snapshotId, userId).delete();
    logger.info('Snapshot deleted successfully', { snapshotId, userId });
  } catch (error) {
    logger.error('Failed to delete snapshot', { userId, snapshotId, error });
    throw handleCosmosError(error);
  }
}

/**
 * Delete all snapshots for a user
 *
 * Use with caution - this is a destructive operation.
 *
 * @param userId - User ID (partition key)
 * @returns Number of snapshots deleted
 * @throws DatabaseError if operation fails
 */
export async function deleteAllSnapshotsForUser(userId: string): Promise<number> {
  try {
    // Get all snapshots for user
    const snapshots = await getSnapshotsByUserId(userId);

    // Delete each snapshot
    const container = getPortfoliosContainer();
    await Promise.all(
      snapshots.map((snapshot) => container.item(snapshot.id, userId).delete())
    );

    logger.warn('All snapshots deleted for user', { userId, count: snapshots.length });
    return snapshots.length;
  } catch (error) {
    logger.error('Failed to delete all snapshots for user', { userId, error });
    throw handleCosmosError(error);
  }
}
