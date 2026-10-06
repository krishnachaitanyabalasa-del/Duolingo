import { getFirebaseToken } from '../firebase';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  if (USE_MOCK) {
    return null; // Signals caller to use local mock fallback engine
  }

  try {
    const token = await getFirebaseToken();
    const authHeaders: Record<string, string> = {};
    if (token) {
      authHeaders['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...options?.headers,
      },
      ...options,
    });

    if (!res.ok) {
      console.warn(`[API] ${endpoint} status ${res.status}. Falling back to mock engine.`);
      return null;
    }

    return await res.json();
  } catch (err) {
    console.warn(`[API] Could not connect to FastAPI at ${BASE_URL}${endpoint}. Falling back to mock engine.`, err);
    return null;
  }
}

