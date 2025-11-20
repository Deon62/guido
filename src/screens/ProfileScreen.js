import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { BottomNavBar } from '../components/BottomNavBar';

export const ProfileScreen = ({ activeTab = 'profile', onTabChange, onSettingsPress, onHelpSupportPress, onTermsPrivacyPress, onEditProfilePress, onLogoutPress, onProfilePicturePress, user: userProp }) => {
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

  const stats = [
    { label: 'Trips', value: '12' },
    { label: 'Guides', value: '8' },
    { label: 'Rating', value: '4.9' },
  ];

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
      icon: 'log-out-outline', 
      label: 'Logout', 
      onPress: () => {
        if (onLogoutPress) {
          onLogoutPress();
        } else {
          console.log('Logout');
        }
      }, 
      danger: true 
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

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={18} color="#6D6D6D" />
            <Text style={styles.infoText}>{user.phone}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={18} color="#6D6D6D" />
            <Text style={styles.infoText}>{user.location}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={18} color="#6D6D6D" />
            <Text style={styles.infoText}>Member since {user.memberSince}</Text>
          </View>
        </View>

        {/* Menu Section */}
        <View style={styles.menuSection}>
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
                  color={item.danger ? '#E74C3C' : '#0A1D37'}
                />
                <Text style={[styles.menuItemText, item.danger && styles.menuItemTextDanger]}>
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
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
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
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  email: {
    fontSize: 14,
    color: '#6D6D6D',
    letterSpacing: 0.3,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#E8E8E8',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0A1D37',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6D6D6D',
    letterSpacing: 0.2,
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#3A3A3A',
    marginLeft: 12,
    letterSpacing: 0.2,
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1A1A1A',
    marginLeft: 16,
    letterSpacing: 0.3,
  },
  menuItemTextDanger: {
    color: '#E74C3C',
  },
});

