import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONTS } from '../constants/fonts';

/**
 * Lightweight Load More button component
 * Shows loading state and can be customized
 */
export const LoadMoreButton = ({ 
  onPress, 
  isLoading = false, 
  hasMore = true,
  text = 'Load More',
  disabled = false 
}) => {
  if (!hasMore) return null;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        (isLoading || disabled) && styles.buttonDisabled
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={isLoading || disabled}
    >
      {isLoading ? (
        <>
          <ActivityIndicator size="small" color="#FFFFFF" style={styles.loader} />
          <Text style={styles.buttonText}>Loading...</Text>
        </>
      ) : (
        <>
          <Ionicons name="arrow-down-circle-outline" size={20} color="#FFFFFF" style={styles.icon} />
          <Text style={styles.buttonText}>{text}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0A1D37',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    marginHorizontal: 16,
    marginVertical: 12,
  },
  buttonDisabled: {
    backgroundColor: '#E8E8E8',
  },
  buttonText: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  icon: {
    marginRight: -4,
  },
  loader: {
    marginRight: 8,
  },
});

