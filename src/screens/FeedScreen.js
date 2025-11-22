import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, Platform, StatusBar as RNStatusBar, Share, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { BottomNavBar } from '../components/BottomNavBar';
import { CommentsModal } from '../components/CommentsModal';
import { FONTS } from '../constants/fonts';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const HEADER_HEIGHT = 80; // Approximate header height
const BOTTOM_NAV_HEIGHT = 80; // Approximate bottom nav height
const CARD_HEIGHT = SCREEN_HEIGHT - HEADER_HEIGHT - BOTTOM_NAV_HEIGHT; // Full visible height

export const FeedScreen = ({ activeTab = 'feed', onTabChange, onAddPostPress }) => {
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [savedPosts, setSavedPosts] = useState(new Set());
  const [selectedPostForComments, setSelectedPostForComments] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [isUserScrolling, setIsUserScrolling] = useState({});
  const scrollViewRefs = useRef({});
  const autoScrollTimers = useRef({});
  const isUserScrollingRef = useRef({});
  const currentImageIndexRef = useRef({});

  // Get safe area insets
  const statusBarHeight = Platform.OS === 'ios' ? 44 : RNStatusBar.currentHeight || 0;

  // Mock feed posts data
  const feedPosts = [
    {
      id: '1',
      user: {
        name: 'Travel Explorer',
        avatar: { uri: 'https://i.pravatar.cc/150?img=1' },
      },
      place: {
        name: 'Eiffel Tower',
        location: 'Paris, France',
        category: 'Landmarks',
      },
      images: [
        { uri: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800' },
        { uri: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800' },
        { uri: 'https://images.unsplash.com/photo-1563874255670-05953328b14a?w=800' },
      ],
      caption: 'The iconic Eiffel Tower at sunset! 🌅 A must-visit when in Paris. The view from the top is absolutely breathtaking!',
      likes: 1247,
      comments: 89,
      timestamp: '2 hours ago',
    },
    {
      id: '2',
      user: {
        name: 'Wanderlust Sarah',
        avatar: { uri: 'https://i.pravatar.cc/150?img=2' },
      },
      place: {
        name: 'Café de Flore',
        location: 'Paris, France',
        category: 'Cafes',
      },
      images: [
        { uri: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800' },
        { uri: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800' },
      ],
      caption: 'Morning coffee at this historic café. The atmosphere is incredible! ☕️',
      likes: 892,
      comments: 45,
      timestamp: '5 hours ago',
    },
    {
      id: '3',
      user: {
        name: 'Nature Lover',
        avatar: { uri: 'https://i.pravatar.cc/150?img=3' },
      },
      place: {
        name: 'Luxembourg Gardens',
        location: 'Paris, France',
        category: 'Nature',
      },
      images: [
        { uri: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800' },
        { uri: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800' },
        { uri: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800' },
        { uri: 'https://images.unsplash.com/photo-1563874255670-05953328b14a?w=800' },
      ],
      caption: 'Perfect spot for a peaceful afternoon walk. The gardens are so well maintained! 🌳',
      likes: 634,
      comments: 23,
      timestamp: '1 day ago',
    },
    {
      id: '4',
      user: {
        name: 'City Explorer',
        avatar: { uri: 'https://i.pravatar.cc/150?img=4' },
      },
      place: {
        name: 'Notre-Dame Cathedral',
        location: 'Paris, France',
        category: 'Landmarks',
      },
      images: [
        { uri: 'https://images.unsplash.com/photo-1563874255670-05953328b14a?w=800' },
        { uri: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800' },
      ],
      caption: 'The architecture here is simply stunning. Every detail tells a story! 🏛️',
      likes: 1456,
      comments: 112,
      timestamp: '2 days ago',
    },
    {
      id: '5',
      user: {
        name: 'Foodie Travels',
        avatar: { uri: 'https://i.pravatar.cc/150?img=5' },
      },
      place: {
        name: 'Hotel Ritz Paris',
        location: 'Paris, France',
        category: 'Hotels',
      },
      images: [
        { uri: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800' },
        { uri: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800' },
        { uri: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800' },
        { uri: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800' },
        { uri: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800' },
      ],
      caption: 'Luxury at its finest! The service here is impeccable. 🏨✨',
      likes: 2103,
      comments: 156,
      timestamp: '3 days ago',
    },
  ];

  // Auto-scroll images for posts with multiple images
  useEffect(() => {
    if (!feedPosts || feedPosts.length === 0) return;
    
    feedPosts.forEach((post) => {
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
  }, [feedPosts.length]); // Only re-run when posts change

  // Sync refs with state
  useEffect(() => {
    isUserScrollingRef.current = isUserScrolling;
    currentImageIndexRef.current = currentImageIndex;
  }, [isUserScrolling, currentImageIndex]);

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
        <Text style={styles.title}>Feed</Text>
      </View>

      {/* Feed ScrollView */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        snapToInterval={CARD_HEIGHT + 8}
        snapToAlignment="start"
        decelerationRate="fast"
        bounces={true}
      >
        {feedPosts.map((post) => (
          <View key={post.id} style={styles.postCard}>
            {/* Post Header */}
            <View style={styles.postHeader}>
              <View style={styles.userInfo}>
                <Image source={post.user.avatar} style={styles.avatar} />
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>{post.user.name}</Text>
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
              </View>
              <TouchableOpacity>
                <Ionicons name="ellipsis-horizontal" size={20} color="#1A1A1A" />
              </TouchableOpacity>
            </View>

            {/* Post Image Carousel */}
            <View style={styles.imageCarouselContainer}>
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
                  />
                ))}
              </ScrollView>
              
              {/* Image Indicators */}
              {(post.images || []).length > 1 && (
                <View style={styles.imageIndicators}>
                  {(post.images || []).slice(0, 5).map((_, imgIndex) => (
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
        ))}
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
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    zIndex: 10,
  },
  title: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    color: '#0A1D37',
    letterSpacing: 0.5,
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
  userName: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    color: '#1A1A1A',
    marginBottom: 2,
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
});

