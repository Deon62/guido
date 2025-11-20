import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

// Placeholder bottom navbar component
// Will be implemented when navigation is set up
export const BottomNavBar = () => {
  return (
    <View style={styles.container}>
      {/* Navbar items will be added here when navigation is implemented */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: '#F7F7F7',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 8,
  },
});

