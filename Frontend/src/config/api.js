/**
 * API Configuration
 * Centralized configuration for API endpoints and base URLs
 */

// Get the server URL from environment variables with proper fallback
const getServerUrl = () => {
  const envUrl = import.meta.env.VITE_SERVER_URL;
  
  // In production, use the environment variable or throw an error
  if (import.meta.env.PROD && !envUrl) {
    console.error('CRITICAL: VITE_SERVER_URL is not set in production environment');
    // Return empty string to cause obvious failure rather than silent localhost fallback
    return '';
  }
  
  // In development, use env variable or default to localhost
  return envUrl || 'http://localhost:4000';
};

export const API_BASE_URL = getServerUrl();

// Validate that we have a proper URL in production
if (import.meta.env.PROD && !API_BASE_URL) {
  console.error('API_BASE_URL is not configured. Please set VITE_SERVER_URL environment variable.');
}

// Log current configuration (only in development)
if (import.meta.env.DEV) {
  console.log('API Configuration:', {
    baseUrl: API_BASE_URL,
    environment: import.meta.env.MODE,
  });
}

export default API_BASE_URL;
