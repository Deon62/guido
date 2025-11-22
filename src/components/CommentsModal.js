import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TextInput, TouchableOpacity, Image, Platform, KeyboardAvoidingView, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONTS } from '../constants/fonts';

export const CommentsModal = ({ visible, post, onClose }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const scrollViewRef = useRef(null);

  // Mock comments data for the post
  useEffect(() => {
    if (visible && post) {
      // Initialize with mock comments if any
      const mockComments = [
        {
          id: '1',
          user: {
            name: 'Sarah Johnson',
            avatar: { uri: 'https://i.pravatar.cc/150?img=5' },
          },
          text: 'This looks amazing! I need to visit this place soon. 📸',
          timestamp: '2 hours ago',
        },
        {
          id: '2',
          user: {
            name: 'Mike Chen',
            avatar: { uri: 'https://i.pravatar.cc/150?img=12' },
          },
          text: 'Been there last month! The views are incredible.',
          timestamp: '5 hours ago',
        },
        {
          id: '3',
          user: {
            name: 'Emma Wilson',
            avatar: { uri: 'https://i.pravatar.cc/150?img=9' },
          },
          text: 'Great recommendation! Adding this to my travel list ✨',
          timestamp: '1 day ago',
        },
      ];
      setComments(mockComments);
    }
  }, [visible, post]);

  // Handle keyboard visibility
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
      // Scroll to bottom when keyboard appears
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleSendComment = () => {
    if (commentText.trim() === '') return;

    const newComment = {
      id: Date.now().toString(),
      user: {
        name: 'You',
        avatar: require('../../assets/profiles/ic.png'), // Current user avatar
      },
      text: commentText.trim(),
      timestamp: 'Just now',
    };

    setComments(prev => [newComment, ...prev]);
    setCommentText('');
    
    // Scroll to top to show new comment
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }, 100);
  };

  const handleClose = () => {
    setCommentText('');
    onClose();
  };

  if (!post) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Overlay */}
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={handleClose}
        />

        {/* Bottom Sheet */}
        <View style={[styles.bottomSheet, isKeyboardVisible && styles.bottomSheetKeyboardVisible]}>
          {/* Handle */}
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>

          {/* Post Preview Header */}
          <View style={styles.postPreview}>
            <View style={styles.postPreviewHeader}>
              <Image source={post.user.avatar} style={styles.postUserAvatar} />
              <View style={styles.postPreviewInfo}>
                <Text style={styles.postUserName} numberOfLines={1}>{post.user.name}</Text>
                <Text style={styles.postPlaceName} numberOfLines={1}>
                  {post.place.name} • {post.place.location}
                </Text>
              </View>
            </View>
            <Image source={post.image} style={styles.postPreviewImage} resizeMode="cover" />
            <Text style={styles.postPreviewCaption} numberOfLines={2}>
              {post.caption}
            </Text>
          </View>

          {/* Comments List */}
          <View style={styles.commentsHeader}>
            <Text style={styles.commentsTitle}>Comments</Text>
            <Text style={styles.commentsCount}>{comments.length}</Text>
          </View>

          <ScrollView
            ref={scrollViewRef}
            style={styles.commentsList}
            contentContainerStyle={styles.commentsListContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {comments.length === 0 ? (
              <View style={styles.emptyComments}>
                <Ionicons name="chatbubble-outline" size={48} color="#C0C0C0" />
                <Text style={styles.emptyCommentsText}>No comments yet</Text>
                <Text style={styles.emptyCommentsSubtext}>Be the first to comment!</Text>
              </View>
            ) : (
              comments.map((comment) => (
                <View key={comment.id} style={styles.commentItem}>
                  <Image source={comment.user.avatar} style={styles.commentAvatar} />
                  <View style={styles.commentContent}>
                    <View style={styles.commentBubble}>
                      <Text style={styles.commentUserName}>{comment.user.name}</Text>
                      <Text style={styles.commentText}>{comment.text}</Text>
                    </View>
                    <Text style={styles.commentTimestamp}>{comment.timestamp}</Text>
                  </View>
                </View>
              ))
            )}
          </ScrollView>

          {/* Input Area */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Add a comment..."
                placeholderTextColor="#9B9B9B"
                value={commentText}
                onChangeText={setCommentText}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={[styles.sendButton, commentText.trim() === '' && styles.sendButtonDisabled]}
                onPress={handleSendComment}
                activeOpacity={0.7}
                disabled={commentText.trim() === ''}
              >
                <Ionicons name="send" size={20} color={commentText.trim() === '' ? '#C0C0C0' : '#FFFFFF'} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    minHeight: '60%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  bottomSheetKeyboardVisible: {
    maxHeight: '90%',
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#E8E8E8',
    borderRadius: 2,
  },
  postPreview: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F7F7F7',
  },
  postPreviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  postUserAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  postPreviewInfo: {
    flex: 1,
  },
  postUserName: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
    color: '#1A1A1A',
    marginBottom: 2,
  },
  postPlaceName: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: '#6D6D6D',
  },
  postPreviewImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    marginBottom: 8,
  },
  postPreviewCaption: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: '#3A3A3A',
    lineHeight: 16,
  },
  commentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F7F7F7',
  },
  commentsTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: '#0A1D37',
    marginRight: 8,
    letterSpacing: 0.3,
  },
  commentsCount: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: '#6D6D6D',
  },
  commentsList: {
    flex: 1,
  },
  commentsListContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  emptyComments: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyCommentsText: {
    fontSize: 16,
    fontFamily: FONTS.semiBold,
    color: '#6D6D6D',
    marginTop: 16,
    marginBottom: 4,
  },
  emptyCommentsSubtext: {
    fontSize: 13,
    fontFamily: FONTS.regular,
    color: '#9B9B9B',
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentBubble: {
    backgroundColor: '#F7F7F7',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 4,
  },
  commentUserName: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
    color: '#1A1A1A',
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: '#3A3A3A',
    lineHeight: 20,
  },
  commentTimestamp: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: '#9B9B9B',
    marginLeft: 12,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 20 : 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F7F7F7',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: '#1A1A1A',
    maxHeight: 100,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0A1D37',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#E8E8E8',
  },
});

