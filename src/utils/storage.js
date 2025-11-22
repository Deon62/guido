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
 * Normalize user data - convert profile_photo to avatar format
 * @param {Object} user - User data from API
 * @returns {Object} Normalized user data
 */
export const normalizeUserData = (user) => {
  if (!user) return user;
  
  const normalized = { ...user };
  
  // Convert profile_photo (relative path) to avatar (full URL object)
  if (user.profile_photo) {
    // Import API_BASE_URL dynamically to avoid circular dependencies
    const { API_BASE_URL } = require('../config/api');
    const fullUrl = user.profile_photo.startsWith('http') 
      ? user.profile_photo 
      : `${API_BASE_URL}/${user.profile_photo}`;
    normalized.avatar = { uri: fullUrl };
  } else if (user.avatar && typeof user.avatar === 'string') {
    // If avatar is already a string URL, convert to object format
    normalized.avatar = { uri: user.avatar };
  }
  
  return normalized;
};

/**
 * Store user data
 * @param {Object} user - User data to store
 */
export const storeUser = (user) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const normalized = normalizeUserData(user);
    localStorage.setItem('user_data', JSON.stringify(normalized));
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

