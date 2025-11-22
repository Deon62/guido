import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { PlaceCard } from '../components/PlaceCard';
import { PlaceCardSkeleton } from '../components/PlaceCardSkeleton';
import { FONTS } from '../constants/fonts';

export const AIRecommendationsScreen = ({ tripData, onBack, onPlacePress }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  
  // Get safe area insets
  const statusBarHeight = Platform.OS === 'ios' ? 44 : RNStatusBar.currentHeight || 0;

  useEffect(() => {
    // Simulate Deony recommendation processing
    const generateRecommendations = async () => {
      setIsLoading(true);
      
      // Simulate Deony processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Analyze user's trip data to generate recommendations
      const wishlistCategories = tripData.wishlist.map(trip => trip.category);
      const pastCategories = tripData.past.map(trip => trip.category);
      const activeCategories = tripData.active.map(trip => trip.category);
      
      // Combine all categories to understand user preferences
      const allCategories = [...wishlistCategories, ...pastCategories, ...activeCategories];
      const categoryCounts = {};
      allCategories.forEach(cat => {
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      });
      
      // Get most preferred categories
      const topCategories = Object.keys(categoryCounts)
        .sort((a, b) => categoryCounts[b] - categoryCounts[a])
        .slice(0, 3);
      
      // TODO: Replace with API data - call AI recommendations API
      // const token = getToken();
      // const recommendations = await fetchAIRecommendations(token, tripData);
      setRecommendations([]);
      setIsLoading(false);
    };
    
    generateRecommendations();
  }, [tripData]);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={[styles.header, { paddingTop: statusBarHeight + 16 }]}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#0A1D37" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={styles.aiIconContainer}>
            <Ionicons name="sparkles" size={20} color="#0A1D37" />
          </View>
          <Text style={styles.title}>Deony Recommendations</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Based on your wishlist, active trips, and past experiences, we've curated these personalized recommendations for you.
          </Text>
        </View>

        {isLoading ? (
          // Show skeleton loaders
          Array.from({ length: 5 }).map((_, index) => (
            <PlaceCardSkeleton key={`skeleton-${index}`} />
          ))
        ) : recommendations.length > 0 ? (
          // Show recommendations
          recommendations.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              onPress={() => onPlacePress && onPlacePress(place)}
            />
          ))
        ) : (
          // Show empty state
          <View style={styles.emptyContainer}>
            <Ionicons name="sparkles-outline" size={64} color="#C0C0C0" />
            <Text style={styles.emptyText}>No recommendations available</Text>
            <Text style={styles.emptySubtext}>
              Add more trips to your wishlist and past trips to get personalized recommendations
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
    backgroundColor: '#F7F7F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  backButton: {
    padding: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  aiIconContainer: {
    marginRight: 8,
  },
  title: {
    fontSize: 20,
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
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 100,
  },
  infoContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: '#3A3A3A',
    lineHeight: 20,
    letterSpacing: 0.2,
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
    marginTop: 16,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: '#6D6D6D',
    textAlign: 'center',
    paddingHorizontal: 40,
    letterSpacing: 0.2,
  },
});

