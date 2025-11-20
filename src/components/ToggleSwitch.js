import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';

export const ToggleSwitch = ({ value, onValueChange, disabled = false }) => {
  return (
    <TouchableOpacity
      style={[styles.toggle, value && styles.toggleActive, disabled && styles.toggleDisabled]}
      onPress={() => !disabled && onValueChange(!value)}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <View style={[styles.thumb, value && styles.thumbActive]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    paddingHorizontal: 2,
    position: 'relative',
  },
  toggleActive: {
    backgroundColor: '#0A1D37',
  },
  toggleDisabled: {
    opacity: 0.5,
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    left: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  thumbActive: {
    left: 24,
  },
});

