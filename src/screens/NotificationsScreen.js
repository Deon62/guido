import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { FONTS } from '../constants/fonts';

export const NotificationsScreen = ({ onBack }) => {
  // Get safe area insets
  const statusBarHeight = Platform.OS === 'ios' ? 44 : RNStatusBar.currentHeight || 0;

  // Mock notifications data
  const notifications = [
    {
      id: '1',
      title: 'Trip Reminder',
      message: 'Your tour with Sarah Johnson starts in 2 hours',
      time: '2h ago',
      unread: true,
    },
    {
      id: '2',
      title: 'New Message',
      message: 'Michael Chen sent you a message',
      time: '5h ago',
      unread: true,
    },
    {
      id: '3',
      title: 'Booking Confirmed',
      message: 'Your booking with Emma Williams has been confirmed',
      time: '1d ago',
      unread: false,
    },
    {
      id: '4',
      title: 'Review Request',
      message: 'Rate your experience with David Martinez',
      time: '2d ago',
      unread: false,
    },
    {
      id: '5',
      title: 'Special Offer',
      message: 'Get 20% off on your next tour booking',
      time: '3d ago',
      unread: false,
    },
    {
      id: '6',
      title: 'Welcome to Guido',
      message: 'Start exploring amazing tour guides in your city',
      time: '1w ago',
      unread: false,
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
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={styles.notificationItem}
              activeOpacity={0.7}
            >
              <View style={styles.notificationContent}>
                <View style={styles.notificationHeader}>
                  <Text style={[styles.notificationTitle, notification.unread && styles.notificationTitleUnread]}>
                    {notification.title}
                  </Text>
                  {notification.unread && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.notificationMessage} numberOfLines={2}>
                  {notification.message}
                </Text>
                <Text style={styles.notificationTime}>{notification.time}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No notifications</Text>
            <Text style={styles.emptySubtext}>
              You're all caught up!
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    paddingTop: 16,
    paddingBottom: 32,
  },
  notificationItem: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 15,
    fontFamily: FONTS.regular,
    fontWeight: '500',
    color: '#1A1A1A',
    letterSpacing: 0.3,
    marginRight: 8,
  },
  notificationTitleUnread: {
    fontFamily: FONTS.semiBold,
    fontWeight: '600',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0A1D37',
  },
  notificationMessage: {
    fontSize: 13,
    fontFamily: FONTS.regular,
    fontWeight: '400',
    color: '#3A3A3A',
    letterSpacing: 0.2,
    lineHeight: 18,
    marginBottom: 6,
  },
  notificationTime: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    fontWeight: '400',
    color: '#6D6D6D',
    letterSpacing: 0.2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: FONTS.semiBold,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 16,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    fontWeight: '400',
    color: '#6D6D6D',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
});

