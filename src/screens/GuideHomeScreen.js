import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { GuideBottomNavBar } from '../components/GuideBottomNavBar';
import { GuideTabSelector } from '../components/GuideTabSelector';

export const GuideHomeScreen = ({ activeTab, onTabChange, onMessagesPress, onNotificationsPress, onProfilePress, onBookingPress }) => {
  const [selectedTab, setSelectedTab] = useState('request');
  
  // Get safe area insets
  const statusBarHeight = Platform.OS === 'ios' ? 44 : RNStatusBar.currentHeight || 0;

  // Mock booking data
  const allBookings = [
    // Request bookings
    {
      id: '1',
      userName: 'Sarah Johnson',
      userAvatar: { uri: 'https://i.pravatar.cc/150?img=1' },
      tourType: 'Historical Tours & Culture',
      location: 'Paris, France',
      date: 'Dec 25, 2024',
      time: '10:00 AM',
      duration: '3 hours',
      status: 'request',
    },
    {
      id: '2',
      userName: 'Michael Chen',
      userAvatar: { uri: 'https://i.pravatar.cc/150?img=2' },
      tourType: 'Food & Local Cuisine',
      location: 'Munich, Germany',
      date: 'Dec 28, 2024',
      time: '2:00 PM',
      duration: '2 hours',
      status: 'request',
    },
    // Accepted bookings
    {
      id: '3',
      userName: 'Emma Williams',
      userAvatar: { uri: 'https://i.pravatar.cc/150?img=3' },
      tourType: 'Art & Architecture',
      location: 'Berlin, Germany',
      date: 'Jan 5, 2025',
      time: '11:00 AM',
      duration: '4 hours',
      status: 'accepted',
    },
    // Active bookings
    {
      id: '4',
      userName: 'David Martinez',
      userAvatar: { uri: 'https://i.pravatar.cc/150?img=4' },
      tourType: 'Nightlife & Entertainment',
      location: 'New York, USA',
      date: 'Today',
      time: '6:00 PM',
      duration: '3 hours',
      status: 'active',
    },
    // Completed bookings
    {
      id: '5',
      userName: 'Lisa Anderson',
      userAvatar: { uri: 'https://i.pravatar.cc/150?img=5' },
      tourType: 'Nature & Outdoor',
      location: 'Nairobi, Kenya',
      date: 'Dec 20, 2024',
      time: '9:00 AM',
      duration: '5 hours',
      status: 'completed',
    },
    // Canceled bookings
    {
      id: '6',
      userName: 'Tom Wilson',
      userAvatar: { uri: 'https://i.pravatar.cc/150?img=6' },
      tourType: 'Shopping & Markets',
      location: 'Mombasa, Kenya',
      date: 'Dec 22, 2024',
      time: '2:00 PM',
      duration: '2 hours',
      status: 'canceled',
    },
  ];

  const tabs = [
    { id: 'request', label: 'Request' },
    { id: 'accepted', label: 'Accepted' },
    { id: 'active', label: 'Active' },
    { id: 'completed', label: 'Completed' },
    { id: 'canceled', label: 'Canceled' },
  ];

  const filteredBookings = allBookings.filter(booking => booking.status === selectedTab);

  const getStatusColor = (status) => {
    switch (status) {
      case 'request':
        return '#0A1D37';
      case 'accepted':
        return '#2196F3';
      case 'active':
        return '#4CAF50';
      case 'completed':
        return '#6D6D6D';
      case 'canceled':
        return '#E74C3C';
      default:
        return '#6D6D6D';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'request':
        return 'Request';
      case 'accepted':
        return 'Accepted';
      case 'active':
        return 'Active';
      case 'completed':
        return 'Completed';
      case 'canceled':
        return 'Canceled';
      default:
        return status;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: statusBarHeight + 16 }]}>
        <Text style={styles.headerTitle}>My Bookings</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Tab Selector */}
      <View style={styles.tabSelectorContainer}>
        <GuideTabSelector
          tabs={tabs}
          activeTab={selectedTab}
          onTabChange={setSelectedTab}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredBookings.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={48} color="#6D6D6D" />
            <Text style={styles.emptyStateText}>No {getStatusLabel(selectedTab)} bookings</Text>
            <Text style={styles.emptyStateSubtext}>Bookings will appear here</Text>
          </View>
        ) : (
          <View style={styles.bookingsContainer}>
            {filteredBookings.map((booking) => (
              <TouchableOpacity
                key={booking.id}
                style={styles.bookingCard}
                onPress={() => {
                  if (onBookingPress && booking.status === 'request') {
                    onBookingPress(booking);
                  }
                }}
                activeOpacity={booking.status === 'request' ? 0.7 : 1}
              >
                <View style={styles.bookingHeader}>
                  <Image
                    source={booking.userAvatar}
                    style={styles.userAvatar}
                    resizeMode="cover"
                  />
                  <View style={styles.bookingInfo}>
                    <Text style={styles.userName}>{booking.userName}</Text>
                    <View style={styles.statusBadge}>
                      <View style={[styles.statusDot, { backgroundColor: getStatusColor(booking.status) }]} />
                      <Text style={[styles.statusText, { color: getStatusColor(booking.status) }]}>
                        {getStatusLabel(booking.status)}
                      </Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.bookingDetails}>
                  <View style={styles.detailRow}>
                    <Ionicons name="star-outline" size={16} color="#6D6D6D" />
                    <Text style={styles.detailText}>{booking.tourType}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="location-outline" size={16} color="#6D6D6D" />
                    <Text style={styles.detailText}>{booking.location}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="calendar-outline" size={16} color="#6D6D6D" />
                    <Text style={styles.detailText}>{booking.date}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="time-outline" size={16} color="#6D6D6D" />
                    <Text style={styles.detailText}>{booking.time} • {booking.duration}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <GuideBottomNavBar activeTab={activeTab} onTabChange={onTabChange} />
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
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0A1D37',
    letterSpacing: 0.5,
  },
  placeholder: {
    width: 32,
  },
  tabSelectorContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  bookingsContainer: {
    padding: 24,
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
  bookingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#F7F7F7',
  },
  bookingInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  bookingDetails: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 13,
    color: '#3A3A3A',
    letterSpacing: 0.2,
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 24,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    letterSpacing: 0.3,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6D6D6D',
    letterSpacing: 0.2,
  },
});

