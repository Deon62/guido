import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Platform, StatusBar as RNStatusBar, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/Button';

export const GuideDetailsScreen = ({ guide, guides = [], currentIndex = 0, onBack, onRequestGuide, onGuideChange }) => {
  // Get safe area insets
  const statusBarHeight = Platform.OS === 'ios' ? 44 : RNStatusBar.currentHeight || 0;
  
  const scrollViewRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  
  const canGoNext = currentIndex < guides.length - 1;
  const canGoPrev = currentIndex > 0;
  
  // Reset scroll position when guide changes
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: false });
    }
    // Fade animation when guide changes
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [guide?.id, currentIndex]);
  
  const handleNextGuide = () => {
    if (canGoNext && onGuideChange) {
      onGuideChange(currentIndex + 1);
    }
  };
  
  const handlePrevGuide = () => {
    if (canGoPrev && onGuideChange) {
      onGuideChange(currentIndex - 1);
    }
  };

  const handleRequestGuide = () => {
    if (onRequestGuide) {
      onRequestGuide(guide);
    }
  };

  if (!guide) return null;

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
        <View style={styles.placeholder}>
          {guides.length > 1 && (
            <Text style={styles.counter}>{currentIndex + 1} / {guides.length}</Text>
          )}
        </View>
      </View>

      {/* Navigation Arrows */}
      {guides.length > 1 && (
        <>
          {canGoPrev && (
            <TouchableOpacity
              style={[styles.navArrow, styles.navArrowLeft]}
              onPress={handlePrevGuide}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={24} color="#0A1D37" />
            </TouchableOpacity>
          )}
          {canGoNext && (
            <TouchableOpacity
              style={[styles.navArrow, styles.navArrowRight]}
              onPress={handleNextGuide}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-forward" size={24} color="#0A1D37" />
            </TouchableOpacity>
          )}
        </>
      )}

      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <ScrollView
          ref={scrollViewRef}
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
            <View style={styles.nameRow}>
              <Text style={styles.name}>{guide.name}</Text>
              {guide.verified && (
                <Ionicons 
                  name="checkmark-circle" 
                  size={22} 
                  color="#2196F3" 
                  style={styles.verifiedBadge}
                />
              )}
            </View>
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
      </Animated.View>

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
  navArrow: {
    position: 'absolute',
    top: '50%',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0A1D37',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 10,
  },
  navArrowLeft: {
    left: 16,
  },
  navArrowRight: {
    right: 16,
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
    alignItems: 'flex-end',
  },
  counter: {
    fontSize: 12,
    color: '#6D6D6D',
    fontWeight: '500',
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
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: 0.5,
    marginRight: 8,
  },
  verifiedBadge: {
    marginLeft: 2,
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

