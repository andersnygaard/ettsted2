/**
 * User Service
 *
 * Provides CRUD operations for User documents in CosmosDB.
 * All operations use parameterized queries to prevent NoSQL injection.
 */

import { getUsersContainer } from '../config/cosmosdb';
import { User } from '../models/User';
import { logger } from '../utils/logger';
import {
  handleCosmosError,
  isNotFoundError,
  buildParameterizedQuery,
} from '../utils/cosmosHelpers';

/**
 * Create a new user
 *
 * @param user - User document to create
 * @returns Created user document
 * @throws ConflictError if user with same id already exists
 * @throws DatabaseError if operation fails
 */
export async function createUser(user: User): Promise<User> {
  try {
    const container = getUsersContainer();
    const { resource } = await container.items.create(user);
    logger.info('User created successfully', { userId: user.id, username: user.username });
    return resource as User;
  } catch (error) {
    logger.error('Failed to create user', { userId: user.id, error });
    throw handleCosmosError(error);
  }
}

/**
 * Get user by ID
 *
 * @param userId - User ID (partition key)
 * @returns User document or null if not found
 * @throws DatabaseError if operation fails
 */
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const container = getUsersContainer();
    const { resource } = await container.item(userId, userId).read<User>();
    return resource || null;
  } catch (error) {
    if (isNotFoundError(error)) {
      return null;
    }
    logger.error('Failed to get user by ID', { userId, error });
    throw handleCosmosError(error);
  }
}

/**
 * Get user by username
 *
 * Uses parameterized query to prevent NoSQL injection.
 * Note: This is a cross-partition query (slower and more expensive).
 *
 * @param username - Username to search for
 * @returns User document or null if not found
 * @throws DatabaseError if operation fails
 */
export async function getUserByUsername(username: string): Promise<User | null> {
  try {
    const container = getUsersContainer();
    const querySpec = buildParameterizedQuery(
      'SELECT * FROM users u WHERE u.username = @username',
      { username }
    );

    const { resources } = await container.items.query<User>(querySpec).fetchAll();

    if (resources.length === 0) {
      return null;
    }

    // Return first match (username should be unique)
    return resources[0];
  } catch (error) {
    logger.error('Failed to get user by username', { username, error });
    throw handleCosmosError(error);
  }
}

/**
 * Update user
 *
 * @param userId - User ID (partition key)
 * @param updates - Partial user object with fields to update
 * @returns Updated user document
 * @throws NotFoundError if user doesn't exist
 * @throws DatabaseError if operation fails
 */
export async function updateUser(
  userId: string,
  updates: Partial<Omit<User, 'id' | 'createdAt'>>
): Promise<User> {
  try {
    const container = getUsersContainer();

    // Read existing user
    const { resource: existingUser } = await container.item(userId, userId).read<User>();
    if (!existingUser) {
      throw new Error('User not found');
    }

    // Merge updates (preserve id and createdAt)
    const updatedUser: User = {
      ...existingUser,
      ...updates,
      id: existingUser.id, // Ensure id is not changed
      createdAt: existingUser.createdAt, // Ensure createdAt is not changed
    };

    // Replace the document
    const { resource } = await container.item(userId, userId).replace(updatedUser);
    logger.info('User updated successfully', { userId, updates: Object.keys(updates) });
    return resource as User;
  } catch (error) {
    logger.error('Failed to update user', { userId, error });
    throw handleCosmosError(error);
  }
}

/**
 * Delete user
 *
 * @param userId - User ID (partition key)
 * @throws NotFoundError if user doesn't exist
 * @throws DatabaseError if operation fails
 */
export async function deleteUser(userId: string): Promise<void> {
  try {
    const container = getUsersContainer();
    await container.item(userId, userId).delete();
    logger.info('User deleted successfully', { userId });
  } catch (error) {
    logger.error('Failed to delete user', { userId, error });
    throw handleCosmosError(error);
  }
}

/**
 * Check if username is available (not taken)
 *
 * @param username - Username to check
 * @returns true if username is available, false if taken
 */
export async function isUsernameAvailable(username: string): Promise<boolean> {
  const user = await getUserByUsername(username);
  return user === null;
}
