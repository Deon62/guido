import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, Image, TouchableOpacity, Dimensions, Platform, StatusBar as RNStatusBar, Share, Alert, TextInput, Animated, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useVideoPlayer, VideoView } from 'expo-video';
import { BottomNavBar } from '../components/BottomNavBar';
import { CommentsModal } from '../components/CommentsModal';
import { ErrorCard } from '../components/ErrorCard';
import { PaginationIndicator } from '../components/PaginationIndicator';
import { FONTS } from '../constants/fonts';
import { debounce } from '../utils/debounce';
import { usePagination } from '../utils/usePagination';
import { getUser } from '../utils/storage';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const HEADER_HEIGHT = 80; // Approximate header height
const BOTTOM_NAV_HEIGHT = 80; // Approximate bottom nav height
const CARD_HEIGHT = SCREEN_HEIGHT - HEADER_HEIGHT - BOTTOM_NAV_HEIGHT; // Full visible height

// Video Post Component using expo-video
const VideoPostItem = ({ videoSource, styles }) => {
  // Handle video source - expo-video can accept require() directly or URI strings
  // If videoSource has a uri property, use it; otherwise use the source directly
  const source = videoSource?.uri || videoSource;
  
  const player = useVideoPlayer(source, (player) => {
    player.loop = false;
    player.muted = false;
    player.play(); // Auto-play the video
  });

  return (
    <View style={styles.videoContainer}>
      <VideoView
        style={styles.videoPlayer}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
        contentFit="cover"
        nativeControls
      />
      <View style={styles.videoBadgeOverlay}>
        <View style={styles.videoTypeBadge}>
          <Ionicons name="videocam" size={16} color="#FFFFFF" />
          <Text style={styles.videoTypeText}>VIDEO</Text>
        </View>
      </View>
    </View>
  );
};

