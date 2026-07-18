// src/utils/localStorage.js
// Safe wrappers around localStorage that gracefully handle SecurityError or unavailable window.

/**
 * Get an item from localStorage.
 * Returns null if the operation fails (e.g., access denied, window undefined).
 */
export function getItem(key) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    return window.localStorage.getItem(key);
  } catch (e) {
    console.warn('localStorage getItem failed:', e);
    return null;
  }
}

/**
 * Set an item in localStorage.
 * Silently ignores errors.
 */
export function setItem(key, value) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.setItem(key, value);
  } catch (e) {
    console.warn('localStorage setItem failed:', e);
  }
}

/**
 * Remove an item from localStorage.
 */
export function removeItem(key) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.removeItem(key);
  } catch (e) {
    console.warn('localStorage removeItem failed:', e);
  }
}
