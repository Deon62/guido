import { getApiUrl, API_BASE_URL } from '../config/api';

/**
 * Create a fetch request with timeout
 */
const fetchWithTimeout = (url, options, timeout = 15000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout. Please check your connection and try again.')), timeout)
    ),
  ]);
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.email - User email
 * @param {string} userData.password - User password
 * @param {string} userData.confirmPassword - Password confirmation
 * @returns {Promise<Object>} Response data from the API
 */
export const register = async (userData) => {
  const url = getApiUrl('auth/register');
  
  // Prepare request body - backend expects snake_case
  const requestBody = {
    email: userData.email,
    password: userData.password,
    confirm_password: userData.confirmPassword, // Backend expects snake_case
  };
  
  console.log('Register request:', { url, body: { ...requestBody, password: '***', confirmPassword: '***' } });

  try {
    const response = await fetchWithTimeout(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      },
      15000 // 15 second timeout
    );
    
    console.log('Response status:', response.status);

    // Check if response has content
    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
        console.log('Response data:', data);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Invalid response from server. Please try again.');
      }
    } else {
      // If not JSON, get text response
      const text = await response.text();
      data = { message: text || 'Registration completed' };
      console.log('Response text:', text);
    }

    if (!response.ok) {
      console.error('API error response:', { status: response.status, data });
      
      // Handle 422 validation errors specifically
      if (response.status === 422) {
        // 422 usually contains detailed validation errors
        // Backend might return errors in different formats:
        // - { detail: "error message" }
        // - { errors: { field: "error" } }
        // - { message: "error", errors: {...} }
        const validationError = new Error(data.message || data.detail || 'Validation failed');
        validationError.status = 422;
        validationError.errors = data.errors || (data.detail && typeof data.detail === 'object' ? data.detail : {}) || {};
        validationError.isValidationError = true;
        console.error('Validation errors:', validationError.errors);
        throw validationError;
      }
      
      // Handle other API error responses
      const errorMessage = data.message || data.error || data.detail || `Registration failed (${response.status})`;
      const apiError = new Error(errorMessage);
      apiError.status = response.status;
      throw apiError;
    }

    return data;
  } catch (error) {
    // Handle network errors or other exceptions
    if (error.message) {
      if (error.message.includes('timeout')) {
        throw new Error(
          `Cannot reach backend at ${API_BASE_URL}. Please verify the backend server is running.`
        );
      }
      if (error.message.includes('Network request failed') || error.message.includes('Failed to fetch')) {
        throw new Error(
          `Network error. Cannot connect to ${API_BASE_URL}. Please check your connection and ensure the backend is running.`
        );
      }
      throw error;
    }
    throw new Error('Network error. Please check your connection and try again.');
  }
};

/**
 * Login a user
 * @param {Object} credentials - User login credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @returns {Promise<Object>} Response data with access_token and user info
 */
export const login = async (credentials) => {
  const url = getApiUrl('auth/login');
  
  const requestBody = {
    email: credentials.email,
    password: credentials.password,
  };
  
  console.log('Login request:', { url, body: { ...requestBody, password: '***' } });

  try {
    const response = await fetchWithTimeout(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      },
      15000
    );
    
    console.log('Response status:', response.status);

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
        console.log('Response data:', data);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Invalid response from server. Please try again.');
      }
    } else {
      const text = await response.text();
      data = { message: text || 'Login completed' };
      console.log('Response text:', text);
    }

    if (!response.ok) {
      console.error('API error response:', { status: response.status, data });
      
      if (response.status === 422) {
        const validationError = new Error(data.message || data.detail || 'Validation failed');
        validationError.status = 422;
        validationError.errors = data.errors || (data.detail && typeof data.detail === 'object' ? data.detail : {}) || {};
        validationError.isValidationError = true;
        throw validationError;
      }
      
      const errorMessage = data.message || data.error || data.detail || `Login failed (${response.status})`;
      const apiError = new Error(errorMessage);
      apiError.status = response.status;
      throw apiError;
    }

    return data;
  } catch (error) {
    if (error.message) {
      if (error.message.includes('timeout')) {
        throw new Error(
          `Cannot reach backend at ${API_BASE_URL}. Please verify the backend server is running.`
        );
      }
      if (error.message.includes('Network request failed') || error.message.includes('Failed to fetch')) {
        throw new Error(
          `Network error. Cannot connect to ${API_BASE_URL}. Please check your connection and ensure the backend is running.`
        );
      }
      throw error;
    }
    throw new Error('Network error. Please check your connection and try again.');
  }
};

