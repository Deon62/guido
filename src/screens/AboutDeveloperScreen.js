import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { FONTS } from '../constants/fonts';

export const AboutDeveloperScreen = ({ onBack }) => {
  // Get safe area insets
  const statusBarHeight = Platform.OS === 'ios' ? 44 : RNStatusBar.currentHeight || 0;

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
        <Text style={styles.headerTitle}>About Developer</Text>
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
            source={require('../../assets/logo/deon.jpg')}
            style={styles.profileImage}
            resizeMode="cover"
          />
          <Text style={styles.name}>Deon Orina</Text>
          <Text style={styles.title}>AI Engineer</Text>
        </View>

        {/* About Section */}
        <View style={styles.aboutSection}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <Text style={styles.aboutText}>
            I'm an AI engineer passionate about creating innovative solutions that make technology more accessible and user-friendly. With a deep interest in machine learning and software development, I enjoy building applications that solve real-world problems.
          </Text>
        </View>

        {/* Why I Built This App */}
        <View style={styles.aboutSection}>
          <Text style={styles.sectionTitle}>Why I Built Guido</Text>
          <Text style={styles.aboutText}>
            Guido was born from my own experiences traveling and wanting a better way to discover amazing places, plan trips, and keep track of all my travel memories in one place.
          </Text>
          <Text style={styles.aboutText}>
            The app aims to make travel planning and discovery more personal and organized. Whether you're exploring a new city or revisiting favorite destinations, Guido helps you discover places, plan your trips, and share your experiences with a community of travelers.
          </Text>
        </View>

        {/* Vision Section */}
        <View style={styles.aboutSection}>
          <Text style={styles.sectionTitle}>Vision</Text>
          <Text style={styles.aboutText}>
            My vision for Guido is to create a global community where travelers can discover amazing places, share their experiences, and build a comprehensive travel journal. I believe that the best travel experiences come from discovering authentic places and connecting with fellow travelers who share their stories and recommendations.
          </Text>
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
    paddingTop: 24,
    paddingBottom: 32,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    marginHorizontal: 24,
    borderRadius: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#F7F7F7',
  },
  name: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: '#1A1A1A',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  title: {
    fontSize: 15,
    fontFamily: FONTS.regular,
    color: '#6D6D6D',
    letterSpacing: 0.3,
  },
  aboutSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 16,
    marginHorizontal: 24,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.semiBold,
    color: '#0A1D37',
    letterSpacing: 0.3,
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: '#3A3A3A',
    letterSpacing: 0.2,
    lineHeight: 22,
    marginBottom: 12,
  },
});

