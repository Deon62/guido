import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Platform, StatusBar as RNStatusBar, Alert, Dimensions, RefreshControl, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { FONTS } from '../constants/fonts';
import { getMyFeedPosts, deleteFeedPost } from '../services/authService';
import { getToken } from '../utils/storage';
import { API_BASE_URL } from '../config/api';

const SCREEN_WIDTH = Dimensions.get('window').width;

export const MyFeedPostsScreen = ({ onBack, onPostPress, onAddPostPress }) => {
  const statusBarHeight = Platform.OS === 'ios' ? 44 : RNStatusBar.currentHeight || 0;

  const [userFeedPosts, setUserFeedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const handleDeletePost = async (postId) => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const token = getToken();
            if (!token) {
              Alert.alert('Authentication Required', 'Please log in to delete posts.');
              return;
            }

            try {
              // Optimistic update - remove from UI immediately
              setUserFeedPosts(prev => prev.filter(post => post.id !== postId));
              
              // Call API to delete
              await deleteFeedPost(token, postId);
              
              Alert.alert('Success', 'Post deleted successfully.');
            } catch (err) {
              console.error('Error deleting post:', err);
              // Revert optimistic update on error
              fetchMyFeedPosts();
              Alert.alert('Error', err.message || 'Failed to delete post. Please try again.');
            }
          },
        },
      ]
    );
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const getCategoryColor = (category) => {
    if (!category || typeof category !== 'string') return '#6D6D6D';
    
    switch (category.toLowerCase()) {
      case 'landmark':
      case 'landmarks':
        return '#FF6B6B';
      case 'hotel':
      case 'hotels':
        return '#4ECDC4';
      case 'cafe':
      case 'cafes':
        return '#FFE66D';
      case 'nature':
        return '#95E1D3';
      case 'skyscraper':
      case 'skycrapers':
        return '#9B59B6';
      default:
        return '#6D6D6D';
    }
  };

  // Format timestamp from API
  const formatTimestamp = (timestamp) => {
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
      
      return date.toLocaleDateString();
    } catch (e) {
      return 'Just now';
    }
  };

  // Fetch user's feed posts from API
  const fetchMyFeedPosts = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setError('Please log in to view your feed posts');
      setIsLoading(false);
      return;
    }

    try {
      const posts = await getMyFeedPosts(token, 0, 20);
      
      // Transform API posts to match UI format
      const transformedPosts = posts.map((post) => {
        // Convert media_paths to images array with full URLs
        const images = (post.media_paths || []).map(mediaPath => {
          const fullUrl = mediaPath.startsWith('http') 
            ? mediaPath 
            : `${API_BASE_URL}/${mediaPath}`;
          return { uri: fullUrl };
        });

        return {
          id: post.id?.toString() || Date.now().toString(),
          place: {
            name: post.location || 'Unknown Location',
            location: post.location || '',
            category: post.category?.name || 'Unknown',
          },
          images: images,
          caption: post.description || '',
          likes: post.likes_count || 0,
          comments: post.comments_count || 0,
          timestamp: post.created_at ? formatTimestamp(post.created_at) : 'Just now',
        };
      });

      setUserFeedPosts(transformedPosts);
      setError(null);
    } catch (err) {
      console.error('Error fetching my feed posts:', err);
      setError(err.message || 'Failed to load your feed posts. Please try again.');
      setUserFeedPosts([]);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Fetch posts on mount
  useEffect(() => {
    fetchMyFeedPosts();
  }, [fetchMyFeedPosts]);

  // Handle refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMyFeedPosts();
  }, [fetchMyFeedPosts]);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: statusBarHeight + 16 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#0A1D37" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Feed Posts</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#0A1D37"
          />
        }
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0A1D37" />
            <Text style={styles.loadingText}>Loading your posts...</Text>
          </View>
        ) : error ? (
          <View style={styles.emptyState}>
            <Ionicons name="alert-circle-outline" size={64} color="#E74C3C" />
            <Text style={styles.emptyStateText}>Error loading posts</Text>
            <Text style={styles.emptyStateSubtext}>{error}</Text>
            <TouchableOpacity
              style={styles.emptyStateButton}
              onPress={fetchMyFeedPosts}
              activeOpacity={0.7}
            >
              <Text style={styles.emptyStateButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : userFeedPosts.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="images-outline" size={64} color="#C0C0C0" />
            <Text style={styles.emptyStateText}>No feed posts yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Share your travel experiences with photos! Create your first feed post to inspire others.
            </Text>
            <TouchableOpacity
              style={styles.emptyStateButton}
              onPress={() => {
                if (onAddPostPress) {
                  onAddPostPress();
                } else {
                  console.log('Create feed post from empty state');
                }
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="camera-outline" size={20} color="#FFFFFF" style={styles.emptyStateButtonIcon} />
              <Text style={styles.emptyStateButtonText}>Create Feed Post</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.postsList}>
            {userFeedPosts.map((post) => (
              <View key={post.id} style={styles.postCard}>
                {/* Post Header */}
                <View style={styles.postCardHeader}>
                  <View style={styles.postPlaceInfo}>
                    <Ionicons name="location" size={14} color="#6D6D6D" />
                    <Text style={styles.postPlaceName}>{post.place.name}</Text>
                    <View style={[styles.categoryTag, { backgroundColor: `${getCategoryColor(post.place.category)}20` }]}>
                      <Text style={[styles.categoryText, { color: getCategoryColor(post.place.category) }]}>
                        {post.place.category}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeletePost(post.id)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="trash-outline" size={20} color="#E74C3C" />
                  </TouchableOpacity>
                </View>

                {/* Post Images Carousel */}
                {post.images && post.images.length > 0 && (
                  <View style={styles.postImagesContainer}>
                    <ScrollView
                      horizontal
                      pagingEnabled
                      showsHorizontalScrollIndicator={false}
                      style={styles.postImagesScroll}
                    >
                      {post.images.slice(0, 5).map((image, imgIndex) => (
                        <Image
                          key={imgIndex}
                          source={image}
                          style={styles.postImage}
                          resizeMode="cover"
                        />
                      ))}
                    </ScrollView>
                    {post.images.length > 1 && (
                      <View style={styles.imageIndicators}>
                        {post.images.slice(0, 5).map((_, imgIndex) => (
                          <View key={imgIndex} style={styles.indicatorDot} />
                        ))}
                      </View>
                    )}
                  </View>
                )}

                {/* Post Caption */}
                {post.caption && (
                  <Text style={styles.postCaption} numberOfLines={3}>
                    {post.caption}
                  </Text>
                )}

                {/* Post Stats */}
                <View style={styles.postStats}>
                  <View style={styles.statItem}>
                    <Ionicons name="heart" size={16} color="#E74C3C" />
                    <Text style={styles.statText}>{formatNumber(post.likes)}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Ionicons name="chatbubble-outline" size={16} color="#6D6D6D" />
                    <Text style={styles.statText}>{formatNumber(post.comments)}</Text>
                  </View>
                  <Text style={styles.postTimestamp}>{post.timestamp}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button for Adding Post */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          if (onAddPostPress) {
            onAddPostPress();
          } else {
            console.log('Add post pressed');
          }
        }}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
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
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: '#0A1D37',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 120,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: '#6D6D6D',
    marginTop: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 120,
    paddingHorizontal: 32,
  },
  emptyStateText: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: '#6D6D6D',
    marginTop: 24,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: '#9B9B9B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
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
  postsList: {
    padding: 16,
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    overflow: 'hidden',
  },
  postCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F7F7F7',
  },
  postPlaceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  postPlaceName: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    color: '#0A1D37',
    marginLeft: 6,
    marginRight: 8,
  },
  categoryTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 10,
    fontFamily: FONTS.semiBold,
  },
  deleteButton: {
    padding: 4,
  },
  postImagesContainer: {
    position: 'relative',
    width: '100%',
    height: 250,
  },
  postImagesScroll: {
    width: '100%',
    height: '100%',
  },
  postImage: {
    width: SCREEN_WIDTH - 32,
    height: 250,
    backgroundColor: '#E8E8E8',
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  indicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  postCaption: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: '#3A3A3A',
    lineHeight: 20,
    padding: 12,
  },
  postStats: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#F7F7F7',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 13,
    fontFamily: FONTS.regular,
    color: '#6D6D6D',
  },
  postTimestamp: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: '#9B9B9B',
    marginLeft: 'auto',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
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
});

