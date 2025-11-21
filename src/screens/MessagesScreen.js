import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MessageCard } from '../components/MessageCard';
import { BottomNavBar } from '../components/BottomNavBar';

export const MessagesScreen = ({ activeTab = 'messages', onTabChange, onMessagePress, hideBottomNav = false }) => {
  // Get safe area insets
  const statusBarHeight = Platform.OS === 'ios' ? 44 : RNStatusBar.currentHeight || 0;

  // Mock messages data
  const messages = [
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: { uri: 'https://i.pravatar.cc/150?img=1' },
      lastMessage: 'Hi! I\'m excited to show you around Paris tomorrow. Meet at the Eiffel Tower at 10 AM?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      unread: true,
      unreadCount: 2,
    },
    {
      id: '2',
      name: 'Michael Chen',
      avatar: { uri: 'https://i.pravatar.cc/150?img=2' },
      lastMessage: 'Thanks for booking! Looking forward to our food tour.',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      unread: false,
    },
    {
      id: '3',
      name: 'Emma Williams',
      avatar: { uri: 'https://i.pravatar.cc/150?img=3' },
      lastMessage: 'The art museum tour was amazing! Thank you so much.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      unread: false,
    },
    {
      id: '4',
      name: 'David Martinez',
      avatar: { uri: 'https://i.pravatar.cc/150?img=4' },
      lastMessage: 'See you tonight for the nightlife tour!',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      unread: true,
      unreadCount: 1,
    },
    {
      id: '5',
      name: 'Lisa Anderson',
      avatar: { uri: 'https://i.pravatar.cc/150?img=5' },
      lastMessage: 'Perfect weather for our nature walk today!',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      unread: false,
    },
    {
      id: '6',
      name: 'James Wilson',
      avatar: { uri: 'https://i.pravatar.cc/150?img=6' },
      lastMessage: 'Check out these amazing photos from our tour!',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      unread: false,
    },
  ];

  const handleMessagePress = (message) => {
    if (onMessagePress) {
      onMessagePress(message);
    } else {
      console.log('Message pressed:', message.name);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={[styles.header, { paddingTop: statusBarHeight + 16 }]}>
        <Text style={styles.title}>Messages</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message.id}
              message={message}
              onPress={() => handleMessagePress(message)}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No messages</Text>
            <Text style={styles.emptySubtext}>
              Your conversations will appear here
            </Text>
          </View>
        )}
      </ScrollView>

      {!hideBottomNav && <BottomNavBar activeTab={activeTab} onTabChange={onTabChange} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0A1D37',
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
    paddingTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6D6D6D',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
});

