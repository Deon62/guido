import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FONTS } from '../constants/fonts';

/**
 * Lightweight pagination indicator component
 * Shows current page info and load progress
 */
export const PaginationIndicator = ({ 
  displayedCount, 
  totalItems, 
  currentPage, 
  totalPages,
  isLoading = false 
}) => {
  if (totalItems === 0) return null;
  
  const percentage = totalItems > 0 ? Math.round((displayedCount / totalItems) * 100) : 0;
  const showProgress = totalPages > 1;

  return (
    <View style={styles.container}>
      {showProgress && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${percentage}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {isLoading 
              ? 'Loading...' 
              : `${displayedCount} of ${totalItems} items (${percentage}%)`
            }
          </Text>
        </View>
      )}
      {totalPages > 1 && (
        <Text style={styles.pageText}>
          Page {currentPage} of {totalPages}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  progressContainer: {
    width: '100%',
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#E8E8E8',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0A1D37',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: '#6D6D6D',
    textAlign: 'center',
  },
  pageText: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
    color: '#0A1D37',
    textAlign: 'center',
  },
});

