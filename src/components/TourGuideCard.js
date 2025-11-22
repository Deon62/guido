import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const TourGuideCard = ({ guide, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.avatarContainer}>
        <Image
          source={guide.avatar}
          style={styles.avatar}
          resizeMode="cover"
        />
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{guide.name}</Text>
            {guide.verified && (
              <Ionicons 
                name="checkmark-circle" 
                size={18} 
                color="#2196F3" 
                style={styles.verifiedBadge}
              />
            )}
          </View>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFB800" style={{ marginRight: 4 }} />
            <Text style={styles.rating}>{guide.rating}</Text>
          </View>
        </View>
        <Text style={styles.specialty}>{guide.specialty}</Text>
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Ionicons name="location" size={12} color="#6D6D6D" style={{ marginRight: 4 }} />
            <Text style={styles.detailText}>{guide.location}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="people" size={12} color="#6D6D6D" style={{ marginRight: 4 }} />
            <Text style={styles.detailText}>{guide.tours} tours</Text>
          </View>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${guide.price}</Text>
          <Text style={styles.priceUnit}>/hour</Text>
        </View>
      </View>
    </TouchableOpacity>
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
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
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
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    letterSpacing: 0.3,
    marginRight: 6,
  },
  verifiedBadge: {
    marginLeft: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  specialty: {
    fontSize: 13,
    color: '#3A3A3A',
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  details: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    fontSize: 12,
    color: '#6D6D6D',
    letterSpacing: 0.2,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0A1D37',
    letterSpacing: 0.3,
  },
  priceUnit: {
    fontSize: 12,
    color: '#6D6D6D',
    marginLeft: 4,
  },
});

