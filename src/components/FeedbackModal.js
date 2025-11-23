import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONTS } from '../constants/fonts';
import { triggerHaptic } from '../utils/haptics';
import { submitFeedback, submitFeatureRequest } from '../services/authService';
import { getToken } from '../utils/storage';

export const FeedbackModal = ({ visible, type, onClose, onSubmit }) => {
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const title = type === 'feedback' ? 'Share Feedback' : 'Request Feature';
  const placeholder = type === 'feedback' 
    ? 'Tell us what you think about the app...'
    : 'Describe the feature you\'d like to see...';

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      triggerHaptic('error');
      return;
    }

    const token = getToken();
    if (!token) {
      Alert.alert('Authentication Required', 'Please log in to submit feedback.');
      return;
    }

    triggerHaptic('medium');
    setIsSubmitting(true);

    try {
      // Call the appropriate API based on type
      if (type === 'feedback') {
        await submitFeedback(token, feedback.trim());
      } else {
        await submitFeatureRequest(token, feedback.trim());
      }
      
      if (onSubmit) {
        onSubmit({ type, feedback: feedback.trim() });
      }
      
      triggerHaptic('success');
      setShowSuccess(true);
      
      // Auto close after 2 seconds
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      triggerHaptic('error');
      console.error('Error submitting feedback:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to submit. Please try again later.'
      );
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFeedback('');
    setShowSuccess(false);
    setIsSubmitting(false);
    if (onClose) onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={handleClose}
        >
          <TouchableOpacity
            style={styles.modalContent}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            {showSuccess ? (
              <View style={styles.successContainer}>
                <View style={styles.successIconContainer}>
                  <Ionicons name="checkmark-circle" size={64} color="#4ECDC4" />
                </View>
                <Text style={styles.successTitle}>Thank You!</Text>
                <Text style={styles.successMessage}>
                  {type === 'feedback' 
                    ? 'Your feedback has been submitted successfully.'
                    : 'Your feature request has been submitted successfully.'}
                </Text>
              </View>
            ) : (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{title}</Text>
                  <TouchableOpacity
                    onPress={handleClose}
                    style={styles.closeButton}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="close" size={24} color="#6D6D6D" />
                  </TouchableOpacity>
                </View>

                <ScrollView
                  style={styles.scrollView}
                  contentContainerStyle={styles.scrollContent}
                  keyboardShouldPersistTaps="handled"
                >
                  <Text style={styles.label}>
                    {type === 'feedback' ? 'Your Feedback' : 'Feature Description'}
                  </Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder={placeholder}
                    placeholderTextColor="#9B9B9B"
                    value={feedback}
                    onChangeText={setFeedback}
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                    maxLength={500}
                  />
                  <Text style={styles.characterCount}>
                    {feedback.length} / 500
                  </Text>
                </ScrollView>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleClose}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      (!feedback.trim() || isSubmitting) && styles.submitButtonDisabled
                    ]}
                    onPress={handleSubmit}
                    disabled={!feedback.trim() || isSubmitting}
                    activeOpacity={0.8}
                  >
                    <Text style={[
                      styles.submitButtonText,
                      (!feedback.trim() || isSubmitting) && styles.submitButtonTextDisabled
                    ]}>
                      {isSubmitting ? 'Submitting...' : 'Submit'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#0A1D37',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
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
  closeButton: {
    padding: 4,
  },
  scrollView: {
    maxHeight: 300,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    color: '#0A1D37',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  textInput: {
    backgroundColor: '#F7F7F7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: FONTS.regular,
    color: '#1A1A1A',
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: '#9B9B9B',
    textAlign: 'right',
    marginTop: 8,
    letterSpacing: 0.2,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 20,
    backgroundColor: '#F7F7F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontFamily: FONTS.semiBold,
    color: '#6D6D6D',
    letterSpacing: 0.3,
  },
  submitButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 20,
    backgroundColor: '#0A1D37',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0A1D37',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 15,
    fontFamily: FONTS.semiBold,
    color: '#F7F7F7',
    letterSpacing: 0.3,
  },
  submitButtonTextDisabled: {
    opacity: 0.7,
  },
  successContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIconContainer: {
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: '#0A1D37',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  successMessage: {
    fontSize: 15,
    fontFamily: FONTS.regular,
    color: '#6D6D6D',
    textAlign: 'center',
    lineHeight: 22,
    letterSpacing: 0.2,
  },
});

