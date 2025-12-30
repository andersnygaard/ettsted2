import dotenv from 'dotenv';
import path from 'path';

// Load .env file from backend directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Environment configuration with validation
 *
 * Validates required environment variables on startup and provides
 * typed exports with sensible defaults for optional variables.
 */

interface EnvironmentConfig {
  // Server
  port: number;
  nodeEnv: string;

  // CI Mock Mode - skips database for CI testing
  ciMockMode: boolean;

  // Database (optional in CI mock mode)
  cosmosDbEndpoint: string;
  cosmosDbKey: string;

  // Authentication
  facebookAppId?: string;
  facebookAppSecret?: string;
  googleClientId?: string;
  googleClientSecret?: string;

  // Demo JWT Secret
  demoJwtSecret: string;

  // OpenAI
  openaiApiKey?: string;

  // Langfuse
  langfusePublicKey?: string;
  langfuseSecretKey?: string;
  langfuseHost?: string;

  // CORS
  allowedOrigins: string[];
}

/**
 * Get required environment variable or throw error
 */
function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

/**
 * Get optional environment variable with default
 */
function getOptionalEnv(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

/**
 * Parse allowed origins from comma-separated string
 */
function parseAllowedOrigins(originsString: string): string[] {
  return originsString.split(',').map(origin => origin.trim()).filter(Boolean);
}

// Check CI mock mode first (before requiring DB config)
const ciMockMode = process.env.CI_MOCK_MODE === 'true';

// Validate and export configuration
export const config: EnvironmentConfig = {
  // Server configuration
  port: parseInt(getOptionalEnv('PORT', '3000'), 10),
  nodeEnv: getOptionalEnv('NODE_ENV', 'development'),

  // CI Mock Mode
  ciMockMode,

  // Database configuration (required unless in CI mock mode)
  cosmosDbEndpoint: ciMockMode ? 'mock://localhost' : getRequiredEnv('COSMOS_DB_ENDPOINT'),
  cosmosDbKey: ciMockMode ? 'mock-key' : getRequiredEnv('COSMOS_DB_KEY'),

  // Authentication (optional - will be needed later)
  facebookAppId: process.env.FACEBOOK_APP_ID,
  facebookAppSecret: process.env.FACEBOOK_APP_SECRET,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,

  // Demo JWT Secret (required in production, optional in development)
  demoJwtSecret: process.env.DEMO_JWT_SECRET || 'demo-secret-key-for-development',

  // OpenAI (optional - will be needed for LLM features)
  openaiApiKey: process.env.OPENAI_API_KEY,

  // Langfuse (optional - will be needed for LLM observability)
  langfusePublicKey: process.env.LANGFUSE_PUBLIC_KEY,
  langfuseSecretKey: process.env.LANGFUSE_SECRET_KEY,
  langfuseHost: process.env.LANGFUSE_HOST,

  // CORS configuration
  allowedOrigins: parseAllowedOrigins(
    getOptionalEnv('ALLOWED_ORIGINS', 'http://localhost:5173')
  )
};

// Validate configuration
if (isNaN(config.port) || config.port < 1 || config.port > 65535) {
  throw new Error(`Invalid PORT: ${process.env.PORT}. Must be a number between 1 and 65535.`);
}

if (config.nodeEnv === 'production' && !process.env.DEMO_JWT_SECRET) {
  throw new Error('DEMO_JWT_SECRET must be set in production');
}

// Log configuration (without sensitive values)
console.log('Environment configuration loaded:', {
  port: config.port,
  nodeEnv: config.nodeEnv,
  ciMockMode: config.ciMockMode,
  cosmosDbEndpoint: config.ciMockMode ? '(mock)' : config.cosmosDbEndpoint,
  allowedOrigins: config.allowedOrigins
});
