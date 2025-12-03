/**
 * EasyAuth Token Service
 *
 * Fetches and caches the access token from Azure EasyAuth.
 * Used to forward authentication to the backend API.
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

// Known claim type URIs
const CLAIM_TYPES = {
  EMAIL: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
  NAME_ID: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier',
  NAME: 'name',
} as const;

let cachedToken: string | null = null;
let tokenExpiry: Date | null = null;
let tokenFetchPromise: Promise<string | null> | null = null;

/**
 * Fetches the client principal from EasyAuth and creates a base64-encoded token
 * that mimics the x-ms-client-principal header format.
 *
 * This token is sent to the backend in the X-MS-CLIENT-PRINCIPAL header
 * so the backend can authenticate the user without going through its own EasyAuth.
 */
export async function getAuthToken(): Promise<string | null> {
  // Return cached token if available and not expired
  if (cachedToken && tokenExpiry && new Date() < tokenExpiry) {
    return cachedToken;
  }

  // Clear expired token
  if (tokenExpiry && new Date() >= tokenExpiry) {
    cachedToken = null;
    tokenExpiry = null;
  }

  // Deduplicate concurrent requests
  if (tokenFetchPromise) {
    return tokenFetchPromise;
  }

  tokenFetchPromise = fetchAuthToken();
  const token = await tokenFetchPromise;
  tokenFetchPromise = null;

  return token;
}

/**
 * Extract claim value by type from user_claims array
 */
function getClaim(claims: EasyAuthClaim[], type: string): string | undefined {
  const claim = claims.find((c) => c.typ === type);
  return claim?.val;
}

async function fetchAuthToken(): Promise<string | null> {
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

    // Extract email from claims (fallback to user_id which is often email)
    const email =
      getClaim(identity.user_claims, CLAIM_TYPES.EMAIL) || identity.user_id;

    // Extract nameidentifier (sub claim) for stable user ID
    const nameId =
      getClaim(identity.user_claims, CLAIM_TYPES.NAME_ID) || identity.user_id;

    // Create a token that matches the x-ms-client-principal format expected by backend
    const principal = {
      userId: nameId,
      userDetails: email,
      identityProvider: identity.provider_name,
      userRoles: ['authenticated'],
    };

    // Base64 encode the principal (same format as x-ms-client-principal header)
    cachedToken = btoa(JSON.stringify(principal));

    // Set token expiry (use expires_on from response, with 5min buffer)
    if (identity.expires_on) {
      const expiryDate = new Date(identity.expires_on);
      // Refresh 5 minutes before actual expiry
      tokenExpiry = new Date(expiryDate.getTime() - 5 * 60 * 1000);
    } else {
      // Default to 1 hour if no expiry provided
      tokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
    }

    console.debug(
      'EasyAuth: Token fetched successfully (provider: %s)',
      identity.provider_name
    );
    return cachedToken;
  } catch (error) {
    console.error('EasyAuth: Failed to fetch token', error);
    return null;
  }
}

/**
 * Clears the cached token. Call this on logout.
 */
export function clearAuthToken(): void {
  cachedToken = null;
  tokenExpiry = null;
  tokenFetchPromise = null;
}

/**
 * Refreshes the token by clearing cache and fetching again.
 */
export async function refreshAuthToken(): Promise<string | null> {
  clearAuthToken();
  return getAuthToken();
}
