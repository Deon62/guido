import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Platform, StatusBar as RNStatusBar, Modal, KeyboardAvoidingView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Button } from '../components/Button';
import { FONTS } from '../constants/fonts';

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
  const categories = ['Landmarks', 'Hotels', 'Cafes', 'Nature'];

  const handleSave = () => {
    if (!formData.placeName || !formData.location || !formData.category || !formData.date) {
      alert('Please fill in all required fields');
      return;
    }

    if (onSave) {
      onSave(formData);
    }
    if (onBack) {
      onBack();
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
        alert('Sorry, we need camera roll permissions to upload images!');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        updateField('image', { uri: result.assets[0].uri });
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
            <View style={styles.inputContainer}>
              <Ionicons name="location-outline" size={20} color="#6D6D6D" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="e.g., Eiffel Tower"
                placeholderTextColor="#6D6D6D"
                value={formData.placeName}
                onChangeText={(value) => updateField('placeName', value)}
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Location Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location *</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="map-outline" size={20} color="#6D6D6D" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="e.g., Paris, France"
                placeholderTextColor="#6D6D6D"
                value={formData.location}
                onChangeText={(value) => updateField('location', value)}
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Category Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category *</Text>
            <TouchableOpacity
              style={styles.inputContainer}
              onPress={() => setShowCategoryModal(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="pricetag-outline" size={20} color="#6D6D6D" style={styles.inputIcon} />
              <Text
                style={[
                  styles.input,
                  !formData.category && styles.placeholderText,
                ]}
              >
                {formData.category || 'Select category'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#6D6D6D" />
            </TouchableOpacity>
          </View>

          {/* Date Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date Visited *</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="calendar-outline" size={20} color="#6D6D6D" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="e.g., Dec 15, 2024"
                placeholderTextColor="#6D6D6D"
                value={formData.date}
                onChangeText={(value) => updateField('date', value)}
              />
            </View>
          </View>

          {/* Description Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Tell us about your experience..."
                placeholderTextColor="#6D6D6D"
                value={formData.description}
                onChangeText={(value) => updateField('description', value)}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          <Button
            title="Add Trip"
            onPress={handleSave}
            variant="primary"
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
});

