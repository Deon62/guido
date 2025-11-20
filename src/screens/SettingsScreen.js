import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

export const SettingsScreen = ({ onBack, onAboutDeveloperPress, onNotificationPreferencesPress, onLanguagePress }) => {
  // Get safe area insets
  const statusBarHeight = Platform.OS === 'ios' ? 44 : RNStatusBar.currentHeight || 0;

  const settingsItems = [
    {
      icon: 'notifications-outline',
      label: 'Notification Preferences',
      onPress: () => {
        if (onNotificationPreferencesPress) {
          onNotificationPreferencesPress();
        } else {
          console.log('Notification Preferences');
        }
      },
    },
    {
      icon: 'language-outline',
      label: 'Language',
      onPress: () => {
        if (onLanguagePress) {
          onLanguagePress();
        } else {
          console.log('Language');
        }
      },
    },
    {
      icon: 'person-outline',
      label: 'More About App Developer',
      onPress: () => {
        if (onAboutDeveloperPress) {
          onAboutDeveloperPress();
        } else {
          console.log('About Developer');
        }
      },
    },
    {
      icon: 'trash-outline',
      label: 'Delete Account',
      onPress: () => console.log('Delete Account'),
      danger: true,
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: statusBarHeight + 16 }]}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#0A1D37" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Settings Section */}
        <View style={styles.settingsSection}>
          {settingsItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.settingsItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.settingsItemLeft}>
                <Ionicons
                  name={item.icon}
                  size={22}
                  color={item.danger ? '#E74C3C' : '#0A1D37'}
                />
                <Text style={[styles.settingsItemText, item.danger && styles.settingsItemTextDanger]}>
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
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0A1D37',
    letterSpacing: 0.5,
  },
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 32,
  },
  settingsSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    marginHorizontal: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsItemText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1A1A1A',
    marginLeft: 16,
    letterSpacing: 0.3,
  },
  settingsItemTextDanger: {
    color: '#E74C3C',
  },
});

