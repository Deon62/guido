import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Platform, StatusBar as RNStatusBar, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/Button';
import { FONTS } from '../constants/fonts';

export const AddTripSuccessScreen = ({ tripData, onBack }) => {
  // Get safe area insets
  const statusBarHeight = Platform.OS === 'ios' ? 44 : RNStatusBar.currentHeight || 0;
  
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay: 100,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        delay: 100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={[styles.content, { paddingTop: statusBarHeight + 40 }]}>
        <Animated.View 
          style={[
            styles.successIconContainer,
            {
              transform: [{ scale: scaleAnim }],
              opacity: fadeAnim,
            },
          ]}
        >
          <View style={styles.successIconCircle}>
            <Ionicons name="checkmark" size={48} color="#FFFFFF" />
          </View>
        </Animated.View>

        <Text style={styles.successTitle}>Trip Added Successfully!</Text>
        <Text style={styles.successMessage}>
          Your visit to {tripData?.placeName || 'this place'} has been added to your past trips.
        </Text>

        {tripData?.location && (
          <View style={styles.tripInfoCard}>
            <View style={styles.tripInfo}>
              <Ionicons name="location" size={20} color="#0A1D37" />
              <Text style={styles.tripInfoText}>{tripData.location}</Text>
            </View>
            {tripData?.date && (
              <View style={styles.tripInfo}>
                <Ionicons name="calendar" size={20} color="#0A1D37" />
                <Text style={styles.tripInfoText}>{tripData.date}</Text>
              </View>
            )}
          </View>
        )}

        <Button
          title="Done"
          onPress={onBack}
          variant="primary"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIconContainer: {
    marginBottom: 32,
  },
  successIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#0A1D37',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0A1D37',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  successTitle: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    color: '#0A1D37',
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: '#3A3A3A',
    textAlign: 'center',
    letterSpacing: 0.2,
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  tripInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    width: '100%',
    shadowColor: '#0A1D37',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  tripInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tripInfoText: {
    fontSize: 15,
    fontFamily: FONTS.regular,
    color: '#1A1A1A',
    marginLeft: 12,
    letterSpacing: 0.2,
  },
});

