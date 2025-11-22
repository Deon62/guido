import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { HotspotCardSkeleton } from '../components/HotspotCardSkeleton';
import { BottomNavBar } from '../components/BottomNavBar';
import { FONTS } from '../constants/fonts';

export const HotspotsScreen = ({ selectedCity, activeTab, onTabChange }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [likedHotspots, setLikedHotspots] = useState(new Set());
  
  // Get safe area insets
  const statusBarHeight = Platform.OS === 'ios' ? 44 : RNStatusBar.currentHeight || 0;

  // Simulate loading hotspots data
  useEffect(() => {
    const loadHotspots = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsLoading(false);
    };
    loadHotspots();
  }, []);

  // Mock hotspots data
  const hotspots = [
    {
      id: '1',
      name: 'Eiffel Tower',
      category: 'Iconic Place',
      image: { uri: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400' },
      likes: 12450,
      rating: 4.8,
      distance: '2.3 km',
      description: 'The most visited monument in the world',
    },
    {
      id: '2',
      name: 'Le Comptoir du Relais',
      category: 'Restaurant',
      image: { uri: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400' },
      likes: 8920,
      rating: 4.6,
      distance: '1.5 km',
      description: 'Authentic French cuisine',
    },
    {
      id: '3',
      name: 'Louvre Museum',
      category: 'Museum',
      image: { uri: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400' },
      likes: 15680,
      rating: 4.9,
      distance: '3.1 km',
      description: 'World\'s largest art museum',
    },
    {
      id: '4',
      name: 'Notre-Dame',
      category: 'Iconic Place',
      image: { uri: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400' },
      likes: 11320,
      rating: 4.7,
      distance: '2.8 km',
      description: 'Medieval Catholic cathedral',
    },
    {
      id: '5',
      name: 'Café de Flore',
      category: 'Cafe',
      image: { uri: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400' },
      likes: 7450,
      rating: 4.5,
      distance: '1.2 km',
      description: 'Historic literary cafe',
    },
    {
      id: '6',
      name: 'Seine River Cruise',
      category: 'Activity',
      image: { uri: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400' },
      likes: 9830,
      rating: 4.7,
      distance: '0.8 km',
      description: 'Scenic boat tour through Paris',
    },
  ];

  const handleHotspotPress = (hotspot) => {
    console.log('Hotspot pressed:', hotspot.name);
    // TODO: Navigate to hotspot details
  };

  const handleLikePress = (hotspotId, event) => {
    event.stopPropagation(); // Prevent card press event
    setLikedHotspots(prev => {
      const newSet = new Set(prev);
      if (newSet.has(hotspotId)) {
        newSet.delete(hotspotId);
      } else {
        newSet.add(hotspotId);
      }
      return newSet;
    });
  };

  const formatLikes = (likes) => {
    if (likes >= 1000) {
      return `${(likes / 1000).toFixed(1)}k`;
    }
    return likes.toString();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: statusBarHeight + 16 }]}>
        <View>
          <Text style={styles.headerTitle}>Hotspots</Text>
          <Text style={styles.headerSubtitle}>
            {selectedCity ? (typeof selectedCity === 'string' ? selectedCity : selectedCity.name) : 'Explore amazing places'}
          </Text>
        </View>
        <TouchableOpacity style={styles.filterButton} activeOpacity={0.7}>
          <Ionicons name="filter" size={22} color="#0A1D37" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gridContainer}>
          {isLoading ? (
            // Show skeleton loaders
            Array.from({ length: 6 }).map((_, index) => (
              <HotspotCardSkeleton key={`skeleton-${index}`} />
            ))
          ) : (
            // Show actual hotspot cards
            hotspots.map((hotspot) => (
              <TouchableOpacity
                key={hotspot.id}
                style={styles.hotspotCard}
                onPress={() => handleHotspotPress(hotspot)}
                activeOpacity={0.85}
              >
                <Image
                  source={hotspot.image}
                  style={styles.hotspotImage}
                  resizeMode="cover"
                />
                <View style={styles.imageOverlay} />
                
                {/* Category Badge */}
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{hotspot.category}</Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtonsContainer}>
                  {/* Share Button */}
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      console.log('Share hotspot:', hotspot.name);
                      // TODO: Implement share functionality
                    }}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name="share-outline"
                      size={22}
                      color="#FFFFFF"
                    />
                  </TouchableOpacity>

                  {/* Heart Like Button */}
                  <TouchableOpacity
                    style={[styles.actionButton, styles.heartButton]}
                    onPress={(e) => handleLikePress(hotspot.id, e)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={likedHotspots.has(hotspot.id) ? 'heart' : 'heart-outline'}
                      size={22}
                      color={likedHotspots.has(hotspot.id) ? '#E74C3C' : '#FFFFFF'}
                    />
                  </TouchableOpacity>
                </View>

                {/* Content */}
                <View style={styles.hotspotContent}>
                  <View style={styles.hotspotHeader}>
                    <View style={styles.hotspotNameContainer}>
                      <Text style={styles.hotspotName} numberOfLines={1}>
                        {hotspot.name}
                      </Text>
                      <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={12} color="#FFD166" />
                        <Text style={styles.ratingText}>{hotspot.rating}</Text>
                      </View>
                    </View>
                  </View>

                  <Text style={styles.hotspotDescription} numberOfLines={2}>
                    {hotspot.description}
                  </Text>

                  <View style={styles.hotspotFooter}>
                    <View style={styles.likesContainer}>
                      <Ionicons name="heart" size={14} color="#E74C3C" />
                      <Text style={styles.likesText}>{formatLikes(hotspot.likes)}</Text>
                    </View>
                    <View style={styles.distanceContainer}>
                      <Ionicons name="location" size={14} color="#6D6D6D" />
                      <Text style={styles.distanceText}>{hotspot.distance}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
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
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    color: '#0A1D37',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    fontFamily: FONTS.regular,
    color: '#6D6D6D',
    letterSpacing: 0.2,
  },
  filterButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
  },
  hotspotCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#0A1D37',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  hotspotImage: {
    width: '100%',
    height: 140,
    backgroundColor: '#E8E8E8',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 140,
    backgroundColor: 'rgba(10, 29, 55, 0.15)',
  },
  categoryBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 10,
    fontFamily: FONTS.semiBold,
    color: '#0A1D37',
    letterSpacing: 0.2,
  },
  actionButtonsContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  heartButton: {
    marginLeft: 8,
  },
  hotspotContent: {
    padding: 12,
  },
  hotspotHeader: {
    marginBottom: 6,
  },
  hotspotNameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  hotspotName: {
    flex: 1,
    fontSize: 15,
    fontFamily: FONTS.bold,
    color: '#1A1A1A',
    letterSpacing: 0.3,
    marginRight: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ratingText: {
    fontSize: 11,
    fontFamily: FONTS.semiBold,
    color: '#0A1D37',
    marginLeft: 3,
  },
  hotspotDescription: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: '#6D6D6D',
    letterSpacing: 0.2,
    lineHeight: 16,
    marginBottom: 8,
  },
  hotspotFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F7F7F7',
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likesText: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
    color: '#E74C3C',
    marginLeft: 4,
    letterSpacing: 0.2,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: '#6D6D6D',
    marginLeft: 4,
    letterSpacing: 0.2,
  },
});

