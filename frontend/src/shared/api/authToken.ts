/**
 * EasyAuth Token Service
 *
 * Fetches and caches the access token from Azure EasyAuth.
 * Used to forward authentication to the backend API.
 */

interface EasyAuthResponse {
  clientPrincipal: {
    identityProvider: string;
    userId: string;
    userDetails: string;
    userRoles: string[];
  } | null;
}

let cachedToken: string | null = null;
let tokenFetchPromise: Promise<string | null> | null = null;

/**
 * Fetches the client principal from EasyAuth and creates a base64-encoded token
 * that mimics the x-ms-client-principal header format.
 *
 * This token is sent to the backend in the X-MS-CLIENT-PRINCIPAL header
 * so the backend can authenticate the user without going through its own EasyAuth.
 */
export async function getAuthToken(): Promise<string | null> {
  // Return cached token if available
  if (cachedToken) {
    return cachedToken;
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

async function fetchAuthToken(): Promise<string | null> {
  try {
    // Fetch from EasyAuth endpoint on the frontend
    const response = await fetch('/.auth/me', {
      credentials: 'include',
    });

    if (!response.ok) {
      console.debug('EasyAuth: Not authenticated');
      return null;
    }

    const data: EasyAuthResponse = await response.json();

    if (!data.clientPrincipal) {
      console.debug('EasyAuth: No client principal');
      return null;
    }

    // Create a token that matches the x-ms-client-principal format
    const principal = {
      userId: data.clientPrincipal.userId,
      userDetails: data.clientPrincipal.userDetails,
      identityProvider: data.clientPrincipal.identityProvider,
      userRoles: data.clientPrincipal.userRoles,
    };

    // Base64 encode the principal (same format as x-ms-client-principal header)
    cachedToken = btoa(JSON.stringify(principal));

    console.debug('EasyAuth: Token fetched successfully');
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
  tokenFetchPromise = null;
}

/**
 * Refreshes the token by clearing cache and fetching again.
 */
export async function refreshAuthToken(): Promise<string | null> {
  clearAuthToken();
  return getAuthToken();
}
