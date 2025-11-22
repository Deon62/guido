import React from 'react';
import { View, Text, StyleSheet, Image, Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button } from '../components/Button';
import { WaveDivider } from '../components/WaveDivider';
import { FONTS } from '../constants/fonts';

export const LandingScreen = ({ onFindCityGuide }) => {
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
        <Image
          source={require('../../assets/logo/guide.png')}
          style={styles.heroImage}
          resizeMode="contain"
        />
        <View style={styles.imageOverlay} />
        <WaveDivider color="#F7F7F7" height={50} />
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        {/* Main Content */}
        <View style={styles.mainContent}>
          <Text style={styles.welcomeText}>
            Discover amazing places and plan your perfect trip
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Get Started"
            onPress={handleFindCityGuide}
            variant="primary"
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
  heroImage: {
    width: '100%',
    height: '100%',
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
    fontFamily: FONTS.regular,
    color: '#3A3A3A',
    textAlign: 'center',
    lineHeight: 28,
    letterSpacing: 0.3,
    marginTop: 10,
  },
  buttonContainer: {
    width: '100%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
});

