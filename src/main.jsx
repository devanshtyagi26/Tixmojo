/**
 * Entry point dispatcher for both client and server rendering
 * 
 * This file determines whether to use client hydration (if server-rendered)
 * or regular client rendering for development mode
 */

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Check if we have server-rendered content
const hasServerData = isBrowser && window.__INITIAL_DATA__;

// In development without server rendering, use createRoot
// In production with SSR, use client.jsx for hydration
if (isBrowser) {
  if (hasServerData) {
    // Server-rendered - use hydration
    import('./client.jsx');
  } else {
    // Client-only rendering for development
    import('./clientDev.jsx');
  }
}

// Export for potential SSR usage
export { default as App } from './App';

// Export for server to check if hydration is supported
export const supportsHydration = true;
