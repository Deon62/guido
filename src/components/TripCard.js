import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const TripCard = ({ trip, onPress, onRatePress }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return '#6D6D6D';
      case 'active':
        return '#0A1D37';
      case 'past':
        return '#6D6D6D';
      case 'scheduled':
        return '#0A1D37';
      default:
        return '#6D6D6D';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'upcoming':
        return 'Upcoming';
      case 'active':
        return 'Active';
      case 'past':
        return 'Completed';
      case 'scheduled':
        return 'Scheduled';
      default:
        return status;
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={trip.status === 'past' && onRatePress ? undefined : onPress}
      activeOpacity={trip.status === 'past' && onRatePress ? 1 : 0.85}
    >
      <Image
        source={trip.guideAvatar}
        style={styles.avatar}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.guideInfo}>
            <Text style={styles.guideName}>{trip.guideName}</Text>
            <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(trip.status)}15` }]}>
              <Text style={[styles.statusText, { color: getStatusColor(trip.status) }]}>
                {getStatusLabel(trip.status)}
              </Text>
            </View>
          </View>
        </View>
        <Text style={styles.tourType}>{trip.tourType}</Text>
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Ionicons name="location" size={11} color="#6D6D6D" style={{ marginRight: 3 }} />
            <Text style={styles.detailText}>{trip.location}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="calendar" size={11} color="#6D6D6D" style={{ marginRight: 3 }} />
            <Text style={styles.detailText}>{trip.date}</Text>
          </View>
        </View>
        {trip.time && (
          <View style={styles.timeContainer}>
            <Ionicons name="time" size={11} color="#6D6D6D" style={{ marginRight: 3 }} />
            <Text style={styles.timeText}>{trip.time}</Text>
          </View>
        )}
        {trip.status === 'past' && onRatePress && (
          <TouchableOpacity
            style={styles.rateButton}
            onPress={() => onRatePress(trip)}
            activeOpacity={0.7}
          >
            <Ionicons name="star" size={14} color="#0A1D37" />
            <Text style={styles.rateButtonText}>Rate Guide</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
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
  guideName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  tourType: {
    fontSize: 12,
    color: '#3A3A3A',
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  details: {
    flexDirection: 'row',
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 2,
  },
  detailText: {
    fontSize: 11,
    color: '#6D6D6D',
    letterSpacing: 0.2,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  timeText: {
    fontSize: 11,
    color: '#6D6D6D',
    letterSpacing: 0.2,
  },
  rateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#F7F7F7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  rateButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0A1D37',
    marginLeft: 6,
    letterSpacing: 0.2,
  },
});

