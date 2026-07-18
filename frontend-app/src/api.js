/**
 * src/api.js
 * Centralised API helpers for LostFoundPK.
 *
 * Usage:
 *   import { authFetch, getToken, getUser, removeAuth } from './api';
 *
 *   // Public request (no token needed)
 *   const posts = await authFetch('/posts/');
 *
 *   // Authenticated request (token injected automatically)
 *   const res = await authFetch('/posts/', { method: 'POST', body: JSON.stringify(data) });
 */

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ---------------------------------------------------------------------------
// Token / user helpers
// ---------------------------------------------------------------------------

export function getToken() {
  return localStorage.getItem('authToken');
}

export function getUser() {
  try {
    const raw = localStorage.getItem('authUser');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function removeAuth() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('authUser');
}

// ---------------------------------------------------------------------------
// Core fetch wrapper
// ---------------------------------------------------------------------------

/**
 * Wraps `fetch` with:
 *   - automatic base-URL prefixing
 *   - automatic `Authorization: Bearer` header when a token is present
 *   - automatic `Content-Type: application/json` for object bodies
 *
 * Returns the parsed JSON body on success, or throws an Error whose
 * `.message` is the detail string from the FastAPI error response.
 *
 * @param {string} path   – e.g. '/posts/' or '/auth/me'
 * @param {RequestInit} options  – standard fetch options
 * @returns {Promise<any>}
 */
export async function authFetch(path, options = {}) {
  const token = getToken();

  const headers = {
    ...(options.body && typeof options.body === 'string'
      ? { 'Content-Type': 'application/json' }
      : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  // 204 No Content — resolve with null
  if (res.status === 204) return null;

  const data = await res.json();

  if (!res.ok) {
    const msg =
      typeof data.detail === 'string'
        ? data.detail
        : Array.isArray(data.detail)
        ? data.detail.map((d) => d.msg).join(', ')
        : `Request failed: ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }

  return data;
}
