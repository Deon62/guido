import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity, Image, Platform, StatusBar as RNStatusBar, TextInput, KeyboardAvoidingView, Animated, Dimensions, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { BottomNavBar } from '../components/BottomNavBar';
import { ErrorCard } from '../components/ErrorCard';
import { LoadMoreButton } from '../components/LoadMoreButton';
import { PaginationIndicator } from '../components/PaginationIndicator';
import { FONTS } from '../constants/fonts';
import { debounce } from '../utils/debounce';
import { usePagination } from '../utils/usePagination';
import { getUser } from '../utils/storage';

export const CommunitiesScreen = ({ activeTab, onTabChange, onPostPress, onMyCommunitiesPress, onCreateCommunityPress }) => {
  const statusBarHeight = Platform.OS === 'ios' ? 44 : RNStatusBar.currentHeight || 0;
  
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [joinedCommunities, setJoinedCommunities] = useState(new Set(['hotels', 'museums']));
  const [newPostText, setNewPostText] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const searchBarWidth = useRef(new Animated.Value(0)).current;
  const searchBarOpacity = useRef(new Animated.Value(0)).current;
  const [showNewPostInput, setShowNewPostInput] = useState(false);

  // Debounced search handler - MUST be before any early returns
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // Debounce search query updates
  const debouncedSetSearch = useCallback(
    debounce((query) => {
      setDebouncedSearchQuery(query);
    }, 300),
    []
  );

  // Animate search bar
  useEffect(() => {
    if (showSearchBar) {
      Animated.parallel([
        Animated.timing(searchBarWidth, {
          toValue: 1,
          duration: 250,
          useNativeDriver: false,
        }),
        Animated.timing(searchBarOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(searchBarWidth, {
          toValue: 0,
          duration: 250,
          useNativeDriver: false,
        }),
        Animated.timing(searchBarOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: false,
        }),
      ]).start();
      setSearchQuery(''); // Clear search when closing
    }
  }, [showSearchBar]);

  // Debounce search query updates
  useEffect(() => {
    debouncedSetSearch(searchQuery);
  }, [searchQuery, debouncedSetSearch]);

  // TODO: Replace with API data
  const allCommunities = useMemo(() => [], []);

  // Load user data for profile picture
  useEffect(() => {
    const loadUserData = () => {
      const user = getUser();
      setUserData(user);
    };
    loadUserData();
  }, []);

  // TODO: Replace with API data
  const getCommunityPosts = (communityId) => {
    // TODO: Fetch posts from API
    // const token = getToken();
    // const posts = await fetchCommunityPosts(token, communityId);
    return [];
  };

  // TODO: Replace with API data
  const getPostComments = (postId) => {
    // TODO: Fetch comments from API
    // const token = getToken();
    // const comments = await fetchPostComments(token, postId);
    return [];
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
      // Use allCommunities instead of communities to ensure we find it
      const community = allCommunities.find(c => c.id === selectedCommunity);
      if (community) {
        const postKey = `${selectedCommunity}-${post.id}`;
        const comments = getPostComments(postKey);
        onPostPress(post, community, comments);
      } else {
        // If community not found, create a fallback community object
        const fallbackCommunity = {
          id: selectedCommunity,
          name: `Community ${selectedCommunity}`,
          description: '',
          members: 0,
        };
        const postKey = `${selectedCommunity}-${post.id}`;
        const comments = getPostComments(postKey);
        onPostPress(post, fallbackCommunity, comments);
      }
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

  // Filter communities based on search query (memoized) - MUST be before early return
  const filteredCommunities = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return allCommunities;
    const query = debouncedSearchQuery.toLowerCase();
    return allCommunities.filter((community) => (
      community.name.toLowerCase().includes(query) ||
      community.description.toLowerCase().includes(query)
    ));
  }, [allCommunities, debouncedSearchQuery]);

  // Use pagination hook for communities list
  const {
    displayedItems: paginatedCommunities,
    currentPage,
    totalPages,
    hasMore,
    isLoadingMore,
    loadMore,
    reset,
    totalItems,
    displayedCount,
  } = usePagination(filteredCommunities, 6, 6); // 6 communities per page, initially show 6

  // Reset pagination when filtered communities change
  useEffect(() => {
    reset();
  }, [filteredCommunities.length, reset]);

  // If a community is selected, show its posts
  if (selectedCommunity) {
    const community = allCommunities.find(c => c.id === selectedCommunity);
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
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#0A1D37"
                colors={['#0A1D37']}
              />
            }
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

  const onRefresh = async () => {
    setRefreshing(true);
    setError(null);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Simulate random error (10% chance for demo)
      if (Math.random() < 0.1) {
        throw new Error('Failed to load communities');
      }
      // In a real app, you would fetch new communities/posts here
    } catch (err) {
      setError('Failed to refresh. Please try again.');
      console.error('Error refreshing communities:', err);
    } finally {
      setRefreshing(false);
    }
  };

  // Show communities list
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: statusBarHeight + 16 }]}>
        <View style={styles.headerLeft}>
          <Animated.View
            style={[
              styles.animatedSearchContainer,
              {
                width: searchBarWidth.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, Dimensions.get('window').width - 180],
                }),
                opacity: searchBarOpacity,
                marginRight: searchBarWidth.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 8],
                }),
              },
            ]}
          >
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color="#6D6D6D" style={styles.searchBarIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search communities..."
                placeholderTextColor="#9B9B9B"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus={showSearchBar}
              />
              {searchQuery.length > 0 ? (
                <TouchableOpacity
                  onPress={() => setSearchQuery('')}
                  style={styles.searchClearButton}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close-circle" size={20} color="#6D6D6D" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => setShowSearchBar(false)}
                  style={styles.searchCloseButton}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close" size={20} color="#6D6D6D" />
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
          {!showSearchBar && (
            <View>
              <Text style={styles.headerTitle}>Communities</Text>
              <Text style={styles.headerSubtitle}>Join discussions about places</Text>
            </View>
          )}
        </View>
        <View style={styles.headerRight}>
          <Animated.View
            style={{
              opacity: searchBarOpacity.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0],
              }),
            }}
          >
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => setShowSearchBar(!showSearchBar)}
              activeOpacity={0.7}
            >
              <Ionicons name="search" size={24} color="#0A1D37" />
            </TouchableOpacity>
          </Animated.View>
          <TouchableOpacity
            style={styles.myCommunitiesButton}
            onPress={() => {
              if (onMyCommunitiesPress) {
                onMyCommunitiesPress();
              }
            }}
            activeOpacity={0.7}
          >
            <View style={styles.myCommunitiesIconContainer}>
              <Ionicons name="people" size={24} color="#0A1D37" />
              <View style={styles.myCommunitiesBadge} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => onTabChange && onTabChange('profile')}
            activeOpacity={0.7}
          >
            <View style={styles.profileImageContainer}>
              {userData?.avatar ? (
                <Image
                  source={userData.avatar}
                  style={styles.profileImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <Ionicons name="person" size={20} color="#C0C0C0" />
                </View>
              )}
              <View style={styles.onlineIndicator} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <ErrorCard
            message={error}
            onRetry={onRefresh}
          />
        </View>
      ) : paginatedCommunities.length === 0 ? (
        <View style={styles.emptyContainer}>
          {debouncedSearchQuery.trim() ? (
            <>
              <Ionicons name="search-outline" size={64} color="#C0C0C0" />
              <Text style={styles.emptyText}>No communities found</Text>
              <Text style={styles.emptySubtext}>Try a different search term</Text>
            </>
          ) : (
            <>
              <Ionicons name="people-outline" size={64} color="#C0C0C0" />
              <Text style={styles.emptyText}>No communities yet</Text>
              <Text style={styles.emptySubtext}>
                Communities will appear here once they're available. Check back soon!
              </Text>
            </>
          )}
        </View>
      ) : (
        <FlatList
          data={paginatedCommunities}
          keyExtractor={(item) => item.id}
          renderItem={({ item: community }) => {
            const isJoined = joinedCommunities.has(community.id);
            return (
              <TouchableOpacity
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
          }}
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, styles.communitiesList]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#0A1D37"
              colors={['#0A1D37']}
            />
          }
          ListFooterComponent={() => (
            <>
              {hasMore && (
                <>
                  <LoadMoreButton
                    onPress={loadMore}
                    isLoading={isLoadingMore}
                    hasMore={hasMore}
                    text="Load More Communities"
                  />
                  <PaginationIndicator
                    displayedCount={displayedCount}
                    totalItems={totalItems}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    isLoading={isLoadingMore}
                  />
                </>
              )}
              {!hasMore && paginatedCommunities.length > 0 && (
                <View style={styles.endIndicator}>
                  <Text style={styles.endText}>All communities loaded</Text>
                </View>
              )}
            </>
          )}
        />
      )}

        {/* Floating Action Button for Creating Community */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => {
            if (onCreateCommunityPress) {
              onCreateCommunityPress();
            } else {
              console.log('Create community pressed');
            }
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </TouchableOpacity>

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
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  animatedSearchContainer: {
    overflow: 'hidden',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchButton: {
    padding: 4,
  },
  myCommunitiesButton: {
    padding: 4,
  },
  myCommunitiesIconContainer: {
    position: 'relative',
  },
  myCommunitiesBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0A1D37',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  profileButton: {
    padding: 4,
  },
  profileImageContainer: {
    position: 'relative',
    width: 40,
    height: 40,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#0A1D37',
  },
  profileImagePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#0A1D37',
    backgroundColor: '#F7F7F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#FFFFFF',
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    minHeight: 44,
  },
  searchBarIcon: {
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
  searchCloseButton: {
    padding: 4,
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 120,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: '#6D6D6D',
    marginTop: 24,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: '#9B9B9B',
    textAlign: 'center',
    lineHeight: 20,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  endIndicator: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  endText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: '#6D6D6D',
  },
});

