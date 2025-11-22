import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const BottomNavBar = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', icon: 'home', label: 'Home' },
    { id: 'trips', icon: 'map', label: 'Trips' },
    { id: 'feed', icon: 'grid', label: 'Feed' },
    { id: 'hotspots', icon: 'location', label: 'Hotspots' },
    { id: 'profile', icon: 'person', label: 'Profile' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tab}
            onPress={() => onTabChange(tab.id)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isActive ? tab.icon : `${tab.icon}-outline`}
              size={24}
              color={isActive ? '#0A1D37' : '#6D6D6D'}
            />
            <View style={[styles.indicator, isActive && styles.indicatorActive]} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    paddingHorizontal: 16,
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    minHeight: Platform.OS === 'ios' ? 80 : 70,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 4,
  },
  indicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 4,
    backgroundColor: 'transparent',
  },
  indicatorActive: {
    backgroundColor: '#0A1D37',
  },
});
