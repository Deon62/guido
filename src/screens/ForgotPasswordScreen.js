import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform, StatusBar as RNStatusBar, KeyboardAvoidingView, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/Button';
import { FONTS } from '../constants/fonts';

export const ForgotPasswordScreen = ({ email, onSetNewPassword, onBack }) => {
  const statusBarHeight = Platform.OS === 'ios' ? 44 : RNStatusBar.currentHeight || 0;
  
  // Mask email - show only first 2 letters
  const maskEmail = (email) => {
    if (!email) return 'your email';
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 2) {
      return `${localPart[0]}***@${domain}`;
    }
    return `${localPart.substring(0, 2)}***@${domain}`;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <StatusBar style="dark" />
      
      {/* Floating Back Button */}
      {onBack && (
        <TouchableOpacity
          style={[styles.floatingBackButton, { top: statusBarHeight + 16 }]}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#0A1D37" />
        </TouchableOpacity>
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Image */}
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/images/emaiil.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Check Your Email</Text>
          <Text style={styles.subtitle}>
            We've sent a password reset link to{'\n'}
            <Text style={styles.emailText}>{maskEmail(email)}</Text>
          </Text>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Ionicons name="mail-outline" size={24} color="#0A1D37" />
          <Text style={styles.infoText}>
            Click the link in the email to reset your password. The link will expire in 24 hours.
          </Text>
        </View>

        {/* Set New Password Button */}
        <Button
          title="Set New Password"
          onPress={onSetNewPassword}
          variant="primary"
        />

        {/* Resend Link */}
        <TouchableOpacity
          style={styles.resendContainer}
          onPress={() => {
            // In a real app, this would resend the email
            console.log('Resend password reset email');
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.resendText}>Didn't receive the email? </Text>
          <Text style={styles.resendLink}>Resend</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  floatingBackButton: {
    position: 'absolute',
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0A1D37',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 32,
  },
  image: {
    width: 240,
    height: 240,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontFamily: FONTS.bold,
    color: '#0A1D37',
    marginBottom: 12,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: '#6D6D6D',
    textAlign: 'center',
    lineHeight: 24,
  },
  emailText: {
    fontFamily: FONTS.semiBold,
    color: '#0A1D37',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#F7F7F7',
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: '#3A3A3A',
    marginLeft: 12,
    lineHeight: 20,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  resendText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: '#6D6D6D',
  },
  resendLink: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    color: '#0A1D37',
  },
});

