import axios, { AxiosError } from 'axios';
import { getAccessToken, getClientPrincipal, isDemoSession } from './authToken';

/**
 * Axios client with error handling interceptors
 *
 * Configured for EasyAuth token forwarding and standard error responses from backend.
 * In production, fetches token from /.auth/me and forwards to backend.
 */

const isDevelopment = import.meta.env.VITE_APP_ENV === 'development';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  withCredentials: true,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Standard error response format from backend
 */
interface ApiErrorResponse {
  error: {
    message: string;
    code: string;
    details?: unknown;
  };
  success: false;
}

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Extract user-friendly error message from API error
 */
function getErrorMessage(error: AxiosError<ApiErrorResponse>): string {
  // Use backend error message if available
  if (error.response?.data?.error?.message) {
    return error.response.data.error.message;
  }

  // Fallback messages in Norwegian
  const status = error.response?.status;
  switch (status) {
    case 400:
      return 'Ugyldig forespørsel. Vennligst sjekk inndataene dine.';
    case 401:
      return 'Du må logge inn for å få tilgang til denne ressursen.';
    case 403:
      return 'Du har ikke tilgang til denne ressursen.';
    case 404:
      return 'Ressursen ble ikke funnet.';
    case 409:
      return 'Ressursen finnes allerede.';
    case 500:
      return 'En serverfeil oppstod. Vennligst prøv igjen senere.';
    case 503:
      return 'Tjenesten er midlertidig utilgjengelig. Vennligst prøv igjen senere.';
    default:
      if (error.request && !error.response) {
        return 'Kunne ikke nå serveren. Sjekk internettforbindelsen din.';
      }
      return 'En uventet feil oppstod. Vennligst prøv igjen.';
  }
}

// Request interceptor - add auth headers
client.interceptors.request.use(
  async (config) => {
    // Attach auth token in two cases:
    // 1. Demo session (works in both dev and prod)
    // 2. Production mode (EasyAuth tokens)
    // In dev mode without demo session, backend injects dev user
    const hasDemoSession = isDemoSession();
    if (hasDemoSession || !isDevelopment) {
      const accessToken = await getAccessToken();
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
        console.debug('Auth: Token attached', {
          type: hasDemoSession ? 'demo' : 'oauth',
          tokenPrefix: accessToken.substring(0, 20) + '...',
          url: config.url
        });
      } else if (!isDevelopment) {
        // Only warn in production (dev mode without demo is expected)
        console.warn('Auth: No access token available for request', { url: config.url });
      }

      // Also send client principal for backward compatibility (EasyAuth only)
      if (!hasDemoSession) {
        const clientPrincipal = await getClientPrincipal();
        if (clientPrincipal) {
          config.headers['X-MS-CLIENT-PRINCIPAL'] = clientPrincipal;
        }
      }
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
client.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    // Log error to console for debugging
    console.error('API Error:', {
      status: error.response?.status,
      code: error.response?.data?.error?.code,
      message: error.response?.data?.error?.message,
      url: error.config?.url,
    });

    // 401 is handled by AuthContext - it sets user to null
    // Components/pages decide whether to redirect or show login UI

    // Transform error to custom ApiError for better handling
    const apiError = new ApiError(
      getErrorMessage(error),
      error.response?.status || 500,
      error.response?.data?.error?.code || 'UNKNOWN_ERROR',
      error.response?.data?.error?.details
    );

    return Promise.reject(apiError);
  }
);

export default client;
