import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

export const TripCardSkeleton = () => {
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
          <View style={styles.guideInfo}>
            <Animated.View style={[styles.guideNamePlaceholder, { opacity }]} />
            <Animated.View style={[styles.statusBadgePlaceholder, { opacity }]} />
          </View>
        </View>
        <Animated.View style={[styles.tourTypePlaceholder, { opacity }]} />
        <View style={styles.details}>
          <Animated.View style={[styles.detailItemPlaceholder, { opacity }]} />
          <Animated.View style={[styles.detailItemPlaceholder, { opacity }]} />
        </View>
        <Animated.View style={[styles.timePlaceholder, { opacity }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
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
    width: 55,
    height: 55,
    borderRadius: 27.5,
    marginRight: 10,
    backgroundColor: '#D0D0D0',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 3,
  },
  guideInfo: {
    flex: 1,
  },
  guideNamePlaceholder: {
    width: 120,
    height: 15,
    backgroundColor: '#D0D0D0',
    borderRadius: 4,
    marginBottom: 6,
  },
  statusBadgePlaceholder: {
    width: 60,
    height: 18,
    backgroundColor: '#D0D0D0',
    borderRadius: 6,
  },
  tourTypePlaceholder: {
    width: '70%',
    height: 12,
    backgroundColor: '#D0D0D0',
    borderRadius: 4,
    marginBottom: 6,
  },
  details: {
    flexDirection: 'row',
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  detailItemPlaceholder: {
    width: 80,
    height: 11,
    backgroundColor: '#D0D0D0',
    borderRadius: 4,
    marginRight: 12,
    marginBottom: 2,
  },
  timePlaceholder: {
    width: 60,
    height: 11,
    backgroundColor: '#D0D0D0',
    borderRadius: 4,
    marginTop: 2,
  },
});

