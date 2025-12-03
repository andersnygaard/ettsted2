/**
 * Auth Token Service
 *
 * Supports two authentication modes:
 * 1. Demo tokens - stored in localStorage, validated by backend
 * 2. EasyAuth tokens - fetched from Azure EasyAuth /.auth/me
 *
 * Priority: Demo token (if present) > EasyAuth token
 *
 * EasyAuth /.auth/me returns an array format:
 * [{
 *   access_token: string,
 *   expires_on: string,
 *   id_token: string,
 *   provider_name: "google" | "facebook",
 *   user_claims: [{ typ: string, val: string }],
 *   user_id: string
 * }]
 */

const DEMO_TOKEN_KEY = 'finans_demo_token';

interface EasyAuthClaim {
  typ: string;
  val: string;
}

interface EasyAuthIdentity {
  access_token: string;
  expires_on: string;
  id_token: string;
  provider_name: string;
  user_claims: EasyAuthClaim[];
  user_id: string;
}

/**
 * Cached auth data structure
 */
interface CachedAuthData {
  idToken: string;        // JWT id_token for Bearer auth
  accessToken: string;    // Opaque access_token (for Google API calls if needed)
  clientPrincipal: string;
  expiry: Date;
}

// Known claim type URIs
const CLAIM_TYPES = {
  EMAIL: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
  NAME_ID: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier',
  NAME: 'name',
} as const;

let cachedAuthData: CachedAuthData | null = null;
let tokenFetchPromise: Promise<CachedAuthData | null> | null = null;

/**
 * Returns auth data, checking demo token first, then EasyAuth.
 * Demo tokens are stored in localStorage and take priority.
 */
export async function getAuthData(): Promise<CachedAuthData | null> {
  // Check for demo token first
  const demoToken = localStorage.getItem(DEMO_TOKEN_KEY);
  if (demoToken) {
    // Demo tokens have 24h expiry, set in localStorage
    // We trust the backend to validate expiry
    return {
      idToken: demoToken,
      accessToken: demoToken,
      clientPrincipal: '',
      expiry: new Date(Date.now() + 24 * 60 * 60 * 1000), // Assume valid for 24h
    };
  }

  // Return cached data if available and not expired
  if (cachedAuthData && new Date() < cachedAuthData.expiry) {
    return cachedAuthData;
  }

  // Clear expired data
  if (cachedAuthData && new Date() >= cachedAuthData.expiry) {
    cachedAuthData = null;
  }

  // Deduplicate concurrent requests
  if (tokenFetchPromise) {
    return tokenFetchPromise;
  }

  tokenFetchPromise = fetchAuthToken();
  const authData = await tokenFetchPromise;
  tokenFetchPromise = null;

  return authData;
}

/**
 * Returns the id_token (JWT) for Authorization: Bearer header.
 * Using id_token instead of access_token because:
 * - id_token is a JWT that can be validated locally or via Google's API
 * - access_token from Google is opaque and requires tokeninfo API call
 */
export async function getAccessToken(): Promise<string | null> {
  const authData = await getAuthData();
  return authData?.idToken ?? null;
}

/**
 * Returns the client principal for X-MS-CLIENT-PRINCIPAL header.
 * @deprecated Use getAccessToken() for Bearer auth instead
 */
export async function getClientPrincipal(): Promise<string | null> {
  const authData = await getAuthData();
  return authData?.clientPrincipal ?? null;
}

/**
 * Extract claim value by type from user_claims array
 */
function getClaim(claims: EasyAuthClaim[], type: string): string | undefined {
  const claim = claims.find((c) => c.typ === type);
  return claim?.val;
}

async function fetchAuthToken(): Promise<CachedAuthData | null> {
  try {
    // Fetch from EasyAuth endpoint on the frontend
    const response = await fetch('/.auth/me', {
      credentials: 'include',
    });

    if (!response.ok) {
      console.debug('EasyAuth: Not authenticated (status %d)', response.status);
      return null;
    }

    // EasyAuth returns an array of identities
    const identities: EasyAuthIdentity[] = await response.json();

    if (!Array.isArray(identities) || identities.length === 0) {
      console.debug('EasyAuth: No identities in response');
      return null;
    }

    // Use the first identity (typically only one for single-provider auth)
    const identity = identities[0];

    if (!identity.user_id || !identity.provider_name) {
      console.debug('EasyAuth: Missing user_id or provider_name');
      return null;
    }

    // Validate id_token exists (JWT for Bearer auth)
    if (!identity.id_token) {
      console.debug('EasyAuth: Missing id_token in response');
      return null;
    }

    // Extract email from claims (fallback to user_id which is often email)
    const email =
      getClaim(identity.user_claims, CLAIM_TYPES.EMAIL) || identity.user_id;

    // Extract nameidentifier (sub claim) for stable user ID
    const nameId =
      getClaim(identity.user_claims, CLAIM_TYPES.NAME_ID) || identity.user_id;

    // Create client principal for X-MS-CLIENT-PRINCIPAL header (backward compat)
    const principal = {
      userId: nameId,
      userDetails: email,
      identityProvider: identity.provider_name,
      userRoles: ['authenticated'],
    };

    // Calculate expiry (use expires_on from response, with 5min buffer)
    let expiry: Date;
    if (identity.expires_on) {
      const expiryDate = new Date(identity.expires_on);
      // Refresh 5 minutes before actual expiry
      expiry = new Date(expiryDate.getTime() - 5 * 60 * 1000);
    } else {
      // Default to 1 hour if no expiry provided
      expiry = new Date(Date.now() + 60 * 60 * 1000);
    }

    // Cache all tokens
    // Strip "Bearer " prefix if present (EasyAuth may return it with prefix)
    const rawIdToken = identity.id_token.startsWith('Bearer ')
      ? identity.id_token.slice(7)
      : identity.id_token;

    cachedAuthData = {
      idToken: rawIdToken,                  // JWT for Bearer auth (without prefix)
      accessToken: identity.access_token,   // Opaque token for Google API calls
      clientPrincipal: btoa(JSON.stringify(principal)),
      expiry,
    };

    console.debug(
      'EasyAuth: Token fetched successfully (provider: %s)',
      identity.provider_name
    );
    return cachedAuthData;
  } catch (error) {
    console.error('EasyAuth: Failed to fetch token', error);
    return null;
  }
}

/**
 * Clears the cached auth data and demo token. Call this on logout.
 */
export function clearAuthToken(): void {
  cachedAuthData = null;
  tokenFetchPromise = null;
  localStorage.removeItem(DEMO_TOKEN_KEY);
}

/**
 * Refreshes auth data by clearing cache and fetching again.
 */
export async function refreshAuthToken(): Promise<CachedAuthData | null> {
  clearAuthToken();
  return getAuthData();
}

/**
 * Store demo token in localStorage
 */
export function setDemoToken(token: string): void {
  localStorage.setItem(DEMO_TOKEN_KEY, token);
  // Clear cached EasyAuth data so demo token takes priority
  cachedAuthData = null;
  tokenFetchPromise = null;
}

/**
 * Get demo token from localStorage
 */
export function getDemoToken(): string | null {
  return localStorage.getItem(DEMO_TOKEN_KEY);
}

/**
 * Check if user has a demo session
 */
export function isDemoSession(): boolean {
  return getDemoToken() !== null;
}

/**
 * @deprecated Use getAccessToken() instead
 * Kept for backward compatibility - returns the access_token
 */
export const getAuthToken = getAccessToken;
