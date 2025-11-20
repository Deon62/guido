import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const GuideBottomNavBar = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', icon: 'home', label: 'Home' },
    { id: 'messages', icon: 'chatbubbles', label: 'Messages' },
    { id: 'notifications', icon: 'notifications', label: 'Notifications' },
    { id: 'profile', icon: 'person', label: 'Profile' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={styles.tab}
          onPress={() => onTabChange(tab.id)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={activeTab === tab.id ? tab.icon : `${tab.icon}-outline`}
            size={24}
            color={activeTab === tab.id ? '#0A1D37' : '#6D6D6D'}
          />
          <View style={[styles.indicator, activeTab === tab.id && styles.indicatorActive]} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    shadowColor: '#0A1D37',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    minWidth: 60,
  },
  indicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'transparent',
    marginTop: 4,
  },
  indicatorActive: {
    backgroundColor: '#0A1D37',
  },
});

