import * as Haptics from 'expo-haptics';
import { Platform, Vibration } from 'react-native';

/**
 * Haptic feedback utility
 * Provides tactile feedback for user interactions
 * Supports both iOS (expo-haptics) and Android (Vibration API)
 */
export const triggerHaptic = (type = 'light') => {
  try {
    if (Platform.OS === 'ios') {
      // iOS haptic feedback using expo-haptics
      switch (type) {
        case 'light':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'medium':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'heavy':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        case 'success':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case 'error':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
        case 'warning':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        case 'selection':
          Haptics.selectionAsync();
          break;
        default:
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } else if (Platform.OS === 'android') {
      // Android haptic feedback using Vibration API
      // Different vibration patterns for different feedback types
      switch (type) {
        case 'light':
          // Short, light vibration (10ms)
          Vibration.vibrate(10);
          break;
        case 'medium':
          // Medium vibration (20ms)
          Vibration.vibrate(20);
          break;
        case 'heavy':
          // Stronger vibration (40ms)
          Vibration.vibrate(40);
          break;
        case 'success':
          // Success pattern: short-short (10ms, pause 50ms, 10ms)
          Vibration.vibrate([0, 10, 50, 10]);
          break;
        case 'error':
          // Error pattern: longer vibration (30ms)
          Vibration.vibrate(30);
          break;
        case 'warning':
          // Warning pattern: medium-short (20ms, pause 30ms, 10ms)
          Vibration.vibrate([0, 20, 30, 10]);
          break;
        case 'selection':
          // Selection: very light tap (5ms)
          Vibration.vibrate(5);
          break;
        default:
          Vibration.vibrate(10);
      }
    }
  } catch (error) {
    // Silently fail if haptics are not available
    console.log('Haptic feedback not available:', error);
  }
};

