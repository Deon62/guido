import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/Button';

export const BookingSuccessScreen = ({ guide, bookingOption, onBack }) => {
  // Get safe area insets
  const statusBarHeight = Platform.OS === 'ios' ? 44 : RNStatusBar.currentHeight || 0;

  const formatBookingDetails = () => {
    if (!bookingOption) return 'Booking confirmed!';

    switch (bookingOption.type) {
      case 'now':
        return 'Booking confirmed! Your guide will arrive within 30 minutes.';
      case 'laterToday':
        const timeWindows = {
          morning: '9:00 AM - 12:00 PM',
          afternoon: '12:00 PM - 5:00 PM',
          evening: '5:00 PM - 9:00 PM',
        };
        return `Booking confirmed for today, ${timeWindows[bookingOption.timeWindow] || 'later today'}.`;
      case 'schedule':
        if (bookingOption.date && bookingOption.time) {
          const dateStr = bookingOption.date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          });
          return `Booking confirmed for ${dateStr} at ${bookingOption.time}.`;
        }
        return 'Booking confirmed!';
      default:
        return 'Booking confirmed!';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.content}>
        <View style={styles.successIconContainer}>
          <View style={styles.successIconCircle}>
            <Ionicons name="checkmark" size={48} color="#F7F7F7" />
          </View>
        </View>

        <Text style={styles.successTitle}>Booking Confirmed!</Text>
        <Text style={styles.successMessage}>{formatBookingDetails()}</Text>

        {guide && (
          <View style={styles.guideInfoCard}>
            <View style={styles.guideInfo}>
              <Ionicons name="person" size={20} color="#0A1D37" />
              <View style={styles.guideInfoTextContainer}>
                <Text style={styles.guideInfoLabel}>Your Guide</Text>
                <Text style={styles.guideInfoText}>{guide.name}</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>
            Your guide will contact you shortly to confirm the details.
          </Text>
        </View>

        <Button
          title="Done"
          onPress={onBack}
          variant="primary"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 44 : RNStatusBar.currentHeight || 0,
    paddingBottom: 40,
  },
  successIconContainer: {
    marginBottom: 32,
  },
  successIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#0A1D37',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0A1D37',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0A1D37',
    letterSpacing: 0.5,
    marginBottom: 16,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    color: '#3A3A3A',
    letterSpacing: 0.2,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  guideInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#0A1D37',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  guideInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  guideInfoTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  guideInfoLabel: {
    fontSize: 12,
    color: '#6D6D6D',
    letterSpacing: 0.2,
    marginBottom: 4,
  },
  guideInfoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0A1D37',
    letterSpacing: 0.3,
  },
  messageContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  messageText: {
    fontSize: 14,
    color: '#6D6D6D',
    letterSpacing: 0.2,
    lineHeight: 20,
    textAlign: 'center',
  },
});

