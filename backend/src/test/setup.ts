/**
 * Test Setup
 *
 * Global setup for integration tests.
 * Initializes database connection before tests run.
 */

import { beforeAll } from 'vitest';
import { initializeDatabase } from '../config/cosmosdb';

beforeAll(async () => {
  await initializeDatabase();
});
