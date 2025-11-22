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

  console.log('Register request:', { url, body: { ...requestBody, password: '***', confirm_password: '***' } });

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
  const url = getApiUrl('profile/me'); // Updated endpoint

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
 * @returns {Promise<Object>} Response data
 */
export const logout = async (token) => {
  const url = getApiUrl('auth/logout');
  console.log('Logout request:', { url });

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
        throw new Error('Invalid response from server. Please try again.');
      }
    } else {
      const text = await response.text();
      data = { message: text || 'Logout completed' };
      console.log('Logout response text:', text);
    }

    if (!response.ok) {
      console.error('Logout API error response:', { status: response.status, data });
      const errorMessage = data.message || data.error || data.detail || `Logout failed (${response.status})`;
      const apiError = new Error(errorMessage);
      apiError.status = response.status;
      throw apiError;
    }

    return data;
  } catch (error) {
    console.error('Logout API error:', error);
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
 * Update user profile
 * @param {string} token - Access token
 * @param {Object} profileData - Profile data to update
 * @param {string} profileData.nickname - User's nickname
 * @param {string} profileData.username - Unique username (without @ prefix)
 * @param {string} profileData.email - Email address
 * @param {string} profileData.city - City name
 * @returns {Promise<Object>} Updated user data
 */
export const updateProfile = async (token, profileData) => {
  const url = getApiUrl('profile/update');
  
  // Ensure username has '@' prefix for API
  const usernameToSend = profileData.username.startsWith('@') 
    ? profileData.username 
    : `@${profileData.username}`;

  const requestBody = {
    nickname: profileData.nickname,
    username: usernameToSend,
    email: profileData.email,
    city: profileData.city,
  };

  console.log('Update profile request:', { url, body: requestBody });

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
      data = { message: text || 'Profile update completed' };
      console.log('Update profile response text:', text);
    }

    if (!response.ok) {
      console.error('Update profile API error response:', { status: response.status, data });

      if (response.status === 422) {
        const validationError = new Error(data.message || data.detail || 'Validation failed');
        validationError.status = 422;
        validationError.errors = data.errors || (data.detail && typeof data.detail === 'object' ? data.detail : {}) || {};
        validationError.isValidationError = true;
        throw validationError;
      }

      const errorMessage = data.message || data.error || data.detail || `Profile update failed (${response.status})`;
      const apiError = new Error(errorMessage);
      apiError.status = response.status;
      throw apiError;
    }

    return data;
  } catch (error) {
    console.error('Update profile API error:', error);
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
 * Upload profile photo
 * @param {string} token - Access token
 * @param {Object} photoFile - Photo file object (from ImagePicker)
 * @param {string} photoFile.uri - Local file URI
 * @param {string} photoFile.type - MIME type (e.g., 'image/jpeg')
 * @param {string} photoFile.name - File name (optional)
 * @returns {Promise<Object>} Response data with uploaded photo URL
 */
export const uploadProfilePhoto = async (token, photoFile) => {
  const url = getApiUrl('profile/upload-photo');

  // Create FormData for file upload
  const formData = new FormData();
  
  // Determine file name and type
  const fileName = photoFile.name || `profile_${Date.now()}.jpg`;
  const fileType = photoFile.type || 'image/jpeg';
  
  // For web, we need to handle file differently
  if (typeof window !== 'undefined' && photoFile.uri) {
    // For web, convert URI to Blob/File
    try {
      let blob;
      
      // Handle different URI types
      if (photoFile.uri.startsWith('data:')) {
        // Data URL (data:image/jpeg;base64,...)
        const response = await fetch(photoFile.uri);
        blob = await response.blob();
      } else if (photoFile.uri.startsWith('blob:')) {
        // Blob URL
        const response = await fetch(photoFile.uri);
        blob = await response.blob();
      } else if (photoFile.uri.startsWith('file://') || photoFile.uri.startsWith('http://') || photoFile.uri.startsWith('https://')) {
        // File URL or HTTP URL
        const response = await fetch(photoFile.uri);
        blob = await response.blob();
      } else {
        // Try to fetch as-is
        const response = await fetch(photoFile.uri);
        blob = await response.blob();
      }
      
      // Create a File object from the blob (better for FormData on web)
      const file = new File([blob], fileName, { type: fileType });
      formData.append('file', file, fileName); // Backend expects field name "file"
      
      console.log('FormData prepared for web:', { fileName, fileType, fileSize: blob.size });
    } catch (error) {
      console.error('Error converting image to blob:', error);
      // Fallback: try to create a File from the URI directly
      try {
        const response = await fetch(photoFile.uri);
        const blob = await response.blob();
        const file = new File([blob], fileName, { type: fileType });
        formData.append('file', file, fileName); // Backend expects field name "file"
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        throw new Error('Failed to prepare image for upload. Please try again.');
      }
    }
  } else {
    // For React Native, use the file object directly
    formData.append('file', { // Backend expects field name "file"
      uri: photoFile.uri,
      type: fileType,
      name: fileName,
    });
  }

  console.log('Upload profile photo request:', { url, fileName, fileType });

  try {
    const response = await fetchWithTimeout(
      url,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type for FormData - browser will set it with boundary
        },
        body: formData,
      },
      30000 // 30 second timeout for file uploads
    );

    console.log('Upload profile photo response status:', response.status);

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
        console.log('Upload profile photo response data:', JSON.stringify(data, null, 2));
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Invalid response from server. Please try again.');
      }
    } else {
      const text = await response.text();
      data = { message: text || 'Photo uploaded successfully' };
      console.log('Upload profile photo response text:', text);
    }

    if (!response.ok) {
      console.error('Upload profile photo API error response:', { status: response.status, data });

      if (response.status === 422) {
        // Handle validation errors - detail might be an array or object
        let errorMessage = 'Validation failed';
        let errorDetails = {};
        
        if (data.detail) {
          if (Array.isArray(data.detail)) {
            // FastAPI validation errors are often arrays
            errorMessage = data.detail.map(err => {
              if (typeof err === 'string') return err;
              if (err.msg) return err.msg;
              if (err.message) return err.message;
              if (err.loc && err.msg) return `${err.loc.join('.')}: ${err.msg}`;
              return JSON.stringify(err);
            }).join(', ');
            errorDetails = data.detail;
          } else if (typeof data.detail === 'string') {
            errorMessage = data.detail;
          } else if (typeof data.detail === 'object') {
            errorDetails = data.detail;
            errorMessage = data.message || data.detail.message || 'Validation failed';
          }
        } else if (data.message) {
          errorMessage = data.message;
        }
        
        const validationError = new Error(errorMessage);
        validationError.status = 422;
        validationError.errors = data.errors || errorDetails || {};
        validationError.isValidationError = true;
        console.error('Validation errors:', validationError.errors);
        throw validationError;
      }

      const errorMessage = data.message || data.error || data.detail || `Photo upload failed (${response.status})`;
      const apiError = new Error(errorMessage);
      apiError.status = response.status;
      throw apiError;
    }

    return data;
  } catch (error) {
    console.error('Upload profile photo API error:', error);
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
 * Create a text feed post
 * @param {string} token - Access token
 * @param {Object} postData - Post data
 * @param {string|number} postData.category_id - Category ID (required)
 * @param {string} postData.description - Post description (required)
 * @param {string} postData.location - Optional location
 * @returns {Promise<Object>} Response data with created post
 */
export const createTextFeedPost = async (token, postData) => {
  const url = getApiUrl('feed/post/text');

  const requestBody = {
    category_id: postData.category_id,
    description: postData.description,
  };

  // Add location only if provided
  if (postData.location && postData.location.trim()) {
    requestBody.location = postData.location.trim();
  }

  console.log('Create text feed post request:', { url, body: requestBody });

  try {
    const response = await fetchWithTimeout(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      },
      15000
    );

    console.log('Create text feed post response status:', response.status);

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
        console.log('Create text feed post response data:', data);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Invalid response from server. Please try again.');
      }
    } else {
      const text = await response.text();
      data = { message: text || 'Post created successfully' };
      console.log('Create text feed post response text:', text);
    }

    if (!response.ok) {
      console.error('Create text feed post API error response:', { status: response.status, data });

      if (response.status === 422) {
        // Handle validation errors
        let errorMessage = 'Validation failed';
        let errorDetails = {};
        
        if (data.detail) {
          if (Array.isArray(data.detail)) {
            errorMessage = data.detail.map(err => {
              if (typeof err === 'string') return err;
              if (err.msg) return err.msg;
              if (err.message) return err.message;
              if (err.loc && err.msg) return `${err.loc.join('.')}: ${err.msg}`;
              return JSON.stringify(err);
            }).join(', ');
            errorDetails = data.detail;
          } else if (typeof data.detail === 'string') {
            errorMessage = data.detail;
          } else if (typeof data.detail === 'object') {
            errorDetails = data.detail;
            errorMessage = data.message || data.detail.message || 'Validation failed';
          }
        } else if (data.message) {
          errorMessage = data.message;
        }
        
        const validationError = new Error(errorMessage);
        validationError.status = 422;
        validationError.errors = data.errors || errorDetails || {};
        validationError.isValidationError = true;
        throw validationError;
      }

      const errorMessage = data.message || data.error || data.detail || `Failed to create post (${response.status})`;
      const apiError = new Error(errorMessage);
      apiError.status = response.status;
      throw apiError;
    }

    return data;
  } catch (error) {
    console.error('Create text feed post API error:', error);
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
 * Create an image feed post
 * @param {string} token - Access token
 * @param {Object} postData - Post data
 * @param {Array<Object>} postData.files - Array of image file objects (1-5 images)
 * @param {string|number} postData.category_id - Optional category ID
 * @param {string} postData.description - Optional post description
 * @param {string} postData.location - Optional location
 * @returns {Promise<Object>} Response data with created post
 */
export const createImageFeedPost = async (token, postData) => {
  const url = getApiUrl('feed/post/image');

  // Create FormData for file upload
  const formData = new FormData();

  // Add image files
  if (postData.files && postData.files.length > 0) {
    for (let i = 0; i < postData.files.length; i++) {
      const file = postData.files[i];
      const fileName = file.name || `image_${i}_${Date.now()}.jpg`;
      const fileType = file.type || 'image/jpeg';
      
      // For web, convert URI to Blob/File
      if (typeof window !== 'undefined' && file.uri) {
        try {
          let blob;
          
          // Handle different URI types
          if (file.uri.startsWith('data:')) {
            const response = await fetch(file.uri);
            blob = await response.blob();
          } else if (file.uri.startsWith('blob:')) {
            const response = await fetch(file.uri);
            blob = await response.blob();
          } else if (file.uri.startsWith('file://') || file.uri.startsWith('http://') || file.uri.startsWith('https://')) {
            const response = await fetch(file.uri);
            blob = await response.blob();
          } else {
            const response = await fetch(file.uri);
            blob = await response.blob();
          }
          
          // Create a File object from the blob
          const fileObj = new File([blob], fileName, { type: fileType });
          formData.append('files', fileObj, fileName);
        } catch (error) {
          console.error('Error converting image to blob:', error);
          // Fallback: use the file object directly
          formData.append('files', {
            uri: file.uri,
            type: fileType,
            name: fileName,
          });
        }
      } else {
        // For React Native, use the file object directly
        formData.append('files', {
          uri: file.uri,
          type: fileType,
          name: fileName,
        });
      }
    }
  }

  // Add optional fields
  if (postData.category_id) {
    formData.append('category_id', postData.category_id);
  }
  if (postData.description && postData.description.trim()) {
    formData.append('description', postData.description.trim());
  }
  if (postData.location && postData.location.trim()) {
    formData.append('location', postData.location.trim());
  }

  console.log('Create image feed post request:', { 
    url, 
    fileCount: postData.files?.length || 0,
    hasCategory: !!postData.category_id,
    hasDescription: !!postData.description,
    hasLocation: !!postData.location
  });

  try {
    const response = await fetchWithTimeout(
      url,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type for FormData - browser will set it with boundary
        },
        body: formData,
      },
      30000 // 30 second timeout for file uploads
    );

    console.log('Create image feed post response status:', response.status);

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
        console.log('Create image feed post response data:', data);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Invalid response from server. Please try again.');
      }
    } else {
      const text = await response.text();
      data = { message: text || 'Post created successfully' };
      console.log('Create image feed post response text:', text);
    }

    if (!response.ok) {
      console.error('Create image feed post API error response:', { status: response.status, data });

      if (response.status === 422) {
        // Handle validation errors
        let errorMessage = 'Validation failed';
        let errorDetails = {};
        
        if (data.detail) {
          if (Array.isArray(data.detail)) {
            errorMessage = data.detail.map(err => {
              if (typeof err === 'string') return err;
              if (err.msg) return err.msg;
              if (err.message) return err.message;
              if (err.loc && err.msg) return `${err.loc.join('.')}: ${err.msg}`;
              return JSON.stringify(err);
            }).join(', ');
            errorDetails = data.detail;
          } else if (typeof data.detail === 'string') {
            errorMessage = data.detail;
          } else if (typeof data.detail === 'object') {
            errorDetails = data.detail;
            errorMessage = data.message || data.detail.message || 'Validation failed';
          }
        } else if (data.message) {
          errorMessage = data.message;
        }
        
        const validationError = new Error(errorMessage);
        validationError.status = 422;
        validationError.errors = data.errors || errorDetails || {};
        validationError.isValidationError = true;
        throw validationError;
      }

      const errorMessage = data.message || data.error || data.detail || `Failed to create post (${response.status})`;
      const apiError = new Error(errorMessage);
      apiError.status = response.status;
      throw apiError;
    }

    return data;
  } catch (error) {
    console.error('Create image feed post API error:', error);
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
 * Get feed posts
 * @param {string} token - Access token
 * @param {number} skip - Number of posts to skip (for pagination)
 * @param {number} limit - Maximum number of posts to return
 * @returns {Promise<Array>} Array of feed posts
 */
export const getFeedPosts = async (token, skip = 0, limit = 20) => {
  const url = `${getApiUrl('feed/posts')}?skip=${skip}&limit=${limit}`;

  console.log('Get feed posts request:', { url, skip, limit });

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

    console.log('Get feed posts response status:', response.status);

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : [];
        console.log('Get feed posts response data:', data);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Invalid response from server. Please try again.');
      }
    } else {
      const text = await response.text();
      data = [];
      console.log('Get feed posts response text:', text);
    }

    if (!response.ok) {
      const errorMessage = data.message || data.error || data.detail || `Failed to get feed posts (${response.status})`;
      const apiError = new Error(errorMessage);
      apiError.status = response.status;
      throw apiError;
    }

    // Return array of posts (API returns array directly)
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Get feed posts API error:', error);
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
 * Add a post to wishlist
 * @param {string} token - Access token
 * @param {number|string} postId - Post ID to add to wishlist
 * @returns {Promise<Object>} Response data
 */