export const FeedScreen = ({ activeTab = 'feed', onTabChange, onAddPostPress, onMyFeedPostsPress, onUserProfilePress }) => {
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [savedPosts, setSavedPosts] = useState(new Set());
  const [followedUsers, setFollowedUsers] = useState(new Set());
  const [selectedPostForComments, setSelectedPostForComments] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [isUserScrolling, setIsUserScrolling] = useState({});
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const scrollViewRefs = useRef({});
  const autoScrollTimers = useRef({});
  const isUserScrollingRef = useRef({});
  const currentImageIndexRef = useRef({});
  const searchBarWidth = useRef(new Animated.Value(0)).current;
  const searchBarOpacity = useRef(new Animated.Value(0)).current;

  // Get safe area insets
  const statusBarHeight = Platform.OS === 'ios' ? 44 : RNStatusBar.currentHeight || 0;

  // TODO: Replace with API data - fetch posts from API
  const generateMockPosts = () => {
    // Return empty array - data should come from API
    return [];
  };

  // TODO: Replace with API data
  const allFeedPosts = useMemo(() => generateMockPosts(), []);

  // Load user data for profile picture
  useEffect(() => {
    const loadUserData = () => {
      const user = getUser();
      setUserData(user);
    };
    loadUserData();
  }, []);

  // Sync refs with state
  useEffect(() => {
    isUserScrollingRef.current = isUserScrolling;
    currentImageIndexRef.current = currentImageIndex;
  }, [isUserScrolling, currentImageIndex]);

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

  // Debounced search handler
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // Debounce search query updates
  const debouncedSetSearch = useCallback(
    debounce((query) => {
      setDebouncedSearchQuery(query);
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSetSearch(searchQuery);
  }, [searchQuery, debouncedSetSearch]);

  // Filter posts based on search query (memoized)
  const filteredPosts = useMemo(() => {
    if (!allFeedPosts || allFeedPosts.length === 0) return [];
    if (!debouncedSearchQuery.trim()) return allFeedPosts;
    const query = debouncedSearchQuery.toLowerCase();
    return allFeedPosts.filter((post) => (
      post.user.name.toLowerCase().includes(query) ||
      post.place.name.toLowerCase().includes(query) ||
      post.place.location.toLowerCase().includes(query) ||
      post.caption.toLowerCase().includes(query) ||
      post.place.category.toLowerCase().includes(query)
    ));
  }, [allFeedPosts, debouncedSearchQuery]);

  // Use pagination hook for infinite scroll
  const {
    displayedItems: paginatedPosts,
    currentPage,
    totalPages,
    hasMore,
    isLoadingMore,
    loadMore,
    reset,
    totalItems,
    displayedCount,
  } = usePagination(filteredPosts || [], 5, 5); // 5 posts per page, initially show 5

  // Reset pagination when filtered posts change
  useEffect(() => {
    reset();
  }, [filteredPosts.length, reset]);

  // Auto-scroll images for posts with multiple images
  useEffect(() => {
    if (!paginatedPosts || paginatedPosts.length === 0) return;
    
    paginatedPosts.forEach((post) => {
      const images = post.images || (post.image ? [post.image] : []);
      if (!images || images.length === 0) return;
      
      const imageCount = Math.min(images.length, 5);
      
      if (imageCount > 1) {
        // Clear existing timer for this post
        if (autoScrollTimers.current[post.id]) {
          clearInterval(autoScrollTimers.current[post.id]);
        }

        // Set up auto-scroll timer
        autoScrollTimers.current[post.id] = setInterval(() => {
          // Skip if user is currently scrolling
          if (isUserScrollingRef.current[post.id]) {
            return;
          }

          const currentIndex = currentImageIndexRef.current[post.id] ?? 0;
          const nextIndex = (currentIndex + 1) % imageCount;
          const screenWidth = Dimensions.get('window').width;

          if (scrollViewRefs.current[post.id]) {
            scrollViewRefs.current[post.id].scrollTo({
              x: nextIndex * screenWidth,
              animated: true,
            });
            setCurrentImageIndex(prev => ({ ...prev, [post.id]: nextIndex }));
          }
        }, 3000); // Change image every 3 seconds
      }
    });

    // Cleanup timers on unmount
    return () => {
      Object.values(autoScrollTimers.current).forEach(timer => {
        if (timer) clearInterval(timer);
      });
    };
  }, [paginatedPosts.length]); // Only re-run when posts change

  const onRefresh = async () => {
    setRefreshing(true);
    setError(null);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Simulate random error (10% chance for demo)
      if (Math.random() < 0.1) {
        throw new Error('Failed to load feed posts');
      }
      // In a real app, you would fetch new feed posts here
    } catch (err) {
      setError('Failed to refresh feed. Please try again.');
      console.error('Error refreshing feed:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleLike = (postId) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleSave = (postId) => {
    setSavedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleFollow = (userId) => {
    setFollowedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const handleCommentsPress = (post) => {
    setSelectedPostForComments(post);
  };

  const handleCloseComments = () => {
    setSelectedPostForComments(null);
  };

  const handleShare = async (post) => {
    try {
      const shareMessage = `${post.user.name} visited ${post.place.name} in ${post.place.location}\n\n${post.caption}\n\n📍 ${post.place.category}\n❤️ ${post.likes} likes | 💬 ${post.comments} comments\n\nCheck it out on Quest!`;
      
      const result = await Share.share({
        message: shareMessage,
        title: `${post.user.name}'s post about ${post.place.name}`,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type of result.activityType
          console.log('Shared with activity type:', result.activityType);
        } else {
          // Shared
          console.log('Post shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
        console.log('Share dismissed');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share post. Please try again.');
      console.error('Error sharing post:', error);
    }
  };

  const getCategoryColor = (category) => {
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
      default:
        return '#6D6D6D';
    }
  };

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
                  outputRange: [0, Dimensions.get('window').width - 180], // Width accounting for search icon, my posts icon, and profile
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
                placeholder="Search posts..."
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
          {!showSearchBar && <Text style={styles.title}>Feed</Text>}
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
            style={styles.myPostsButton}
            onPress={() => {
              if (onMyFeedPostsPress) {
                onMyFeedPostsPress();
              }
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="images" size={24} color="#0A1D37" />
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

      {/* Feed FlatList with infinite scroll */}
      {error ? (
        <View style={styles.errorContainer}>
          <ErrorCard
            message={error}
            onRetry={onRefresh}
          />
        </View>
      ) : paginatedPosts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="images-outline" size={64} color="#C0C0C0" />
          <Text style={styles.emptyText}>No posts yet</Text>
          <Text style={styles.emptySubtext}>
            Start following users or create your first post to see content in your feed!
          </Text>
          <TouchableOpacity
            style={styles.emptyStateButton}
            onPress={() => {
              if (onAddPostPress) {
                onAddPostPress();
              }
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="camera-outline" size={20} color="#FFFFFF" style={styles.emptyStateButtonIcon} />
            <Text style={styles.emptyStateButtonText}>Create Your First Post</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={paginatedPosts}
            keyExtractor={(item) => item.id}
            renderItem={({ item: post }) => (
              <View style={styles.postCard}>
            {/* Post Header */}
            <View style={styles.postHeader}>
              <TouchableOpacity 
                style={styles.userInfo}
                onPress={() => {
                  if (onUserProfilePress) {
                    onUserProfilePress(post.user);
                  }
                }}
                activeOpacity={0.7}
              >
                <Image source={post.user.avatar} style={styles.avatar} />
                <View style={styles.userDetails}>
                  <View style={styles.userNameContainer}>
                    <Text style={styles.userName}>{post.user.name}</Text>
                    {post.user.isPremium && (
                      <View style={styles.premiumBadge}>
                        <View style={styles.premiumBadgeContainer}>
                          <View style={styles.premiumBadgeInner}>
                            <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                          </View>
                          <View style={styles.premiumBadgeRing} />
                        </View>
                      </View>
                    )}
                    {post.user.isCEO && (
                      <View style={styles.ceoBadge}>
                        <Text style={styles.ceoBadgeText}>CEO</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.placeInfo}>
                    <Ionicons name="location" size={12} color="#6D6D6D" />
                    <Text style={styles.placeName}>{post.place.name}</Text>
                    <View style={[styles.categoryTag, { backgroundColor: `${getCategoryColor(post.place.category)}20` }]}>
                      <Text style={[styles.categoryText, { color: getCategoryColor(post.place.category) }]}>
                        {post.place.category}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleFollow(post.user.name)}
                style={[
                  styles.followButton,
                  followedUsers.has(post.user.name) && styles.followButtonFollowing
                ]}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.followButtonText,
                  followedUsers.has(post.user.name) && styles.followButtonTextFollowing
                ]}>
                  {followedUsers.has(post.user.name) ? 'Following' : 'Follow'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Post Media Carousel (Images or Videos) */}
            <View style={styles.imageCarouselContainer}>
              {post.videos && post.videos.length > 0 ? (
                // Video Display using expo-video
                <VideoPostItem videoSource={post.videos[0]} styles={styles} />
              ) : (
                // Image Carousel
                <ScrollView
                  ref={(ref) => {
                    if (ref) {
                      scrollViewRefs.current[post.id] = ref;
                    }
                  }}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onScrollBeginDrag={() => {
                    setIsUserScrolling(prev => ({ ...prev, [post.id]: true }));
                  }}
                  onMomentumScrollEnd={(event) => {
                    const screenWidth = Dimensions.get('window').width;
                    const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
                    setCurrentImageIndex(prev => ({ ...prev, [post.id]: index }));
                    
                    // Resume auto-scroll after user stops scrolling (after 3 seconds)
                    setTimeout(() => {
                      setIsUserScrolling(prev => ({ ...prev, [post.id]: false }));
                    }, 3000);
                  }}
                  style={styles.imageCarousel}
                  scrollEventThrottle={16}
                >
                  {(post.images || (post.image ? [post.image] : [])).slice(0, 5).map((image, imgIndex) => (
                    <Image
                      key={imgIndex}
                      source={image}
                      style={styles.postImage}
                      resizeMode="cover"
                      progressiveRenderingEnabled={true}
                    />
                  ))}
                </ScrollView>
              )}
              
              {/* Image Indicators (only for images) */}
              {post.images && post.images.length > 1 && (
                <View style={styles.imageIndicators}>
                  {post.images.slice(0, 5).map((_, imgIndex) => (
                    <View
                      key={imgIndex}
                      style={[
                        styles.indicatorDot,
                        (currentImageIndex[post.id] ?? 0) === imgIndex && styles.indicatorDotActive
                      ]}
                    />
                  ))}
                </View>
              )}
            </View>

            {/* Post Actions */}
            <View style={styles.postActions}>
              <View style={styles.leftActions}>
                <TouchableOpacity
                  onPress={() => handleLike(post.id)}
                  style={styles.actionButton}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={likedPosts.has(post.id) ? 'heart' : 'heart-outline'}
                    size={28}
                    color={likedPosts.has(post.id) ? '#E74C3C' : '#1A1A1A'}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleCommentsPress(post)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="chatbubble-outline" size={26} color="#1A1A1A" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleShare(post)}
                  style={styles.actionButton}
                  activeOpacity={0.7}
                >
                  <Ionicons name="paper-plane-outline" size={26} color="#1A1A1A" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => handleSave(post.id)}
                style={styles.actionButton}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={savedPosts.has(post.id) ? 'bookmark' : 'bookmark-outline'}
                  size={26}
                  color={savedPosts.has(post.id) ? '#0A1D37' : '#1A1A1A'}
                />
              </TouchableOpacity>
            </View>

            {/* Post Stats */}
            <View style={styles.postStats}>
              <Text style={styles.likesText}>
                {likedPosts.has(post.id) ? post.likes + 1 : post.likes} likes
              </Text>
              <Text style={styles.commentsText}>{post.comments} comments</Text>
            </View>

            {/* Post Caption */}
            <View style={styles.postCaption}>
              <Text style={styles.captionText}>
                <Text style={styles.captionUserName}>{post.user.name}</Text>
                {' '}
                {post.caption}
              </Text>
            </View>

                {/* Post Timestamp */}
                <Text style={styles.timestamp}>{post.timestamp}</Text>
              </View>
            )}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            snapToInterval={CARD_HEIGHT + 8}
            snapToAlignment="start"
            decelerationRate="fast"
            bounces={true}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#0A1D37"
                colors={['#0A1D37']}
              />
            }
            onEndReached={() => {
              if (hasMore && !isLoadingMore) {
                loadMore();
              }
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={() => (
              <>
                {hasMore && (
                  <PaginationIndicator
                    displayedCount={displayedCount}
                    totalItems={totalItems}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    isLoading={isLoadingMore}
                  />
                )}
                {!hasMore && paginatedPosts.length > 0 && (
                  <View style={styles.endIndicator}>
                    <Text style={styles.endText}>You've reached the end</Text>
                  </View>
                )}
              </>
            )}
          />
        </>
      )}

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

      {/* Comments Modal */}
      <CommentsModal
        visible={selectedPostForComments !== null}
        post={selectedPostForComments}
        onClose={handleCloseComments}
      />

      <BottomNavBar activeTab={activeTab} onTabChange={onTabChange} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    zIndex: 10,
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
  title: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    color: '#0A1D37',
    letterSpacing: 0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchButton: {
    padding: 4,
  },
  myPostsButton: {
    padding: 4,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  postCard: {
    height: CARD_HEIGHT,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    color: '#1A1A1A',
    marginBottom: 2,
  },
  premiumBadge: {
    marginBottom: 2,
    marginLeft: 4,
  },
  premiumBadgeContainer: {
    position: 'relative',
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumBadgeInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#003D82',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#002855',
    shadowColor: '#003D82',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  premiumBadgeRing: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#003D82',
    borderStyle: 'solid',
    opacity: 0.4,
    transform: [{ rotate: '45deg' }],
  },
  ceoBadge: {
    marginBottom: 2,
    marginLeft: 4,
    backgroundColor: '#0A1D37',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    minWidth: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ceoBadgeText: {
    fontSize: 9,
    fontFamily: FONTS.bold,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  placeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  placeName: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: '#6D6D6D',
    marginLeft: 4,
    marginRight: 6,
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
  followButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#0A1D37',
    minWidth: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followButtonText: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  followButtonTextFollowing: {
    color: '#0A1D37',
  },
  followButtonFollowing: {
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  imageCarouselContainer: {
    position: 'relative',
    width: '100%',
    height: CARD_HEIGHT * 0.65,
  },
  imageCarousel: {
    width: '100%',
    height: '100%',
  },
  postImage: {
    width: Dimensions.get('window').width,
    height: CARD_HEIGHT * 0.65,
    backgroundColor: '#E8E8E8',
  },
  videoContainer: {
    width: '100%',
    height: CARD_HEIGHT * 0.65,
    position: 'relative',
    backgroundColor: '#000000',
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
  },
  videoBadgeOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  videoTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
  },
  videoTypeText: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    color: '#FFFFFF',
    letterSpacing: 0.5,
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
  indicatorDotActive: {
    backgroundColor: '#FFFFFF',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginRight: 16,
    padding: 4,
  },
  postStats: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  likesText: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    color: '#1A1A1A',
    marginRight: 16,
  },
  commentsText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: '#6D6D6D',
  },
  postCaption: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  captionText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: '#1A1A1A',
    lineHeight: 20,
  },
  captionUserName: {
    fontFamily: FONTS.semiBold,
  },
  timestamp: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: '#6D6D6D',
    paddingHorizontal: 16,
    marginBottom: 16,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
});

