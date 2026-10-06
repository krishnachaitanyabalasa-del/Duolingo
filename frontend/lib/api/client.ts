import { getFirebaseToken } from '../firebase';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

function isLocalhost(): boolean {
  if (typeof window === 'undefined') return true;
  return (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '0.0.0.0'
  );
}

export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  if (USE_MOCK) {
    return null; // Signals caller to use local mock fallback engine
  }

  // If in production/remote environment (e.g. Firebase Hosting) and API URL points to localhost,
  // skip remote-to-local requests to prevent CORS/mixed-content preflight errors.
  const isTargetLocalhost = BASE_URL.includes('127.0.0.1') || BASE_URL.includes('localhost');
  if (!isLocalhost() && isTargetLocalhost) {
    return null;
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
  } catch {
    return null;
  }
}


