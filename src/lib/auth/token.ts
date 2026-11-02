export const TOKEN_STORAGE_KEY = 'velora_token';
export const ROLE_COOKIE_KEY = 'velora_user_role';
export const TOKEN_COOKIE_KEY = 'velora_auth_token';

/**
 * Retrieves the stored JWT token from localStorage or document.cookie.
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    const local = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (local) return local;
  } catch {
    // localStorage might be blocked in restricted browser modes
  }

  const match = document.cookie.match(new RegExp('(^|; )' + TOKEN_COOKIE_KEY + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

/**
 * Stores the JWT token and user role in localStorage and cookies for client & Next.js middleware access.
 */
export function setAuthToken(token: string, role?: string): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch {
    // Ignore storage quota or access errors
  }

  const maxAge = 60 * 60 * 24 * 7; // 7 days
  document.cookie = `${TOKEN_COOKIE_KEY}=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  if (role) {
    document.cookie = `${ROLE_COOKIE_KEY}=${encodeURIComponent(role)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  }
}

/**
 * Clears stored JWT tokens and role cookies.
 */
export function removeAuthToken(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    // Ignore storage quota or access errors
  }

  document.cookie = `${TOKEN_COOKIE_KEY}=; path=/; max-age=0; SameSite=Lax`;
  document.cookie = `${ROLE_COOKIE_KEY}=; path=/; max-age=0; SameSite=Lax`;
}

/**
 * Reads user role from document.cookie.
 */
export function getCookieRole(): string | null {
  if (typeof window === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|; )' + ROLE_COOKIE_KEY + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}
