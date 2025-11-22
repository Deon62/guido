import React, { useEffect, useRef, memo } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONTS } from '../constants/fonts';

export const PlaceCard = memo(({ place, onPress, delay = 0 }) => {
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const pressScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        delay,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay]);

  const handlePressIn = () => {
    Animated.spring(pressScale, {
      toValue: 0.97,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressScale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };
  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'landmark':
      case 'landmarks':
        return 'business';
      case 'hotel':
      case 'hotels':
        return 'bed';
      case 'cafe':
      case 'cafes':
        return 'cafe';
      case 'nature':
        return 'leaf';
      default:
        return 'location';
    }
  };

  const getCategoryColor = (category) => {
    switch (category.toLowerCase()) {
      case 'landmark':
      case 'landmarks':
        return '#FF6B6B';
      case 'hotel':
      case 'hotels':
        return '#4ECDC4';
      case 'cafe':
      case 'cafes':
        return '#FFE66D';
      case 'nature':
        return '#95E1D3';
      default:
        return '#6D6D6D';
    }
  };

  return (
    <Animated.View
      style={[
        {
          transform: [
            { scale: scaleAnim },
            { scale: pressScale },
          ],
          opacity: opacityAnim,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
      <View style={styles.imageContainer}>
        <Image
          source={place.image}
          style={styles.image}
          resizeMode="cover"
          loadingIndicatorSource={require('../../assets/images/undone.png')}
          progressiveRenderingEnabled={true}
        />
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>{place.name}</Text>
          {place.rating && (
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color="#FFB800" style={{ marginRight: 2 }} />
              <Text style={styles.rating}>{place.rating}</Text>
            </View>
          )}
        </View>
        {place.address && (
          <View style={styles.details}>
            <Ionicons name="location" size={12} color="#6D6D6D" style={{ marginRight: 4 }} />
            <Text style={styles.detailText} numberOfLines={1}>{place.address}</Text>
          </View>
        )}
        {place.distance && (
          <Text style={styles.distance}>{place.distance}</Text>
        )}
        {place.description && (
          <Text style={styles.description} numberOfLines={2}>{place.description}</Text>
        )}
      </View>
      <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(place.category) }]}>
        <Ionicons name={getCategoryIcon(place.category)} size={12} color="#FFFFFF" />
        <Text style={styles.categoryText}>{place.category}</Text>
      </View>
    </TouchableOpacity>
    </Animated.View>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for memo
  return (
    prevProps.place.id === nextProps.place.id &&
    prevProps.place.name === nextProps.place.name &&
    prevProps.delay === nextProps.delay
  );
});

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
    position: 'relative',
  },
  imageContainer: {
    marginRight: 12,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8E8E8',
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryText: {
    fontSize: 9,
    fontFamily: FONTS.semiBold,
    color: '#FFFFFF',
    marginLeft: 3,
    textTransform: 'capitalize',
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
  name: {
    fontSize: 16,
    fontFamily: FONTS.semiBold,
    color: '#1A1A1A',
    letterSpacing: 0.3,
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
    color: '#1A1A1A',
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: '#6D6D6D',
    letterSpacing: 0.2,
    flex: 1,
  },
  distance: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: '#6D6D6D',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  description: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: '#3A3A3A',
    letterSpacing: 0.2,
    lineHeight: 16,
    marginTop: 2,
  },
});

