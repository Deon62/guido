/**
 * Form validation utilities
 */

// Validate email format
export const validateEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

// Validate required field
export const validateRequired = (value, fieldName = 'This field') => {
  if (!value || value.trim() === '') {
    return `${fieldName} is required`;
  }
  return null;
};

// Validate minimum length
export const validateMinLength = (value, minLength, fieldName = 'This field') => {
  if (value && value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  return null;
};

// Validate maximum length
export const validateMaxLength = (value, maxLength, fieldName = 'This field') => {
  if (value && value.length > maxLength) {
    return `${fieldName} must be no more than ${maxLength} characters`;
  }
  return null;
};

// Validate image file
export const validateImageFile = async (uri) => {
  try {
    // Check file extension
    const extension = uri.split('.').pop().toLowerCase();
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    
    if (!allowedExtensions.includes(extension)) {
      return 'Image must be in JPG, PNG, GIF, or WEBP format';
    }

    // Check file size (max 10MB)
    const response = await fetch(uri);
    const blob = await response.blob();
    const fileSizeMB = blob.size / (1024 * 1024);
    
    if (fileSizeMB > 10) {
      return 'Image size must be less than 10MB';
    }

    return null; // Valid
  } catch (error) {
    return 'Unable to validate image file';
  }
};

// Validate username format (alphanumeric, underscore, hyphen, 3-20 chars)
export const validateUsername = (username) => {
  if (!username) return null; // Optional field
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return usernameRegex.test(username) 
    ? null 
    : 'Username must be 3-20 characters and contain only letters, numbers, underscores, or hyphens';
};

// Validate place name (non-empty, reasonable length)
export const validatePlaceName = (placeName) => {
  if (!placeName || placeName.trim() === '') {
    return 'Place name is required';
  }
  if (placeName.length > 100) {
    return 'Place name must be less than 100 characters';
  }
  return null;
};

// Validate location (non-empty, reasonable length)
export const validateLocation = (location) => {
  if (!location || location.trim() === '') {
    return 'Location is required';
  }
  if (location.length > 200) {
    return 'Location must be less than 200 characters';
  }
  return null;
};


