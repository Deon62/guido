import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Platform, StatusBar as RNStatusBar, Modal, KeyboardAvoidingView, Alert, Keyboard, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Button } from '../components/Button';
import { ErrorCard } from '../components/ErrorCard';
import { FONTS } from '../constants/fonts';
import { triggerHaptic } from '../utils/haptics';
import { compressImage } from '../utils/imageCompression';
import { validatePlaceName, validateLocation, validateImageFile, validateMaxLength } from '../utils/formValidation';

export const AddFeedPostScreen = ({ onBack, onSave }) => {
  // Get safe area insets
  const statusBarHeight = Platform.OS === 'ios' ? 44 : RNStatusBar.currentHeight || 0;

  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState({ current: 0, total: 0 });
  const [formData, setFormData] = useState({
    placeName: '',
    location: '',
    mainCategory: '',
    caption: '',
    images: [],
    videos: [],
  });
  const [fieldErrors, setFieldErrors] = useState({
    placeName: null,
    location: null,
    mainCategory: null,
    caption: null,
    images: null,
    videos: null,
    media: null,
  });

  const [showMainCategoryModal, setShowMainCategoryModal] = useState(false);
  
  const mainCategories = ['Core', 'Cultural', 'Relaxation', 'Food & Drink Niche', 'Miscellaneous / Unique'];

  const handleSave = async () => {
    if (isSubmitting) return;

    // Validate all fields
    const hasMedia = formData.images.length > 0 || formData.videos.length > 0;
    const errors = {
      placeName: validatePlaceName(formData.placeName),
      location: validateLocation(formData.location),
      mainCategory: !formData.mainCategory ? 'Main category is required' : null,
      media: !hasMedia ? 'At least one image or video is required' : null,
      caption: validateMaxLength(formData.caption, 500, 'Caption'),
    };
    
    setFieldErrors(errors);
    
    const hasErrors = Object.values(errors).some(err => err !== null);
    if (hasErrors) {
      setError('Please fix the errors below');
      triggerHaptic('error');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate random error (10% chance for demo)
      if (Math.random() < 0.1) {
        throw new Error('Failed to post');
      }

      if (onSave) {
        onSave(formData);
      }
      triggerHaptic('success');
    } catch (err) {
      setError('Failed to post. Please try again.');
      triggerHaptic('error');
      console.error('Error posting:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Real-time validation
    let error = null;
    if (field === 'placeName') {
      error = validatePlaceName(value);
    } else if (field === 'location') {
      error = validateLocation(value);
    } else if (field === 'caption') {
      error = validateMaxLength(value, 500, 'Caption');
    }
    
    setFieldErrors(prev => ({
      ...prev,
      [field]: error,
    }));
    
    // Clear general error when user types
    if (error === null && fieldErrors[field]) {
      setError(null);
    }
  };


  const handleImagePick = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'We need camera roll permissions to upload media!');
        return;
      }

      // Calculate how many images can still be selected (max 5 total media items)
      const totalMedia = formData.images.length + formData.videos.length;
      const remainingSlots = 5 - totalMedia;
      if (remainingSlots === 0) {
        Alert.alert('Maximum Media', 'You can only select up to 5 images or videos total');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 1, // Get full quality first, we'll compress it
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const originalUri = result.assets[0].uri;
        
        // Validate image file
        const imageError = await validateImageFile(originalUri);
        if (imageError) {
          Alert.alert('Invalid Image', imageError);
          triggerHaptic('error');
          return;
        }
        
        // Show compression indicator
        setIsCompressing(true);
        setCompressionProgress({ current: 1, total: 1 });
        triggerHaptic('light');
        
        try {
          // Compress the image
          const compressedImage = await compressImage(originalUri, 1200, 1200, 0.8);
          
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, compressedImage].slice(0, 5),
          }));
          
          // Clear media errors
          setFieldErrors(prev => ({
            ...prev,
            media: null,
            images: null,
          }));
        } catch (compressionError) {
          console.error('Compression error:', compressionError);
          Alert.alert('Error', 'Failed to process image. Please try again.');
          triggerHaptic('error');
        } finally {
          setIsCompressing(false);
          setCompressionProgress({ current: 0, total: 0 });
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Error picking image. Please try again.');
    }
  };

  const handleVideoPick = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'We need camera roll permissions to upload videos!');
        return;
      }

      // Calculate how many videos can still be selected (max 5 total media items)
      const totalMedia = formData.images.length + formData.videos.length;
      const remainingSlots = 5 - totalMedia;
      if (remainingSlots === 0) {
        Alert.alert('Maximum Media', 'You can only select up to 5 images or videos total');
        return;
      }

      // Launch video picker (no editing - users must trim videos in their gallery app first)
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['videos'],
        allowsEditing: false, // Disabled to avoid Android compatibility issues
        videoQuality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const videoAsset = result.assets[0];
        
        // Get duration (in milliseconds)
        const durationMs = videoAsset.duration || 0;
        const durationSeconds = durationMs / 1000;
        
        // Check video duration (15 seconds max)
        if (durationSeconds > 15) {
          Alert.alert(
            'Video Too Long',
            `This video is ${Math.round(durationSeconds)} seconds long. Videos must be 15 seconds or shorter.\n\nPlease trim your video to 15 seconds or less in your gallery app, then try again.`,
            [{ text: 'OK', onPress: () => triggerHaptic('light') }]
          );
          triggerHaptic('error');
          return;
        }
        
        triggerHaptic('light');
        
        const videoData = {
          uri: videoAsset.uri,
          duration: durationMs,
          type: videoAsset.type || 'video',
          width: videoAsset.width,
          height: videoAsset.height,
        };
        
        setFormData(prev => ({
          ...prev,
          videos: [...prev.videos, videoData].slice(0, 5),
        }));
        
        // Clear media errors
        setFieldErrors(prev => ({
          ...prev,
          media: null,
          videos: null,
        }));
      }
    } catch (error) {
      console.error('Error picking video:', error);
      Alert.alert('Error', 'Error picking video. Please try again.');
      triggerHaptic('error');
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveVideo = (index) => {
    setFormData(prev => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index),
    }));
  };

  const formatDuration = (milliseconds) => {
    if (!milliseconds) return '0:00';
    const seconds = Math.floor(milliseconds / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
        <Text style={styles.headerTitle}>Create Post</Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <View style={styles.content}>
            {/* Media Upload Section */}
            <View style={styles.mediaSection}>
              <Text style={styles.label}>Media *</Text>
              <Text style={styles.mediaCountText}>
                {(formData.images.length + formData.videos.length)} / 5 items selected
              </Text>
              {(fieldErrors.media || fieldErrors.images || fieldErrors.videos) && (
                <Text style={styles.fieldError}>
                  {fieldErrors.media || fieldErrors.images || fieldErrors.videos}
                </Text>
              )}
              
              {/* Media Previews Grid */}
              {(formData.images.length > 0 || formData.videos.length > 0) && (
                <View style={styles.mediaGrid}>
                  {/* Image Previews */}
                  {formData.images.map((image, index) => (
                    <View key={`img-${index}`} style={styles.mediaPreviewWrapper}>
                      <Image source={image} style={styles.mediaPreview} resizeMode="cover" />
                      <View style={styles.mediaTypeBadge}>
                        <Ionicons name="image" size={12} color="#FFFFFF" />
                      </View>
                      <TouchableOpacity
                        style={styles.removeMediaButton}
                        onPress={() => handleRemoveImage(index)}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="close-circle" size={20} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  ))}
                  
                  {/* Video Previews */}
                  {formData.videos.map((video, index) => (
                    <View key={`vid-${index}`} style={styles.mediaPreviewWrapper}>
                      <View style={styles.videoPreviewContainer}>
                        <View style={styles.videoPlaceholder}>
                          <Ionicons name="videocam" size={32} color="#6D6D6D" />
                        </View>
                        <View style={styles.videoOverlay}>
                          <View style={styles.playButton}>
                            <Ionicons name="play" size={16} color="#FFFFFF" />
                          </View>
                          <Text style={styles.videoDurationText}>
                            {formatDuration(video.duration)}
                          </Text>
                        </View>
                      </View>
                      <View style={[styles.mediaTypeBadge, styles.videoBadge]}>
                        <Ionicons name="videocam" size={12} color="#FFFFFF" />
                      </View>
                      <TouchableOpacity
                        style={styles.removeMediaButton}
                        onPress={() => handleRemoveVideo(index)}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="close-circle" size={20} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              {/* Add Media Buttons */}
              {(formData.images.length + formData.videos.length) < 5 && (
                <View style={styles.mediaUploadContainer}>
                  <TouchableOpacity
                    style={[styles.mediaUploadButton, styles.imageUploadButton]}
                    onPress={handleImagePick}
                    activeOpacity={0.8}
                    disabled={isCompressing}
                  >
                    {isCompressing ? (
                      <View style={styles.compressingContainer}>
                        <ActivityIndicator size="small" color="#0A1D37" />
                        <Text style={styles.compressingText}>Compressing...</Text>
                      </View>
                    ) : (
                      <>
                        <Ionicons name="camera" size={24} color="#0A1D37" />
                        <Text style={styles.mediaUploadText}>Add Photos</Text>
                      </>
                    )}
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.mediaUploadButton, styles.videoUploadButton]}
                    onPress={handleVideoPick}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="videocam" size={24} color="#FFFFFF" />
                    <Text style={[styles.mediaUploadText, styles.videoUploadTextStyle]}>
                      Add Video
                    </Text>
                    <Text style={styles.videoLimitText}>Max 15 seconds</Text>
                    <Text style={styles.videoTrimHint}>Trim in gallery first</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Place Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Place Name *</Text>
              <TextInput
                style={[styles.input, fieldErrors.placeName && styles.inputError]}
                placeholder="e.g., Eiffel Tower"
                placeholderTextColor="#9B9B9B"
                value={formData.placeName}
                onChangeText={(text) => updateField('placeName', text)}
              />
              {fieldErrors.placeName && (
                <Text style={styles.fieldError}>{fieldErrors.placeName}</Text>
              )}
            </View>

            {/* Location */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Location *</Text>
              <TextInput
                style={[styles.input, fieldErrors.location && styles.inputError]}
                placeholder="e.g., Paris, France"
                placeholderTextColor="#9B9B9B"
                value={formData.location}
                onChangeText={(text) => updateField('location', text)}
              />
              {fieldErrors.location && (
                <Text style={styles.fieldError}>{fieldErrors.location}</Text>
              )}
            </View>

            {/* Main Category Dropdown */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Main Category *</Text>
              <TouchableOpacity
                style={[styles.categoryButton, fieldErrors.mainCategory && styles.inputError]}
                onPress={() => setShowMainCategoryModal(true)}
                activeOpacity={0.7}
              >
                <Text style={[styles.categoryButtonText, !formData.mainCategory && styles.placeholderText]}>
                  {formData.mainCategory || 'Select Main Category'}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#6D6D6D" />
              </TouchableOpacity>
              {fieldErrors.mainCategory && (
                <Text style={styles.fieldError}>{fieldErrors.mainCategory}</Text>
              )}
            </View>

            {/* Caption */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Caption</Text>
              {error && !fieldErrors.caption && (
                <View style={styles.errorContainer}>
                  <ErrorCard
                    message={error}
                    onRetry={() => setError(null)}
                  />
                </View>
              )}
              <TextInput
                style={[styles.input, styles.textArea, fieldErrors.caption && styles.inputError]}
                placeholder="Share your experience..."
                placeholderTextColor="#9B9B9B"
                value={formData.caption}
                onChangeText={(text) => {
                  updateField('caption', text);
                  if (error) setError(null); // Clear error when user types
                }}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                maxLength={500}
              />
              <View style={styles.captionFooter}>
                {fieldErrors.caption ? (
                  <Text style={styles.fieldError}>{fieldErrors.caption}</Text>
                ) : (
                  <Text style={styles.characterCount}>
                    {formData.caption.length} / 500
                  </Text>
                )}
              </View>
            </View>

            {/* Save Button */}
            <View style={styles.buttonContainer}>
              <Button
                title={isSubmitting ? "Posting..." : "Post to Feed"}
                onPress={handleSave}
                variant="primary"
                disabled={isSubmitting}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Main Category Modal */}
      <Modal
        visible={showMainCategoryModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMainCategoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setShowMainCategoryModal(false)}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Main Category</Text>
              <TouchableOpacity
                onPress={() => setShowMainCategoryModal(false)}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color="#0A1D37" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
              {mainCategories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={styles.categoryOption}
                  onPress={() => {
                    updateField('mainCategory', category);
                    setFieldErrors(prev => ({
                      ...prev,
                      mainCategory: null,
                    }));
                    setShowMainCategoryModal(false);
                    triggerHaptic('light');
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.categoryOptionText}>{category}</Text>
                  {formData.mainCategory === category && (
                    <Ionicons name="checkmark" size={20} color="#0A1D37" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: '#0A1D37',
    letterSpacing: 0.5,
  },
  placeholder: {
    width: 32,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  mediaSection: {
    marginBottom: 24,
  },
  mediaCountText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: '#6D6D6D',
    marginBottom: 12,
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    marginHorizontal: -6,
  },
  mediaPreviewWrapper: {
    width: '18.5%',
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    marginHorizontal: 6,
    marginBottom: 12,
  },
  mediaPreview: {
    width: '100%',
    height: '100%',
  },
  removeMediaButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 10,
    zIndex: 2,
  },
  mediaTypeBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(10, 29, 55, 0.8)',
    borderRadius: 4,
    padding: 4,
    zIndex: 2,
  },
  videoBadge: {
    backgroundColor: 'rgba(231, 76, 60, 0.8)',
  },
  videoPreviewContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F7F7F7',
    position: 'relative',
  },
  videoPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8E8E8',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  videoDurationText: {
    fontSize: 11,
    fontFamily: FONTS.semiBold,
    color: '#FFFFFF',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  mediaUploadContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  mediaUploadButton: {
    flex: 1,
    height: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E8E8E8',
    borderStyle: 'dashed',
  },
  imageUploadButton: {
    borderColor: '#E8E8E8',
  },
  videoUploadButton: {
    backgroundColor: '#0A1D37',
    borderColor: '#0A1D37',
    borderStyle: 'solid',
  },
  mediaUploadText: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
    color: '#0A1D37',
    marginTop: 6,
    letterSpacing: 0.3,
  },
  videoUploadTextStyle: {
    color: '#FFFFFF',
  },
  videoLimitText: {
    fontSize: 10,
    fontFamily: FONTS.regular,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
    letterSpacing: 0.2,
  },
  videoTrimHint: {
    fontSize: 9,
    fontFamily: FONTS.regular,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
    letterSpacing: 0.2,
    fontStyle: 'italic',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    color: '#0A1D37',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    fontFamily: FONTS.regular,
    color: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  inputError: {
    borderColor: '#E74C3C',
    borderWidth: 1.5,
  },
  fieldError: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: '#E74C3C',
    marginTop: 6,
    letterSpacing: 0.2,
  },
  captionFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 6,
  },
  characterCount: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: '#6D6D6D',
    letterSpacing: 0.2,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 14,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  categoryButtonText: {
    fontSize: 15,
    fontFamily: FONTS.regular,
    color: '#1A1A1A',
  },
  placeholderText: {
    color: '#9B9B9B',
  },
  buttonContainer: {
    marginTop: 8,
    marginBottom: 32,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    maxHeight: '70%',
    shadowColor: '#0A1D37',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  modalScrollView: {
    maxHeight: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: '#0A1D37',
    letterSpacing: 0.5,
  },
  categoryButtonDisabled: {
    backgroundColor: '#F7F7F7',
    borderColor: '#E8E8E8',
  },
  disabledText: {
    color: '#C0C0C0',
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  categoryOptionText: {
    flex: 1,
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: '#1A1A1A',
    letterSpacing: 0.3,
  },
  errorContainer: {
    marginBottom: 16,
  },
  compressingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  compressingText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: '#6D6D6D',
    marginTop: 12,
    letterSpacing: 0.2,
  },
  compressingProgress: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: '#9B9B9B',
    marginTop: 4,
    letterSpacing: 0.2,
  },
});

