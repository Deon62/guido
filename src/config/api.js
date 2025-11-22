// API Configuration
// For web development, use localhost
// Update the production URL when deploying
const getBaseUrl = () => {
  if (__DEV__) {
    return 'http://localhost:8000';
  }
  return 'https://your-production-api.com';
};

export const API_BASE_URL = getBaseUrl();
export const API_VERSION = '/api/v1';

export const getApiUrl = (endpoint) => {
  // Remove leading slash from endpoint if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}${API_VERSION}/${cleanEndpoint}`;
};

