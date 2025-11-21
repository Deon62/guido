import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

export const HotspotCardSkeleton = () => {
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
      <Animated.View style={[styles.categoryBadge, { opacity }]} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.nameContainer}>
            <Animated.View style={[styles.namePlaceholder, { opacity }]} />
            <Animated.View style={[styles.ratingPlaceholder, { opacity }]} />
          </View>
        </View>

        <Animated.View style={[styles.descriptionPlaceholder1, { opacity }]} />
        <Animated.View style={[styles.descriptionPlaceholder2, { opacity }]} />

        <View style={styles.footer}>
          <Animated.View style={[styles.likesPlaceholder, { opacity }]} />
          <Animated.View style={[styles.distancePlaceholder, { opacity }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#0A1D37',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  imagePlaceholder: {
    width: '100%',
    height: 140,
    backgroundColor: '#D0D0D0',
  },
  categoryBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 60,
    height: 20,
    backgroundColor: '#D0D0D0',
    borderRadius: 6,
  },
  content: {
    padding: 12,
  },
  header: {
    marginBottom: 6,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  namePlaceholder: {
    flex: 1,
    height: 15,
    backgroundColor: '#D0D0D0',
    borderRadius: 4,
    marginRight: 6,
  },
  ratingPlaceholder: {
    width: 35,
    height: 18,
    backgroundColor: '#D0D0D0',
    borderRadius: 4,
  },
  descriptionPlaceholder1: {
    width: '100%',
    height: 12,
    backgroundColor: '#D0D0D0',
    borderRadius: 4,
    marginBottom: 4,
  },
  descriptionPlaceholder2: {
    width: '75%',
    height: 12,
    backgroundColor: '#D0D0D0',
    borderRadius: 4,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F7F7F7',
  },
  likesPlaceholder: {
    width: 40,
    height: 12,
    backgroundColor: '#D0D0D0',
    borderRadius: 4,
  },
  distancePlaceholder: {
    width: 35,
    height: 11,
    backgroundColor: '#D0D0D0',
    borderRadius: 4,
  },
});

