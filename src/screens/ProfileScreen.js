import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { BottomNavBar } from '../components/BottomNavBar';
import { FONTS } from '../constants/fonts';
import { triggerHaptic } from '../utils/haptics';
import { FeedbackModal } from '../components/FeedbackModal';
import { getCurrentUser } from '../services/authService';
import { getToken, getUser, normalizeUserData, storeUser } from '../utils/storage';

export const ProfileScreen = ({ activeTab = 'profile', onTabChange, onSettingsPress, onHelpSupportPress, onTermsPrivacyPress, onEditProfilePress, onLogoutPress, onProfilePicturePress, onMyPostsPress, onMyCommunitiesPress, onComingSoonPress, onFollowersPress, onFollowingPress, user: userProp, hideBottomNav = false }) => {
  // Get safe area insets
  const statusBarHeight = Platform.OS === 'ios' ? 44 : RNStatusBar.currentHeight || 0;
  
  // Feedback modal state
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackType, setFeedbackType] = useState('feedback'); // 'feedback' or 'feature'
  const [userData, setUserData] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      // Only use prop if it has valid data (not null and not mock data)
      // Check for mock data indicators
      const isMockData = userProp && (
        userProp.name === 'John Doe' || 
        userProp.email === 'john.doe@example.com' ||
        (userProp.avatar && typeof userProp.avatar === 'object' && userProp.avatar.uri && userProp.avatar.uri.includes('pravatar'))
      );
      
      if (userProp && !isMockData) {
        setUserData(userProp);
        setIsLoadingUser(false);
        return;
      }

            const token = getToken();
            if (!token) {
              // No token, use stored user or null
              const storedUser = getUser();
              const normalizedStoredUser = storedUser ? normalizeUserData(storedUser) : null;
              setUserData(normalizedStoredUser);
              setIsLoadingUser(false);
              return;
            }

            try {
              const user = await getCurrentUser(token);
              const normalizedUser = normalizeUserData(user);
              setUserData(normalizedUser);
              // Update stored user data
              storeUser(normalizedUser);
            } catch (error) {
              console.error('Error fetching user data:', error);
              // Fallback to stored user or null
              const storedUser = getUser();
              const normalizedStoredUser = storedUser ? normalizeUserData(storedUser) : null;
              setUserData(normalizedStoredUser);
            } finally {
              setIsLoadingUser(false);
            }
    };

    fetchUserData();
  }, [userProp]);

  const handleSettingsPress = () => {
    if (onSettingsPress) {
      onSettingsPress();
    } else {
      console.log('Settings pressed');
    }
  };

  // Use fetched user data or prop
  const user = userData || userProp;


  const menuItems = [
    { 
      icon: 'person-outline', 
      label: 'Edit Profile', 
      onPress: () => {
        if (onEditProfilePress) {
          onEditProfilePress();
        } else {
          console.log('Edit Profile');
        }
      }
    },
    { 
      icon: 'help-circle-outline', 
      label: 'Help & Support', 
      onPress: () => {
        if (onHelpSupportPress) {
          onHelpSupportPress();
        } else {
          console.log('Help & Support');
        }
      }
    },
    { 
      icon: 'document-text-outline', 
      label: 'Terms & Privacy', 
      onPress: () => {
        if (onTermsPrivacyPress) {
          onTermsPrivacyPress();
        } else {
          console.log('Terms & Privacy');
        }
      }
    },
    { 
      icon: 'download-outline', 
      label: 'Download my data', 
      onPress: () => {
        if (onComingSoonPress) {
          onComingSoonPress('Download My Data', "We're working on making your data export feature available. You'll be able to download all your account data soon!");
        } else {
          console.log('Download my data');
        }
      }
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: statusBarHeight + 16 }]}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity
          onPress={handleSettingsPress}
          style={styles.settingsButton}
          activeOpacity={0.7}
        >
          <Ionicons name="settings-outline" size={24} color="#0A1D37" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {user?.avatar ? (
              <Image
                source={user.avatar}
                style={styles.avatar}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={40} color="#C0C0C0" />
              </View>
            )}
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={() => {
                if (onProfilePicturePress) {
                  onProfilePicturePress();
                } else {
                  console.log('Change profile picture');
                }
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="camera" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          {((user?.nickname && user.nickname.trim()) || (user?.name && user.name.trim())) ? (
            <Text style={styles.name}>{user.nickname || user.name}</Text>
          ) : null}
          {((user?.username && user.username.trim()) || (user?.email && user.email.trim())) ? (
            <Text style={styles.email}>{user.username || user.email}</Text>
          ) : null}
        </View>

        {/* Followers/Following Section */}
        <View style={styles.followStatsSection}>
          <TouchableOpacity 
            style={styles.followStatItem} 
            activeOpacity={0.7}
            onPress={() => {
              triggerHaptic('light');
              if (onFollowersPress) onFollowersPress();
            }}
          >
            <Text style={styles.followStatNumber}>{user?.followers_count || user?.followersCount || 0}</Text>
            <Text style={styles.followStatLabel}>Followers</Text>
          </TouchableOpacity>
          <View style={styles.followStatDivider} />
          <TouchableOpacity 
            style={styles.followStatItem} 
            activeOpacity={0.7}
            onPress={() => {
              triggerHaptic('light');
              if (onFollowingPress) onFollowingPress();
            }}
          >
            <Text style={styles.followStatNumber}>{user?.following_count || user?.followingCount || 0}</Text>
            <Text style={styles.followStatLabel}>Following</Text>
          </TouchableOpacity>
        </View>

        {/* Streaks Section */}
        <View style={styles.streaksSection}>
          <View style={styles.streakCard}>
            <Ionicons name="flame" size={18} color="#FF6B6B" />
            <View style={styles.streakInfo}>
              <Text style={styles.streakNumber}>{user?.streakDays || 0}</Text>
              <Text style={styles.streakLabel}>Day Streak</Text>
            </View>
          </View>
          {/* Progress Indicator */}
          {user?.streakDays > 0 && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${Math.min((user.streakDays % 30) / 30 * 100, 100)}%` }]} />
              </View>
              <Text style={styles.progressText}>
                {30 - (user.streakDays % 30)} days until next milestone
              </Text>
            </View>
          )}
        </View>

        {/* My Posts Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>My Posts</Text>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              if (onMyPostsPress) {
                onMyPostsPress();
              } else {
                console.log('My Posts');
              }
            }}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons
                name="document-text-outline"
                size={22}
                color="#0A1D37"
              />
              <Text style={styles.menuItemText}>View all posts</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color="#6D6D6D"
            />
          </TouchableOpacity>
        </View>


        {/* Personal Info Section */}
        {((user?.location && user.location.trim()) || (user?.city && user.city.trim()) || (user?.memberSince && user.memberSince.trim())) && (
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Personal Info</Text>
            {((user?.location && user.location.trim()) || (user?.city && user.city.trim())) && (
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={18} color="#6D6D6D" />
                <Text style={styles.infoText}>{user.location || user.city}</Text>
              </View>
            )}
            {(user?.memberSince && user.memberSince.trim()) && (
              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={18} color="#6D6D6D" />
                <Text style={styles.infoText}>Member since {user.memberSince}</Text>
              </View>
            )}
          </View>
        )}

        {/* Account Hub Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Account Hub</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons
                  name={item.icon}
                  size={22}
                  color="#0A1D37"
                />
                <Text style={styles.menuItemText}>
                  {item.label}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color="#6D6D6D"
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Feedback Section */}
        <View style={styles.feedbackSection}>
          <Text style={styles.sectionTitle}>Help Us Improve</Text>
          <View style={styles.feedbackButtonsContainer}>
            <TouchableOpacity
              style={styles.feedbackButton}
              onPress={() => {
                triggerHaptic('light');
                setFeedbackType('feedback');
                setShowFeedbackModal(true);
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="chatbubble-outline" size={20} color="#0A1D37" />
              <Text style={styles.feedbackButtonText}>Share Feedback</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.feedbackButton}
              onPress={() => {
                triggerHaptic('light');
                setFeedbackType('feature');
                setShowFeedbackModal(true);
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="bulb-outline" size={20} color="#0A1D37" />
              <Text style={styles.feedbackButtonText}>Request Feature</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => {
              if (onLogoutPress) {
                onLogoutPress();
              } else {
                console.log('Logout');
              }
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Feedback Modal */}
      <FeedbackModal
        visible={showFeedbackModal}
        type={feedbackType}
        onClose={() => setShowFeedbackModal(false)}
        onSubmit={(data) => {
          console.log('Feedback submitted:', data);
          // Here you would typically send the feedback to your backend
        }}
      />

      {!hideBottomNav && <BottomNavBar activeTab={activeTab} onTabChange={onTabChange} />}
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
  headerTitle: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    color: '#0A1D37',
    letterSpacing: 0.5,
  },
  settingsButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#F7F7F7',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#F7F7F7',
    backgroundColor: '#F7F7F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0A1D37',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#0A1D37',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  name: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: '#1A1A1A',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  email: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: '#6D6D6D',
    letterSpacing: 0.3,
  },
  followStatsSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  followStatItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followStatNumber: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: '#0A1D37',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  followStatLabel: {
    fontSize: 13,
    fontFamily: FONTS.regular,
    color: '#6D6D6D',
    letterSpacing: 0.2,
  },
  followStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E8E8E8',
    marginHorizontal: 24,
  },
  streaksSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFE5E5',
  },
  streakInfo: {
    marginLeft: 12,
  },
  streakNumber: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: '#FF6B6B',
    letterSpacing: 0.3,
  },
  streakLabel: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: '#6D6D6D',
    letterSpacing: 0.2,
    marginTop: 2,
  },
  progressContainer: {
    marginTop: 12,
    width: '100%',
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#FFE5E5',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6B6B',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: '#6D6D6D',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: FONTS.semiBold,
    color: '#0A1D37',
    letterSpacing: 0.3,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: '#3A3A3A',
    marginLeft: 12,
    letterSpacing: 0.2,
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    fontSize: 15,
    fontFamily: FONTS.regular,
    color: '#1A1A1A',
    marginLeft: 16,
    letterSpacing: 0.3,
  },
  menuItemTextDanger: {
    color: '#E74C3C',
  },
  logoutSection: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginBottom: 16,
  },
  logoutButton: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 20,
    backgroundColor: '#F7F7F7',
    borderWidth: 2,
    borderColor: '#E74C3C',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E74C3C',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  logoutButtonText: {
    fontSize: 15,
    fontFamily: FONTS.semiBold,
    color: '#E74C3C',
    letterSpacing: 0.6,
  },
  feedbackSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  feedbackButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  feedbackButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    gap: 8,
  },
  feedbackButtonText: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    color: '#0A1D37',
    letterSpacing: 0.3,
  },
});

