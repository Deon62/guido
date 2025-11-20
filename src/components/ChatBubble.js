import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const ChatBubble = ({ message, isOwn }) => {
  return (
    <View style={[styles.container, isOwn ? styles.ownContainer : styles.otherContainer]}>
      <View style={[styles.bubble, isOwn ? styles.ownBubble : styles.otherBubble]}>
        <Text style={[styles.messageText, isOwn ? styles.ownText : styles.otherText]}>
          {message.text}
        </Text>
        <Text style={[styles.timeText, isOwn ? styles.ownTime : styles.otherTime]}>
          {message.time}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    paddingHorizontal: 24,
  },
  ownContainer: {
    alignItems: 'flex-end',
  },
  otherContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  ownBubble: {
    backgroundColor: '#0A1D37',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  messageText: {
    fontSize: 14,
    letterSpacing: 0.2,
    lineHeight: 20,
    marginBottom: 4,
  },
  ownText: {
    color: '#F7F7F7',
  },
  otherText: {
    color: '#1A1A1A',
  },
  timeText: {
    fontSize: 10,
    letterSpacing: 0.2,
  },
  ownTime: {
    color: '#F7F7F7',
    opacity: 0.7,
  },
  otherTime: {
    color: '#6D6D6D',
  },
});

