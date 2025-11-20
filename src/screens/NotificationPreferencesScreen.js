import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { ToggleSwitch } from '../components/ToggleSwitch';

export const NotificationPreferencesScreen = ({ onBack }) => {
  // Get safe area insets
  const statusBarHeight = Platform.OS === 'ios' ? 44 : RNStatusBar.currentHeight || 0;

  const [preferences, setPreferences] = useState({
    sms: true,
    email: true,
    inApp: true,
    marketing: false,
  });

  const togglePreference = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const notificationOptions = [
    {
      id: 'sms',
      label: 'SMS Notifications',
      description: 'Receive notifications via SMS',
      icon: 'chatbubble-outline',
      value: preferences.sms,
    },
    {
      id: 'email',
      label: 'Email Notifications',
      description: 'Receive notifications via email',
      icon: 'mail-outline',
      value: preferences.email,
    },
    {
      id: 'inApp',
      label: 'In-App Notifications',
      description: 'Receive notifications within the app',
      icon: 'notifications-outline',
      value: preferences.inApp,
    },
    {
      id: 'marketing',
      label: 'Marketing Notifications',
      description: 'Receive promotional offers and updates',
      icon: 'megaphone-outline',
      value: preferences.marketing,
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
        <Text style={styles.headerTitle}>Notification Preferences</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.optionsSection}>
          {notificationOptions.map((option) => (
            <View key={option.id} style={styles.optionItem}>
              <View style={styles.optionLeft}>
                <Ionicons
                  name={option.icon}
                  size={22}
                  color="#0A1D37"
                  style={styles.optionIcon}
                />
                <View style={styles.optionInfo}>
                  <Text style={styles.optionLabel}>{option.label}</Text>
                  <Text style={styles.optionDescription}>{option.description}</Text>
                </View>
              </View>
              <ToggleSwitch
                value={preferences[option.id]}
                onValueChange={() => togglePreference(option.id)}
              />
            </View>
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
  optionsSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    marginRight: 12,
  },
  optionInfo: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1A1A1A',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 12,
    color: '#6D6D6D',
    letterSpacing: 0.2,
  },
});

