import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { FONTS } from '../constants/fonts';

export const PrivacyScreen = ({ onBack, onTermsPress }) => {
  // Get safe area insets
  const statusBarHeight = Platform.OS === 'ios' ? 44 : RNStatusBar.currentHeight || 0;

  const sections = [
    {
      title: '1. Information We Collect',
      content: 'We collect information you provide directly to us, such as when you create an account, make a booking, or contact us. This includes your name, email address, phone number, and payment information.',
    },
    {
      title: '2. How We Use Your Information',
      content: 'We use the information we collect to provide, maintain, and improve our services, process transactions, send you communications, and personalize your experience.',
    },
    {
      title: '3. Information Sharing',
      content: 'We do not sell your personal information. We may share your information with guides to facilitate bookings, with service providers who assist us in operating our platform, or as required by law.',
    },
    {
      title: '4. Data Security',
      content: 'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.',
    },
    {
      title: '5. Your Rights',
      content: 'You have the right to access, update, or delete your personal information at any time. You can do this through your account settings or by contacting us directly.',
    },
    {
      title: '6. Cookies and Tracking',
      content: 'We use cookies and similar tracking technologies to collect information about your use of our app. You can control cookie preferences through your device settings.',
    },
    {
      title: '7. Children\'s Privacy',
      content: 'Our service is not intended for users under the age of 18. We do not knowingly collect personal information from children under 18.',
    },
    {
      title: '8. Changes to This Policy',
      content: 'We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.',
    },
  ];

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
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.lastUpdated}>Last updated: December 2024</Text>
          
          <Text style={styles.intro}>
            At Guido, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our app.
          </Text>
          
          {sections.map((section, index) => (
            <View key={index} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.sectionContent}>{section.content}</Text>
            </View>
          ))}

          <View style={styles.contactSection}>
            <Text style={styles.contactText}>
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <Text style={styles.contactLink}>privacy@guido.app</Text>
            </Text>
          </View>

          {onTermsPress && (
            <TouchableOpacity
              style={styles.linkButton}
              onPress={onTermsPress}
              activeOpacity={0.7}
            >
              <Ionicons name="document-text-outline" size={18} color="#0A1D37" />
              <Text style={styles.linkButtonText}>View Terms of Service</Text>
              <Ionicons name="chevron-forward" size={18} color="#0A1D37" />
            </TouchableOpacity>
          )}
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
    paddingBottom: 32,
  },
  content: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    margin: 24,
    borderRadius: 12,
  },
  lastUpdated: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    fontWeight: '400',
    color: '#6D6D6D',
    letterSpacing: 0.2,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  intro: {
    fontSize: 15,
    fontFamily: FONTS.regular,
    fontWeight: '500',
    color: '#3A3A3A',
    letterSpacing: 0.2,
    lineHeight: 24,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    fontWeight: '700',
    color: '#0A1D37',
    letterSpacing: 0.3,
    marginBottom: 12,
  },
  sectionContent: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    fontWeight: '400',
    color: '#3A3A3A',
    letterSpacing: 0.2,
    lineHeight: 22,
  },
  contactSection: {
    marginTop: 16,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
  },
  contactText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    fontWeight: '400',
    color: '#3A3A3A',
    letterSpacing: 0.2,
    lineHeight: 22,
  },
  contactLink: {
    fontFamily: FONTS.semiBold,
    fontWeight: '600',
    color: '#0A1D37',
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    padding: 16,
    backgroundColor: '#F7F7F7',
    borderRadius: 12,
  },
  linkButtonText: {
    fontSize: 15,
    fontFamily: FONTS.semiBold,
    fontWeight: '600',
    color: '#0A1D37',
    marginLeft: 12,
    flex: 1,
    letterSpacing: 0.3,
  },
});