/**
 * Get current user data
 * @param {string} token - Access token
 * @returns {Promise<Object>} User data
 */
export const getCurrentUser = async (token) => {
  const url = getApiUrl('profile/me');

  try {
    const response = await fetchWithTimeout(
      url,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      },
      15000
    );
    
    console.log('Get current user response status:', response.status);

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
        console.log('User data:', data);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Invalid response from server. Please try again.');
      }
    } else {
      const text = await response.text();
      data = { message: text };
      console.log('Response text:', text);
    }

    if (!response.ok) {
      const errorMessage = data.message || data.error || data.detail || `Failed to get user data (${response.status})`;
      const apiError = new Error(errorMessage);
      apiError.status = response.status;
      throw apiError;
    }

    return data;
  } catch (error) {
    if (error.message) {
      if (error.message.includes('timeout')) {
        throw new Error(
          `Cannot reach backend at ${API_BASE_URL}. Please verify the backend server is running.`
        );
      }
      if (error.message.includes('Network request failed') || error.message.includes('Failed to fetch')) {
        throw new Error(
          `Network error. Cannot connect to ${API_BASE_URL}. Please check your connection and ensure the backend is running.`
        );
      }
      throw error;
    }
    throw new Error('Network error. Please check your connection and try again.');
  }
};

/**
 * Logout user
 * @param {string} token - Access token
 * @returns {Promise<Object>} Logout response
 */
export const logout = async (token) => {
  const url = getApiUrl('auth/logout');

  try {
    const response = await fetchWithTimeout(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      },
      15000
    );
    
    console.log('Logout response status:', response.status);

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
        console.log('Logout response data:', data);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        // Even if parsing fails, logout should succeed
        data = { message: 'Logged out successfully' };
      }
    } else {
      const text = await response.text();
      data = { message: text || 'Logged out successfully' };
    }

    // Logout is successful even if response is not ok (some backends return 200, others might return different codes)
    // The important thing is we clear local storage
    return data;
  } catch (error) {
    console.error('Logout error:', error);
    // Even if API call fails, we should still clear local storage
    // Return success so the app can proceed with logout
    return { message: 'Logged out locally' };
  }
};

/**
 * Update user profile
 * @param {string} token - Access token
 * @param {Object} profileData - Profile data to update
 * @param {string} profileData.nickname - User's nickname
 * @param {string} profileData.username - Unique username (3-50 characters, will be prefixed with @)
 * @param {string} profileData.email - Email address (must be unique)
 * @param {string} profileData.city - City name
 * @returns {Promise<Object>} Updated user data
 */
export const updateProfile = async (token, profileData) => {
  const url = getApiUrl('profile/update');
  
  // Ensure username starts with @
  let username = profileData.username || '';
  if (username && !username.startsWith('@')) {
    username = '@' + username;
  }
  
  const requestBody = {
    nickname: profileData.nickname,
    username: username,
    email: profileData.email,
    city: profileData.city,
  };
  
  console.log('Update profile request:', { url, body: { ...requestBody } });

  try {
    const response = await fetchWithTimeout(
      url,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      },
      15000
    );
    
    console.log('Update profile response status:', response.status);

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
        console.log('Update profile response data:', data);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Invalid response from server. Please try again.');
      }
    } else {
      const text = await response.text();
      data = { message: text || 'Profile updated successfully' };
      console.log('Response text:', text);
    }

    if (!response.ok) {
      console.error('API error response:', { status: response.status, data });
      
      if (response.status === 422) {
        const validationError = new Error(data.message || data.detail || 'Validation failed');
        validationError.status = 422;
        validationError.errors = data.errors || (data.detail && typeof data.detail === 'object' ? data.detail : {}) || {};
        validationError.isValidationError = true;
        console.error('Validation errors:', validationError.errors);
        throw validationError;
      }
      
      const errorMessage = data.message || data.error || data.detail || `Profile update failed (${response.status})`;
      const apiError = new Error(errorMessage);
      apiError.status = response.status;
      throw apiError;
    }

    return data;
  } catch (error) {
    if (error.message) {
      if (error.message.includes('timeout')) {
        throw new Error(
          `Cannot reach backend at ${API_BASE_URL}. Please verify the backend server is running.`
        );
      }
      if (error.message.includes('Network request failed') || error.message.includes('Failed to fetch')) {
        throw new Error(
          `Network error. Cannot connect to ${API_BASE_URL}. Please check your connection and ensure the backend is running.`
        );
      }
      throw error;
    }
    throw new Error('Network error. Please check your connection and try again.');
  }
};

