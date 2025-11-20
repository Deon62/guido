import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Platform, StatusBar as RNStatusBar, KeyboardAvoidingView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { ChatBubble } from '../components/ChatBubble';

export const ChatScreen = ({ message, onBack }) => {
  const [inputText, setInputText] = useState('');
  
  // Get safe area insets
  const statusBarHeight = Platform.OS === 'ios' ? 44 : RNStatusBar.currentHeight || 0;

  // Mock chat messages
  const [chatMessages, setChatMessages] = useState([
    {
      id: '1',
      text: 'Hi! I\'m excited to show you around Paris tomorrow. Meet at the Eiffel Tower at 10 AM?',
      time: '10:30 AM',
      isOwn: false,
    },
    {
      id: '2',
      text: 'That sounds perfect! I\'ll be there at 10 AM. Looking forward to it!',
      time: '10:32 AM',
      isOwn: true,
    },
    {
      id: '3',
      text: 'Great! I\'ll bring my camera and show you some hidden spots too.',
      time: '10:33 AM',
      isOwn: false,
    },
    {
      id: '4',
      text: 'Amazing! Can\'t wait 😊',
      time: '10:35 AM',
      isOwn: true,
    },
  ]);

  const handleSend = () => {
    if (inputText.trim()) {
      const now = new Date();
      const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      
      const newMessage = {
        id: Date.now().toString(),
        text: inputText.trim(),
        time: time,
        isOwn: true,
      };
      
      setChatMessages([...chatMessages, newMessage]);
      setInputText('');
    }
  };

  const formatTime = (timestamp) => {
    const msgDate = new Date(timestamp);
    return msgDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <StatusBar style="dark" />
      <View style={[styles.header, { paddingTop: statusBarHeight + 16 }]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color="#0A1D37" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{message?.name || 'Chat'}</Text>
          <Text style={styles.headerStatus}>Online</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {chatMessages.map((msg) => (
          <ChatBubble
            key={msg.id}
            message={msg}
            isOwn={msg.isOwn}
          />
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          placeholderTextColor="#6D6D6D"
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, inputText.trim() && styles.sendButtonActive]}
          onPress={handleSend}
          activeOpacity={0.7}
          disabled={!inputText.trim()}
        >
          <Ionicons
            name="send"
            size={20}
            color={inputText.trim() ? '#F7F7F7' : '#6D6D6D'}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  headerStatus: {
    fontSize: 12,
    color: '#6D6D6D',
    letterSpacing: 0.2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    paddingBottom: Platform.OS === 'ios' ? 32 : 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1A1A1A',
    letterSpacing: 0.2,
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#0A1D37',
  },
});

