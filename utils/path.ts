/**
 * Get the base URL from Vite's environment
 * In production with GitHub Pages, this will be '/urban-survival-simulation/'
 * In development, this will be '/'
 */
export const BASE_URL = import.meta.env.BASE_URL || '/';

/**
 * Helper function to get resource path with base URL
 * @param path - Resource path (should start with '/')
 * @returns Full path with base URL
 */
export function getResourcePath(path: string): string {
  // Ensure path starts with '/'
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  // Remove leading slash from base URL if it exists, then add path
  const base = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
  return `${base}${normalizedPath}`;
}
