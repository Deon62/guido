import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

export const PlaceCardSkeleton = () => {
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
      <Animated.View style={[styles.image, { opacity }]} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Animated.View style={[styles.namePlaceholder, { opacity }]} />
          <Animated.View style={[styles.ratingPlaceholder, { opacity }]} />
        </View>
        <Animated.View style={[styles.addressPlaceholder, { opacity }]} />
        <Animated.View style={[styles.distancePlaceholder, { opacity }]} />
        <Animated.View style={[styles.descriptionPlaceholder, { opacity }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: '#0A1D37',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 12,
    backgroundColor: '#D0D0D0',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  namePlaceholder: {
    width: 150,
    height: 16,
    backgroundColor: '#D0D0D0',
    borderRadius: 4,
    marginRight: 8,
  },
  ratingPlaceholder: {
    width: 40,
    height: 14,
    backgroundColor: '#D0D0D0',
    borderRadius: 4,
  },
  addressPlaceholder: {
    width: '80%',
    height: 12,
    backgroundColor: '#D0D0D0',
    borderRadius: 4,
    marginBottom: 4,
  },
  distancePlaceholder: {
    width: 60,
    height: 11,
    backgroundColor: '#D0D0D0',
    borderRadius: 4,
    marginBottom: 4,
  },
  descriptionPlaceholder: {
    width: '90%',
    height: 12,
    backgroundColor: '#D0D0D0',
    borderRadius: 4,
    marginTop: 2,
  },
});

