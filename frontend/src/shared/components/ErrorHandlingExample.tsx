import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useToast } from '@finans/components';
import { useApiError } from '../hooks/useApiError';
import client from '../api/client';

/**
 * Example Component: Error Handling Demonstration
 *
 * This component demonstrates all error handling patterns.
 * NOT meant for production - only for testing/demonstration.
 */
export default function ErrorHandlingExample() {
  const { showSuccess, showError, showInfo, showWarning } = useToast();
  const [testType, setTestType] = useState<string>('');

  // Example 1: useQuery with automatic error handling
  const { data, error, isLoading } = useQuery({
    queryKey: ['test', testType],
    queryFn: async () => {
      if (!testType) return null;
      const response = await client.get(`/test/${testType}`);
      return response.data;
    },
    enabled: !!testType,
  });

  // Auto-show error toast
  useApiError(error);

  // Example 2: useMutation with manual success handling
  const mutation = useMutation({
    mutationFn: async (data: { type: string }) => {
      const response = await client.post('/test', data);
      return response.data;
    },
    onSuccess: () => {
      showSuccess('Test fullført!');
    },
  });

  // Auto-show error toast for mutations
  useApiError(mutation.error);

  // Example 3: Manual try/catch
  const handleManualTest = async (errorCode: number) => {
    try {
      await client.get(`/test/error/${errorCode}`);
      showSuccess('No error!');
    } catch (error) {
      // Error is already transformed to ApiError by interceptor
      // and logged to console. We can just show it:
      showError(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  // Example 4: Throw rendering error to test ErrorBoundary
  const [shouldThrow, setShouldThrow] = useState(false);
  if (shouldThrow) {
    throw new Error('Test rendering error for ErrorBoundary');
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Error Handling Examples</h1>

      <section style={{ marginBottom: '2rem' }}>
        <h2>1. Toast Types</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button onClick={() => showSuccess('Suksess!')}>Success</button>
          <button onClick={() => showError('Feil!')}>Error</button>
          <button onClick={() => showInfo('Informasjon')}>Info</button>
          <button onClick={() => showWarning('Advarsel')}>Warning</button>
        </div>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>2. API Error Codes</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button onClick={() => handleManualTest(400)}>400 - Bad Request</button>
          <button onClick={() => handleManualTest(401)}>401 - Unauthorized</button>
          <button onClick={() => handleManualTest(403)}>403 - Forbidden</button>
          <button onClick={() => handleManualTest(404)}>404 - Not Found</button>
          <button onClick={() => handleManualTest(409)}>409 - Conflict</button>
          <button onClick={() => handleManualTest(500)}>500 - Server Error</button>
        </div>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>3. TanStack Query Error</h2>
        <input
          type="text"
          placeholder="Enter test type"
          value={testType}
          onChange={(e) => setTestType(e.target.value)}
        />
        {isLoading && <p>Loading...</p>}
        {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>4. TanStack Mutation Error</h2>
        <button
          onClick={() => mutation.mutate({ type: 'test' })}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Testing...' : 'Test Mutation'}
        </button>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>5. Error Boundary Test</h2>
        <button
          onClick={() => setShouldThrow(true)}
          style={{ background: 'red', color: 'white' }}
        >
          Throw Rendering Error
        </button>
        <p style={{ fontSize: '0.875rem', color: 'gray' }}>
          This will trigger the ErrorBoundary and show the fallback UI
        </p>
      </section>
    </div>
  );
}
