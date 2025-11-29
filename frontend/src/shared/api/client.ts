import axios, { AxiosError } from 'axios';

/**
 * Axios client with error handling interceptors
 *
 * Configured for EasyAuth and standard error responses from backend.
 */

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  withCredentials: true, // Include cookies for EasyAuth
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

// Request interceptor - add auth headers if needed
client.interceptors.request.use(
  (config) => {
    // Future: Add custom headers here if needed
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

    // Handle 401 - Unauthorized (redirect to login)
    if (error.response?.status === 401) {
      console.warn('Unauthorized - redirecting to login');
      // Show message before redirect
      // Note: Toast will be shown by the component that catches this error
      // Delay redirect to allow user to see the message
      setTimeout(() => {
        window.location.href = '/.auth/login/google';
      }, 1500);
    }

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
