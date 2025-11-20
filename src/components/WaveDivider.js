import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export const WaveDivider = ({ color = '#F7F7F7', height = 40 }) => {
  return (
    <View style={[styles.container, { height }]}>
      <Svg
        width="100%"
        height={height}
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        style={styles.wave}
      >
        <Path
          d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          fill={color}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  wave: {
    width: '100%',
  },
});

