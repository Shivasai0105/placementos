import { useAuth } from '../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL || '';

export const useApi = () => {
  const { token, logout } = useAuth();

  const request = async (path, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    let res;
    try {
      res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers,
      });
    } catch (networkErr) {
      // Network failure (server down, no internet, DNS error, etc.)
      throw new Error('Cannot reach the server. Please check your connection.');
    }

    if (res.status === 401) {
      logout();
      throw new Error('Session expired. Please log in again.');
    }

    // Guard against HTML error pages (Render, Nginx, CDN, etc.)
    // that would cause a cryptic JSON parse crash.
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const text = await res.text();
      console.error(`Non-JSON response (${res.status}) from ${path}:`, text.slice(0, 200));
      throw new Error(
        res.ok
          ? 'Unexpected server response. Please try again.'
          : `Server error (${res.status}). Please try again later.`
      );
    }

    let data;
    try {
      data = await res.json();
    } catch {
      // Empty body or truncated response (e.g. Render cold-start / crash)
      console.error(`Empty/invalid JSON body (${res.status}) from ${path}`);
      throw new Error(
        res.ok
          ? 'Server returned an empty response. Please try again.'
          : `Server error (${res.status}). The server may be waking up — wait a few seconds and retry.`
      );
    }
    if (!res.ok) {
      throw new Error(data.message || 'Something went wrong.');
    }
    return data;
  };

  return { request };
};
