import { useState, useCallback } from 'react';

/**
 * Reusable hook for async API calls.
 * Manages loading, error, and data states automatically.
 */
export function useApi<T, A extends any[]>(
  apiFunction: (...args: A) => Promise<T>
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (...args: A) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Operation failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  return { data, loading, error, execute, setData };
}
