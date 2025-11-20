import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { CityCard } from '../components/CityCard';

export const CitySelectionScreen = ({ onCitySelect, onBack }) => {
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

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={[styles.header, { paddingTop: statusBarHeight + 16 }]}>
        <Text style={styles.title}>Select a City</Text>
        <Text style={styles.subtitle}>Choose your destination</Text>
      </View>
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {cities.map((city) => (
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

