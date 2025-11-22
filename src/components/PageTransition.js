import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

export const PageTransition = ({ children, isVisible = true, duration = 300 }) => {
  const fadeAnim = useRef(new Animated.Value(isVisible ? 1 : 0)).current;
  const slideAnim = useRef(new Animated.Value(isVisible ? 0 : 20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: isVisible ? 1 : 0,
        duration,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: isVisible ? 0 : 20,
        duration,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isVisible, duration]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

