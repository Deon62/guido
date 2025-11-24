import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar as RNStatusBar, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { FONTS } from '../constants/fonts';
import { getMyCommunityPosts } from '../services/authService';
import { getToken } from '../utils/storage';
import { API_BASE_URL } from '../config/api';

export const MyPostsScreen = ({ onBack, onPostPress }) => {
  const statusBarHeight = Platform.OS === 'ios' ? 44 : RNStatusBar.currentHeight || 0;

  const [userPosts, setUserPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const formatNumber = (num) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
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

  // Fetch user's community posts from API
  const fetchMyCommunityPosts = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setError('Please log in to view your posts');
      setIsLoading(false);
      return;
    }

    try {
      const posts = await getMyCommunityPosts(token, 0, 20);
      
      // Transform API posts to match UI format
      const transformedPosts = posts.map((post) => {
        // Build full URL for profile picture if available
        let avatarUri = null;
        if (post.author_profile_picture) {
          const profilePath = post.author_profile_picture.startsWith('http') 
            ? post.author_profile_picture 
            : post.author_profile_picture.startsWith('uploads/')
            ? post.author_profile_picture
            : `uploads/${post.author_profile_picture}`;
          avatarUri = { uri: `${API_BASE_URL}/${profilePath}` };
        }

        return {
          id: post.id?.toString() || Date.now().toString(),
          community: post.community?.name || 'Unknown Community',
          communityId: post.community_id || post.community?.id,
          title: post.title || '',
          content: post.message || post.content || '',
          upvotes: post.upvotes || post.likes_count || 0,
          comments: post.comments_count || 0,
          isUpvoted: post.is_upvoted || false,
          timestamp: post.created_at ? formatTimestamp(post.created_at) : 'Just now',
          user: {
            name: post.author_name || 'You',
            username: post.author_username || '',
            avatar: avatarUri || '👤',
          },
        };
      });

      setUserPosts(transformedPosts);
      setError(null);
    } catch (err) {
      console.error('Error fetching my community posts:', err);
      setError(err.message || 'Failed to load your posts. Please try again.');
      setUserPosts([]);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Fetch posts on mount
  useEffect(() => {
    fetchMyCommunityPosts();
  }, [fetchMyCommunityPosts]);

  // Handle refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMyCommunityPosts();
  }, [fetchMyCommunityPosts]);

  const handlePostPress = (post) => {
    if (onPostPress) {
      // Create community object from post data
      const community = {
        id: post.communityId || post.community?.id || 'unknown',
        name: post.community || post.community?.name || 'Unknown Community',
        description: post.community?.description || '',
      };
      // Ensure post has user information for PostDetailScreen
      const postWithUser = {
        ...post,
        user: {
          name: post.user?.name || 'You', // Since these are the user's own posts
          avatar: post.user?.avatar || '👤',
        },
      };
      onPostPress(postWithUser, community, []);
    }
  };

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
        <Text style={styles.headerTitle}>My Posts</Text>
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
              onPress={fetchMyCommunityPosts}
              activeOpacity={0.7}
            >
              <Text style={styles.emptyStateButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : userPosts.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color="#C0C0C0" />
            <Text style={styles.emptyStateText}>No posts yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Start sharing your experiences with the community! Create your first post to get started.
            </Text>
            <TouchableOpacity
              style={styles.emptyStateButton}
              onPress={() => {
                // Navigate to create post - this would be handled by parent
                console.log('Create post from empty state');
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" style={styles.emptyStateButtonIcon} />
              <Text style={styles.emptyStateButtonText}>Create Your First Post</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.postsList}>
            {userPosts.map((post) => (
              <TouchableOpacity
                key={post.id}
                style={styles.postCard}
                onPress={() => handlePostPress(post)}
                activeOpacity={0.85}
              >
                <View style={styles.postHeader}>
                  <View style={styles.communityBadge}>
                    <Text style={styles.communityText}>{post.community}</Text>
                  </View>
                  <Text style={styles.postTimestamp}>{post.timestamp}</Text>
                </View>

                <Text style={styles.postTitle}>{post.title}</Text>
                <Text style={styles.postContent} numberOfLines={3}>
                  {post.content}
                </Text>

                <View style={styles.postActions}>
                  <View style={styles.actionButton}>
                    <Ionicons
                      name={post.isUpvoted ? 'arrow-up' : 'arrow-up-outline'}
                      size={18}
                      color={post.isUpvoted ? '#0A1D37' : '#6D6D6D'}
                    />
                    <Text style={[styles.actionText, post.isUpvoted && styles.actionTextActive]}>
                      {formatNumber(post.upvotes)}
                    </Text>
                  </View>

                  <View style={styles.actionButton}>
                    <Ionicons name="chatbubble-outline" size={18} color="#6D6D6D" />
                    <Text style={styles.actionText}>{formatNumber(post.comments)}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
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
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  communityBadge: {
    backgroundColor: '#F7F7F7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  communityText: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
    color: '#0A1D37',
  },
  postTimestamp: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: '#9B9B9B',
  },
  postTitle: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: '#0A1D37',
    marginBottom: 8,
    lineHeight: 22,
  },
  postContent: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: '#3A3A3A',
    lineHeight: 20,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F7F7F7',
    gap: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 13,
    fontFamily: FONTS.regular,
    color: '#6D6D6D',
  },
  actionTextActive: {
    color: '#0A1D37',
    fontFamily: FONTS.semiBold,
  },
});

