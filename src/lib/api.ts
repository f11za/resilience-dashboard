// API utility with graceful fallback to demo data

const API_BASE = '/api';

export async function fetchWithFallback<T>(
  endpoint: string,
  fallbackData: T,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      console.warn(`API call failed: ${endpoint}, using fallback data`);
      return fallbackData;
    }

    return await response.json();
  } catch (error) {
    console.warn(`API call error: ${endpoint}, using fallback data`, error);
    return fallbackData;
  }
}

export async function postWithFallback<T>(
  endpoint: string,
  data: any,
  fallbackResponse: T
): Promise<T> {
  return fetchWithFallback(
    endpoint,
    fallbackResponse,
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  );
}
