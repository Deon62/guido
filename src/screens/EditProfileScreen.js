import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/Button';
import { FONTS } from '../constants/fonts';

export const EditProfileScreen = ({ user, onBack, onSave, onProfilePicturePress, currentAvatar }) => {
  // Get safe area insets
  const statusBarHeight = Platform.OS === 'ios' ? 44 : RNStatusBar.currentHeight || 0;

  const [formData, setFormData] = useState({
    nickname: user?.nickname || user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    city: user?.city || '',
    avatar: currentAvatar || user?.avatar,
  });

  // Update avatar when currentAvatar prop changes
  useEffect(() => {
    if (currentAvatar) {
      setFormData(prev => ({
        ...prev,
        avatar: currentAvatar,
      }));
    }
  }, [currentAvatar]);

  const handleSave = () => {
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

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Profile Picture Section */}
          <View style={styles.profilePictureSection}>
            <View style={styles.avatarContainer}>
              <Image
                source={formData.avatar || user?.avatar}
                style={styles.avatar}
                resizeMode="cover"
              />
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
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#6D6D6D" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your nickname"
                placeholderTextColor="#6D6D6D"
                value={formData.nickname}
                onChangeText={(value) => updateField('nickname', value)}
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Username Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="at" size={20} color="#6D6D6D" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your username"
                placeholderTextColor="#6D6D6D"
                value={formData.username}
                onChangeText={(value) => updateField('username', value)}
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Email Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
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

          {/* City Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>City</Text>
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

          <Button
            title="Save Changes"
            onPress={handleSave}
            variant="primary"
          />
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
});