export const addToWishlist = async (token, postId) => {
  const url = getApiUrl('wishlist/add');

  const requestBody = {
    post_id: typeof postId === 'string' ? parseInt(postId, 10) : postId,
  };

  console.log('Add to wishlist request:', { url, body: requestBody });

  try {
    const response = await fetchWithTimeout(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      },
      15000
    );

    console.log('Add to wishlist response status:', response.status);

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
        console.log('Add to wishlist response data:', data);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Invalid response from server. Please try again.');
      }
    } else {
      const text = await response.text();
      data = { message: text || 'Post added to wishlist' };
      console.log('Add to wishlist response text:', text);
    }

    if (!response.ok) {
      console.error('Add to wishlist API error response:', { status: response.status, data });

      if (response.status === 422) {
        const validationError = new Error(data.message || data.detail || 'Validation failed');
        validationError.status = 422;
        validationError.errors = data.errors || (data.detail && typeof data.detail === 'object' ? data.detail : {}) || {};
        validationError.isValidationError = true;
        console.error('Validation errors:', validationError.errors);
        throw validationError;
      }

      const errorMessage = data.message || data.error || data.detail || `Failed to add to wishlist (${response.status})`;
      const apiError = new Error(errorMessage);
      apiError.status = response.status;
      throw apiError;
    }

    return data;
  } catch (error) {
    console.error('Add to wishlist API error:', error);
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
 * Get user's wishlist posts
 * @param {string} token - Access token
 * @returns {Promise<Array>} Array of wishlist posts
 */
export const getMyWishlist = async (token) => {
  const url = getApiUrl('wishlist/my');

  console.log('Get wishlist request:', { url });

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

    console.log('Get wishlist response status:', response.status);

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : [];
        console.log('Get wishlist response data:', data);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Invalid response from server. Please try again.');
      }
    } else {
      const text = await response.text();
      data = [];
      console.log('Get wishlist response text:', text);
    }

    if (!response.ok) {
      const errorMessage = data.message || data.error || data.detail || `Failed to get wishlist (${response.status})`;
      const apiError = new Error(errorMessage);
      apiError.status = response.status;
      throw apiError;
    }

    // Return array of posts (API might return array directly or wrapped in an object)
    if (Array.isArray(data)) {
      return data;
    } else if (data.posts && Array.isArray(data.posts)) {
      return data.posts;
    } else if (data.items && Array.isArray(data.items)) {
      return data.items;
    }
    return [];
  } catch (error) {
    console.error('Get wishlist API error:', error);
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
