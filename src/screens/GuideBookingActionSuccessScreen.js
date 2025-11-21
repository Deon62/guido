import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

export const GuideBookingActionSuccessScreen = ({ action, booking, onDone }) => {
  // Get safe area insets
  const statusBarHeight = Platform.OS === 'ios' ? 44 : RNStatusBar.currentHeight || 0;
  
  const isAccepted = action === 'accepted';
  const iconName = isAccepted ? 'checkmark-circle' : 'close-circle';
  const iconColor = isAccepted ? '#4CAF50' : '#E74C3C';
  const title = isAccepted ? 'Booking Accepted!' : 'Booking Rejected';
  const message = isAccepted 
    ? 'You have successfully accepted the booking request. The guest has been notified.'
    : 'You have rejected the booking request. The guest has been notified.';

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={[styles.content, { paddingTop: statusBarHeight + 40 }]}>
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: isAccepted ? '#E8F5E9' : '#FEE' }]}>
            <Ionicons name={iconName} size={64} color={iconColor} />
          </View>
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>

        {booking && (
          <View style={styles.bookingSummary}>
            <Text style={styles.summaryTitle}>Booking Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Guest:</Text>
              <Text style={styles.summaryValue}>{booking.userName}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Date:</Text>
              <Text style={styles.summaryValue}>{booking.date}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Time:</Text>
              <Text style={styles.summaryValue}>{booking.time}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Location:</Text>
              <Text style={styles.summaryValue}>{booking.location}</Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={styles.doneButton}
          onPress={onDone}
          activeOpacity={0.7}
        >
          <Text style={styles.doneButtonText}>Done</Text>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 32,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0A1D37',
    letterSpacing: 0.5,
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#3A3A3A',
    letterSpacing: 0.3,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  bookingSummary: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0A1D37',
    letterSpacing: 0.3,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6D6D6D',
    letterSpacing: 0.2,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    letterSpacing: 0.2,
  },
  doneButton: {
    width: '100%',
    backgroundColor: '#0A1D37',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});

