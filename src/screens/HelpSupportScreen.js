import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

export const HelpSupportScreen = ({ onBack, onTermsPress, onPrivacyPress }) => {
  // Get safe area insets
  const statusBarHeight = Platform.OS === 'ios' ? 44 : RNStatusBar.currentHeight || 0;

  const faqItems = [
    {
      question: 'How do I book a guide?',
      answer: 'Browse available guides on the home screen, select a guide to view their details, and tap "Request Guide" to book them. You can choose to book now, later today, or schedule for a future date.',
    },
    {
      question: 'How much does it cost?',
      answer: 'Each guide sets their own hourly rate. You can see the pricing on each guide\'s profile before booking.',
    },
    {
      question: 'Can I cancel a booking?',
      answer: 'Yes, you can cancel bookings through the Trips section. Cancellation policies may vary depending on the timing and guide preferences.',
    },
    {
      question: 'How do I contact my guide?',
      answer: 'Once you have an active booking, you can message your guide directly through the Messages section in the app.',
    },
    {
      question: 'What if I need to change my booking?',
      answer: 'You can contact your guide through the Messages section to discuss any changes to your booking.',
    },
  ];

  const contactOptions = [
    {
      icon: 'mail-outline',
      label: 'Email Support',
      value: 'support@guido.app',
      onPress: () => console.log('Email support'),
    },
    {
      icon: 'chatbubble-outline',
      label: 'Live Chat',
      value: 'Available 24/7',
      onPress: () => console.log('Live chat'),
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
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <View style={styles.contactContainer}>
            {contactOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.contactItem}
                onPress={option.onPress}
                activeOpacity={0.7}
              >
                <View style={styles.contactItemLeft}>
                  <View style={styles.contactIconContainer}>
                    <Ionicons name={option.icon} size={20} color="#0A1D37" />
                  </View>
                  <View style={styles.contactItemContent}>
                    <Text style={styles.contactLabel}>{option.label}</Text>
                    <Text style={styles.contactValue}>{option.value}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#6D6D6D" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqContainer}>
            {faqItems.map((item, index) => (
              <View key={index} style={styles.faqItem}>
                <Text style={styles.faqQuestion}>{item.question}</Text>
                <Text style={styles.faqAnswer}>{item.answer}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Legal Section */}
        {(onTermsPress || onPrivacyPress) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Legal</Text>
            <View style={styles.legalContainer}>
              {onTermsPress && (
                <TouchableOpacity
                  style={styles.legalItem}
                  onPress={onTermsPress}
                  activeOpacity={0.7}
                >
                  <View style={styles.legalItemLeft}>
                    <View style={styles.legalIconContainer}>
                      <Ionicons name="document-text-outline" size={20} color="#0A1D37" />
                    </View>
                    <Text style={styles.legalLabel}>Terms of Service</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#6D6D6D" />
                </TouchableOpacity>
              )}
              {onPrivacyPress && (
                <TouchableOpacity
                  style={styles.legalItem}
                  onPress={onPrivacyPress}
                  activeOpacity={0.7}
                >
                  <View style={styles.legalItemLeft}>
                    <View style={styles.legalIconContainer}>
                      <Ionicons name="shield-checkmark-outline" size={20} color="#0A1D37" />
                    </View>
                    <Text style={styles.legalLabel}>Privacy Policy</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#6D6D6D" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
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
    paddingTop: 24,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0A1D37',
    letterSpacing: 0.3,
    marginBottom: 16,
  },
  contactContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  contactItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  contactIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F7F7F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactItemContent: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 13,
    color: '#6D6D6D',
    letterSpacing: 0.2,
  },
  faqContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
  },
  faqItem: {
    marginBottom: 24,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0A1D37',
    letterSpacing: 0.3,
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#3A3A3A',
    letterSpacing: 0.2,
    lineHeight: 20,
  },
  legalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
  },
  legalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  legalItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  legalIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F7F7F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  legalLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    letterSpacing: 0.3,
  },
});

