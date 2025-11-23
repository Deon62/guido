import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, StatusBar as RNStatusBar, ActivityIndicator, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { FONTS } from '../constants/fonts';
import { triggerHaptic } from '../utils/haptics';
import { toggleFollowUser, getFollowers, getFollowing } from '../services/authService';
import { getToken } from '../utils/storage';
import { API_BASE_URL } from '../config/api';

export const FollowersFollowingScreen = ({ onBack, initialTab = 'followers', userId }) => {
  const statusBarHeight = Platform.OS === 'ios' ? 44 : RNStatusBar.currentHeight || 0;
  const [activeTab, setActiveTab] = useState(initialTab);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTogglingFollow, setIsTogglingFollow] = useState(new Set());

  // Fetch followers and following when component mounts or userId changes
  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      if (!token) {
        console.log('No token available for fetching followers/following');
        setIsLoading(false);
        return;
      }

      if (userId === null || userId === undefined) {
        console.log('No userId provided for fetching followers/following');
        setIsLoading(false);
        return;
      }

      console.log('Fetching followers/following for userId:', userId);
      setIsLoading(true);
      try {
        const [followersData, followingData] = await Promise.all([
          getFollowers(token, userId),
          getFollowing(token, userId),
        ]);

        console.log('Followers data:', followersData);
        console.log('Following data:', followingData);

        // Transform followers data
        const transformedFollowers = Array.isArray(followersData) 
          ? followersData.map(user => ({
              id: user.user_id || user.id,
              name: user.name || user.nickname || user.username || 'Unknown',
              username: user.username || `@${user.user_id || user.id}`,
              bio: user.bio || '',
              avatar: user.profile_photo || user.profile_picture || user.avatar || '',
              isFollowing: user.is_following || false,
            }))
          : [];

        // Transform following data
        const transformedFollowing = Array.isArray(followingData)
          ? followingData.map(user => ({
              id: user.user_id || user.id,
              name: user.name || user.nickname || user.username || 'Unknown',
              username: user.username || `@${user.user_id || user.id}`,
              bio: user.bio || '',
              avatar: user.profile_photo || user.profile_picture || user.avatar || '',
            }))
          : [];

        console.log('Transformed followers:', transformedFollowers);
        console.log('Transformed following:', transformedFollowing);

        setFollowers(transformedFollowers);
        setFollowing(transformedFollowing);
      } catch (error) {
        console.error('Error fetching followers/following:', error);
        console.error('Error details:', {
          message: error.message,
          status: error.status,
          userId: userId
        });
        Alert.alert('Error', error.message || 'Failed to load followers/following. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleFollow = async (userId) => {
    const token = getToken();
    if (!token) {
      Alert.alert('Authentication Required', 'Please log in to follow users.');
      return;
    }

    triggerHaptic('light');
    setIsTogglingFollow(prev => new Set([...prev, userId]));

    // Optimistic update
    const wasFollowing = followers.find(u => u.id === userId)?.isFollowing || false;
    setFollowers(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, isFollowing: !wasFollowing }
          : user
      )
    );

    try {
      await toggleFollowUser(token, userId);
      triggerHaptic('success');
    } catch (error) {
      console.error('Error toggling follow:', error);
      // Revert optimistic update
      setFollowers(prev => 
        prev.map(user => 
          user.id === userId 
            ? { ...user, isFollowing: wasFollowing }
            : user
        )
      );
      triggerHaptic('error');
      Alert.alert('Error', error.message || 'Failed to update follow status. Please try again.');
    } finally {
      setIsTogglingFollow(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const handleUnfollow = async (userId) => {
    const token = getToken();
    if (!token) {
      Alert.alert('Authentication Required', 'Please log in to unfollow users.');
      return;
    }

    triggerHaptic('light');
    setIsTogglingFollow(prev => new Set([...prev, userId]));

    // Optimistic update - remove from following list
    setFollowing(prev => prev.filter(user => user.id !== userId));
    // Also update followers list if this user is in it
    setFollowers(prev =>
      prev.map(user =>
        user.id === userId
          ? { ...user, isFollowing: false }
          : user
      )
    );

    try {
      await toggleFollowUser(token, userId);
      triggerHaptic('success');
    } catch (error) {
      console.error('Error toggling unfollow:', error);
      // Revert optimistic update - re-add to following list
      // We'd need to refetch to properly revert, but for now just show error
      triggerHaptic('error');
      Alert.alert('Error', error.message || 'Failed to unfollow. Please try again.');
      // Refetch data to get correct state
      const refetchToken = getToken();
      if (refetchToken && userId) {
        try {
          const followingData = await getFollowing(refetchToken, userId);
          const transformedFollowing = followingData.map(user => ({
            id: user.user_id || user.id,
            name: user.name || user.username || 'Unknown',
            username: user.username || `@${user.user_id || user.id}`,
            bio: user.bio || '',
            avatar: user.profile_photo || user.profile_picture || user.avatar || '',
          }));
          setFollowing(transformedFollowing);
        } catch (e) {
          console.error('Error refetching following:', e);
        }
      }
    } finally {
      setIsTogglingFollow(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const currentList = useMemo(() => {
    return activeTab === 'followers' ? followers : following;
  }, [activeTab, followers, following]);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: statusBarHeight + 16 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            triggerHaptic('light');
            if (onBack) onBack();
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#0A1D37" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {activeTab === 'followers' ? 'Followers' : 'Following'}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'followers' && styles.tabActive]}
          onPress={() => {
            triggerHaptic('light');
            setActiveTab('followers');
          }}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'followers' && styles.tabTextActive]}>
            Followers ({followers.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'following' && styles.tabActive]}
          onPress={() => {
            triggerHaptic('light');
            setActiveTab('following');
          }}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'following' && styles.tabTextActive]}>
            Following ({following.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0A1D37" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : currentList.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons 
              name={activeTab === 'followers' ? 'people-outline' : 'person-outline'} 
              size={64} 
              color="#C0C0C0" 
            />
            <Text style={styles.emptyTitle}>
              {activeTab === 'followers' ? 'No followers yet' : 'Not following anyone'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'followers' 
                ? 'When people follow you, they\'ll appear here'
                : 'Start following people to see their posts in your feed'}
            </Text>
          </View>
        ) : (
          currentList.map((user) => {
            const isLoadingFollow = isTogglingFollow.has(user.id);
            const avatarUri = user.avatar 
              ? (user.avatar.startsWith('http') 
                  ? user.avatar 
                  : `${API_BASE_URL}/${user.avatar.startsWith('uploads/') ? user.avatar : `uploads/${user.avatar}`}`)
              : null;

            return (
            <View key={user.id} style={styles.userItem}>
              <View style={styles.userInfo}>
                <View style={styles.avatarContainer}>
                  {avatarUri ? (
                    <Image source={{ uri: avatarUri }} style={styles.avatarImage} resizeMode="cover" />
                  ) : (
                    <Ionicons name="person" size={24} color="#C0C0C0" />
                  )}
                </View>
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.username}>{user.username}</Text>
                  {user.bio && (
                    <Text style={styles.bio} numberOfLines={1}>{user.bio}</Text>
                  )}
                </View>
              </View>
              {activeTab === 'followers' ? (
                <TouchableOpacity
                  style={[
                    styles.followButton,
                    user.isFollowing && styles.followingButton,
                    isLoadingFollow && styles.followButtonDisabled
                  ]}
                  onPress={() => handleFollow(user.id)}
                  activeOpacity={0.7}
                  disabled={isLoadingFollow}
                >
                  {isLoadingFollow ? (
                    <ActivityIndicator size="small" color={user.isFollowing ? "#0A1D37" : "#FFFFFF"} />
                  ) : (
                    <Text style={[
                      styles.followButtonText,
                      user.isFollowing && styles.followingButtonText
                    ]}>
                      {user.isFollowing ? 'Following' : 'Follow'}
                    </Text>
                  )}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.unfollowButton, isLoadingFollow && styles.followButtonDisabled]}
                  onPress={() => handleUnfollow(user.id)}
                  activeOpacity={0.7}
                  disabled={isLoadingFollow}
                >
                  {isLoadingFollow ? (
                    <ActivityIndicator size="small" color="#E74C3C" />
                  ) : (
                    <Text style={styles.unfollowButtonText}>Unfollow</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
            );
          })
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
    fontSize: 18,
    fontFamily: FONTS.semiBold,
    color: '#0A1D37',
    letterSpacing: 0.3,
  },
  headerSpacer: {
    width: 32,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#0A1D37',
  },
  tabText: {
    fontSize: 15,
    fontFamily: FONTS.regular,
    color: '#6D6D6D',
    letterSpacing: 0.2,
  },
  tabTextActive: {
    fontFamily: FONTS.semiBold,
    color: '#0A1D37',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: FONTS.semiBold,
    color: '#0A1D37',
    marginTop: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: '#6D6D6D',
    textAlign: 'center',
    lineHeight: 20,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: '#6D6D6D',
  },
  followButtonDisabled: {
    opacity: 0.6,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontFamily: FONTS.semiBold,
    color: '#0A1D37',
    marginBottom: 2,
    letterSpacing: 0.2,
  },
  username: {
    fontSize: 13,
    fontFamily: FONTS.regular,
    color: '#6D6D6D',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  bio: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: '#9B9B9B',
    letterSpacing: 0.2,
  },
  followButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#0A1D37',
    minWidth: 90,
    alignItems: 'center',
  },
  followingButton: {
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  followButtonText: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  followingButtonText: {
    color: '#0A1D37',
  },
  unfollowButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    minWidth: 90,
    alignItems: 'center',
  },
  unfollowButtonText: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    color: '#E74C3C',
    letterSpacing: 0.3,
  },
});

