import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Platform, StatusBar as RNStatusBar, Modal, KeyboardAvoidingView, Keyboard, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { FONTS } from '../constants/fonts';
import { triggerHaptic } from '../utils/haptics';

export const AIChatScreen = ({ activeTab = 'ai', onTabChange, onBack }) => {
  const statusBarHeight = Platform.OS === 'ios' ? 44 : RNStatusBar.currentHeight || 0;
  
  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'ai',
      text: "Hey there, wanderer! 🌍✨ I'm Deony, your travel companion, and I'm absolutely thrilled you're here! Whether you're dreaming of your next adventure, need tips for that hidden gem, or just want to chat about the world's wonders, I'm all ears! What's on your travel mind today?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showConversationsPanel, setShowConversationsPanel] = useState(false);
  const [selectedConversationMenu, setSelectedConversationMenu] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const scrollViewRef = useRef(null);
  const panelSlideAnim = useRef(new Animated.Value(1)).current;
  const menuButtonRefs = useRef({});
  const [conversations] = useState([
    { id: '1', title: 'Planning a trip to Paris', lastMessage: 'What are the best places to visit?', timestamp: '2 hours ago' },
    { id: '2', title: 'Budget travel tips', lastMessage: 'How can I travel on a budget?', timestamp: '1 day ago' },
    { id: '3', title: 'Hidden gems in Tokyo', lastMessage: 'Tell me about off-the-beaten-path spots', timestamp: '3 days ago' },
  ]);

  // Typing animation
  const dot1Anim = useRef(new Animated.Value(0.4)).current;
  const dot2Anim = useRef(new Animated.Value(0.4)).current;
  const dot3Anim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    if (isTyping) {
      const animateDot = (anim, delay) => {
        return Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(anim, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0.4,
              duration: 400,
              useNativeDriver: true,
            }),
          ])
        );
      };

      const animation = Animated.parallel([
        animateDot(dot1Anim, 0),
        animateDot(dot2Anim, 200),
        animateDot(dot3Anim, 400),
      ]);

      animation.start();

      return () => animation.stop();
    } else {
      dot1Anim.setValue(0.4);
      dot2Anim.setValue(0.4);
      dot3Anim.setValue(0.4);
    }
  }, [isTyping]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  useEffect(() => {
    if (showConversationsPanel) {
      Animated.spring(panelSlideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(panelSlideAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [showConversationsPanel]);

  const handleSend = async () => {
    if (!inputText.trim() || isTyping) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      text: inputText.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    triggerHaptic('light');
    Keyboard.dismiss();

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        text: "That's a fantastic question! Let me help you with that. I'm here to make your travel dreams come true! 🎉",
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
      triggerHaptic('success');
    }, 1500);
  };

  const handleNewConversation = () => {
    setMessages([
      {
        id: '1',
        type: 'ai',
        text: "Hey there, wanderer! 🌍✨ I'm Deony, your travel companion, and I'm absolutely thrilled you're here! Whether you're dreaming of your next adventure, need tips for that hidden gem, or just want to chat about the world's wonders, I'm all ears! What's on your travel mind today?",
        timestamp: new Date().toISOString(),
      },
    ]);
    setShowConversationsPanel(false);
    triggerHaptic('light');
  };

  const handleConversationMenuPress = (conversationId, event) => {
    event.stopPropagation();
    triggerHaptic('light');
    
    // Get button position relative to window
    const buttonRef = menuButtonRefs.current[conversationId];
    if (buttonRef) {
      buttonRef.measureInWindow((x, y, width, height) => {
        setMenuPosition({ x, y, width, height });
      });
    } else {
      // Fallback: position near right edge
      setMenuPosition({ x: 0, y: 200, width: 0, height: 0 });
    }
    
    setSelectedConversationMenu(conversationId);
  };

  const handleConversationAction = (action, conversationId) => {
    triggerHaptic('light');
    setSelectedConversationMenu(null);
    
    switch (action) {
      case 'share':
        // TODO: Implement share functionality
        console.log('Share conversation:', conversationId);
        break;
      case 'rename':
        // TODO: Implement rename functionality
        console.log('Rename conversation:', conversationId);
        break;
      case 'delete':
        // TODO: Implement delete functionality
        console.log('Delete conversation:', conversationId);
        break;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: statusBarHeight + 16 }]}>
        <TouchableOpacity
          onPress={() => {
            triggerHaptic('light');
            if (onBack) onBack();
            else if (onTabChange) onTabChange('feed');
          }}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#0A1D37" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Ionicons name="sparkles" size={20} color="#0A1D37" />
          <Text style={styles.headerTitle}>Deony</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            triggerHaptic('light');
            setShowConversationsPanel(true);
          }}
          style={styles.panelButton}
          activeOpacity={0.7}
        >
          <Ionicons name="menu" size={24} color="#0A1D37" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageWrapper,
                message.type === 'user' ? styles.userMessageWrapper : styles.aiMessageWrapper,
              ]}
            >
              {message.type === 'ai' && (
                <View style={styles.aiAvatar}>
                  <Ionicons name="sparkles" size={20} color="#FFFFFF" />
                </View>
              )}
              <View
                style={[
                  styles.messageBubble,
                  message.type === 'user' ? styles.userBubble : styles.aiBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    message.type === 'user' ? styles.userMessageText : styles.aiMessageText,
                  ]}
                >
                  {message.text}
                </Text>
              </View>
              {message.type === 'user' && (
                <View style={styles.userAvatar}>
                  <Ionicons name="person" size={16} color="#FFFFFF" />
                </View>
              )}
            </View>
          ))}
          
          {isTyping && (
            <View style={[styles.messageWrapper, styles.aiMessageWrapper]}>
              <View style={styles.aiAvatar}>
                <Ionicons name="sparkles" size={20} color="#FFFFFF" />
              </View>
              <View style={[styles.messageBubble, styles.aiBubble]}>
                <View style={styles.typingIndicator}>
                  <Animated.View style={[styles.typingDot, { opacity: dot1Anim }]} />
                  <Animated.View style={[styles.typingDot, { opacity: dot2Anim }]} />
                  <Animated.View style={[styles.typingDot, { opacity: dot3Anim }]} />
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Ask me anything about travel..."
              placeholderTextColor="rgba(155, 155, 155, 0.8)"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              returnKeyType="send"
              onSubmitEditing={handleSend}
            />
            <TouchableOpacity
              style={[styles.sendButton, (!inputText.trim() || isTyping) && styles.sendButtonDisabled]}
              onPress={handleSend}
              activeOpacity={0.7}
              disabled={!inputText.trim() || isTyping}
            >
              <Ionicons
                name="send"
                size={20}
                color={(!inputText.trim() || isTyping) ? 'rgba(192, 192, 192, 0.6)' : '#FFFFFF'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Conversations Panel */}
      <Modal
        visible={showConversationsPanel}
        transparent={true}
        animationType="none"
        onRequestClose={() => {
          setShowConversationsPanel(false);
          setSelectedConversationMenu(null);
        }}
      >
        <View style={styles.panelOverlay}>
          <TouchableOpacity
            style={styles.panelBackdrop}
            activeOpacity={1}
            onPress={() => {
              setShowConversationsPanel(false);
              setSelectedConversationMenu(null);
            }}
          />
          <Animated.View 
            style={[
              styles.panelContent,
              {
                transform: [{
                  translateX: panelSlideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 400],
                  }),
                }],
              },
            ]}
          >
            <View style={styles.panelHeader}>
              <Text style={styles.panelTitle}>Past Conversations</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowConversationsPanel(false);
                  setSelectedConversationMenu(null);
                }}
                style={styles.panelCloseButton}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color="#0A1D37" />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              style={styles.newConversationButton}
              onPress={handleNewConversation}
              activeOpacity={0.7}
            >
              <Ionicons name="add-circle" size={24} color="#0A1D37" />
              <Text style={styles.newConversationText}>New Conversation</Text>
            </TouchableOpacity>

            <ScrollView style={styles.conversationsList}>
              {conversations.map((conversation) => (
                <TouchableOpacity
                  key={conversation.id}
                  style={styles.conversationItem}
                  onPress={() => {
                    // Load conversation
                    setShowConversationsPanel(false);
                    setSelectedConversationMenu(null);
                    triggerHaptic('light');
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.conversationContent}>
                    <Text style={styles.conversationTitle}>{conversation.title}</Text>
                    <Text style={styles.conversationTimestamp}>{conversation.timestamp}</Text>
                  </View>
                  <TouchableOpacity
                    ref={(ref) => {
                      if (ref) menuButtonRefs.current[conversation.id] = ref;
                    }}
                    style={styles.conversationMenuButton}
                    onPress={(e) => handleConversationMenuPress(conversation.id, e)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="ellipsis-vertical" size={20} color="#6D6D6D" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>

      {/* Conversation Actions Modal */}
      <Modal
        visible={selectedConversationMenu !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedConversationMenu(null)}
      >
        <TouchableOpacity
          style={styles.actionModalOverlay}
          activeOpacity={1}
          onPress={() => setSelectedConversationMenu(null)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={[
              styles.actionModalContent,
              {
                position: 'absolute',
                top: menuPosition.y > 0 ? menuPosition.y + menuPosition.height + 8 : 200,
                right: 20,
              }
            ]}>
              <TouchableOpacity
                style={styles.actionModalItem}
                onPress={() => {
                  if (selectedConversationMenu) {
                    handleConversationAction('share', selectedConversationMenu);
                  }
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="share-outline" size={22} color="#0A1D37" />
                <Text style={styles.actionModalItemText}>Share</Text>
              </TouchableOpacity>
              <View style={styles.actionModalDivider} />
              <TouchableOpacity
                style={styles.actionModalItem}
                onPress={() => {
                  if (selectedConversationMenu) {
                    handleConversationAction('rename', selectedConversationMenu);
                  }
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="create-outline" size={22} color="#0A1D37" />
                <Text style={styles.actionModalItemText}>Rename</Text>
              </TouchableOpacity>
              <View style={styles.actionModalDivider} />
              <TouchableOpacity
                style={styles.actionModalItem}
                onPress={() => {
                  if (selectedConversationMenu) {
                    handleConversationAction('delete', selectedConversationMenu);
                  }
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="trash-outline" size={22} color="#E74C3C" />
                <Text style={[styles.actionModalItemText, styles.actionModalItemTextDanger]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  backButton: {
    padding: 4,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: '#0A1D37',
    letterSpacing: 0.5,
  },
  panelButton: {
    padding: 4,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 100,
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  userMessageWrapper: {
    justifyContent: 'flex-end',
  },
  aiMessageWrapper: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0A1D37',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  userAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  aiBubble: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: '#0A1D37',
    borderTopRightRadius: 4,
  },
  messageText: {
    fontSize: 15,
    fontFamily: FONTS.regular,
    lineHeight: 22,
    letterSpacing: 0.2,
  },
  aiMessageText: {
    color: '#1A1A1A',
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6D6D6D',
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    backgroundColor: 'transparent',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 28,
    paddingHorizontal: 4,
    paddingVertical: 4,
    shadowColor: '#0A1D37',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: FONTS.regular,
    color: '#1A1A1A',
    maxHeight: 100,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
    borderRadius: 24,
    marginRight: 4,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0A1D37',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0A1D37',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(232, 232, 232, 0.6)',
  },
  panelOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  panelBackdrop: {
    flex: 1,
  },
  panelContent: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '85%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    shadowColor: '#0A1D37',
    shadowOffset: {
      width: -2,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  panelTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: '#0A1D37',
    letterSpacing: 0.5,
  },
  panelCloseButton: {
    padding: 4,
  },
  newConversationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    gap: 12,
  },
  newConversationText: {
    fontSize: 16,
    fontFamily: FONTS.semiBold,
    color: '#0A1D37',
    letterSpacing: 0.3,
  },
  conversationsList: {
    flex: 1,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  conversationContent: {
    flex: 1,
  },
  conversationTitle: {
    fontSize: 16,
    fontFamily: FONTS.semiBold,
    color: '#0A1D37',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  conversationTimestamp: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: '#9B9B9B',
    letterSpacing: 0.2,
  },
  conversationMenuButton: {
    padding: 8,
    marginLeft: 8,
  },
  actionModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  actionModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: 200,
    shadowColor: '#0A1D37',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  actionModalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  actionModalDivider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginHorizontal: 0,
  },
  actionModalItemText: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: '#0A1D37',
    letterSpacing: 0.2,
  },
  actionModalItemTextDanger: {
    color: '#E74C3C',
  },
});

