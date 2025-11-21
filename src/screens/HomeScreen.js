import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { TourGuideCard } from '../components/TourGuideCard';
import { TourGuideCardSkeleton } from '../components/TourGuideCardSkeleton';
import { BottomNavBar } from '../components/BottomNavBar';

export const HomeScreen = ({ selectedCity, activeTab = 'home', onTabChange, onNotificationsPress, onGuidePress }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Get safe area insets
  const statusBarHeight = Platform.OS === 'ios' ? 44 : RNStatusBar.currentHeight || 0;

  // Simulate loading guides data
  useEffect(() => {
    const loadGuides = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsLoading(false);
    };
    loadGuides();
  }, []);

  // Mock tour guide data
  const mockGuides = [
    {
      id: '1',
      name: 'Sarah Johnson',
      specialty: 'Historical Tours & Culture',
      location: 'Downtown',
      rating: 4.9,
      tours: 127,
      price: 45,
      avatar: { uri: 'https://i.pravatar.cc/150?img=1' },
      verified: true,
    },
    {
      id: '2',
      name: 'Michael Chen',
      specialty: 'Food & Local Cuisine',
      location: 'City Center',
      rating: 4.8,
      tours: 89,
      price: 50,
      avatar: { uri: 'https://i.pravatar.cc/150?img=2' },
      verified: false,
    },
    {
      id: '3',
      name: 'Emma Williams',
      specialty: 'Art & Architecture',
      location: 'Historic District',
      rating: 5.0,
      tours: 156,
      price: 55,
      avatar: { uri: 'https://i.pravatar.cc/150?img=3' },
      verified: true,
    },
    {
      id: '4',
      name: 'David Martinez',
      specialty: 'Nightlife & Entertainment',
      location: 'Entertainment Quarter',
      rating: 4.7,
      tours: 94,
      price: 40,
      avatar: { uri: 'https://i.pravatar.cc/150?img=4' },
      verified: false,
    },
    {
      id: '5',
      name: 'Lisa Anderson',
      specialty: 'Nature & Outdoor',
      location: 'Parks & Gardens',
      rating: 4.9,
      tours: 112,
      price: 48,
      avatar: { uri: 'https://i.pravatar.cc/150?img=5' },
      verified: true,
    },
    {
      id: '6',
      name: 'James Wilson',
      specialty: 'Photography Tours',
      location: 'Scenic Areas',
      rating: 4.8,
      tours: 73,
      price: 52,
      avatar: { uri: 'https://i.pravatar.cc/150?img=6' },
      verified: false,
    },
  ];

  const handleGuidePress = (guide) => {
    if (onGuidePress) {
      onGuidePress(guide);
    } else {
      console.log('Guide selected:', guide.name);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={[styles.header, { paddingTop: statusBarHeight + 16 }]}>
        <View>
          <Text style={styles.greeting}>Hello!</Text>
          <Text style={styles.location}>
            {selectedCity ? `${selectedCity.name}, ${selectedCity.country}` : 'Explore Cities'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => onNotificationsPress && onNotificationsPress()}
          style={styles.notificationButton}
          activeOpacity={0.7}
        >
          <Ionicons name="notifications-outline" size={24} color="#0A1D37" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Available Guides</Text>
        {isLoading ? (
          // Show skeleton loaders
          Array.from({ length: 6 }).map((_, index) => (
            <TourGuideCardSkeleton key={`skeleton-${index}`} />
          ))
        ) : (
          // Show actual guide cards
          mockGuides.map((guide) => (
            <TourGuideCard
              key={guide.id}
              guide={guide}
              onPress={() => handleGuidePress(guide)}
            />
          ))
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
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  notificationButton: {
    padding: 4,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0A1D37',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#6D6D6D',
    fontWeight: '400',
    letterSpacing: 0.3,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    letterSpacing: 0.3,
    marginBottom: 16,
  },
});

