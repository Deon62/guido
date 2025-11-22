import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Platform, StatusBar as RNStatusBar, Alert, KeyboardAvoidingView, Keyboard } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/Button';
import { FONTS } from '../constants/fonts';
import { validateEmail, validateUsername, validateMaxLength } from '../utils/formValidation';
import { triggerHaptic } from '../utils/haptics';
import { updateProfile } from '../services/authService';
import { getToken, storeUser } from '../utils/storage';

export const EditProfileScreen = ({ user, onBack, onSave, onProfilePicturePress, currentAvatar }) => {
  // Get safe area insets
  const statusBarHeight = Platform.OS === 'ios' ? 44 : RNStatusBar.currentHeight || 0;

  // Initialize username - remove @ if present (we'll add it when saving)
  const initialUsername = user?.username || '';
  const usernameWithoutAt = initialUsername.startsWith('@') ? initialUsername.slice(1) : initialUsername;
  
  const [formData, setFormData] = useState({
    nickname: user?.nickname || user?.name || '',
    username: usernameWithoutAt,
    email: user?.email || '',
    city: user?.city || '',
    avatar: currentAvatar || user?.avatar,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    nickname: null,
    username: null,
    email: null,
    city: null,
  });
  const scrollViewRef = useRef(null);
  const emailInputRef = useRef(null);
  const cityInputRef = useRef(null);
  const emailInputLayout = useRef({ y: 0 });
  const cityInputLayout = useRef({ y: 0 });

  // Update avatar when currentAvatar prop changes
  useEffect(() => {
    if (currentAvatar) {
      setFormData(prev => ({
        ...prev,
        avatar: currentAvatar,
      }));
    }
  }, [currentAvatar]);

  const handleSave = async () => {
    if (isSubmitting) return;

    // Validate all fields
    // For username validation, check without @ prefix
    const usernameToValidate = formData.username?.startsWith('@') 
      ? formData.username.slice(1) 
      : formData.username;
    
    const errors = {
      nickname: validateMaxLength(formData.nickname, 50, 'Nickname'),
      username: usernameToValidate ? validateUsername(usernameToValidate) : null,
      email: formData.email ? (validateEmail(formData.email) ? null : 'Please enter a valid email address') : null,
      city: validateMaxLength(formData.city, 100, 'City'),
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
        throw new Error('Not authenticated. Please login again.');
      }

      // Call update profile API
      const updatedUser = await updateProfile(token, {
        nickname: formData.nickname,
        username: usernameToValidate, // API will add @ prefix
        email: formData.email,
        city: formData.city,
      });
      
      // Store updated user data
      if (updatedUser) {
        storeUser(updatedUser);
      }
      
      if (onSave) {
        onSave({ ...formData, ...updatedUser });
      }
      
      triggerHaptic('success');
      if (onBack) {
        onBack();
      }
    } catch (error) {
      console.error('Profile update error:', error);
      triggerHaptic('error');
      
      // Handle validation errors
      if (error.isValidationError && error.errors) {
        const fieldErrors = {};
        if (typeof error.errors === 'object') {
          Object.keys(error.errors).forEach((field) => {
            const fieldError = error.errors[field];
            if (Array.isArray(fieldError)) {
              fieldErrors[field] = fieldError[0] || fieldError;
            } else if (typeof fieldError === 'string') {
              fieldErrors[field] = fieldError;
            }
          });
        }
        
        if (Object.keys(fieldErrors).length > 0) {
          setFieldErrors(prev => ({ ...prev, ...fieldErrors }));
        } else {
          Alert.alert('Validation Error', error.message || 'Please check your input and try again.');
        }
      } else {
        const errorMessage = error.message || 'Failed to save profile. Please try again.';
        Alert.alert('Error', errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field, value) => {
    // For username, remove @ if user types it (we'll add it when saving)
    let processedValue = value;
    if (field === 'username' && value.startsWith('@')) {
      processedValue = value.slice(1);
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: processedValue,
    }));
    
    // Real-time validation
    let error = null;
    if (field === 'nickname') {
      error = validateMaxLength(processedValue, 50, 'Nickname');
    } else if (field === 'username') {
      error = processedValue ? validateUsername(processedValue) : null;
    } else if (field === 'email') {
      error = processedValue ? (validateEmail(processedValue) ? null : 'Please enter a valid email address') : null;
    } else if (field === 'city') {
      error = validateMaxLength(processedValue, 100, 'City');
    }
    
    setFieldErrors(prev => ({
      ...prev,
      [field]: error,
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
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
        <View style={styles.content}>
          {/* Profile Picture Section */}
          <View style={styles.profilePictureSection}>
            <View style={styles.avatarContainer}>
              {(formData.avatar || user?.avatar) ? (
                <Image
                  source={formData.avatar || user.avatar}
                  style={styles.avatar}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={40} color="#C0C0C0" />
                </View>
              )}
              <TouchableOpacity
                style={styles.cameraButton}
                onPress={() => {
                  if (onProfilePicturePress) {
                    onProfilePicturePress();
                  } else {
                    console.log('Change profile picture');
                  }
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="camera" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.profilePictureHint}>Tap camera icon to change</Text>
          </View>
          
          {/* Nickname Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nickname</Text>
            <View style={[styles.inputContainer, fieldErrors.nickname && styles.inputContainerError]}>
              <Ionicons name="person-outline" size={20} color={fieldErrors.nickname ? '#E74C3C' : '#6D6D6D'} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your nickname"
                placeholderTextColor="#6D6D6D"
                value={formData.nickname}
                onChangeText={(value) => updateField('nickname', value)}
                autoCapitalize="words"
                maxLength={50}
              />
            </View>
            {fieldErrors.nickname && (
              <Text style={styles.fieldError}>{fieldErrors.nickname}</Text>
            )}
          </View>

          {/* Username Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <View style={[styles.inputContainer, fieldErrors.username && styles.inputContainerError]}>
              <Ionicons name="at" size={20} color={fieldErrors.username ? '#E74C3C' : '#6D6D6D'} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="username (without @)"
                placeholderTextColor="#6D6D6D"
                value={formData.username}
                onChangeText={(value) => updateField('username', value)}
                autoCapitalize="none"
                maxLength={50}
              />
            </View>
            {fieldErrors.username && (
              <Text style={styles.fieldError}>{fieldErrors.username}</Text>
            )}
          </View>

          {/* Email Field */}
          <View 
            style={styles.inputGroup}
            onLayout={(event) => {
              emailInputLayout.current.y = event.nativeEvent.layout.y;
            }}
          >
            <Text style={styles.label}>Email Address</Text>
            <View style={[styles.inputContainer, fieldErrors.email && styles.inputContainerError]}>
              <Ionicons name="mail-outline" size={20} color={fieldErrors.email ? '#E74C3C' : '#6D6D6D'} style={styles.inputIcon} />
              <TextInput
                ref={emailInputRef}
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#6D6D6D"
                value={formData.email}
                onChangeText={(value) => updateField('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => {
                  setTimeout(() => {
                    scrollViewRef.current?.scrollTo({
                      y: emailInputLayout.current.y - 50,
                      animated: true,
                    });
                  }, 300);
                }}
              />
            </View>
            {fieldErrors.email && (
              <Text style={styles.fieldError}>{fieldErrors.email}</Text>
            )}
          </View>

          {/* City Field */}
          <View 
            style={styles.inputGroup}
            onLayout={(event) => {
              cityInputLayout.current.y = event.nativeEvent.layout.y;
            }}
          >
            <Text style={styles.label}>City</Text>
            <View style={[styles.inputContainer, fieldErrors.city && styles.inputContainerError]}>
              <Ionicons name="location-outline" size={20} color={fieldErrors.city ? '#E74C3C' : '#6D6D6D'} style={styles.inputIcon} />
              <TextInput
                ref={cityInputRef}
                style={styles.input}
                placeholder="Enter your city"
                placeholderTextColor="#6D6D6D"
                value={formData.city}
                onChangeText={(value) => updateField('city', value)}
                autoCapitalize="words"
                maxLength={100}
                onFocus={() => {
                  setTimeout(() => {
                    scrollViewRef.current?.scrollTo({
                      y: cityInputLayout.current.y - 50,
                      animated: true,
                    });
                  }, 300);
                }}
              />
            </View>
            {fieldErrors.city && (
              <Text style={styles.fieldError}>{fieldErrors.city}</Text>
            )}
          </View>

          <Button
            title={isSubmitting ? "Saving..." : "Save Changes"}
            onPress={handleSave}
            variant="primary"
            disabled={isSubmitting}
          />
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  },
  content: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: '#0A1D37',
    letterSpacing: 0.3,
    marginBottom: 24,
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
  profilePictureSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#F7F7F7',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#F7F7F7',
    backgroundColor: '#F7F7F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0A1D37',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#0A1D37',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  profilePictureHint: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: '#6D6D6D',
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
});

