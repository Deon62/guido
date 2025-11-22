import * as ImageManipulator from 'expo-image-manipulator';
import { Platform } from 'react-native';

/**
 * Compress and resize image before upload
 * @param {string} imageUri - URI of the image to compress
 * @param {number} maxWidth - Maximum width (default: 1200)
 * @param {number} maxHeight - Maximum height (default: 1200)
 * @param {number} quality - Compression quality 0-1 (default: 0.8)
 * @returns {Promise<{uri: string, width: number, height: number}>} Compressed image
 */
export const compressImage = async (imageUri, maxWidth = 1200, maxHeight = 1200, quality = 0.8) => {
  try {
    // On web, expo-image-manipulator might not work, so return original URI
    if (Platform.OS === 'web') {
      console.log('Web platform: returning original image URI (compression may not be available)');
      return { uri: imageUri };
    }

    // Get image dimensions
    const manipResult = await ImageManipulator.manipulateAsync(
      imageUri,
      [
        {
          resize: {
            width: maxWidth,
            height: maxHeight,
          },
        },
      ],
      {
        compress: quality,
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );

    return {
      uri: manipResult.uri,
      width: manipResult.width,
      height: manipResult.height,
    };
  } catch (error) {
    console.error('Error compressing image:', error);
    // Return original if compression fails
    return { uri: imageUri };
  }
};

/**
 * Compress multiple images
 * @param {Array<string>} imageUris - Array of image URIs
 * @param {Function} onProgress - Progress callback (current, total)
 * @returns {Promise<Array>} Array of compressed images
 */
export const compressImages = async (imageUris, onProgress) => {
  const compressedImages = [];
  
  for (let i = 0; i < imageUris.length; i++) {
    const compressed = await compressImage(imageUris[i]);
    compressedImages.push(compressed);
    
    if (onProgress) {
      onProgress(i + 1, imageUris.length);
    }
  }
  
  return compressedImages;
};

