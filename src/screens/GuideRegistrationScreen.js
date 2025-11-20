import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Platform, StatusBar as RNStatusBar, KeyboardAvoidingView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/Button';

export const GuideRegistrationScreen = ({ onBack, onSubmit }) => {
  // Get safe area insets
  const statusBarHeight = Platform.OS === 'ios' ? 44 : RNStatusBar.currentHeight || 0;

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    specialty: '',
    bio: '',
    languages: '',
    experience: '',
    hourlyRate: '',
    availability: '',
  });

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(formData);
    }
  };

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
          <Text style={styles.title}>Tell us about yourself</Text>
          <Text style={styles.subtitle}>Fill in your details to become a guide</Text>
          
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

          {/* Experience */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Years of Experience *</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="time-outline" size={20} color="#6D6D6D" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter years of experience"
                placeholderTextColor="#6D6D6D"
                value={formData.experience}
                onChangeText={(value) => updateField('experience', value)}
                keyboardType="numeric"
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

          <Button
            title="Submit Application"
            onPress={handleSubmit}
            variant="primary"
          />
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
    fontWeight: '700',
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
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0A1D37',
    letterSpacing: 0.3,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6D6D6D',
    letterSpacing: 0.2,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
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
    color: '#1A1A1A',
    letterSpacing: 0.2,
    padding: 0,
  },
  textAreaContainer: {
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 0,
  },
});

