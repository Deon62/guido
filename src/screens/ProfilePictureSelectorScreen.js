import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { FONTS } from '../constants/fonts';

// Import profile images
const profileImages = [
  require('../../assets/profiles/ic.png'),
  require('../../assets/profiles/ic1.png'),
  require('../../assets/profiles/ic2.png'),
  require('../../assets/profiles/ic3.png'),
  require('../../assets/profiles/ic4.png'),
  require('../../assets/profiles/ic5.png'),
];

export const ProfilePictureSelectorScreen = ({ currentAvatar, onBack, onSelect }) => {
  // Get safe area insets
  const statusBarHeight = Platform.OS === 'ios' ? 44 : RNStatusBar.currentHeight || 0;

  const [selectedImage, setSelectedImage] = useState(currentAvatar);

  const handleSelect = (image) => {
    setSelectedImage(image);
    if (onSelect) {
      onSelect(image);
    }
    if (onBack) {
      onBack();
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
        <Text style={styles.headerTitle}>Choose Profile Picture</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Select a profile picture</Text>
          <Text style={styles.subtitle}>Choose from the available options</Text>
          
          <View style={styles.imageGrid}>
            {profileImages.map((image, index) => {
              const isSelected = selectedImage === image;
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.imageContainer, isSelected && styles.imageContainerSelected]}
                  onPress={() => handleSelect(image)}
                  activeOpacity={0.7}
                >
                  <Image
                    source={image}
                    style={styles.profileImage}
                    resizeMode="cover"
                  />
                  {isSelected && (
                    <View style={styles.selectedOverlay}>
                      <Ionicons name="checkmark-circle" size={32} color="#F7F7F7" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
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
    fontFamily: FONTS.bold,
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
    paddingBottom: 40,
  },
  content: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    fontWeight: '700',
    color: '#0A1D37',
    letterSpacing: 0.3,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    fontWeight: '400',
    color: '#6D6D6D',
    letterSpacing: 0.2,
    marginBottom: 24,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: '30%',
    aspectRatio: 1,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E8E8E8',
    position: 'relative',
  },
  imageContainerSelected: {
    borderColor: '#0A1D37',
    borderWidth: 3,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  selectedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10, 29, 55, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

