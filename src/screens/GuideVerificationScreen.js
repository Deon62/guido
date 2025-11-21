import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Platform, StatusBar as RNStatusBar, Alert, KeyboardAvoidingView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export const GuideVerificationScreen = ({ onBack, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    phone: '',
    otp: '',
  });
  const [idImage, setIdImage] = useState(null);
  const [selfieImage, setSelfieImage] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [selectedGender, setSelectedGender] = useState(null);
  
  // Get safe area insets
  const statusBarHeight = Platform.OS === 'ios' ? 44 : RNStatusBar.currentHeight || 0;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const pickImage = async (type) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to upload images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      if (type === 'id') {
        setIdImage(result.assets[0].uri);
      } else {
        setSelfieImage(result.assets[0].uri);
      }
    }
  };

  const handleSendOTP = () => {
    if (!formData.phone) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }
    // TODO: Send OTP to phone
    setOtpSent(true);
    Alert.alert('OTP Sent', 'Please check your phone for the verification code');
  };

  const handleSubmit = () => {
    if (!formData.name || !selectedGender || !idImage || !selfieImage || !formData.phone || !formData.otp) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (onSubmit) {
      onSubmit({
        ...formData,
        gender: selectedGender,
        idImage,
        selfieImage,
      });
    }
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
        <Text style={styles.headerTitle}>Get Verified Badge</Text>
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
          nestedScrollEnabled={true}
        >
        {/* Info Section */}
        <View style={styles.infoSection}>
          <Ionicons name="information-circle" size={24} color="#2196F3" />
          <Text style={styles.infoText}>
            Complete verification to get your verified badge. This helps build trust with users.
          </Text>
        </View>

        {/* Name Field */}
        <View style={styles.section}>
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#6D6D6D" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor="#6D6D6D"
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
            />
          </View>
        </View>

        {/* Gender Field */}
        <View style={styles.section}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.genderContainer}>
            {['Male', 'Female', 'Other'].map((gender) => (
              <TouchableOpacity
                key={gender}
                style={[
                  styles.genderOption,
                  selectedGender === gender && styles.genderOptionSelected
                ]}
                onPress={() => setSelectedGender(gender)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.genderText,
                  selectedGender === gender && styles.genderTextSelected
                ]}>
                  {gender}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ID/Passport Image */}
        <View style={styles.section}>
          <Text style={styles.label}>ID / Passport</Text>
          <TouchableOpacity
            style={styles.imagePicker}
            onPress={() => pickImage('id')}
            activeOpacity={0.7}
          >
            {idImage ? (
              <Image source={{ uri: idImage }} style={styles.previewImage} resizeMode="cover" />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="camera" size={32} color="#6D6D6D" />
                <Text style={styles.imagePlaceholderText}>Tap to upload ID/Passport</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Selfie Image */}
        <View style={styles.section}>
          <Text style={styles.label}>Selfie Photo</Text>
          <TouchableOpacity
            style={styles.imagePicker}
            onPress={() => pickImage('selfie')}
            activeOpacity={0.7}
          >
            {selfieImage ? (
              <Image source={{ uri: selfieImage }} style={styles.previewImage} resizeMode="cover" />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="person" size={32} color="#6D6D6D" />
                <Text style={styles.imagePlaceholderText}>Tap to upload selfie</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Phone Number */}
        <View style={styles.section}>
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={20} color="#6D6D6D" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              placeholderTextColor="#6D6D6D"
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
            />
            <TouchableOpacity
              style={[styles.otpButton, otpSent && styles.otpButtonSent]}
              onPress={handleSendOTP}
              disabled={otpSent}
              activeOpacity={0.7}
            >
              <Text style={[styles.otpButtonText, otpSent && styles.otpButtonTextSent]}>
                {otpSent ? 'Sent' : 'Send OTP'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* OTP Field */}
        {otpSent && (
          <View style={styles.section}>
            <Text style={styles.label}>Verification Code</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#6D6D6D" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter OTP"
                placeholderTextColor="#6D6D6D"
                keyboardType="number-pad"
                value={formData.otp}
                onChangeText={(value) => handleInputChange('otp', value)}
                maxLength={6}
              />
            </View>
          </View>
        )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Verification Fee</Text>
          <Text style={styles.price}>$20 USD</Text>
        </View>
        <TouchableOpacity
          style={styles.payButton}
          onPress={handleSubmit}
          activeOpacity={0.7}
        >
          <Text style={styles.payButtonText}>Pay & Submit</Text>
        </TouchableOpacity>
      </View>
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
    fontSize: 20,
    fontWeight: '700',
    color: '#0A1D37',
    letterSpacing: 0.3,
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
    paddingBottom: 180,
  },
  infoSection: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: 16,
    margin: 24,
    marginBottom: 16,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#0A1D37',
    marginLeft: 12,
    letterSpacing: 0.2,
    lineHeight: 20,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
    paddingVertical: 14,
    letterSpacing: 0.2,
  },
  otpButton: {
    backgroundColor: '#0A1D37',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  otpButtonSent: {
    backgroundColor: '#E8E8E8',
  },
  otpButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  otpButtonTextSent: {
    color: '#6D6D6D',
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  genderOption: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderOptionSelected: {
    borderColor: '#2196F3',
    backgroundColor: '#E3F2FD',
  },
  genderText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3A3A3A',
    letterSpacing: 0.2,
  },
  genderTextSelected: {
    color: '#2196F3',
    fontWeight: '600',
  },
  imagePicker: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    overflow: 'hidden',
  },
  imagePlaceholder: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
  },
  imagePlaceholderText: {
    fontSize: 13,
    color: '#6D6D6D',
    marginTop: 8,
    letterSpacing: 0.2,
  },
  previewImage: {
    width: '100%',
    height: 200,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    shadowColor: '#0A1D37',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    alignItems: 'center',
    gap: 16,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: '#6D6D6D',
    letterSpacing: 0.2,
    marginBottom: 2,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0A1D37',
    letterSpacing: 0.3,
  },
  payButton: {
    backgroundColor: '#0A1D37',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    minWidth: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});

