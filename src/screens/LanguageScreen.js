import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

export const LanguageScreen = ({ onBack }) => {
  // Get safe area insets
  const statusBarHeight = Platform.OS === 'ios' ? 44 : RNStatusBar.currentHeight || 0;

  const [selectedLanguage, setSelectedLanguage] = useState('english');

  const languages = [
    {
      id: 'english',
      label: 'English',
      nativeLabel: 'English',
    },
    {
      id: 'german',
      label: 'German',
      nativeLabel: 'Deutsch',
    },
    {
      id: 'french',
      label: 'French',
      nativeLabel: 'Français',
    },
    {
      id: 'spanish',
      label: 'Spanish',
      nativeLabel: 'Español',
    },
    {
      id: 'swahili',
      label: 'Swahili',
      nativeLabel: 'Kiswahili',
    },
  ];

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
        <Text style={styles.headerTitle}>Language</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.optionsSection}>
          {languages.map((language) => {
            const isSelected = selectedLanguage === language.id;
            return (
              <TouchableOpacity
                key={language.id}
                style={styles.languageItem}
                onPress={() => setSelectedLanguage(language.id)}
                activeOpacity={0.7}
              >
                <View style={styles.languageLeft}>
                  <Text style={styles.languageLabel}>{language.label}</Text>
                  <Text style={styles.languageNative}>{language.nativeLabel}</Text>
                </View>
                {isSelected && (
                  <Ionicons name="checkmark" size={24} color="#0A1D37" />
                )}
              </TouchableOpacity>
            );
          })}
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
    paddingTop: 16,
    paddingBottom: 32,
  },
  optionsSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  languageLeft: {
    flex: 1,
  },
  languageLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1A1A1A',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  languageNative: {
    fontSize: 13,
    color: '#6D6D6D',
    letterSpacing: 0.2,
  },
});

