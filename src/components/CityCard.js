import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { FONTS } from '../constants/fonts';

export const CityCard = ({ city, country, image, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Image
        source={image}
        style={styles.cityImage}
        resizeMode="cover"
      />
      <View style={styles.overlay} />
      <View style={styles.textContainer}>
        <Text style={styles.cityName}>{city}</Text>
        <Text style={styles.countryName}>{country}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
    shadowColor: '#0A1D37',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cityImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    backgroundColor: 'rgba(10, 29, 55, 0.5)',
  },
  textContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  cityName: {
    fontSize: 16,
    fontFamily: FONTS.semiBold,
    color: '#F7F7F7',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  countryName: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: '#F7F7F7',
    opacity: 0.9,
    letterSpacing: 0.3,
  },
});

