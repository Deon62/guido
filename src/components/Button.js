import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { FONTS } from '../constants/fonts';

export const Button = ({ title, onPress, variant = 'primary' }) => {
  const isPrimary = variant === 'primary';
  
  return (
    <TouchableOpacity
      style={[styles.button, isPrimary ? styles.primaryButton : styles.secondaryButton]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.buttonText, isPrimary ? styles.primaryText : styles.secondaryText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
    shadowColor: '#0A1D37',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  primaryButton: {
    backgroundColor: '#0A1D37',
  },
  secondaryButton: {
    backgroundColor: '#F7F7F7',
    borderWidth: 2,
    borderColor: '#0A1D37',
  },
  buttonText: {
    fontSize: 15,
    fontFamily: FONTS.semiBold,
    letterSpacing: 0.6,
  },
  primaryText: {
    color: '#F7F7F7',
  },
  secondaryText: {
    color: '#0A1D37',
  },
});

