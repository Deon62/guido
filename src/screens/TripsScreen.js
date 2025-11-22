import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar as RNStatusBar, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { PlaceCard } from '../components/PlaceCard';
import { PlaceCardSkeleton } from '../components/PlaceCardSkeleton';
import { TabSelector } from '../components/TabSelector';
import { BottomNavBar } from '../components/BottomNavBar';
import { ErrorCard } from '../components/ErrorCard';
import { FONTS } from '../constants/fonts';
import { getMyWishlist } from '../services/authService';
import { getToken } from '../utils/storage';
import { API_BASE_URL } from '../config/api';

export const TripsScreen = ({ activeTab = 'trips', onTabChange, onNotificationsPress, onRatePress, onAddTripPress, onAIRecommend }) => {
  const [selectedTab, setSelectedTab] = useState('wishlist');
  const [isLoading, setIsLoading] = useState(true);
  const [hasUnreadNotifications] = useState(true); // TODO: Replace with actual notification state
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistError, setWishlistError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Get safe area insets
  const statusBarHeight = Platform.OS === 'ios' ? 44 : RNStatusBar.currentHeight || 0;

  // Format timestamp from API
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Just now';
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch (error) {
      return 'Just now';
    }
  };

  // Fetch wishlist posts
  const fetchWishlist = async () => {
    const token = getToken();
    if (!token) {
      setWishlistError('Please log in to view your wishlist.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setWishlistError(null);

    try {
      const wishlistData = await getMyWishlist(token);
      console.log('Wishlist data received:', wishlistData);

      // Transform wishlist items to display format
      const transformedItems = wishlistData.map(item => {
        // Get first image from post_image array or post.media_paths
        const imageArray = item.post_image || item.post?.media_paths || [];
        const firstImage = imageArray.length > 0 ? imageArray[0] : null;
        
        // Convert to full URL
        let imageUrl = null;
        if (firstImage) {
          imageUrl = firstImage.startsWith('http') 
            ? firstImage 
            : `${API_BASE_URL}/${firstImage}`;
        }

        // Get author avatar
        let authorAvatar = null;
        if (item.post?.author?.profile_photo) {
          const photoUrl = item.post.author.profile_photo.startsWith('http')
            ? item.post.author.profile_photo
            : `${API_BASE_URL}/${item.post.author.profile_photo}`;
          authorAvatar = { uri: photoUrl };
        }

        return {
          id: item.id || item.post_id,
          postId: item.post_id || item.post?.id,
          image: imageUrl ? { uri: imageUrl } : null,
          location: item.location || item.post?.location || 'Unknown Location',
          category: item.category_name || item.post?.category || 'General',
          author: {
            name: item.post?.author?.nickname || item.post?.author?.username || 'Unknown',
            username: item.post?.author?.username || '',
            avatar: authorAvatar,
          },
          createdAt: item.created_at || item.post?.created_at,
        };
      });

      console.log('Transformed wishlist items:', transformedItems);
      setWishlistItems(transformedItems);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      setWishlistError(err.message || 'Failed to load wishlist. Please try again.');
      setWishlistItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load trips data from API
  useEffect(() => {
    const loadTrips = async () => {
      // TODO: Fetch trips from API for other tabs
      // const token = getToken();
      // const trips = await fetchTrips(token);
      setIsLoading(false);
    };
    loadTrips();
  }, []);

  // Load wishlist when wishlist tab is selected
  useEffect(() => {
    if (selectedTab === 'wishlist') {
      fetchWishlist();
    }
  }, [selectedTab]);

  // Refresh handler
  const onRefresh = async () => {
    if (selectedTab === 'wishlist') {
      setRefreshing(true);
      await fetchWishlist();
      setRefreshing(false);
    }
  };

  // TODO: Replace with API data
  const allTrips = [];

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
    // TODO: Get user's trip data from API for AI recommendations
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

      {/* Tab Description */}
      <View style={styles.tabDescriptionContainer}>
        <Text style={styles.tabDescription}>
          {selectedTab === 'wishlist' && 'Places you added wishing to visit'}
          {selectedTab === 'active' && 'Places you are currently visiting'}
          {selectedTab === 'past' && 'Places you have already visited'}
          {selectedTab === 'recommendations' && 'Get personalized recommendations based on your trips'}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          selectedTab === 'wishlist' ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#0A1D37"
              colors={['#0A1D37']}
            />
          ) : undefined
        }
      >
        {selectedTab === 'wishlist' ? (
          // Wishlist Tab Content
          isLoading ? (
            <View style={styles.emptyContainer}>
              <ActivityIndicator size="large" color="#0A1D37" />
              <Text style={styles.loadingText}>Loading wishlist...</Text>
            </View>
          ) : wishlistError ? (
            <View style={styles.emptyContainer}>
              <ErrorCard
                message={wishlistError}
                onRetry={fetchWishlist}
              />
            </View>
          ) : wishlistItems.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="bookmark-outline" size={64} color="#C0C0C0" />
              <Text style={styles.emptyText}>No saved posts yet</Text>
              <Text style={styles.emptySubtext}>
                Tap the bookmark icon on any post in the feed to add it to your wishlist!
              </Text>
            </View>
          ) : (
            <View style={styles.wishlistContainer}>
              {wishlistItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.wishlistItem}
                  activeOpacity={0.8}
                >
                  {/* Image - only show first one */}
                  {item.image ? (
                    <Image source={item.image} style={styles.itemImage} resizeMode="cover" />
                  ) : (
                    <View style={styles.itemImagePlaceholder}>
                      <Ionicons name="image-outline" size={32} color="#C0C0C0" />
                    </View>
                  )}

                  {/* Content */}
                  <View style={styles.itemContent}>
                    {/* Location and Category */}
                    <View style={styles.itemHeader}>
                      <View style={styles.locationContainer}>
                        <Ionicons name="location" size={14} color="#6D6D6D" />
                        <Text style={styles.locationText} numberOfLines={1}>
                          {item.location}
                        </Text>
                      </View>
                      {item.category && (
                        <View style={[styles.categoryTag, { backgroundColor: '#F0F0F0' }]}>
                          <Text style={styles.categoryText}>{item.category}</Text>
                        </View>
                      )}
                    </View>

                    {/* Author Info */}
                    <View style={styles.authorContainer}>
                      {item.author.avatar ? (
                        <Image source={item.author.avatar} style={styles.authorAvatar} />
                      ) : (
                        <View style={styles.authorAvatarPlaceholder}>
                          <Ionicons name="person" size={12} color="#C0C0C0" />
                        </View>
                      )}
                      <Text style={styles.authorName} numberOfLines={1}>
                        {item.author.name}
                      </Text>
                      {item.createdAt && (
                        <Text style={styles.timestamp}>
                          • {formatTimestamp(item.createdAt)}
                        </Text>
                      )}
                    </View>
                  </View>

                  {/* Bookmark Icon */}
                  <View style={styles.bookmarkIcon}>
                    <Ionicons name="bookmark" size={20} color="#0A1D37" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )
        ) : selectedTab === 'recommendations' ? (
          // Show AI Recommendations section
          <View style={styles.recommendationsContainer}>
            <View style={styles.aiRecommendCard}>
              <View style={styles.aiRecommendHeader}>
                <Ionicons name="sparkles" size={32} color="#0A1D37" />
                <Text style={styles.aiRecommendTitle}>Get Deony Recommendations</Text>
              </View>
              <Text style={styles.aiRecommendDescription}>
                Discover personalized places based on your wishlist, active trips, and past experiences. Deony analyzes your travel patterns to suggest destinations you'll love.
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
            <Ionicons 
              name={
                selectedTab === 'wishlist' ? 'heart-outline' :
                selectedTab === 'active' ? 'calendar-outline' :
                'time-outline'
              } 
              size={64} 
              color="#C0C0C0" 
            />
            <Text style={styles.emptyText}>No {selectedTab} trips</Text>
            <Text style={styles.emptySubtext}>
              {selectedTab === 'wishlist' && 'Start building your dream destinations! Add places you want to visit to your wishlist.'}
              {selectedTab === 'active' && 'You don\'t have any active trips right now. Plan your next adventure!'}
              {selectedTab === 'past' && 'You haven\'t added any past trips yet. Share your travel memories!'}
              {selectedTab === 'recommendations' && 'Get personalized trip recommendations based on your preferences!'}
            </Text>
            {selectedTab === 'past' && (
              <TouchableOpacity
                style={styles.emptyStateButton}
                onPress={() => {
                  if (onAddTripPress) {
                    onAddTripPress();
                  }
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" style={styles.emptyStateButtonIcon} />
                <Text style={styles.emptyStateButtonText}>Add Past Trip</Text>
              </TouchableOpacity>
            )}
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
  tabDescriptionContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  tabDescription: {
    fontSize: 13,
    fontFamily: FONTS.regular,
    color: '#6D6D6D',
    letterSpacing: 0.2,
    lineHeight: 18,
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
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A1D37',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginTop: 8,
  },
  emptyStateButtonIcon: {
    marginRight: 8,
  },
  emptyStateButtonText: {
    fontSize: 15,
    fontFamily: FONTS.semiBold,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: '#6D6D6D',
    marginTop: 16,
  },
  wishlistContainer: {
    padding: 16,
  },
  wishlistItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#0A1D37',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  itemImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#F0F0F0',
  },
  itemImagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContent: {
    padding: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  locationText: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    color: '#1A1A1A',
    marginLeft: 4,
    flex: 1,
  },
  categoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 11,
    fontFamily: FONTS.semiBold,
    color: '#6D6D6D',
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  authorAvatarPlaceholder: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F7F7F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  authorName: {
    fontSize: 13,
    fontFamily: FONTS.regular,
    color: '#6D6D6D',
    flex: 1,
  },
  timestamp: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: '#9B9B9B',
    marginLeft: 4,
  },
  bookmarkIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 6,
    shadowColor: '#0A1D37',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});

