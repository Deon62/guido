import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { FONTS } from '../constants/fonts';

export const LandingScreen = ({ onFindCityGuide }) => {
  useEffect(() => {
    // Auto-navigate to home screen after 2 seconds
    const timer = setTimeout(() => {
      if (onFindCityGuide) {
        onFindCityGuide();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [onFindCityGuide]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.content}>
        <Text style={styles.appName}>Quest</Text>
        <Text style={styles.tagline}>Discover amazing places</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1D37',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: 56,
    fontFamily: FONTS.bold,
    color: '#FFFFFF',
    marginBottom: 12,
    letterSpacing: 2,
    fontWeight: '700',
  },
  tagline: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: '#FFFFFF',
    opacity: 0.8,
    letterSpacing: 0.5,
  },
});

