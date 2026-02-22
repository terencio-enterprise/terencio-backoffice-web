/**
 * Global Application Configuration
 * Logic constants only. Styles are handled in CSS.
 */
export const AppConfig = {
  API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  TIMEOUT: 15000,
  AUTH_HEADER_KEY: 'Authorization',
};
