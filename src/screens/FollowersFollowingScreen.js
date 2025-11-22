import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { FONTS } from '../constants/fonts';
import { triggerHaptic } from '../utils/haptics';

export const FollowersFollowingScreen = ({ onBack, initialTab = 'followers' }) => {
  const statusBarHeight = Platform.OS === 'ios' ? 44 : RNStatusBar.currentHeight || 0;
  const [activeTab, setActiveTab] = useState(initialTab);

  // Mock data - in real app, this would come from props or API
  const [followers, setFollowers] = useState([
    { id: '1', name: 'Sarah Johnson', username: '@sarahj', avatar: '👤', isFollowing: false, bio: 'Travel enthusiast and food lover' },
    { id: '2', name: 'Mike Chen', username: '@mikechen', avatar: '👤', isFollowing: true, bio: 'Photographer exploring the world' },
    { id: '3', name: 'Emma Wilson', username: '@emmaw', avatar: '👤', isFollowing: false, bio: 'Adventure seeker' },
    { id: '4', name: 'David Lee', username: '@davidl', avatar: '👤', isFollowing: true, bio: 'City explorer' },
    { id: '5', name: 'Lisa Park', username: '@lisap', avatar: '👤', isFollowing: false, bio: 'Nature lover' },
  ]);

  const [following, setFollowing] = useState([
    { id: '2', name: 'Mike Chen', username: '@mikechen', avatar: '👤', bio: 'Photographer exploring the world' },
    { id: '4', name: 'David Lee', username: '@davidl', avatar: '👤', bio: 'City explorer' },
    { id: '6', name: 'Alex Brown', username: '@alexb', avatar: '👤', bio: 'Travel blogger' },
    { id: '7', name: 'Sophie Martin', username: '@sophiem', avatar: '👤', bio: 'Foodie and traveler' },
  ]);

  const handleFollow = (userId) => {
    triggerHaptic('light');
    setFollowers(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, isFollowing: !user.isFollowing }
          : user
      )
    );
  };

  const handleUnfollow = (userId) => {
    triggerHaptic('light');
    setFollowing(prev => prev.filter(user => user.id !== userId));
    // Also update followers list if this user is in it
    setFollowers(prev =>
      prev.map(user =>
        user.id === userId
          ? { ...user, isFollowing: false }
          : user
      )
    );
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
        {currentList.length === 0 ? (
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
          currentList.map((user) => (
            <View key={user.id} style={styles.userItem}>
              <View style={styles.userInfo}>
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatarText}>{user.avatar}</Text>
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
                    user.isFollowing && styles.followingButton
                  ]}
                  onPress={() => handleFollow(user.id)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.followButtonText,
                    user.isFollowing && styles.followingButtonText
                  ]}>
                    {user.isFollowing ? 'Following' : 'Follow'}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.unfollowButton}
                  onPress={() => handleUnfollow(user.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.unfollowButtonText}>Unfollow</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
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
  },
  avatarText: {
    fontSize: 24,
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

