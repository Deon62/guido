import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/Button';

export const GuideDetailsScreen = ({ guide, onBack, onRequestGuide }) => {
  // Get safe area insets
  const statusBarHeight = Platform.OS === 'ios' ? 44 : RNStatusBar.currentHeight || 0;

  const handleRequestGuide = () => {
    if (onRequestGuide) {
      onRequestGuide(guide);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: statusBarHeight + 16 }]}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#0A1D37" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Guide Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Image
            source={guide.avatar}
            style={styles.avatar}
            resizeMode="cover"
          />
          <Text style={styles.name}>{guide.name}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFB800" style={{ marginRight: 4 }} />
            <Text style={styles.rating}>{guide.rating}</Text>
            <Text style={styles.toursCount}> • {guide.tours} tours</Text>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>
            {guide.name} is a passionate local guide specializing in {guide.specialty.toLowerCase()}. 
            With years of experience exploring the city, they love sharing hidden gems and authentic 
            experiences with travelers. Their tours are designed to give you a genuine local perspective 
            while ensuring you have a memorable and enjoyable time.
          </Text>
        </View>

        {/* Specialty Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specialty</Text>
          <Text style={styles.specialtyText}>{guide.specialty}</Text>
        </View>

        {/* Location Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={16} color="#6D6D6D" style={{ marginRight: 8 }} />
            <Text style={styles.locationText}>{guide.location}</Text>
          </View>
        </View>

        {/* Pricing Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing</Text>
          <View style={styles.pricingRow}>
            <Text style={styles.price}>${guide.price}</Text>
            <Text style={styles.priceUnit}>/hour</Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Request Button */}
      <View style={styles.stickyBar}>
        <Button
          title="Request Guide"
          onPress={handleRequestGuide}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0A1D37',
    letterSpacing: 0.5,
  },
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#F7F7F7',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  toursCount: {
    fontSize: 14,
    color: '#6D6D6D',
    marginLeft: 4,
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 16,
    marginHorizontal: 24,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0A1D37',
    letterSpacing: 0.3,
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 14,
    color: '#3A3A3A',
    letterSpacing: 0.2,
    lineHeight: 22,
  },
  specialtyText: {
    fontSize: 15,
    color: '#3A3A3A',
    letterSpacing: 0.2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: '#3A3A3A',
    letterSpacing: 0.2,
  },
  pricingRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0A1D37',
    letterSpacing: 0.3,
  },
  priceUnit: {
    fontSize: 14,
    color: '#6D6D6D',
    marginLeft: 4,
  },
  stickyBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    shadowColor: '#0A1D37',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
});

