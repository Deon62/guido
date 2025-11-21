import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { TripCard } from '../components/TripCard';
import { TabSelector } from '../components/TabSelector';
import { BottomNavBar } from '../components/BottomNavBar';

export const TripsScreen = ({ activeTab = 'trips', onTabChange, onNotificationsPress, onRatePress }) => {
  const [selectedTab, setSelectedTab] = useState('upcoming');
  
  // Get safe area insets
  const statusBarHeight = Platform.OS === 'ios' ? 44 : RNStatusBar.currentHeight || 0;

  // Mock trip data
  const allTrips = [
    // Upcoming trips
    {
      id: '1',
      guideName: 'Sarah Johnson',
      guideAvatar: { uri: 'https://i.pravatar.cc/150?img=1' },
      tourType: 'Historical Tours & Culture',
      location: 'Paris, France',
      date: 'Dec 25, 2024',
      time: '10:00 AM',
      status: 'upcoming',
    },
    {
      id: '2',
      guideName: 'Michael Chen',
      guideAvatar: { uri: 'https://i.pravatar.cc/150?img=2' },
      tourType: 'Food & Local Cuisine',
      location: 'Munich, Germany',
      date: 'Dec 28, 2024',
      time: '2:00 PM',
      status: 'upcoming',
    },
    {
      id: '3',
      guideName: 'Emma Williams',
      guideAvatar: { uri: 'https://i.pravatar.cc/150?img=3' },
      tourType: 'Art & Architecture',
      location: 'Berlin, Germany',
      date: 'Jan 5, 2025',
      time: '11:00 AM',
      status: 'scheduled',
    },
    // Active trips
    {
      id: '4',
      guideName: 'David Martinez',
      guideAvatar: { uri: 'https://i.pravatar.cc/150?img=4' },
      tourType: 'Nightlife & Entertainment',
      location: 'New York, USA',
      date: 'Today',
      time: '6:00 PM',
      status: 'active',
    },
    // Past trips
    {
      id: '5',
      guideName: 'Lisa Anderson',
      guideAvatar: { uri: 'https://i.pravatar.cc/150?img=5' },
      tourType: 'Nature & Outdoor',
      location: 'Nairobi, Kenya',
      date: 'Dec 15, 2024',
      status: 'past',
    },
    {
      id: '6',
      guideName: 'James Wilson',
      guideAvatar: { uri: 'https://i.pravatar.cc/150?img=6' },
      tourType: 'Photography Tours',
      location: 'Mombasa, Kenya',
      date: 'Dec 10, 2024',
      status: 'past',
    },
  ];

  const tabs = [
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'active', label: 'Active' },
    { id: 'past', label: 'Past' },
    { id: 'scheduled', label: 'Schedule' },
  ];

  const getFilteredTrips = () => {
    if (selectedTab === 'scheduled') {
      return allTrips.filter(trip => trip.status === 'scheduled');
    }
    return allTrips.filter(trip => trip.status === selectedTab);
  };

  const filteredTrips = getFilteredTrips();

  const handleTripPress = (trip) => {
    console.log('Trip selected:', trip);
    // TODO: Navigate to trip details
  };

  const handleRatePress = (trip) => {
    console.log('TripsScreen handleRatePress called with trip:', trip);
    if (onRatePress) {
      console.log('Calling onRatePress prop');
      onRatePress(trip);
    } else {
      console.log('onRatePress prop is not defined');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={[styles.header, { paddingTop: statusBarHeight + 16 }]}>
        <Text style={styles.title}>My Trips</Text>
        <TouchableOpacity
          onPress={() => onNotificationsPress && onNotificationsPress()}
          style={styles.notificationButton}
          activeOpacity={0.7}
        >
          <Ionicons name="notifications-outline" size={24} color="#0A1D37" />
        </TouchableOpacity>
      </View>

      <TabSelector
        tabs={tabs}
        activeTab={selectedTab}
        onTabChange={setSelectedTab}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredTrips.length > 0 ? (
          filteredTrips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onPress={() => handleTripPress(trip)}
              onRatePress={handleRatePress}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No {selectedTab} trips</Text>
            <Text style={styles.emptySubtext}>
              {selectedTab === 'upcoming' && 'You have no upcoming trips scheduled'}
              {selectedTab === 'active' && 'You have no active trips right now'}
              {selectedTab === 'past' && 'You have no past trips yet'}
              {selectedTab === 'scheduled' && 'You have no scheduled trips'}
            </Text>
          </View>
        )}
      </ScrollView>

      <BottomNavBar activeTab={activeTab} onTabChange={onTabChange} />
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
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  notificationButton: {
    padding: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0A1D37',
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6D6D6D',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
});

