/**
 * CosmosDB Configuration and Initialization
 *
 * Provides singleton CosmosDB client and container references.
 * Initializes database and containers on server startup.
 * In CI mock mode, skips real database connection and uses mock data.
 */

import { CosmosClient, Database, Container } from '@azure/cosmos';
import https from 'https';
import { config } from './environment';
import { logger } from '../utils/logger';

// Database and container IDs
const DATABASE_ID = 'finans-db';
const USERS_CONTAINER_ID = 'users';
const PORTFOLIOS_CONTAINER_ID = 'portfolios';

// Throughput configuration (Request Units per second)
const DEFAULT_THROUGHPUT = 400; // Minimum for cost efficiency

// Skip real client creation in CI mock mode
let client: CosmosClient | null = null;

if (!config.ciMockMode) {
  // For local emulator: disable SSL cert verification (self-signed cert)
  const isLocalEmulator = config.cosmosDbEndpoint.includes('localhost');
  const agent = isLocalEmulator
    ? new https.Agent({ rejectUnauthorized: false })
    : undefined;

  // Singleton CosmosDB client
  client = new CosmosClient({
    endpoint: config.cosmosDbEndpoint,
    key: config.cosmosDbKey,
    agent,
  });
}

// Container references (initialized during initializeDatabase)
let database: Database;
let usersContainer: Container;
let portfoliosContainer: Container;

/**
 * Initialize database and containers
 *
 * Creates database and containers if they don't exist.
 * Should be called on server startup before handling requests.
 * In CI mock mode, skips real initialization.
 *
 * @throws Error if database initialization fails
 */
export async function initializeDatabase(): Promise<void> {
  // Skip database initialization in CI mock mode
  if (config.ciMockMode) {
    logger.info('CI mock mode enabled - skipping CosmosDB initialization');
    return;
  }

  if (!client) {
    throw new Error('CosmosDB client not initialized');
  }

  try {
    logger.info('Initializing CosmosDB connection...');

    // Create or get database
    const { database: db } = await client.databases.createIfNotExists({
      id: DATABASE_ID,
    });
    database = db;
    logger.info(`Database initialized: ${DATABASE_ID}`);

    // Create or get users container
    const { container: usersC } = await database.containers.createIfNotExists({
      id: USERS_CONTAINER_ID,
      partitionKey: '/id',
      throughput: DEFAULT_THROUGHPUT,
    });
    usersContainer = usersC;
    logger.info(`Container initialized: ${USERS_CONTAINER_ID} (partition key: /id, throughput: ${DEFAULT_THROUGHPUT} RU/s)`);

    // Create or get portfolios container
    const { container: portfoliosC } = await database.containers.createIfNotExists({
      id: PORTFOLIOS_CONTAINER_ID,
      partitionKey: '/userId',
      throughput: DEFAULT_THROUGHPUT,
    });
    portfoliosContainer = portfoliosC;
    logger.info(`Container initialized: ${PORTFOLIOS_CONTAINER_ID} (partition key: /userId, throughput: ${DEFAULT_THROUGHPUT} RU/s)`);

    // Validate connection by reading database properties
    await database.read();
    logger.info('CosmosDB connection validated successfully');
  } catch (error) {
    logger.error('Failed to initialize CosmosDB', { error });
    throw error;
  }
}

/**
 * Get database reference
 *
 * @throws Error if database not initialized
 */
export function getDatabase(): Database {
  if (!database) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return database;
}

/**
 * Get users container reference
 *
 * @throws Error if container not initialized
 */
export function getUsersContainer(): Container {
  if (!usersContainer) {
    throw new Error('Users container not initialized. Call initializeDatabase() first.');
  }
  return usersContainer;
}

/**
 * Get portfolios container reference
 *
 * @throws Error if container not initialized
 */
export function getPortfoliosContainer(): Container {
  if (!portfoliosContainer) {
    throw new Error('Portfolios container not initialized. Call initializeDatabase() first.');
  }
  return portfoliosContainer;
}

// Export client for advanced use cases
export { client };
