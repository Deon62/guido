import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

export const CityCardSkeleton = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    shimmer.start();
    return () => shimmer.stop();
  }, [shimmerAnim]);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.card}>
      <Animated.View style={[styles.imagePlaceholder, { opacity }]} />
      <View style={styles.textContainer}>
        <Animated.View style={[styles.cityNamePlaceholder, { opacity }]} />
        <Animated.View style={[styles.countryNamePlaceholder, { opacity }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
    backgroundColor: '#E8E8E8',
    shadowColor: '#0A1D37',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#D0D0D0',
  },
  textContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  cityNamePlaceholder: {
    width: '60%',
    height: 16,
    backgroundColor: '#B0B0B0',
    borderRadius: 4,
    marginBottom: 6,
  },
  countryNamePlaceholder: {
    width: '40%',
    height: 12,
    backgroundColor: '#B0B0B0',
    borderRadius: 4,
  },
});

