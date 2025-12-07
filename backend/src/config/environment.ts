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

  // CI/Testing
  ciMockMode: boolean;

  // Database
  cosmosDbEndpoint: string;
  cosmosDbKey: string;

  // Authentication
  facebookAppId?: string;
  facebookAppSecret?: string;
  googleClientId?: string;
  googleClientSecret?: string;

  // OpenAI
  openaiApiKey?: string;

  // Langfuse
  langfusePublicKey?: string;
  langfuseSecretKey?: string;
  langfuseHost?: string;

  // CORS
  allowedOrigins: string[];

  // Rate Limiting
  rateLimitGeneral: number;
  rateLimitCalculator: number;
  rateLimitLLM: number;
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

// Check if running in CI mock mode (skips database)
const ciMockMode = process.env.CI_MOCK_MODE === 'true';

// Validate and export configuration
export const config: EnvironmentConfig = {
  // Server configuration
  port: parseInt(getOptionalEnv('PORT', '3000'), 10),
  nodeEnv: getOptionalEnv('NODE_ENV', 'development'),

  // CI/Testing
  ciMockMode,

  // Database configuration (required unless CI mock mode)
  cosmosDbEndpoint: ciMockMode ? 'mock://localhost' : getRequiredEnv('COSMOS_DB_ENDPOINT'),
  cosmosDbKey: ciMockMode ? 'mock-key' : getRequiredEnv('COSMOS_DB_KEY'),

  // Authentication (optional - will be needed later)
  facebookAppId: process.env.FACEBOOK_APP_ID,
  facebookAppSecret: process.env.FACEBOOK_APP_SECRET,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,

  // OpenAI (optional - will be needed for LLM features)
  openaiApiKey: process.env.OPENAI_API_KEY,

  // Langfuse (optional - will be needed for LLM observability)
  langfusePublicKey: process.env.LANGFUSE_PUBLIC_KEY,
  langfuseSecretKey: process.env.LANGFUSE_SECRET_KEY,
  langfuseHost: process.env.LANGFUSE_HOST,

  // CORS configuration
  allowedOrigins: parseAllowedOrigins(
    getOptionalEnv('ALLOWED_ORIGINS', 'http://localhost:5173')
  ),

  // Rate limiting configuration
  rateLimitGeneral: parseInt(getOptionalEnv('RATE_LIMIT_REQUESTS', '100'), 10),
  rateLimitCalculator: parseInt(getOptionalEnv('RATE_LIMIT_CALCULATOR', '10'), 10),
  rateLimitLLM: parseInt(getOptionalEnv('RATE_LIMIT_LLM', '20'), 10)
};

// Validate configuration
if (isNaN(config.port) || config.port < 1 || config.port > 65535) {
  throw new Error(`Invalid PORT: ${process.env.PORT}. Must be a number between 1 and 65535.`);
}

// Log configuration (without sensitive values)
console.log('Environment configuration loaded:', {
  port: config.port,
  nodeEnv: config.nodeEnv,
  cosmosDbEndpoint: config.cosmosDbEndpoint,
  allowedOrigins: config.allowedOrigins,
  rateLimits: {
    general: config.rateLimitGeneral,
    calculator: config.rateLimitCalculator,
    llm: config.rateLimitLLM
  }
});
