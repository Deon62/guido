import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

export const CircularGridLogo = ({ size = 160 }) => {
  const gridLines = 3; // Smaller grid as per guidelines
  const circleSize = size;
  const gridSpacing = circleSize / (gridLines + 1);

  return (
    <View style={[styles.container, { width: circleSize, height: circleSize }]}>
      {/* Circular border with grid pattern */}
      <View style={[styles.gridContainer, { width: circleSize, height: circleSize, borderRadius: circleSize / 2 }]}>
        {/* Vertical grid lines */}
        {[...Array(gridLines)].map((_, i) => {
          const position = gridSpacing * (i + 1);
          return (
            <View
              key={`v-${i}`}
              style={[
                styles.gridLine,
                styles.verticalLine,
                {
                  left: position - 0.5,
                  height: circleSize,
                },
              ]}
            />
          );
        })}
        {/* Horizontal grid lines */}
        {[...Array(gridLines)].map((_, i) => {
          const position = gridSpacing * (i + 1);
          return (
            <View
              key={`h-${i}`}
              style={[
                styles.gridLine,
                styles.horizontalLine,
                {
                  top: position - 0.5,
                  width: circleSize,
                },
              ]}
            />
          );
        })}
        {/* Circular border */}
        <View style={[styles.circleBorder, { width: circleSize, height: circleSize, borderRadius: circleSize / 2 }]} />
      </View>
      
      {/* Logo Image - clipped to circle */}
      <View style={[styles.logoContainer, { width: circleSize - 20, height: circleSize - 20, borderRadius: (circleSize - 20) / 2 }]}>
        <Image
          source={require('../../assets/logo/logo.png')}
          style={[styles.logo, { width: circleSize - 20, height: circleSize - 20 }]}
          resizeMode="cover"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridContainer: {
    position: 'absolute',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: '#0A1D37',
    opacity: 0.2,
  },
  verticalLine: {
    width: 1.5,
    top: 0,
  },
  horizontalLine: {
    height: 1.5,
    left: 0,
  },
  circleBorder: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#0A1D37',
    opacity: 0.25,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7F7F7',
    overflow: 'hidden',
    position: 'absolute',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
});

