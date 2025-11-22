import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { FONTS } from '../constants/fonts';

export const TermsScreen = ({ onBack, onPrivacyPress }) => {
  // Get safe area insets
  const statusBarHeight = Platform.OS === 'ios' ? 44 : RNStatusBar.currentHeight || 0;

  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: 'By accessing and using the Quest app, you accept and agree to be bound by the terms and provision of this agreement.',
    },
    {
      title: '2. Service Description',
      content: 'Quest is a travel companion app that helps you discover amazing places, plan your trips, and share your travel experiences. We provide a platform for users to explore destinations, manage their travel itineraries, and connect with other travelers.',
    },
    {
      title: '3. User Responsibilities',
      content: 'Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account. Users must be at least 18 years old to use this service.',
    },
    {
      title: '4. User-Generated Content',
      content: 'Users may post photos, reviews, and other content about places they have visited. You retain ownership of your content but grant Guido a license to use, display, and distribute your content within the app.',
    },
    {
      title: '5. Trip Management',
      content: 'Users can add trips, create wishlists, and manage their travel history through the app. All trip data is stored securely and can be accessed, modified, or deleted at any time through your account.',
    },
    {
      title: '6. Location Data',
      content: 'The app uses location services to show nearby places and provide location-based recommendations. You can control location permissions through your device settings.',
    },
    {
      title: '7. Limitation of Liability',
      content: 'Quest provides information about places and travel experiences. We are not responsible for the accuracy of user-generated content, the safety of locations, or any issues that may arise during your travels. Users participate at their own risk.',
    },
    {
      title: '8. Changes to Terms',
      content: 'Quest reserves the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.',
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
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.lastUpdated}>Last updated: December 2024</Text>
          
          {sections.map((section, index) => (
            <View key={index} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.sectionContent}>{section.content}</Text>
            </View>
          ))}

          <View style={styles.contactSection}>
            <Text style={styles.contactText}>
              If you have any questions about these Terms of Service, please contact us at{' '}
              <Text style={styles.contactLink}>legal@guido.app</Text>
            </Text>
          </View>

          {onPrivacyPress && (
            <TouchableOpacity
              style={styles.linkButton}
              onPress={onPrivacyPress}
              activeOpacity={0.7}
            >
              <Ionicons name="document-text-outline" size={18} color="#0A1D37" />
              <Text style={styles.linkButtonText}>View Privacy Policy</Text>
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
    color: '#6D6D6D',
    letterSpacing: 0.2,
    marginBottom: 24,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: '#0A1D37',
    letterSpacing: 0.3,
    marginBottom: 12,
  },
  sectionContent: {
    fontSize: 14,
    fontFamily: FONTS.regular,
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
    color: '#3A3A3A',
    letterSpacing: 0.2,
    lineHeight: 22,
  },
  contactLink: {
    fontFamily: FONTS.semiBold,
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
    color: '#0A1D37',
    marginLeft: 12,
    flex: 1,
    letterSpacing: 0.3,
  },
});

