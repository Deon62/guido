import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export const TabSelector = ({ tabs, activeTab, onTabChange }) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tab}
              onPress={() => onTabChange(tab.id)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab.label}
              </Text>
              {isActive && <View style={styles.indicator} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 6,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 20,
    alignItems: 'center',
    position: 'relative',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6D6D6D',
    letterSpacing: 0.3,
  },
  tabTextActive: {
    color: '#0A1D37',
    fontWeight: '600',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#0A1D37',
    borderRadius: 2,
  },
});

