import React from 'react';
import { View, Text, StyleSheet, Platform, StatusBar as RNStatusBar, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button } from '../components/Button';
import { WaveDivider } from '../components/WaveDivider';
import { GuideIllustration } from '../components/GuideIllustration';

export const LandingScreen = ({ onFindCityGuide, onRegisterAsGuide }) => {
  const handleRegisterAsGuide = () => {
    if (onRegisterAsGuide) {
      onRegisterAsGuide();
    } else {
      console.log('Register as guide pressed');
    }
  };

  const handleFindCityGuide = () => {
    if (onFindCityGuide) {
      onFindCityGuide();
    } else {
      console.log('Find city guide pressed');
    }
  };

  // Get safe area insets
  const statusBarHeight = Platform.OS === 'ios' ? 44 : RNStatusBar.currentHeight || 0;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {/* Hero Image Section - Full Width */}
      <View style={[styles.imageSection, { paddingTop: statusBarHeight }]}>
        <View style={styles.svgContainer}>
          <GuideIllustration width="100%" height="100%" />
        </View>
        <View style={styles.imageOverlay} />
        <WaveDivider color="#F7F7F7" height={50} />
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        {/* Main Content */}
        <View style={styles.mainContent}>
          <Text style={styles.welcomeText}>
            Discover amazing local guides{'\n'}who'll show you around
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Find City Guide"
            onPress={handleFindCityGuide}
            variant="primary"
          />
          <Button
            title="Register as Guide"
            onPress={handleRegisterAsGuide}
            variant="secondary"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  imageSection: {
    width: '100%',
    height: '50%',
    minHeight: 400,
    position: 'relative',
    overflow: 'hidden',
  },
  svgContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10, 29, 55, 0.05)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
    justifyContent: 'space-between',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingVertical: 20,
  },
  welcomeText: {
    fontSize: 20,
    color: '#3A3A3A',
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '400',
    letterSpacing: 0.3,
    marginTop: 10,
  },
  buttonContainer: {
    width: '100%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
});

