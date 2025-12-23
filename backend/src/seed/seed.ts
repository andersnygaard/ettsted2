/**
 * Database Seed Script
 *
 * Seeds the CosmosDB database with test data for development.
 * Run with: pnpm db:seed
 *
 * Idempotent - can be run multiple times safely (upserts data)
 */

import { CosmosClient } from '@azure/cosmos';
import https from 'https';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Configuration
const COSMOS_ENDPOINT = process.env.COSMOS_DB_ENDPOINT || 'https://localhost:8081';
const COSMOS_KEY = process.env.COSMOS_DB_KEY || '';
const DATABASE_ID = 'finans-db';
const USERS_CONTAINER = 'users';
const PORTFOLIOS_CONTAINER = 'portfolios';

// For local emulator: disable SSL verification
const isLocalEmulator = COSMOS_ENDPOINT.includes('localhost');
const agent = isLocalEmulator
  ? new https.Agent({ rejectUnauthorized: false })
  : undefined;

async function seed() {
  console.log('🌱 Starting database seed...\n');
  console.log(`   Endpoint: ${COSMOS_ENDPOINT}`);
  console.log(`   Database: ${DATABASE_ID}\n`);

  // Connect to CosmosDB
  const client = new CosmosClient({
    endpoint: COSMOS_ENDPOINT,
    key: COSMOS_KEY,
    agent,
  });

  try {
    // Create database and containers if they don't exist
    const { database } = await client.databases.createIfNotExists({ id: DATABASE_ID });

    const { container: usersContainer } = await database.containers.createIfNotExists({
      id: USERS_CONTAINER,
      partitionKey: { paths: ['/id'] },
    });

    const { container: portfoliosContainer } = await database.containers.createIfNotExists({
      id: PORTFOLIOS_CONTAINER,
      partitionKey: { paths: ['/userId'] },
    });

    // Load fixtures
    const fixturesPath = path.join(__dirname, 'fixtures');

    const usersData = JSON.parse(
      fs.readFileSync(path.join(fixturesPath, 'users.json'), 'utf-8')
    );

    const snapshotsData = JSON.parse(
      fs.readFileSync(path.join(fixturesPath, 'snapshots.json'), 'utf-8')
    );

    // Seed users
    console.log('📦 Seeding users...');
    for (const user of usersData) {
      // Add timestamps if missing
      const userDoc = {
        ...user,
        createdAt: user.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await usersContainer.items.upsert(userDoc);
      console.log(`   ✓ User: ${user.nickname} (${user.id})`);
    }

    // Seed snapshots
    console.log('\n📦 Seeding snapshots...');
    for (const snapshot of snapshotsData) {
      // Add timestamps if missing
      const snapshotDoc = {
        ...snapshot,
        createdAt: snapshot.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await portfoliosContainer.items.upsert(snapshotDoc);
      console.log(`   ✓ Snapshot: ${snapshot.date} (${snapshot.id})`);
    }

    console.log('\n✅ Database seeded successfully!\n');
    console.log('   Summary:');
    console.log(`   - Users: ${usersData.length}`);
    console.log(`   - Snapshots: ${snapshotsData.length}`);

  } catch (error) {
    console.error('\n❌ Seed failed:', error);
    process.exit(1);
  }
}

// Run seed
seed();
