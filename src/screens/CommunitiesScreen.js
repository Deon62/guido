import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar as RNStatusBar, TextInput, KeyboardAvoidingView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { BottomNavBar } from '../components/BottomNavBar';
import { FONTS } from '../constants/fonts';

export const CommunitiesScreen = ({ activeTab, onTabChange, onPostPress }) => {
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [joinedCommunities, setJoinedCommunities] = useState(new Set(['hotels', 'museums']));
  const [newPostText, setNewPostText] = useState('');
  const [showNewPostInput, setShowNewPostInput] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get safe area insets
  const statusBarHeight = Platform.OS === 'ios' ? 44 : RNStatusBar.currentHeight || 0;

  // Mock communities data
  const communities = [
    {
      id: 'hotels',
      name: 'q/hotels',
      description: 'Discuss hotels, accommodations, and stays',
      members: 12450,
      posts: 3420,
      icon: 'bed-outline',
    },
    {
      id: 'museums',
      name: 'q/museums',
      description: 'Share experiences and tips about museums',
      members: 8920,
      posts: 2150,
      icon: 'library-outline',
    },
    {
      id: 'landmarks',
      name: 'q/landmarks',
      description: 'Iconic places and landmarks discussions',
      members: 15680,
      posts: 4890,
      icon: 'location-outline',
    },
    {
      id: 'cafes',
      name: 'q/cafes',
      description: 'Coffee shops, cafes, and dining spots',
      members: 7450,
      posts: 1890,
      icon: 'cafe-outline',
    },
    {
      id: 'nature',
      name: 'q/nature',
      description: 'Parks, trails, and natural attractions',
      members: 11320,
      posts: 3120,
      icon: 'leaf-outline',
    },
    {
      id: 'restaurants',
      name: 'q/restaurants',
      description: 'Restaurant reviews and recommendations',
      members: 9830,
      posts: 2560,
      icon: 'restaurant-outline',
    },
  ];

  // Mock posts data for selected community
  const getCommunityPosts = (communityId) => {
    const allPosts = {
      hotels: [
        {
          id: '1',
          user: { name: 'Sarah Johnson', avatar: '👤' },
          title: 'Best budget hotel in Paris?',
          content: 'Looking for recommendations for a budget-friendly hotel in Paris. Preferably near the city center. Any suggestions?',
          upvotes: 124,
          comments: 23,
          timestamp: '2 hours ago',
          isUpvoted: false,
        },
        {
          id: '2',
          user: { name: 'Mike Chen', avatar: '👤' },
          title: 'Hotel booking tips',
          content: 'Always book directly with the hotel for better rates and cancellation policies. Also check for seasonal discounts!',
          upvotes: 89,
          comments: 15,
          timestamp: '5 hours ago',
          isUpvoted: true,
        },
        {
          id: '3',
          user: { name: 'Emma Wilson', avatar: '👤' },
          title: 'Boutique hotels vs chains',
          content: 'What do you prefer? I love the unique character of boutique hotels but chains offer more reliability.',
          upvotes: 67,
          comments: 31,
          timestamp: '1 day ago',
          isUpvoted: false,
        },
      ],
      museums: [
        {
          id: '1',
          user: { name: 'David Lee', avatar: '👤' },
          title: 'Louvre Museum - must see exhibits?',
          content: 'Visiting the Louvre next week. What are the absolute must-see exhibits? I have limited time.',
          upvotes: 156,
          comments: 42,
          timestamp: '3 hours ago',
          isUpvoted: false,
        },
        {
          id: '2',
          user: { name: 'Lisa Park', avatar: '👤' },
          title: 'Museum pass worth it?',
          content: 'Is the Paris Museum Pass worth buying? Planning to visit 4-5 museums during my stay.',
          upvotes: 98,
          comments: 28,
          timestamp: '8 hours ago',
          isUpvoted: true,
        },
      ],
      landmarks: [
        {
          id: '1',
          user: { name: 'Alex Brown', avatar: '👤' },
          title: 'Eiffel Tower - best time to visit?',
          content: 'When is the best time to visit the Eiffel Tower to avoid crowds? Early morning or late evening?',
          upvotes: 203,
          comments: 56,
          timestamp: '1 hour ago',
          isUpvoted: false,
        },
      ],
      cafes: [
        {
          id: '1',
          user: { name: 'Maria Garcia', avatar: '👤' },
          title: 'Cozy cafes for remote work',
          content: 'Looking for cafes in Paris with good WiFi and a quiet atmosphere for working. Any recommendations?',
          upvotes: 78,
          comments: 19,
          timestamp: '4 hours ago',
          isUpvoted: false,
        },
      ],
      nature: [
        {
          id: '1',
          user: { name: 'Tom Anderson', avatar: '👤' },
          title: 'Best parks for a morning run',
          content: 'Which parks in Paris are best for running? Looking for safe, well-maintained paths.',
          upvotes: 92,
          comments: 24,
          timestamp: '6 hours ago',
          isUpvoted: true,
        },
      ],
      restaurants: [
        {
          id: '1',
          user: { name: 'Sophie Martin', avatar: '👤' },
          title: 'Authentic French cuisine recommendations',
          content: 'Where can I find authentic French food that locals actually eat? Not tourist traps.',
          upvotes: 145,
          comments: 38,
          timestamp: '2 hours ago',
          isUpvoted: false,
        },
      ],
    };
    return allPosts[communityId] || [];
  };

  // Get comments for a post
  const getPostComments = (postId) => {
    const allComments = {
      'hotels-1': [
        { id: '1', user: { name: 'John Doe', avatar: '👤' }, text: 'I stayed at Hotel Central last month. Great location and affordable!', timestamp: '1 hour ago' },
        { id: '2', user: { name: 'Jane Smith', avatar: '👤' }, text: 'Check out Hotel des Arts, it\'s in the heart of the city.', timestamp: '2 hours ago' },
        { id: '3', user: { name: 'Bob Wilson', avatar: '👤' }, text: 'I recommend booking through the hotel website directly for better rates.', timestamp: '3 hours ago' },
      ],
      'hotels-2': [
        { id: '1', user: { name: 'Alice Brown', avatar: '👤' }, text: 'Great tip! I always check cancellation policies too.', timestamp: '1 hour ago' },
        { id: '2', user: { name: 'Charlie Davis', avatar: '👤' }, text: 'Also sign up for hotel loyalty programs for extra discounts.', timestamp: '4 hours ago' },
      ],
      'museums-1': [
        { id: '1', user: { name: 'Sarah Lee', avatar: '👤' }, text: 'Definitely see the Mona Lisa, Venus de Milo, and the Winged Victory of Samothrace!', timestamp: '30 mins ago' },
        { id: '2', user: { name: 'Mike Johnson', avatar: '👤' }, text: 'The Egyptian antiquities section is amazing too. Don\'t miss it!', timestamp: '1 hour ago' },
        { id: '3', user: { name: 'Emma White', avatar: '👤' }, text: 'Get there early to avoid the crowds at the Mona Lisa.', timestamp: '2 hours ago' },
      ],
      'landmarks-1': [
        { id: '1', user: { name: 'David Green', avatar: '👤' }, text: 'Early morning (before 9 AM) is best. Much less crowded!', timestamp: '45 mins ago' },
        { id: '2', user: { name: 'Lisa Chen', avatar: '👤' }, text: 'Sunset is also beautiful but can be busy. Book tickets in advance.', timestamp: '1 hour ago' },
      ],
    };
    return allComments[postId] || [];
  };

  const handleJoinCommunity = (communityId) => {
    setJoinedCommunities(prev => {
      const newSet = new Set(prev);
      if (newSet.has(communityId)) {
        newSet.delete(communityId);
      } else {
        newSet.add(communityId);
      }
      return newSet;
    });
  };

  const handlePostPress = (post) => {
    if (onPostPress && selectedCommunity) {
      const community = communities.find(c => c.id === selectedCommunity);
      const postKey = `${selectedCommunity}-${post.id}`;
      const comments = getPostComments(postKey);
      onPostPress(post, community, comments);
    }
  };

  const handleUpvote = (postId) => {
    // In a real app, this would update the post's upvote state
    console.log('Upvote post:', postId);
  };

  const handlePostSubmit = () => {
    if (newPostText.trim()) {
      // In a real app, this would submit the post
      console.log('New post:', newPostText);
      setNewPostText('');
      setShowNewPostInput(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  // If a community is selected, show its posts
  if (selectedCommunity) {
    const community = communities.find(c => c.id === selectedCommunity);
    const posts = getCommunityPosts(selectedCommunity);
    const isJoined = joinedCommunities.has(selectedCommunity);

    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        
        {/* Header */}
        <View style={[styles.header, { paddingTop: statusBarHeight + 16 }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedCommunity(null)}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#0A1D37" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>{community.name}</Text>
            <Text style={styles.headerSubtitle}>{formatNumber(community.members)} members</Text>
          </View>
          <TouchableOpacity
            style={[styles.joinButton, isJoined && styles.joinButtonJoined]}
            onPress={() => handleJoinCommunity(selectedCommunity)}
            activeOpacity={0.7}
          >
            <Text style={[styles.joinButtonText, isJoined && styles.joinButtonTextJoined]}>
              {isJoined ? 'Joined' : 'Join'}
            </Text>
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Community Info */}
            <View style={styles.communityDetailInfo}>
              <Ionicons name={community.icon} size={32} color="#0A1D37" />
              <Text style={styles.communityDescription}>{community.description}</Text>
            </View>

            {/* New Post Input */}
            {showNewPostInput && isJoined && (
              <View style={styles.newPostContainer}>
                <TextInput
                  style={styles.newPostInput}
                  placeholder="What would you like to discuss?"
                  placeholderTextColor="#9B9B9B"
                  value={newPostText}
                  onChangeText={setNewPostText}
                  multiline
                  maxLength={500}
                />
                <View style={styles.newPostActions}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      setShowNewPostInput(false);
                      setNewPostText('');
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.submitButton, newPostText.trim() === '' && styles.submitButtonDisabled]}
                    onPress={handlePostSubmit}
                    activeOpacity={0.7}
                    disabled={newPostText.trim() === ''}
                  >
                    <Text style={[styles.submitButtonText, newPostText.trim() === '' && styles.submitButtonTextDisabled]}>
                      Post
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Create Post Button */}
            {!showNewPostInput && isJoined && (
              <TouchableOpacity
                style={styles.createPostButton}
                onPress={() => setShowNewPostInput(true)}
                activeOpacity={0.7}
              >
                <Ionicons name="create-outline" size={20} color="#0A1D37" />
                <Text style={styles.createPostText}>Create a post</Text>
              </TouchableOpacity>
            )}

            {/* Posts List */}
            <View style={styles.postsList}>
              {posts.map((post) => (
                <TouchableOpacity
                  key={post.id}
                  style={styles.postCard}
                  onPress={() => handlePostPress(post)}
                  activeOpacity={0.85}
                >
                  <View style={styles.postHeader}>
                    <View style={styles.postUserInfo}>
                      <View style={styles.postAvatar}>
                        <Text style={styles.postAvatarText}>{post.user.avatar}</Text>
                      </View>
                      <View>
                        <Text style={styles.postUserName}>{post.user.name}</Text>
                        <Text style={styles.postTimestamp}>{post.timestamp}</Text>
                      </View>
                    </View>
                  </View>

                  <Text style={styles.postTitle}>{post.title}</Text>
                  <Text style={styles.postContent}>{post.content}</Text>

                  <View style={styles.postActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleUpvote(post.id);
                      }}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={post.isUpvoted ? 'arrow-up' : 'arrow-up-outline'}
                        size={18}
                        color={post.isUpvoted ? '#0A1D37' : '#6D6D6D'}
                      />
                      <Text style={[styles.actionText, post.isUpvoted && styles.actionTextActive]}>
                        {formatNumber(post.upvotes)}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        handlePostPress(post);
                      }}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="chatbubble-outline" size={18} color="#6D6D6D" />
                      <Text style={styles.actionText}>{formatNumber(post.comments)}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={(e) => e.stopPropagation()}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="share-outline" size={18} color="#6D6D6D" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <BottomNavBar activeTab={activeTab} onTabChange={onTabChange} />
      </View>
    );
  }

  // Filter communities based on search query
  const filteredCommunities = communities.filter((community) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      community.name.toLowerCase().includes(query) ||
      community.description.toLowerCase().includes(query)
    );
  });

  // Show communities list
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: statusBarHeight + 16 }]}>
        <View>
          <Text style={styles.headerTitle}>Communities</Text>
          <Text style={styles.headerSubtitle}>Join discussions about places</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#6D6D6D" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search communities..."
          placeholderTextColor="#9B9B9B"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            style={styles.searchClearButton}
            activeOpacity={0.7}
          >
            <Ionicons name="close-circle" size={20} color="#6D6D6D" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.communitiesList}>
          {filteredCommunities.length === 0 ? (
            <View style={styles.emptySearchResults}>
              <Ionicons name="search-outline" size={48} color="#C0C0C0" />
              <Text style={styles.emptySearchText}>No communities found</Text>
              <Text style={styles.emptySearchSubtext}>Try a different search term</Text>
            </View>
          ) : (
            filteredCommunities.map((community) => {
            const isJoined = joinedCommunities.has(community.id);
            return (
              <TouchableOpacity
                key={community.id}
                style={styles.communityCard}
                onPress={() => setSelectedCommunity(community.id)}
                activeOpacity={0.85}
              >
                <View style={styles.communityCardHeader}>
                  <View style={styles.communityIconContainer}>
                    <Ionicons name={community.icon} size={24} color="#0A1D37" />
                  </View>
                  <View style={styles.communityInfo}>
                    <Text style={styles.communityName}>{community.name}</Text>
                    <Text style={styles.communityStats}>
                      {formatNumber(community.members)} members • {formatNumber(community.posts)} posts
                    </Text>
                  </View>
                  {isJoined && (
                    <View style={styles.joinedBadge}>
                      <Text style={styles.joinedBadgeText}>Joined</Text>
                    </View>
                  )}
                </View>
                <View style={styles.communityDescriptionContainer}>
                  <Text style={styles.communityCardDescription} numberOfLines={2}>
                    {community.description}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
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
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: '#1A1A1A',
    padding: 0,
  },
  searchClearButton: {
    padding: 4,
    marginLeft: 8,
  },
  emptySearchResults: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptySearchText: {
    fontSize: 16,
    fontFamily: FONTS.semiBold,
    color: '#6D6D6D',
    marginTop: 16,
    marginBottom: 4,
  },
  emptySearchSubtext: {
    fontSize: 13,
    fontFamily: FONTS.regular,
    color: '#9B9B9B',
  },
  joinButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#0A1D37',
    borderRadius: 20,
  },
  joinButtonJoined: {
    backgroundColor: '#E8E8E8',
  },
  joinButtonText: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    color: '#FFFFFF',
  },
  joinButtonTextJoined: {
    color: '#6D6D6D',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  communitiesList: {
    padding: 16,
  },
  communityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  communityCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  communityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F7F7F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  communityInfo: {
    flex: 1,
  },
  communityName: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: '#0A1D37',
    marginBottom: 2,
  },
  communityStats: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: '#6D6D6D',
  },
  joinedBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#E8E8E8',
    borderRadius: 12,
  },
  joinedBadgeText: {
    fontSize: 11,
    fontFamily: FONTS.semiBold,
    color: '#6D6D6D',
  },
  communityDescriptionContainer: {
    marginLeft: 52, // Align with icon (40px icon container + 12px margin)
    marginTop: 4,
  },
  communityCardDescription: {
    fontSize: 13,
    fontFamily: FONTS.regular,
    color: '#3A3A3A',
    lineHeight: 18,
  },
  communityDetailInfo: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    marginBottom: 8,
  },
  communityDescription: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: '#3A3A3A',
    marginTop: 12,
    lineHeight: 20,
    textAlign: 'center',
  },
  createPostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  createPostText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: '#6D6D6D',
    marginLeft: 8,
  },
  newPostContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  newPostInput: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: '#1A1A1A',
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  newPostActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: '#6D6D6D',
  },
  submitButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#0A1D37',
    borderRadius: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#E8E8E8',
  },
  submitButtonText: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    color: '#FFFFFF',
  },
  submitButtonTextDisabled: {
    color: '#9B9B9B',
  },
  postsList: {
    paddingHorizontal: 16,
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
    marginBottom: 12,
  },
  postUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F7F7F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  postAvatarText: {
    fontSize: 16,
  },
  postUserName: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
    color: '#0A1D37',
    marginBottom: 2,
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

