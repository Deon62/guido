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
    subCategory: '',
    caption: '',
    images: [],
  });
  const [fieldErrors, setFieldErrors] = useState({
    placeName: null,
    location: null,
    mainCategory: null,
    subCategory: null,
    caption: null,
    images: null,
  });

  const [showMainCategoryModal, setShowMainCategoryModal] = useState(false);
  const [showSubCategoryModal, setShowSubCategoryModal] = useState(false);
  
  const mainCategories = ['Core', 'Cultural', 'Relaxation', 'Food & Drink Niche', 'Miscellaneous / Unique'];
  
  const categoryOptions = {
    Core: [
      'Hotels',
      'Cafes',
      'Restaurants',
      'Museums',
      'Landmarks',
      'Nature / Parks',
      'Beaches',
      'Nightlife / Bars',
      'Shopping / Malls',
      'Theaters / Cinemas',
      'Adventure & Outdoors',
      'Hiking Trails',
      'Mountains',
      'Lakes / Rivers',
      'Wildlife / Safari',
      'Camping Sites',
      'Sports Facilities / Gyms',
    ],
    Cultural: [
      'Art Galleries',
      'Historical Sites',
      'Markets / Bazaars',
      'Religious Sites (Churches, Temples, Mosques)',
      'Festivals / Event Venues',
    ],
    Relaxation: [
      'Spas',
      'Wellness Retreats',
      'Resorts',
      'Yoga / Meditation Centers',
    ],
    'Food & Drink Niche': [
      'Bakeries / Pastry Shops',
      'Juice / Smoothie Bars',
      'Street Food Spots',
      'Wine / Brewery Tours',
    ],
    'Miscellaneous / Unique': [
      'Co-working Spaces',
      'Libraries / Book Cafes',
      'Scenic Views / Lookouts',
      'Photography Spots',
      'Hidden Gems / Secret Spots',
    ],
  };

  const handleSave = async () => {
    if (isSubmitting) return;

    // Validate all fields
    const errors = {
      placeName: validatePlaceName(formData.placeName),
      location: validateLocation(formData.location),
      mainCategory: !formData.mainCategory ? 'Main category is required' : null,
      subCategory: !formData.subCategory ? 'Sub category is required' : null,
      images: formData.images.length === 0 ? 'At least one image is required' : null,
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
        Alert.alert('Permission Required', 'We need camera roll permissions to upload images!');
        return;
      }

      // Calculate how many images can still be selected
      const remainingSlots = 5 - formData.images.length;
      if (remainingSlots === 0) {
        Alert.alert('Maximum Images', 'You can only select up to 5 images');
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
            images: [...prev.images, compressedImage].slice(0, 5), // Ensure max 5 images
          }));
          
          // Clear image error if any
          setFieldErrors(prev => ({
            ...prev,
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

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
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
            {/* Image Upload Section */}
            <View style={styles.imageSection}>
              <Text style={styles.label}>Images *</Text>
              <Text style={styles.imageCountText}>
                {formData.images.length} / 5 images selected
              </Text>
              {fieldErrors.images && (
                <Text style={styles.fieldError}>{fieldErrors.images}</Text>
              )}
              
              {/* Image Previews Grid */}
              {formData.images.length > 0 && (
                <View style={styles.imagesGrid}>
                  {formData.images.map((image, index) => (
                    <View key={index} style={styles.imagePreviewWrapper}>
                      <Image source={image} style={styles.imagePreviewSmall} resizeMode="cover" />
                      <TouchableOpacity
                        style={styles.removeImageButtonSmall}
                        onPress={() => handleRemoveImage(index)}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="close-circle" size={20} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              {/* Add Image Button */}
              {formData.images.length < 5 && (
                <TouchableOpacity
                  style={styles.imageUploadButton}
                  onPress={handleImagePick}
                  activeOpacity={0.8}
                  disabled={isCompressing}
                >
                  {isCompressing ? (
                    <View style={styles.compressingContainer}>
                      <ActivityIndicator size="large" color="#0A1D37" />
                      <Text style={styles.compressingText}>Compressing image...</Text>
                      {compressionProgress.total > 0 && (
                        <Text style={styles.compressingProgress}>
                          {compressionProgress.current} / {compressionProgress.total}
                        </Text>
                      )}
                    </View>
                  ) : (
                    <>
                      <Ionicons name="camera" size={32} color="#6D6D6D" />
                      <Text style={styles.imageUploadText}>
                        {formData.images.length === 0 ? 'Add Photos' : 'Add More Photos'}
                      </Text>
                      <Text style={styles.imageUploadSubtext}>
                        {formData.images.length === 0 
                          ? 'Tap to upload images (up to 5)' 
                          : `Add ${5 - formData.images.length} more image${5 - formData.images.length > 1 ? 's' : ''}`
                        }
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
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

            {/* Sub Category Dropdown */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Sub Category *</Text>
              <TouchableOpacity
                style={[
                  styles.categoryButton, 
                  fieldErrors.subCategory && styles.inputError,
                  !formData.mainCategory && styles.categoryButtonDisabled
                ]}
                onPress={() => {
                  if (formData.mainCategory) {
                    setShowSubCategoryModal(true);
                  }
                }}
                activeOpacity={0.7}
                disabled={!formData.mainCategory}
              >
                <Text style={[
                  styles.categoryButtonText, 
                  !formData.subCategory && styles.placeholderText,
                  !formData.mainCategory && styles.disabledText
                ]}>
                  {formData.subCategory || (formData.mainCategory ? 'Select Sub Category' : 'Select main category first')}
                </Text>
                <Ionicons name="chevron-down" size={20} color={formData.mainCategory ? "#6D6D6D" : "#C0C0C0"} />
              </TouchableOpacity>
              {fieldErrors.subCategory && (
                <Text style={styles.fieldError}>{fieldErrors.subCategory}</Text>
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
                    // Reset sub category when main category changes
                    updateField('subCategory', '');
                    setFieldErrors(prev => ({
                      ...prev,
                      mainCategory: null,
                      subCategory: null,
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

      {/* Sub Category Modal */}
      <Modal
        visible={showSubCategoryModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSubCategoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setShowSubCategoryModal(false)}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Sub Category</Text>
              <TouchableOpacity
                onPress={() => setShowSubCategoryModal(false)}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color="#0A1D37" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
              {formData.mainCategory && categoryOptions[formData.mainCategory]?.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={styles.categoryOption}
                  onPress={() => {
                    updateField('subCategory', category);
                    setFieldErrors(prev => ({
                      ...prev,
                      subCategory: null,
                    }));
                    setShowSubCategoryModal(false);
                    triggerHaptic('light');
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.categoryOptionText}>{category}</Text>
                  {formData.subCategory === category && (
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
  imageSection: {
    marginBottom: 24,
  },
  imageCountText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: '#6D6D6D',
    marginBottom: 12,
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    marginHorizontal: -6,
  },
  imagePreviewWrapper: {
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
  imagePreviewSmall: {
    width: '100%',
    height: '100%',
  },
  removeImageButtonSmall: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 10,
  },
  imageUploadButton: {
    width: '100%',
    height: 120,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E8E8E8',
    borderStyle: 'dashed',
  },
  imageUploadText: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    color: '#0A1D37',
    marginTop: 8,
    letterSpacing: 0.3,
  },
  imageUploadSubtext: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: '#6D6D6D',
    marginTop: 4,
    letterSpacing: 0.2,
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

