/**
 * Development-only client entry point
 * Used only during development when not using SSR
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import './Style/imports.css';

// Ensure the page is scrolled to top on refresh
if (history.scrollRestoration) {
  history.scrollRestoration = 'manual';
}

// Reset scroll position on page load
window.onload = () => {
  window.scrollTo(0, 0);
};

// Google OAuth client ID
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 
  '737893507438-rfo58r4pjsklna2pbj3t0g4jcn6g4p13.apps.googleusercontent.com';

// Check if we have a valid-looking Google OAuth client ID
const isValidGoogleClientId = googleClientId && 
  googleClientId.includes('.apps.googleusercontent.com') && 
  googleClientId.length > 30;

if (!isValidGoogleClientId) {
  console.warn(
    'Warning: Google OAuth client ID appears to be invalid or missing. ' +
    'Google login functionality may not work correctly.'
  );
}

// Use standard createRoot for development
const root = createRoot(document.getElementById('root'));

// Render the app
console.log('Development mode: Using client-side only rendering');
root.render(
  <StrictMode>
    <HelmetProvider>
      <GoogleOAuthProvider clientId={googleClientId}>
        <App />
      </GoogleOAuthProvider>
    </HelmetProvider>
  </StrictMode>
);