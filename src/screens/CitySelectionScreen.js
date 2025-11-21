import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, StatusBar as RNStatusBar, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { CityCard } from '../components/CityCard';

export const CitySelectionScreen = ({ onCitySelect, onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get safe area insets
  const statusBarHeight = Platform.OS === 'ios' ? 44 : RNStatusBar.currentHeight || 0;

  const cities = [
    {
      id: 'paris',
      name: 'Paris',
      country: 'France',
      image: require('../../assets/images/paris.png'),
    },
    {
      id: 'munich',
      name: 'Munich',
      country: 'Germany',
      image: require('../../assets/images/munich.png'),
    },
    {
      id: 'newyork',
      name: 'New York',
      country: 'USA',
      image: require('../../assets/images/newyork.png'),
    },
    {
      id: 'berlin',
      name: 'Berlin',
      country: 'Germany',
      image: require('../../assets/images/berlin.png'),
    },
    {
      id: 'nairobi',
      name: 'Nairobi',
      country: 'Kenya',
      image: require('../../assets/images/Nairobi.png'),
    },
    {
      id: 'mombasa',
      name: 'Mombasa',
      country: 'Kenya',
      image: require('../../assets/images/Mombasa.png'),
    },
    {
      id: 'nakuru',
      name: 'Nakuru',
      country: 'Kenya',
      image: require('../../assets/images/Nakuru.png'),
    },
    {
      id: 'kisumu',
      name: 'Kisumu',
      country: 'Kenya',
      image: require('../../assets/images/Kisumu.png'),
    },
  ];

  const handleCityPress = (city) => {
    if (onCitySelect) {
      onCitySelect(city);
    }
    console.log('City selected:', city.name);
  };

  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={[styles.header, { paddingTop: statusBarHeight + 16 }]}>
        <Text style={styles.title}>Select a City</Text>
        <Text style={styles.subtitle}>Choose your destination</Text>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#6D6D6D" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search cities..."
            placeholderTextColor="#6D6D6D"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Ionicons 
              name="close-circle" 
              size={20} 
              color="#6D6D6D" 
              style={styles.clearIcon}
              onPress={() => setSearchQuery('')}
            />
          )}
        </View>
      </View>
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {filteredCities.map((city) => (
            <CityCard
              key={city.id}
              city={city.name}
              country={city.country}
              image={city.image}
              onPress={() => handleCityPress(city)}
            />
          ))}
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
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0A1D37',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6D6D6D',
    fontWeight: '400',
    letterSpacing: 0.3,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
    letterSpacing: 0.2,
    padding: 0,
  },
  clearIcon: {
    marginLeft: 8,
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
});

