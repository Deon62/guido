import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const MessageCard = ({ message, onPress }) => {
  const formatTime = (timestamp) => {
    const now = new Date();
    const msgDate = new Date(timestamp);
    const diff = now - msgDate;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) {
      return 'Just now';
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return `${days}d ago`;
    } else {
      return msgDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Image
        source={message.avatar}
        style={styles.avatar}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.name}>{message.name}</Text>
            {message.unread && <View style={styles.unreadDot} />}
          </View>
          <Text style={styles.time}>{formatTime(message.timestamp)}</Text>
        </View>
        <View style={styles.messageRow}>
          <Text style={[styles.messageText, message.unread && styles.messageTextUnread]} numberOfLines={1}>
            {message.lastMessage}
          </Text>
          {message.unread && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{message.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    letterSpacing: 0.3,
    marginRight: 6,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0A1D37',
  },
  time: {
    fontSize: 11,
    color: '#6D6D6D',
    letterSpacing: 0.2,
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messageText: {
    fontSize: 13,
    color: '#6D6D6D',
    letterSpacing: 0.2,
    flex: 1,
    marginRight: 8,
  },
  messageTextUnread: {
    color: '#1A1A1A',
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: '#0A1D37',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    fontSize: 11,
    fontWeight: '600',
    color: '#F7F7F7',
  },
});

