import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Platform, StatusBar as RNStatusBar, KeyboardAvoidingView, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { FONTS } from '../constants/fonts';

export const GuideRegistrationScreen = ({ onBack, onSubmit }) => {
  // Get safe area insets
  const statusBarHeight = Platform.OS === 'ios' ? 44 : RNStatusBar.currentHeight || 0;

  const [currentStep, setCurrentStep] = useState(1);
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    specialty: '',
    bio: '',
    languages: '',
    hourlyRate: '',
    availability: '',
    paymentMethod: '',
  });

  const paymentMethods = ['Mobile Money', 'Card', 'Crypto', 'Cash'];

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.fullName.trim() && formData.email.trim() && formData.phone.trim();
      case 2:
        return formData.city.trim() && formData.specialty.trim() && formData.bio.trim();
      case 3:
        return formData.languages.trim() && formData.hourlyRate.trim() && formData.availability.trim() && formData.paymentMethod.trim();
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      {/* Full Name */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Full Name *</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#6D6D6D" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor="#6D6D6D"
            value={formData.fullName}
            onChangeText={(value) => updateField('fullName', value)}
            autoCapitalize="words"
          />
        </View>
      </View>

      {/* Email */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email Address *</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#6D6D6D" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#6D6D6D"
            value={formData.email}
            onChangeText={(value) => updateField('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </View>

      {/* Phone */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phone Number *</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="call-outline" size={20} color="#6D6D6D" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your phone number"
            placeholderTextColor="#6D6D6D"
            value={formData.phone}
            onChangeText={(value) => updateField('phone', value)}
            keyboardType="phone-pad"
          />
        </View>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      {/* City */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>City *</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="location-outline" size={20} color="#6D6D6D" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your city"
            placeholderTextColor="#6D6D6D"
            value={formData.city}
            onChangeText={(value) => updateField('city', value)}
            autoCapitalize="words"
          />
        </View>
      </View>

      {/* Specialty */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Specialty *</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="star-outline" size={20} color="#6D6D6D" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="e.g., Historical Tours, Food Tours, Art & Architecture"
            placeholderTextColor="#6D6D6D"
            value={formData.specialty}
            onChangeText={(value) => updateField('specialty', value)}
            autoCapitalize="words"
          />
        </View>
      </View>

      {/* Bio */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Bio *</Text>
        <View style={[styles.inputContainer, styles.textAreaContainer]}>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Tell travelers about yourself and your tours..."
            placeholderTextColor="#6D6D6D"
            value={formData.bio}
            onChangeText={(value) => updateField('bio', value)}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      {/* Languages */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Languages Spoken *</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="language-outline" size={20} color="#6D6D6D" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="e.g., English, Spanish, French"
            placeholderTextColor="#6D6D6D"
            value={formData.languages}
            onChangeText={(value) => updateField('languages', value)}
          />
        </View>
      </View>

      {/* Hourly Rate */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Hourly Rate ($) *</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="cash-outline" size={20} color="#6D6D6D" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your hourly rate"
            placeholderTextColor="#6D6D6D"
            value={formData.hourlyRate}
            onChangeText={(value) => updateField('hourlyRate', value)}
            keyboardType="decimal-pad"
          />
        </View>
      </View>

      {/* Availability */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Availability *</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="calendar-outline" size={20} color="#6D6D6D" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="e.g., Weekdays 9 AM - 6 PM"
            placeholderTextColor="#6D6D6D"
            value={formData.availability}
            onChangeText={(value) => updateField('availability', value)}
          />
        </View>
      </View>

      {/* Payment Method */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Payment Method *</Text>
        <TouchableOpacity
          style={styles.inputContainer}
          onPress={() => setShowPaymentDropdown(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="wallet-outline" size={20} color="#6D6D6D" style={styles.inputIcon} />
          <Text style={[styles.input, !formData.paymentMethod && styles.placeholderText]}>
            {formData.paymentMethod || 'Select payment method'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#6D6D6D" />
        </TouchableOpacity>
      </View>

      {/* Payment Method Dropdown Modal */}
      <Modal
        visible={showPaymentDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPaymentDropdown(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPaymentDropdown(false)}
        >
          <View style={styles.dropdownContainer}>
            {paymentMethods.map((method, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dropdownItem,
                  formData.paymentMethod === method && styles.dropdownItemSelected
                ]}
                onPress={() => {
                  updateField('paymentMethod', method);
                  setShowPaymentDropdown(false);
                }}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.dropdownItemText,
                  formData.paymentMethod === method && styles.dropdownItemTextSelected
                ]}>
                  {method}
                </Text>
                {formData.paymentMethod === method && (
                  <Ionicons name="checkmark" size={20} color="#0A1D37" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
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
        <Text style={styles.headerTitle}>Join as Guide</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View style={styles.content}>
          {/* Centered Title */}
          <Text style={styles.title}>Tell us about yourself...</Text>
          
          {/* Step Indicators */}
          <View style={styles.stepIndicators}>
            <View style={[styles.stepIndicator, currentStep >= 1 && styles.stepIndicatorActive]} />
            <View style={[styles.stepIndicator, currentStep >= 2 && styles.stepIndicatorActive]} />
            <View style={[styles.stepIndicator, currentStep >= 3 && styles.stepIndicatorActive]} />
          </View>

          {/* Step Content */}
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          {/* Navigation Buttons */}
          <View style={styles.navigationButtons}>
            {currentStep > 1 && (
              <TouchableOpacity
                style={styles.backButtonNav}
                onPress={handleBack}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={20} color="#0A1D37" style={{ marginRight: 8 }} />
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                styles.nextButton,
                !validateStep(currentStep) && styles.nextButtonDisabled
              ]}
              onPress={handleNext}
              disabled={!validateStep(currentStep)}
              activeOpacity={0.8}
            >
              <Text style={styles.nextButtonText}>
                {currentStep === 3 ? 'Submit' : 'Next'}
              </Text>
              {currentStep < 3 && (
                <Ionicons name="arrow-forward" size={20} color="#F7F7F7" style={{ marginLeft: 8 }} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    paddingBottom: 100,
  },
  content: {
    padding: 24,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: '#0A1D37',
    letterSpacing: 0.3,
    marginBottom: 32,
    textAlign: 'center',
  },
  stepIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  stepIndicator: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E8E8E8',
    marginHorizontal: 4,
  },
  stepIndicatorActive: {
    backgroundColor: '#0A1D37',
  },
  stepContent: {
    flex: 1,
    minHeight: 300,
  },
  inputGroup: {
    marginBottom: 20,
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
  textAreaContainer: {
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 0,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 32,
  },
  backButtonNav: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#0A1D37',
    marginRight: 12,
  },
  backButtonText: {
    fontSize: 15,
    fontFamily: FONTS.semiBold,
    color: '#0A1D37',
    letterSpacing: 0.6,
  },
  nextButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 20,
    backgroundColor: '#0A1D37',
    shadowColor: '#0A1D37',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  nextButtonDisabled: {
    backgroundColor: '#CCCCCC',
    shadowOpacity: 0,
    elevation: 0,
  },
  nextButtonText: {
    fontSize: 15,
    fontFamily: FONTS.semiBold,
    color: '#F7F7F7',
    letterSpacing: 0.6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 8,
    minWidth: 280,
    maxWidth: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemSelected: {
    backgroundColor: '#F7F7F7',
  },
  dropdownItemText: {
    fontSize: 15,
    fontFamily: FONTS.regular,
    color: '#1A1A1A',
    letterSpacing: 0.2,
  },
  dropdownItemTextSelected: {
    fontFamily: FONTS.semiBold,
    color: '#0A1D37',
  },
});

