import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Modal, FlatList, TextInput, TouchableOpacity, Image, Platform, KeyboardAvoidingView, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONTS } from '../constants/fonts';
import { usePagination } from '../utils/usePagination';
import { LoadMoreButton } from './LoadMoreButton';

export const CommentsModal = ({ visible, post, onClose }) => {
  const [userComments, setUserComments] = useState([]); // User's own comments
  const [commentText, setCommentText] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const scrollViewRef = useRef(null);

  // Generate mock comments data for the post
  const generateMockComments = useMemo(() => {
    if (!visible || !post) return [];
    
    const baseComments = [
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

    // Generate additional comments for pagination testing
    const users = [
      { name: 'Alex Brown', img: 13 },
      { name: 'Lisa Park', img: 14 },
      { name: 'David Lee', img: 15 },
      { name: 'Maria Garcia', img: 16 },
      { name: 'Tom Anderson', img: 17 },
      { name: 'Sophie Martin', img: 18 },
      { name: 'James Wilson', img: 19 },
      { name: 'Anna Taylor', img: 20 },
    ];

    const comments = [
      'Amazing photos! 📷',
      'I was there last summer, it\'s beautiful!',
      'Adding to my bucket list! ✨',
      'The best place I\'ve ever visited!',
      'Great recommendation, thanks!',
      'I need to go there ASAP!',
      'Looks incredible! 😍',
      'Been there, done that, loved it!',
    ];

    const additionalComments = [];
    for (let i = 4; i <= 20; i++) {
      const user = users[i % users.length];
      const comment = comments[i % comments.length];
      const hoursAgo = i * 2;
      const timestamp = hoursAgo < 24 
        ? `${hoursAgo} hours ago` 
        : `${Math.floor(hoursAgo / 24)} days ago`;

      additionalComments.push({
        id: String(i),
        user: {
          name: user.name,
          avatar: { uri: `https://i.pravatar.cc/150?img=${user.img}` },
        },
        text: comment,
        timestamp,
      });
    }

    return [...baseComments, ...additionalComments];
  }, [visible, post]);

  // Use pagination hook for comments
  const {
    displayedItems: paginatedComments,
    currentPage,
    totalPages,
    hasMore,
    isLoadingMore,
    loadMore,
    reset,
    totalItems,
    displayedCount,
  } = usePagination(generateMockComments, 10, 10); // 10 comments per page, initially show 10

  // Reset pagination when modal opens/closes or post changes
  useEffect(() => {
    if (visible && post) {
      reset();
      setUserComments([]);
    }
  }, [visible, post, reset]);

  // Combine user comments with paginated comments
  const allDisplayedComments = useMemo(() => {
    return [...userComments, ...paginatedComments];
  }, [userComments, paginatedComments]);

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

    setUserComments(prev => [newComment, ...prev]);
    setCommentText('');
    
    // Scroll to top to show new comment
    setTimeout(() => {
      scrollViewRef.current?.scrollToOffset({ offset: 0, animated: true });
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
          {/* Header with Close Button */}
          <View style={styles.headerContainer}>
            <View style={styles.commentsHeader}>
              <Text style={styles.commentsTitle}>Comments</Text>
              <Text style={styles.commentsCount}>{allDisplayedComments.length + (hasMore ? '+' : '')}</Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-down" size={24} color="#0A1D37" />
            </TouchableOpacity>
          </View>

          {allDisplayedComments.length === 0 && !hasMore ? (
            <View style={styles.emptyComments}>
              <Ionicons name="chatbubble-outline" size={48} color="#C0C0C0" />
              <Text style={styles.emptyCommentsText}>No comments yet</Text>
              <Text style={styles.emptyCommentsSubtext}>Be the first to comment!</Text>
            </View>
          ) : (
            <FlatList
              ref={scrollViewRef}
              data={allDisplayedComments}
              keyExtractor={(item) => item.id}
              renderItem={({ item: comment }) => (
                <View style={styles.commentItem}>
                  <Image source={comment.user.avatar} style={styles.commentAvatar} />
                  <View style={styles.commentContent}>
                    <View style={styles.commentBubble}>
                      <Text style={styles.commentUserName}>{comment.user.name}</Text>
                      <Text style={styles.commentText}>{comment.text}</Text>
                    </View>
                    <Text style={styles.commentTimestamp}>{comment.timestamp}</Text>
                  </View>
                </View>
              )}
              style={styles.commentsList}
              contentContainerStyle={styles.commentsListContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              inverted={false}
              onEndReached={() => {
                if (hasMore && !isLoadingMore) {
                  loadMore();
                }
              }}
              onEndReachedThreshold={0.5}
              ListFooterComponent={() => (
                <>
                  {hasMore && (
                    <LoadMoreButton
                      onPress={loadMore}
                      isLoading={isLoadingMore}
                      hasMore={hasMore}
                      text="Load More Comments"
                    />
                  )}
                  {!hasMore && allDisplayedComments.length > 0 && (
                    <View style={styles.endIndicator}>
                      <Text style={styles.endText}>All comments loaded</Text>
                    </View>
                  )}
                </>
              )}
            />
          )}

          {/* Input Area */}
          <View style={styles.inputContainer}>
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
    maxHeight: '90%',
    minHeight: '75%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  bottomSheetKeyboardVisible: {
    maxHeight: '95%',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F7F7F7',
  },
  commentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  commentsTitle: {
    fontSize: 16,
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
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 20 : 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: '#1A1A1A',
    maxHeight: 100,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F7F7F7',
    borderRadius: 20,
    marginRight: 8,
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
  endIndicator: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  endText: {
    fontSize: 13,
    fontFamily: FONTS.regular,
    color: '#9B9B9B',
  },
});

