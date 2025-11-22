import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, StatusBar as RNStatusBar, Alert, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { FONTS } from '../constants/fonts';
import { compressImage } from '../utils/imageCompression';
import { uploadProfilePhoto } from '../services/authService';
import { getToken } from '../utils/storage';
import { triggerHaptic } from '../utils/haptics';

// Import profile images
const profileImages = [
  require('../../assets/profiles/ic.png'),
  require('../../assets/profiles/ic1.png'),
  require('../../assets/profiles/ic2.png'),
  require('../../assets/profiles/ic3.png'),
  require('../../assets/profiles/ic4.png'),
  require('../../assets/profiles/ic5.png'),
];

export const ProfilePictureSelectorScreen = ({ currentAvatar, onBack, onSelect }) => {
  // Get safe area insets
  const statusBarHeight = Platform.OS === 'ios' ? 44 : RNStatusBar.currentHeight || 0;

  const [selectedImage, setSelectedImage] = useState(currentAvatar);
  const [isUploading, setIsUploading] = useState(false);

  const handleSelect = async (image) => {
    // If it's a local asset (require), just select it
    if (typeof image === 'number' || (image && !image.uri)) {
      setSelectedImage(image);
      if (onSelect) {
        onSelect(image);
      }
      if (onBack) {
        onBack();
      }
      return;
    }

    // If it's a file from ImagePicker, upload it first
    if (image && image.uri) {
      await handleUploadPhoto(image);
    }
  };

  const handleUploadPhoto = async (photoFile) => {
    const token = getToken();
    if (!token) {
      Alert.alert('Authentication Required', 'Please log in to upload a profile photo.');
      return;
    }

    setIsUploading(true);
    triggerHaptic('light');

    try {
      // Compress the image before upload
      const compressedImage = await compressImage(photoFile.uri, 800, 800, 0.8);
      
      // Prepare file object for upload
      const fileToUpload = {
        uri: compressedImage.uri,
        type: 'image/jpeg',
        name: `profile_${Date.now()}.jpg`,
      };

      // Upload to API
      const response = await uploadProfilePhoto(token, fileToUpload);
      
      console.log('Profile photo uploaded:', response);
      
      // The response contains profile_photo as a relative path
      // Convert it to a full URL for display
      let uploadedPhoto = null;
      
      if (response.profile_photo) {
        // profile_photo is a relative path like "uploads/profile_photos/uuid.jpg"
        // Need to convert to full URL
        const { API_BASE_URL } = require('../config/api');
        const fullUrl = `${API_BASE_URL}/${response.profile_photo}`;
        uploadedPhoto = { uri: fullUrl };
      } else if (response.photo_url || response.avatar_url || response.avatar) {
        // Fallback to other possible field names
        const photoUrl = response.photo_url || response.avatar_url || response.avatar;
        uploadedPhoto = typeof photoUrl === 'string' ? { uri: photoUrl } : photoUrl;
      } else {
        // Last resort: use compressed image
        uploadedPhoto = { uri: compressedImage.uri };
      }
      
      setSelectedImage(uploadedPhoto);
      
      if (onSelect) {
        onSelect(uploadedPhoto);
      }
      
      triggerHaptic('success');
      Alert.alert('Success', 'Profile photo uploaded successfully!');
      
      if (onBack) {
        onBack();
      }
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      triggerHaptic('error');
      
      let errorMessage = 'Failed to upload profile photo. Please try again.';
      if (error.message) {
        errorMessage = error.message;
      } else if (error.errors && Array.isArray(error.errors)) {
        errorMessage = error.errors.map(err => {
          if (typeof err === 'string') return err;
          if (err.msg) return err.msg;
          if (err.message) return err.message;
          return JSON.stringify(err);
        }).join(', ');
      }
      
      Alert.alert('Upload Failed', errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handlePickFromGallery = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'We need camera roll permissions to upload photos!');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1], // Square for profile picture
        quality: 1, // Get full quality first, we'll compress it
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const selectedPhoto = result.assets[0];
        await handleUploadPhoto(selectedPhoto);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleTakePhoto = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'We need camera permissions to take photos!');
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1], // Square for profile picture
        quality: 1, // Get full quality first, we'll compress it
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const selectedPhoto = result.assets[0];
        await handleUploadPhoto(selectedPhoto);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: statusBarHeight + 16 }]}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#0A1D37" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choose Profile Picture</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Select a profile picture</Text>
          <Text style={styles.subtitle}>Upload from your device or choose from options</Text>
          
          {/* Upload Options */}
          <View style={styles.uploadSection}>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handlePickFromGallery}
              disabled={isUploading}
              activeOpacity={0.7}
            >
              <Ionicons name="images-outline" size={24} color="#0A1D37" />
              <Text style={styles.uploadButtonText}>Choose from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handleTakePhoto}
              disabled={isUploading}
              activeOpacity={0.7}
            >
              <Ionicons name="camera-outline" size={24} color="#0A1D37" />
              <Text style={styles.uploadButtonText}>Take Photo</Text>
            </TouchableOpacity>
          </View>

          {isUploading && (
            <View style={styles.uploadingContainer}>
              <ActivityIndicator size="small" color="#0A1D37" />
              <Text style={styles.uploadingText}>Uploading photo...</Text>
            </View>
          )}

          <Text style={styles.dividerText}>Or choose from options</Text>
          
          <View style={styles.imageGrid}>
            {profileImages.map((image, index) => {
              const isSelected = selectedImage === image;
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.imageContainer, isSelected && styles.imageContainerSelected]}
                  onPress={() => handleSelect(image)}
                  activeOpacity={0.7}
                >
                  <Image
                    source={image}
                    style={styles.profileImage}
                    resizeMode="cover"
                  />
                  {isSelected && (
                    <View style={styles.selectedOverlay}>
                      <Ionicons name="checkmark-circle" size={32} color="#F7F7F7" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    color: '#0A1D37',
    letterSpacing: 0.5,
  },
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  content: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: '#0A1D37',
    letterSpacing: 0.3,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: '#6D6D6D',
    letterSpacing: 0.2,
    marginBottom: 24,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: '30%',
    aspectRatio: 1,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E8E8E8',
    position: 'relative',
  },
  imageContainerSelected: {
    borderColor: '#0A1D37',
    borderWidth: 3,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  selectedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10, 29, 55, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  uploadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    gap: 8,
  },
  uploadButtonText: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    color: '#0A1D37',
    letterSpacing: 0.2,
  },
  uploadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginBottom: 16,
    gap: 12,
  },
  uploadingText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: '#6D6D6D',
    letterSpacing: 0.2,
  },
  dividerText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: '#6D6D6D',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 0.2,
  },
});

