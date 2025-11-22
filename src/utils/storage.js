// Token storage utility for web
// Uses localStorage for web platform

/**
 * Store access token
 * @param {string} token - Access token to store
 */
export const storeToken = (token) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem('access_token', token);
  }
};

/**
 * Get stored access token
 * @returns {string|null} Access token or null if not found
 */
export const getToken = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem('access_token');
  }
  return null;
};

/**
 * Remove access token
 */
export const removeToken = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.removeItem('access_token');
  }
};

/**
 * Store user data
 * @param {Object} user - User data to store
 */
export const storeUser = (user) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem('user_data', JSON.stringify(user));
  }
};

/**
 * Get stored user data
 * @returns {Object|null} User data or null if not found
 */
export const getUser = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }
  return null;
};

/**
 * Remove user data
 */
export const removeUser = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.removeItem('user_data');
  }
};

/**
 * Clear all auth data
 */
export const clearAuth = () => {
  removeToken();
  removeUser();
};

