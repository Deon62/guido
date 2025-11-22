import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { FONTS } from '../constants/fonts';

export const MyPostsScreen = ({ onBack, onPostPress }) => {
  const statusBarHeight = Platform.OS === 'ios' ? 44 : RNStatusBar.currentHeight || 0;

  // Mock user posts data
  const [userPosts] = useState([
    {
      id: '1',
      title: 'Best budget hotel in Paris?',
      content: 'Looking for recommendations for a budget-friendly hotel in Paris. Preferably near the city center. Any suggestions?',
      community: 'q/hotels',
      upvotes: 124,
      comments: 23,
      timestamp: '2 days ago',
      isUpvoted: false,
    },
    {
      id: '2',
      title: 'Louvre Museum - must see exhibits?',
      content: 'Visiting the Louvre next week. What are the absolute must-see exhibits? I have limited time.',
      community: 'q/museums',
      upvotes: 156,
      comments: 42,
      timestamp: '5 days ago',
      isUpvoted: true,
    },
    {
      id: '3',
      title: 'Cozy cafes for remote work',
      content: 'Looking for cafes in Paris with good WiFi and a quiet atmosphere for working. Any recommendations?',
      community: 'q/cafes',
      upvotes: 78,
      comments: 19,
      timestamp: '1 week ago',
      isUpvoted: false,
    },
  ]);

  const formatNumber = (num) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const handlePostPress = (post) => {
    if (onPostPress) {
      // Create a mock community object for the post
      const community = {
        id: post.community.replace('q/', ''),
        name: post.community,
        description: '',
      };
      // Ensure post has user information for PostDetailScreen
      const postWithUser = {
        ...post,
        user: {
          name: 'You', // Since these are the user's own posts
          avatar: '👤',
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
      >
        {userPosts.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color="#C0C0C0" />
            <Text style={styles.emptyStateText}>No posts yet</Text>
            <Text style={styles.emptyStateSubtext}>Start sharing your experiences with the community!</Text>
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

