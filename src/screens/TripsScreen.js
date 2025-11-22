import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { PlaceCard } from '../components/PlaceCard';
import { PlaceCardSkeleton } from '../components/PlaceCardSkeleton';
import { TabSelector } from '../components/TabSelector';
import { BottomNavBar } from '../components/BottomNavBar';
import { FONTS } from '../constants/fonts';

export const TripsScreen = ({ activeTab = 'trips', onTabChange, onNotificationsPress, onRatePress, onAddTripPress, onAIRecommend }) => {
  const [selectedTab, setSelectedTab] = useState('wishlist');
  const [isLoading, setIsLoading] = useState(true);
  const [hasUnreadNotifications] = useState(true); // TODO: Replace with actual notification state
  
  // Get safe area insets
  const statusBarHeight = Platform.OS === 'ios' ? 44 : RNStatusBar.currentHeight || 0;

  // Simulate loading trips data
  useEffect(() => {
    const loadTrips = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsLoading(false);
    };
    loadTrips();
  }, []);

  // Mock trip data with places
  const allTrips = [
    // Wishlist trips (places user wants to visit)
    {
      id: '1',
      placeName: 'Eiffel Tower',
      placeImage: { uri: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400' },
      category: 'Landmarks',
      location: 'Paris, France',
      date: 'Planning for Dec 25, 2024',
      status: 'wishlist',
    },
    {
      id: '2',
      placeName: 'Hotel Ritz Paris',
      placeImage: { uri: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400' },
      category: 'Hotels',
      location: 'Paris, France',
      date: 'Planning for Jan 2025',
      status: 'wishlist',
    },
    {
      id: '3',
      placeName: 'Luxembourg Gardens',
      placeImage: { uri: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400' },
      category: 'Nature',
      location: 'Paris, France',
      date: 'Planning for Spring 2025',
      status: 'wishlist',
    },
    // Active trips
    {
      id: '4',
      placeName: 'Notre-Dame Cathedral',
      placeImage: { uri: 'https://images.unsplash.com/photo-1563874255670-05953328b14a?w=400' },
      category: 'Landmarks',
      location: 'Paris, France',
      date: 'Today',
      time: 'Visiting now',
      status: 'active',
    },
    {
      id: '5',
      placeName: 'Café de Flore',
      placeImage: { uri: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400' },
      category: 'Cafes',
      location: 'Paris, France',
      date: 'Today',
      time: '2:00 PM',
      status: 'active',
    },
    // Past trips
    {
      id: '6',
      placeName: 'Arc de Triomphe',
      placeImage: { uri: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=400' },
      category: 'Landmarks',
      location: 'Paris, France',
      date: 'Dec 15, 2024',
      status: 'past',
    },
    {
      id: '7',
      placeName: 'Bois de Vincennes',
      placeImage: { uri: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400' },
      category: 'Nature',
      location: 'Paris, France',
      date: 'Dec 10, 2024',
      status: 'past',
    },
    {
      id: '8',
      placeName: 'Les Deux Magots',
      placeImage: { uri: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400' },
      category: 'Cafes',
      location: 'Paris, France',
      date: 'Nov 28, 2024',
      status: 'past',
    },
  ];

  const tabs = [
    { id: 'wishlist', label: 'Wishlist' },
    { id: 'active', label: 'Active' },
    { id: 'past', label: 'Past' },
    { id: 'recommendations', label: 'Recommendations' },
  ];

  const getFilteredTrips = () => {
    if (selectedTab === 'wishlist') {
      return allTrips.filter(trip => trip.status === 'wishlist');
    }
    if (selectedTab === 'recommendations') {
      return []; // Recommendations will be shown via AI Recommend button
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

  const handleAIRecommend = () => {
    // Get user's trip data for AI recommendations
    const wishlistTrips = allTrips.filter(trip => trip.status === 'wishlist');
    const activeTrips = allTrips.filter(trip => trip.status === 'active');
    const pastTrips = allTrips.filter(trip => trip.status === 'past');
    
    if (onAIRecommend) {
      onAIRecommend({
        wishlist: wishlistTrips,
        active: activeTrips,
        past: pastTrips,
      });
    } else {
      console.log('AI Recommend pressed - wishlist:', wishlistTrips.length, 'active:', activeTrips.length, 'past:', pastTrips.length);
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
          <View style={styles.notificationIconContainer}>
            <Ionicons name="notifications-outline" size={24} color="#0A1D37" />
            {hasUnreadNotifications && <View style={styles.notificationDot} />}
          </View>
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
        {selectedTab === 'recommendations' ? (
          // Show AI Recommendations section
          <View style={styles.recommendationsContainer}>
            <View style={styles.aiRecommendCard}>
              <View style={styles.aiRecommendHeader}>
                <Ionicons name="sparkles" size={32} color="#0A1D37" />
                <Text style={styles.aiRecommendTitle}>Get AI Recommendations</Text>
              </View>
              <Text style={styles.aiRecommendDescription}>
                Discover personalized places based on your wishlist, active trips, and past experiences. Our AI analyzes your travel patterns to suggest destinations you'll love.
              </Text>
              <TouchableOpacity
                style={styles.aiRecommendButton}
                onPress={handleAIRecommend}
                activeOpacity={0.8}
              >
                <Ionicons name="sparkles" size={20} color="#FFFFFF" />
                <Text style={styles.aiRecommendButtonText}>Get Recommendations</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : isLoading ? (
          // Show skeleton loaders
          Array.from({ length: 4 }).map((_, index) => (
            <PlaceCardSkeleton key={`skeleton-${index}`} />
          ))
        ) : filteredTrips.length > 0 ? (
          // Show actual place cards
          filteredTrips.map((trip, index) => (
            <PlaceCard
              key={trip.id}
              place={{
                id: trip.id,
                name: trip.placeName,
                category: trip.category,
                address: trip.location,
                distance: trip.date,
                description: trip.time || trip.date,
                image: trip.placeImage,
              }}
              onPress={() => handleTripPress(trip)}
              delay={index * 50}
            />
          ))
        ) : (
          // Show empty state
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No {selectedTab} trips</Text>
            <Text style={styles.emptySubtext}>
              {selectedTab === 'wishlist' && 'You have no places in your wishlist yet'}
              {selectedTab === 'active' && 'You have no active trips right now'}
              {selectedTab === 'past' && 'You have no past trips yet'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button - Only show on Past trips tab */}
      {selectedTab === 'past' && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => {
            if (onAddTripPress) {
              onAddTripPress();
            } else {
              console.log('Add trip pressed');
            }
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      )}

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
  notificationIconContainer: {
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E74C3C',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    fontFamily: FONTS.bold,
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
    fontFamily: FONTS.semiBold,
    color: '#1A1A1A',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: '#6D6D6D',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0A1D37',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0A1D37',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 20,
  },
  recommendationsContainer: {
    paddingTop: 20,
  },
  aiRecommendCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  aiRecommendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  aiRecommendTitle: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    color: '#0A1D37',
    marginLeft: 12,
    letterSpacing: 0.3,
  },
  aiRecommendDescription: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: '#6D6D6D',
    lineHeight: 20,
    marginBottom: 24,
    letterSpacing: 0.2,
  },
  aiRecommendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0A1D37',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  aiRecommendButtonText: {
    fontSize: 16,
    fontFamily: FONTS.semiBold,
    color: '#FFFFFF',
    marginLeft: 8,
    letterSpacing: 0.3,
  },
});

