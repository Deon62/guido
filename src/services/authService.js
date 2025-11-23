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

/**
 * Get communities list
 * @param {string} token - Access token
 * @param {number} skip - Number of items to skip (default: 0)
 * @param {number} limit - Number of items to return (default: 50)
 * @returns {Promise<Array>} Array of communities
 */
export const getCommunities = async (token, skip = 0, limit = 50) => {
  const url = getApiUrl(`communities?skip=${skip}&limit=${limit}`);

  console.log('Get communities request:', { url, skip, limit });

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

    console.log('Get communities response status:', response.status);

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
      console.log('Get communities response data:', data);
    } else {
      const text = await response.text();
      data = [];
      console.log('Get communities response text:', text);
    }

    if (!response.ok) {
      const errorMessage = data.message || data.error || data.detail || `Failed to get communities (${response.status})`;
      const apiError = new Error(errorMessage);
      apiError.status = response.status;
      throw apiError;
    }

    // Transform API response to match UI format
    if (Array.isArray(data)) {
      return data.map(community => {
        // Convert profile_picture to full URL
        let profilePictureUrl = null;
        if (community.profile_picture) {
          if (community.profile_picture.startsWith('http')) {
            profilePictureUrl = community.profile_picture;
          } else {
            // Remove leading slash if present to avoid double slashes
            let cleanPath = community.profile_picture.startsWith('/') 
              ? community.profile_picture.slice(1) 
              : community.profile_picture;
            
            // Add 'uploads/' prefix if not already present (backend serves from uploads directory)
            if (!cleanPath.startsWith('uploads/')) {
              cleanPath = `uploads/${cleanPath}`;
            }
            
            profilePictureUrl = `${API_BASE_URL}/${cleanPath}`;
          }
          console.log('Community profile picture URL:', {
            original: community.profile_picture,
            fullUrl: profilePictureUrl
          });
        }
        
        return {
          id: community.id,
          name: community.name,
          description: community.description || '',
          profile_picture: profilePictureUrl,
          created_by: community.created_by,
          is_admin_created: community.is_admin_created || false,
          created_at: community.created_at,
          updated_at: community.updated_at,
          creator_name: community.creator_name,
          creator_username: community.creator_username,
          members_count: community.members_count || 0,
          posts_count: community.posts_count || 0,
          is_member: community.is_member || false,
          // UI fields
          icon: 'people',
          members: community.members_count || 0,
          posts: community.posts_count || 0,
        };
      });
    }
    return [];
  } catch (error) {
    console.error('Get communities API error:', error);
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
 * Toggle like on a post
 * @param {string} token - Access token
 * @param {string|number} postId - Post ID
 * @returns {Promise<Object>} Response data
 */
export const toggleLikePost = async (token, postId) => {
  const url = getApiUrl(`likes/post/${postId}`);

  console.log('Toggle like post request:', { url, postId });

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

    console.log('Toggle like post response status:', response.status);

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
      console.log('Toggle like post response data:', data);
    } else {
      const text = await response.text();
      data = {};
      console.log('Toggle like post response text:', text);
    }

    if (!response.ok) {
      const errorMessage = data.message || data.error || data.detail || `Failed to toggle like (${response.status})`;
      const apiError = new Error(errorMessage);
      apiError.status = response.status;
      throw apiError;
    }

    return data;
  } catch (error) {
    console.error('Toggle like post API error:', error);
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
 * Get post likes count
 * @param {string} token - Access token
 * @param {string|number} postId - Post ID
 * @returns {Promise<number>} Likes count
 */
export const getPostLikesCount = async (token, postId) => {
  const url = getApiUrl(`likes/post/${postId}/count`);

  console.log('Get post likes count request:', { url, postId });

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

    console.log('Get post likes count response status:', response.status);

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
      console.log('Get post likes count response data:', data);
    } else {
      const text = await response.text();
      data = { count: 0 };
      console.log('Get post likes count response text:', text);
    }

    if (!response.ok) {
      const errorMessage = data.message || data.error || data.detail || `Failed to get likes count (${response.status})`;
      const apiError = new Error(errorMessage);
      apiError.status = response.status;
      throw apiError;
    }

    // Handle different response formats
    if (typeof data === 'number') {
      return data;
    } else if (data.count !== undefined) {
      return data.count;
    } else if (data.likes_count !== undefined) {
      return data.likes_count;
    }
    return 0;
  } catch (error) {
    console.error('Get post likes count API error:', error);
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
 * Get like status for a post
 * @param {string} token - Access token
 * @param {string|number} postId - Post ID
 * @returns {Promise<boolean>} True if liked, false otherwise
 */
export const getPostLikeStatus = async (token, postId) => {
  const url = getApiUrl(`likes/post/${postId}/status`);

  console.log('Get post like status request:', { url, postId });

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

    console.log('Get post like status response status:', response.status);

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
      console.log('Get post like status response data:', data);
    } else {
      const text = await response.text();
      data = { liked: false };
      console.log('Get post like status response text:', text);
    }

    if (!response.ok) {
      const errorMessage = data.message || data.error || data.detail || `Failed to get like status (${response.status})`;
      const apiError = new Error(errorMessage);
      apiError.status = response.status;
      throw apiError;
    }

    // Handle different response formats
    if (typeof data === 'boolean') {
      return data;
    } else if (data.liked !== undefined) {
      return data.liked;
    } else if (data.is_liked !== undefined) {
      return data.is_liked;
    }
    return false;
  } catch (error) {
    console.error('Get post like status API error:', error);
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
 * Create a past trip
 * @param {string} token - Access token
 * @param {Object} tripData - Trip data
 * @param {string} tripData.place_name - Place name (required)
 * @param {string} tripData.location - Location (required)
 * @param {string} tripData.category - Category (required)
 * @param {string} tripData.date - Date (required)
 * @param {string} tripData.description - Optional description
 * @param {File|Object} tripData.image - Optional image file
 * @returns {Promise<Object>} Created trip data
 */
export const createPastTrip = async (token, tripData) => {
  const url = getApiUrl('trips/');

  console.log('Create past trip request:', { url, tripData: { ...tripData, image: tripData.image ? 'present' : 'none' } });

  try {
    // If image is provided, use multipart/form-data, otherwise use JSON
    if (tripData.image) {
      const formData = new FormData();

      // Add text fields
      formData.append('place_name', tripData.place_name);
      formData.append('location', tripData.location);
      formData.append('category', tripData.category);
      formData.append('date', tripData.date);
      if (tripData.description) {
        formData.append('description', tripData.description);
      }

      // Handle image file
      if (typeof window !== 'undefined' && tripData.image.uri) {
        // For web, convert URI to Blob/File
        try {
          let blob;
          const imageUri = tripData.image.uri;
          
          if (imageUri.startsWith('data:')) {
            const response = await fetch(imageUri);
            blob = await response.blob();
          } else if (imageUri.startsWith('blob:') || imageUri.startsWith('file://') || imageUri.startsWith('http://') || imageUri.startsWith('https://')) {
            const response = await fetch(imageUri);
            blob = await response.blob();
          } else {
            const response = await fetch(imageUri);
            blob = await response.blob();
          }
          
          const fileName = tripData.image.name || `trip_${Date.now()}.jpg`;
          const fileType = tripData.image.type || 'image/jpeg';
          const file = new File([blob], fileName, { type: fileType });
          formData.append('image', file, fileName);
        } catch (error) {
          console.error('Error converting image to blob:', error);
          throw new Error('Failed to prepare image for upload. Please try again.');
        }
      } else {
        // For React Native
        formData.append('image', {
          uri: tripData.image.uri,
          type: tripData.image.type || 'image/jpeg',
          name: tripData.image.name || `trip_${Date.now()}.jpg`,
        });
      }

      const response = await fetchWithTimeout(
        url,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            // Don't set Content-Type - browser will set it with boundary
          },
          body: formData,
        },
        30000 // 30 second timeout for file uploads
      );

      console.log('Create past trip response status:', response.status);

      const contentType = response.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
        console.log('Create past trip response data:', data);
      } else {
        const text = await response.text();
        data = {};
        console.log('Create past trip response text:', text);
      }

      if (!response.ok) {
        const errorMessage = data.message || data.error || data.detail || `Failed to create trip (${response.status})`;
        const apiError = new Error(errorMessage);
        apiError.status = response.status;
        throw apiError;
      }

      return data;
    } else {
      // No image, use JSON
      const requestBody = {
        place_name: tripData.place_name,
        location: tripData.location,
        category: tripData.category,
        date: tripData.date,
      };

      if (tripData.description) {
        requestBody.description = tripData.description;
      }

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

      console.log('Create past trip response status:', response.status);

      const contentType = response.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
        console.log('Create past trip response data:', data);
      } else {
        const text = await response.text();
        data = {};
        console.log('Create past trip response text:', text);
      }

      if (!response.ok) {
        const errorMessage = data.message || data.error || data.detail || `Failed to create trip (${response.status})`;
        const apiError = new Error(errorMessage);
        apiError.status = response.status;
        throw apiError;
      }

      return data;
    }
  } catch (error) {
    console.error('Create past trip API error:', error);
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
 * Get my past trips
 * @param {string} token - Access token
 * @returns {Promise<Array>} Array of past trips
 */
export const getMyPastTrips = async (token) => {
  const url = getApiUrl('trips/my');

  console.log('Get my past trips request:', { url });

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

    console.log('Get my past trips response status:', response.status);

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
      console.log('Get my past trips response data:', data);
    } else {
      const text = await response.text();
      data = [];
      console.log('Get my past trips response text:', text);
    }

    if (!response.ok) {
      const errorMessage = data.message || data.error || data.detail || `Failed to get past trips (${response.status})`;
      const apiError = new Error(errorMessage);
      apiError.status = response.status;
      throw apiError;
    }

    // Return array of trips (API might return array directly or wrapped in an object)
    if (Array.isArray(data)) {
      return data;
    } else if (data.trips && Array.isArray(data.trips)) {
      return data.trips;
    } else if (data.items && Array.isArray(data.items)) {
      return data.items;
    }
    return [];
  } catch (error) {
    console.error('Get my past trips API error:', error);
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
 * Toggle join/leave a community
 * @param {string} token - Access token
 * @param {string|number} communityId - Community ID
 * @returns {Promise<Object>} Response data
 */
export const toggleJoinCommunity = async (token, communityId) => {
  const url = getApiUrl(`communities/${communityId}/join`);

  console.log('Toggle join community request:', { url, communityId });

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

    console.log('Toggle join community response status:', response.status);

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
      console.log('Toggle join community response data:', data);
    } else {
      const text = await response.text();
      data = {};
      console.log('Toggle join community response text:', text);
    }

    if (!response.ok) {
      const errorMessage = data.message || data.error || data.detail || `Failed to toggle join (${response.status})`;
      const apiError = new Error(errorMessage);
      apiError.status = response.status;
      throw apiError;
    }

    return data;
  } catch (error) {
    console.error('Toggle join community API error:', error);
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
 * Create a community post
 * @param {string} token - Access token
 * @param {string|number} communityId - Community ID
 * @param {Object} postData - Post data
 * @param {string} postData.content - Post content (required)
 * @returns {Promise<Object>} Created post data
 */
export const createCommunityPost = async (token, communityId, postData) => {
  const url = getApiUrl(`communities/${communityId}/posts`);

  const requestBody = {
    message: postData.message || postData.content,
  };

  console.log('Create community post request:', { url, communityId, body: requestBody });

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

    console.log('Create community post response status:', response.status);

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
      console.log('Create community post response data:', data);
    } else {
      const text = await response.text();
      data = {};
      console.log('Create community post response text:', text);
    }

    if (!response.ok) {
      const errorMessage = data.message || data.error || data.detail || `Failed to create post (${response.status})`;
      const apiError = new Error(errorMessage);
      apiError.status = response.status;
      throw apiError;
    }

    return data;
  } catch (error) {
    console.error('Create community post API error:', error);
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
 * Get community posts
 * @param {string} token - Access token
 * @param {string|number} communityId - Community ID
 * @param {number} skip - Number of items to skip (default: 0)
 * @param {number} limit - Number of items to return (default: 20)
 * @returns {Promise<Array>} Array of community posts
 */
export const getCommunityPosts = async (token, communityId, skip = 0, limit = 20) => {
  const url = getApiUrl(`communities/${communityId}/posts?skip=${skip}&limit=${limit}`);

  console.log('Get community posts request:', { url, communityId, skip, limit });

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

    console.log('Get community posts response status:', response.status);

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
      console.log('Get community posts response data:', data);
    } else {
      const text = await response.text();
      data = [];
      console.log('Get community posts response text:', text);
    }

    if (!response.ok) {
      const errorMessage = data.message || data.error || data.detail || `Failed to get community posts (${response.status})`;
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
    console.error('Get community posts API error:', error);
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

// Follow/Unfollow APIs
export const toggleFollowUser = async (token, userId) => {
  const url = getApiUrl(`follow/user/${userId}`);

  console.log('Toggle follow user request:', { url, userId });

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

    console.log('Toggle follow user response status:', response.status);

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
      console.log('Toggle follow user response data:', data);
    } else {
      const text = await response.text();
      data = {};
      console.log('Toggle follow user response text:', text);
    }

    if (!response.ok) {
      const errorMessage = data.message || data.error || data.detail || `Failed to toggle follow (${response.status})`;
      const apiError = new Error(errorMessage);
      apiError.status = response.status;
      throw apiError;
    }

    return data;
  } catch (error) {
    console.error('Toggle follow user API error:', error);
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

export const getFollowers = async (token, userId) => {
  const url = getApiUrl(`follow/user/${userId}/followers`);

  console.log('Get followers request:', { url, userId });

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

    console.log('Get followers response status:', response.status);

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
      console.log('Get followers response data:', data);
    } else {
      const text = await response.text();
      data = [];
      console.log('Get followers response text:', text);
    }

    if (!response.ok) {
      const errorMessage = data.message || data.error || data.detail || `Failed to get followers (${response.status})`;
      const apiError = new Error(errorMessage);
      apiError.status = response.status;
      throw apiError;
    }

    // Return array of followers (API might return array directly or wrapped in an object)
    if (Array.isArray(data)) {
      return data;
    } else if (data.followers && Array.isArray(data.followers)) {
      return data.followers;
    } else if (data.items && Array.isArray(data.items)) {
      return data.items;
    }
    return [];
  } catch (error) {
    console.error('Get followers API error:', error);
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

export const getFollowing = async (token, userId) => {
  const url = getApiUrl(`follow/user/${userId}/following`);

  console.log('Get following request:', { url, userId });

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

    console.log('Get following response status:', response.status);

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
      console.log('Get following response data:', data);
    } else {
      const text = await response.text();
      data = [];
      console.log('Get following response text:', text);
    }

    if (!response.ok) {
      const errorMessage = data.message || data.error || data.detail || `Failed to get following (${response.status})`;
      const apiError = new Error(errorMessage);
      apiError.status = response.status;
      throw apiError;
    }

    // Return array of following (API might return array directly or wrapped in an object)
    if (Array.isArray(data)) {
      return data;
    } else if (data.following && Array.isArray(data.following)) {
      return data.following;
    } else if (data.items && Array.isArray(data.items)) {
      return data.items;
    }
    return [];
  } catch (error) {
    console.error('Get following API error:', error);
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

export const getFollowStatus = async (token, userId) => {
  const url = getApiUrl(`follow/user/${userId}/status`);

  console.log('Get follow status request:', { url, userId });

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

    console.log('Get follow status response status:', response.status);

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
      console.log('Get follow status response data:', data);
    } else {
      const text = await response.text();
      data = {};
      console.log('Get follow status response text:', text);
    }

    if (!response.ok) {
      const errorMessage = data.message || data.error || data.detail || `Failed to get follow status (${response.status})`;
      const apiError = new Error(errorMessage);
      apiError.status = response.status;
      throw apiError;
    }

    return data;
  } catch (error) {
    console.error('Get follow status API error:', error);
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

// AI Chat APIs
export const createConversation = async (token, title) => {
  const url = getApiUrl('chat/conversations');

  console.log('Create conversation request:', { url, title });

  try {
    const response = await fetchWithTimeout(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title }),
      },
      15000
    );

    console.log('Create conversation response status:', response.status);

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
      console.log('Create conversation response data:', data);
    } else {
      const text = await response.text();
      data = {};
      console.log('Create conversation response text:', text);
    }

    if (!response.ok) {
      const errorMessage = data.message || data.error || data.detail || `Failed to create conversation (${response.status})`;
      const apiError = new Error(errorMessage);
      apiError.status = response.status;
      throw apiError;
    }

    return data;
  } catch (error) {
    console.error('Create conversation API error:', error);
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

export const sendMessageStream = async (token, conversationId, content, onChunk) => {
  const url = getApiUrl(`chat/conversations/${conversationId}/message/stream`);

  console.log('Send message stream request:', { url, conversationId, content });

  try {
    const response = await fetchWithTimeout(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      },
      60000 // Longer timeout for streaming
    );

    console.log('Send message stream response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || errorData.error || errorData.detail || `Failed to send message (${response.status})`;
      const apiError = new Error(errorMessage);
      apiError.status = response.status;
      throw apiError;
    }

    // Handle streaming response
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullResponse = '';

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        break;
      }

      // Decode the chunk
      buffer += decoder.decode(value, { stream: true });
      
      // Process complete lines (SSE format: data: {...}\n\n)
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep incomplete line in buffer

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const textContent = line.slice(6); // Remove 'data: ' prefix
          
          // Check if it's [DONE] marker
          if (textContent.trim() === '[DONE]') {
            // Stream is complete
            break;
          }
          
          // Try to parse as JSON first (for structured responses)
          if (textContent.trim().startsWith('{') || textContent.trim().startsWith('[')) {
            try {
              const chunk = JSON.parse(textContent);
              
              // Handle different JSON response formats
              if (chunk.content || chunk.text || chunk.message) {
                const chunkText = chunk.content || chunk.text || chunk.message;
                fullResponse += chunkText;
                
                // Call the onChunk callback with the accumulated response so far
                if (onChunk) {
                  onChunk(fullResponse, chunk);
                }
              } else if (chunk.delta) {
                // Handle delta format
                fullResponse += chunk.delta;
                if (onChunk) {
                  onChunk(fullResponse, chunk);
                }
              }
            } catch (parseError) {
              // If JSON parsing fails, treat as plain text
              if (textContent.trim()) {
                fullResponse += textContent;
                if (onChunk) {
                  onChunk(fullResponse, { text: textContent });
                }
              }
            }
          } else {
            // Plain text chunk (most common case)
            if (textContent.trim() || textContent.length > 0) {
              fullResponse += textContent;
              if (onChunk) {
                onChunk(fullResponse, { text: textContent });
              }
            }
          }
        } else if (line.trim() && !line.startsWith(':')) {
          // Handle plain text chunks (non-SSE format)
          fullResponse += line;
          if (onChunk) {
            onChunk(fullResponse, { text: line });
          }
        }
      }
    }

    // Process any remaining buffer
    if (buffer.trim()) {
      fullResponse += buffer;
      if (onChunk) {
        onChunk(fullResponse, { text: buffer });
      }
    }

    return { content: fullResponse };
  } catch (error) {
    console.error('Send message stream API error:', error);
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
