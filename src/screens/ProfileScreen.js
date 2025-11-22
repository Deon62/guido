import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { BottomNavBar } from '../components/BottomNavBar';
import { FONTS } from '../constants/fonts';
import { triggerHaptic } from '../utils/haptics';

export const ProfileScreen = ({ activeTab = 'profile', onTabChange, onSettingsPress, onHelpSupportPress, onTermsPrivacyPress, onEditProfilePress, onLogoutPress, onProfilePicturePress, onMyPostsPress, onMyCommunitiesPress, onComingSoonPress, user: userProp, hideBottomNav = false }) => {
  // Get safe area insets
  const statusBarHeight = Platform.OS === 'ios' ? 44 : RNStatusBar.currentHeight || 0;

  const handleSettingsPress = () => {
    if (onSettingsPress) {
      onSettingsPress();
    } else {
      console.log('Settings pressed');
    }
  };

  // Mock user data (use prop if provided)
  const user = userProp || {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: { uri: 'https://i.pravatar.cc/150?img=12' },
    phone: '+1 234 567 8900',
    location: 'New York, USA',
    city: 'New York',
    memberSince: 'January 2024',
  };


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
            <Image
              source={user.avatar}
              style={styles.avatar}
              resizeMode="cover"
            />
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
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        {/* Followers/Following Section */}
        <View style={styles.followStatsSection}>
          <TouchableOpacity style={styles.followStatItem} activeOpacity={0.7}>
            <Text style={styles.followStatNumber}>1.2k</Text>
            <Text style={styles.followStatLabel}>Followers</Text>
          </TouchableOpacity>
          <View style={styles.followStatDivider} />
          <TouchableOpacity style={styles.followStatItem} activeOpacity={0.7}>
            <Text style={styles.followStatNumber}>456</Text>
            <Text style={styles.followStatLabel}>Following</Text>
          </TouchableOpacity>
        </View>

        {/* Streaks Section */}
        <View style={styles.streaksSection}>
          <View style={styles.streakCard}>
            <Ionicons name="flame" size={18} color="#FF6B6B" />
            <View style={styles.streakInfo}>
              <Text style={styles.streakNumber}>12</Text>
              <Text style={styles.streakLabel}>Day Streak</Text>
            </View>
          </View>
          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '75%' }]} />
            </View>
            <Text style={styles.progressText}>9 days until next milestone</Text>
          </View>
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
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Personal Info</Text>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={18} color="#6D6D6D" />
            <Text style={styles.infoText}>{user.location}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={18} color="#6D6D6D" />
            <Text style={styles.infoText}>Member since {user.memberSince}</Text>
          </View>
        </View>

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
});

