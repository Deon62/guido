import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Platform, StatusBar as RNStatusBar, Modal, KeyboardAvoidingView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { compressImage } from '../utils/imageCompression';
import { Button } from '../components/Button';
import { FONTS } from '../constants/fonts';
import { validatePlaceName, validateLocation, validateImageFile, validateMaxLength } from '../utils/formValidation';
import { triggerHaptic } from '../utils/haptics';
import { createPastTrip } from '../services/authService';
import { getToken } from '../utils/storage';

export const AddPastTripScreen = ({ onBack, onSave }) => {
  // Get safe area insets
  const statusBarHeight = Platform.OS === 'ios' ? 44 : RNStatusBar.currentHeight || 0;

  const [formData, setFormData] = useState({
    placeName: '',
    location: '',
    category: '',
    date: '',
    description: '',
    image: null,
  });

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    placeName: null,
    location: null,
    category: null,
    date: null,
    description: null,
    image: null,
  });
  const categories = ['Landmarks', 'Hotels', 'Cafes', 'Nature'];

  const handleSave = async () => {
    if (isSubmitting) return;

    // Validate all fields
    const errors = {
      placeName: validatePlaceName(formData.placeName),
      location: validateLocation(formData.location),
      category: !formData.category ? 'Category is required' : null,
      date: !formData.date || formData.date.trim() === '' ? 'Date is required' : null,
      description: validateMaxLength(formData.description, 500, 'Description'),
    };
    
    setFieldErrors(errors);
    
    const hasErrors = Object.values(errors).some(err => err !== null);
    if (hasErrors) {
      triggerHaptic('error');
      return;
    }

    setIsSubmitting(true);
    triggerHaptic('medium');

    try {
      const token = getToken();
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }

      // Prepare trip data for API
      const tripData = {
        place_name: formData.placeName.trim(),
        location: formData.location.trim(),
        category: formData.category.trim(),
        date: formData.date.trim(),
      };

      if (formData.description && formData.description.trim()) {
        tripData.description = formData.description.trim();
      }

      // Add image if present
      if (formData.image) {
        tripData.image = formData.image;
      }

      // Call API to create trip
      const response = await createPastTrip(token, tripData);
      console.log('Past trip created:', response);
      
      if (onSave) {
        onSave({ ...formData, ...response });
      }
      triggerHaptic('success');
      Alert.alert('Success', 'Trip added successfully!');
      if (onBack) {
        onBack();
      }
    } catch (error) {
      console.error('Error creating past trip:', error);
      triggerHaptic('error');
      Alert.alert('Error', error.message || 'Failed to save trip. Please try again.');
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
    } else if (field === 'date') {
      error = !value || value.trim() === '' ? 'Date is required' : null;
    } else if (field === 'description') {
      error = validateMaxLength(value, 500, 'Description');
    }
    
    setFieldErrors(prev => ({
      ...prev,
      [field]: error,
    }));
  };

  const getCategoryColor = (category) => {
    switch (category.toLowerCase()) {
      case 'landmark':
      case 'landmarks':
        return '#FF6B6B';
      case 'hotel':
      case 'hotels':
        return '#4ECDC4';
      case 'cafe':
      case 'cafes':
        return '#FFE66D';
      case 'nature':
        return '#95E1D3';
      default:
        return '#6D6D6D';
    }
  };

  const handleImagePick = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to upload images!');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1, // Get full quality first, we'll compress it
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const originalUri = result.assets[0].uri;
        
        // Validate image file
        const imageError = await validateImageFile(originalUri);
        if (imageError) {
          Alert.alert('Invalid Image', imageError);
          triggerHaptic('error');
          return;
        }
        
        try {
          // Compress the image
          const compressedImage = await compressImage(originalUri, 1200, 1200, 0.8);
          updateField('image', compressedImage);
          setFieldErrors(prev => ({
            ...prev,
            image: null,
          }));
          triggerHaptic('light');
        } catch (compressionError) {
          console.error('Compression error:', compressionError);
          Alert.alert('Error', 'Failed to process image. Please try again.');
          triggerHaptic('error');
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      alert('Error picking image. Please try again.');
    }
  };

  const handleRemoveImage = () => {
    updateField('image', null);
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
        <Text style={styles.headerTitle}>Add Past Trip</Text>
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
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Place Image</Text>
            {formData.image ? (
              <View style={styles.imagePreviewContainer}>
                <Image source={formData.image} style={styles.imagePreview} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={handleRemoveImage}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close-circle" size={24} color="#E74C3C" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.imageUploadButton}
                onPress={handleImagePick}
                activeOpacity={0.7}
              >
                <Ionicons name="camera-outline" size={32} color="#6D6D6D" />
                <Text style={styles.imageUploadText}>Tap to upload image</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Place Name Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Place Name *</Text>
            <View style={[styles.inputContainer, fieldErrors.placeName && styles.inputContainerError]}>
              <Ionicons name="location-outline" size={20} color={fieldErrors.placeName ? '#E74C3C' : '#6D6D6D'} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="e.g., Eiffel Tower"
                placeholderTextColor="#6D6D6D"
                value={formData.placeName}
                onChangeText={(value) => updateField('placeName', value)}
                autoCapitalize="words"
              />
            </View>
            {fieldErrors.placeName && (
              <Text style={styles.fieldError}>{fieldErrors.placeName}</Text>
            )}
          </View>

          {/* Location Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location *</Text>
            <View style={[styles.inputContainer, fieldErrors.location && styles.inputContainerError]}>
              <Ionicons name="map-outline" size={20} color={fieldErrors.location ? '#E74C3C' : '#6D6D6D'} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="e.g., Paris, France"
                placeholderTextColor="#6D6D6D"
                value={formData.location}
                onChangeText={(value) => updateField('location', value)}
                autoCapitalize="words"
              />
            </View>
            {fieldErrors.location && (
              <Text style={styles.fieldError}>{fieldErrors.location}</Text>
            )}
          </View>

          {/* Category Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category *</Text>
            <TouchableOpacity
              style={[styles.inputContainer, fieldErrors.category && styles.inputContainerError]}
              onPress={() => setShowCategoryModal(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="pricetag-outline" size={20} color={fieldErrors.category ? '#E74C3C' : '#6D6D6D'} style={styles.inputIcon} />
              <Text
                style={[
                  styles.input,
                  !formData.category && styles.placeholderText,
                ]}
              >
                {formData.category || 'Select category'}
              </Text>
              <Ionicons name="chevron-down" size={20} color={fieldErrors.category ? '#E74C3C' : '#6D6D6D'} />
            </TouchableOpacity>
            {fieldErrors.category && (
              <Text style={styles.fieldError}>{fieldErrors.category}</Text>
            )}
          </View>

          {/* Date Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date Visited *</Text>
            <View style={[styles.inputContainer, fieldErrors.date && styles.inputContainerError]}>
              <Ionicons name="calendar-outline" size={20} color={fieldErrors.date ? '#E74C3C' : '#6D6D6D'} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="e.g., Dec 15, 2024"
                placeholderTextColor="#6D6D6D"
                value={formData.date}
                onChangeText={(value) => updateField('date', value)}
              />
            </View>
            {fieldErrors.date && (
              <Text style={styles.fieldError}>{fieldErrors.date}</Text>
            )}
          </View>

          {/* Description Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <View style={[styles.inputContainer, styles.textAreaContainer, fieldErrors.description && styles.inputContainerError]}>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Tell us about your experience..."
                placeholderTextColor="#6D6D6D"
                value={formData.description}
                onChangeText={(value) => updateField('description', value)}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                maxLength={500}
              />
            </View>
            <View style={styles.descriptionFooter}>
              {fieldErrors.description ? (
                <Text style={styles.fieldError}>{fieldErrors.description}</Text>
              ) : (
                <Text style={styles.characterCount}>
                  {formData.description.length} / 500
                </Text>
              )}
            </View>
          </View>

          <Button
            title={isSubmitting ? "Adding Trip..." : "Add Trip"}
            onPress={handleSave}
            variant="primary"
            disabled={isSubmitting}
          />
        </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Category Dropdown Modal */}
      <Modal
        visible={showCategoryModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCategoryModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity
                onPress={() => setShowCategoryModal(false)}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color="#0A1D37" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalList}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.modalItem,
                    formData.category === category && styles.modalItemSelected,
                  ]}
                  onPress={() => {
                    updateField('category', category);
                    setFieldErrors(prev => ({
                      ...prev,
                      category: null,
                    }));
                    setShowCategoryModal(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      formData.category === category && {
                        color: getCategoryColor(category),
                        fontFamily: FONTS.semiBold,
                      },
                    ]}
                  >
                    {category}
                  </Text>
                  {formData.category === category && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={getCategoryColor(category)}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
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
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
    flexGrow: 1,
  },
  content: {
    padding: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    color: '#1A1A1A',
    letterSpacing: 0.3,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: FONTS.regular,
    color: '#1A1A1A',
    letterSpacing: 0.2,
    padding: 0,
  },
  placeholderText: {
    color: '#6D6D6D',
  },
  imageUploadButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderStyle: 'dashed',
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageUploadText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: '#6D6D6D',
    marginTop: 8,
    letterSpacing: 0.2,
  },
  imagePreviewContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#E8E8E8',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
  },
  textAreaContainer: {
    minHeight: 100,
    paddingVertical: 12,
  },
  textArea: {
    minHeight: 80,
    paddingTop: 0,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    maxHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: '#0A1D37',
    letterSpacing: 0.3,
  },
  modalList: {
    paddingVertical: 8,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F7F7F7',
  },
  modalItemSelected: {
    backgroundColor: '#F7F7F7',
  },
  modalItemText: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: '#1A1A1A',
    letterSpacing: 0.2,
  },
  inputContainerError: {
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
  descriptionFooter: {
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
});

