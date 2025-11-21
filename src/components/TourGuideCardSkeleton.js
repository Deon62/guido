import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

export const TourGuideCardSkeleton = () => {
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
      <Animated.View style={[styles.avatar, { opacity }]} />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.nameRow}>
            <Animated.View style={[styles.namePlaceholder, { opacity }]} />
            <Animated.View style={[styles.verifiedBadgePlaceholder, { opacity }]} />
          </View>
          <Animated.View style={[styles.ratingPlaceholder, { opacity }]} />
        </View>
        <Animated.View style={[styles.specialtyPlaceholder, { opacity }]} />
        <View style={styles.details}>
          <Animated.View style={[styles.detailItemPlaceholder, { opacity }]} />
          <Animated.View style={[styles.detailItemPlaceholder, { opacity }]} />
        </View>
        <Animated.View style={[styles.pricePlaceholder, { opacity }]} />
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
  avatar: {
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
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  namePlaceholder: {
    width: 120,
    height: 16,
    backgroundColor: '#D0D0D0',
    borderRadius: 4,
    marginRight: 6,
  },
  verifiedBadgePlaceholder: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#D0D0D0',
  },
  ratingPlaceholder: {
    width: 40,
    height: 14,
    backgroundColor: '#D0D0D0',
    borderRadius: 4,
  },
  specialtyPlaceholder: {
    width: '70%',
    height: 13,
    backgroundColor: '#D0D0D0',
    borderRadius: 4,
    marginBottom: 8,
  },
  details: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailItemPlaceholder: {
    width: 60,
    height: 12,
    backgroundColor: '#D0D0D0',
    borderRadius: 4,
    marginRight: 16,
  },
  pricePlaceholder: {
    width: 50,
    height: 18,
    backgroundColor: '#D0D0D0',
    borderRadius: 4,
    marginTop: 4,
  },
});

