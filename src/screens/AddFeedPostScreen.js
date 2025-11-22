import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Platform, StatusBar as RNStatusBar, Modal, KeyboardAvoidingView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Button } from '../components/Button';
import { FONTS } from '../constants/fonts';

export const AddFeedPostScreen = ({ onBack, onSave }) => {
  // Get safe area insets
  const statusBarHeight = Platform.OS === 'ios' ? 44 : RNStatusBar.currentHeight || 0;

  const [formData, setFormData] = useState({
    placeName: '',
    location: '',
    category: '',
    caption: '',
    images: [],
  });

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const categories = ['Landmarks', 'Hotels', 'Cafes', 'Nature'];

  const handleSave = () => {
    if (!formData.placeName || !formData.location || !formData.category || formData.images.length === 0) {
      Alert.alert('Missing Information', 'Please fill in all required fields and add at least one image');
      return;
    }

    if (onSave) {
      onSave(formData);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
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
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newImage = { uri: result.assets[0].uri };
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, newImage].slice(0, 5), // Ensure max 5 images
        }));
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
                >
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
                </TouchableOpacity>
              )}
            </View>

            {/* Place Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Place Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Eiffel Tower"
                placeholderTextColor="#9B9B9B"
                value={formData.placeName}
                onChangeText={(text) => updateField('placeName', text)}
              />
            </View>

            {/* Location */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Location *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Paris, France"
                placeholderTextColor="#9B9B9B"
                value={formData.location}
                onChangeText={(text) => updateField('location', text)}
              />
            </View>

            {/* Category Dropdown */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category *</Text>
              <TouchableOpacity
                style={styles.categoryButton}
                onPress={() => setShowCategoryModal(true)}
                activeOpacity={0.7}
              >
                <Text style={[styles.categoryButtonText, !formData.category && styles.placeholderText]}>
                  {formData.category || 'Select Category'}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#6D6D6D" />
              </TouchableOpacity>
            </View>

            {/* Caption */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Caption</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Share your experience..."
                placeholderTextColor="#9B9B9B"
                value={formData.caption}
                onChangeText={(text) => updateField('caption', text)}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Save Button */}
            <View style={styles.buttonContainer}>
              <Button
                title="Post to Feed"
                onPress={handleSave}
                variant="primary"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Category Modal */}
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
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={styles.categoryOption}
                onPress={() => {
                  updateField('category', category);
                  setShowCategoryModal(false);
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.categoryColorDot, { backgroundColor: getCategoryColor(category) }]} />
                <Text style={styles.categoryOptionText}>{category}</Text>
                {formData.category === category && (
                  <Ionicons name="checkmark" size={20} color="#0A1D37" />
                )}
              </TouchableOpacity>
            ))}
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    maxHeight: '50%',
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
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F7F7F7',
  },
  categoryColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryOptionText: {
    flex: 1,
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: '#1A1A1A',
    letterSpacing: 0.3,
  },
});

