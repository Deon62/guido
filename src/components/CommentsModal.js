import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Modal, FlatList, TextInput, TouchableOpacity, Image, Platform, KeyboardAvoidingView, Keyboard, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONTS } from '../constants/fonts';
import { usePagination } from '../utils/usePagination';
import { LoadMoreButton } from './LoadMoreButton';
import { createFeedPostComment, getFeedPostComments } from '../services/authService';
import { getToken } from '../utils/storage';
import { API_BASE_URL } from '../config/api';

export const CommentsModal = ({ visible, post, onClose }) => {
  const [userComments, setUserComments] = useState([]); // User's own comments
  const [commentText, setCommentText] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allComments, setAllComments] = useState([]);
  const scrollViewRef = useRef(null);

  // Format timestamp helper
  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      
      return date.toLocaleDateString();
    } catch (e) {
      return 'Just now';
    }
  };

  // Fetch comments from API
  useEffect(() => {
    const fetchComments = async () => {
      if (!visible || !post?.id) {
        return;
      }

      const token = getToken();
      if (!token) {
        return;
      }

      setIsLoadingComments(true);
      try {
        const commentsData = await getFeedPostComments(token, post.id);
        
        // Transform API response to UI format
        const transformedComments = commentsData.map(comment => ({
          id: comment.id?.toString() || Date.now().toString(),
          user: {
            name: comment.author_name || 'Unknown User',
            avatar: comment.author_profile_picture 
              ? { uri: comment.author_profile_picture.startsWith('http') 
                  ? comment.author_profile_picture 
                  : `${API_BASE_URL}/${comment.author_profile_picture}` }
              : '👤',
          },
          text: comment.content || '',
          timestamp: comment.created_at ? formatTimestamp(comment.created_at) : 'Just now',
        }));

        setAllComments(transformedComments);
      } catch (err) {
        console.error('Error fetching feed post comments:', err);
        Alert.alert('Error', 'Failed to load comments. Please try again.');
      } finally {
        setIsLoadingComments(false);
      }
    };

    fetchComments();
  }, [visible, post?.id]);

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
  } = usePagination(allComments, 10, 10); // 10 comments per page, initially show 10

  // Reset pagination when modal opens/closes or post changes
  useEffect(() => {
    if (visible && post) {
      reset();
      setUserComments([]);
      setCommentText('');
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

  const handleSendComment = async () => {
    if (commentText.trim() === '' || isSubmitting) return;

    if (!post?.id) {
      Alert.alert('Error', 'Post information is missing.');
      return;
    }

    const token = getToken();
    if (!token) {
      Alert.alert('Authentication Required', 'Please log in to comment.');
      return;
    }

    // Validate content length
    if (commentText.trim().length > 2000) {
      Alert.alert('Error', 'Comment must be 2000 characters or less.');
      return;
    }

    setIsSubmitting(true);

    try {
      const commentData = await createFeedPostComment(
        token,
        post.id,
        commentText.trim()
      );

      // Transform API response to UI format
      const newComment = {
        id: commentData.id?.toString() || Date.now().toString(),
        user: {
          name: commentData.author_name || 'You',
          avatar: commentData.author_profile_picture 
            ? { uri: commentData.author_profile_picture.startsWith('http') 
                ? commentData.author_profile_picture 
                : `${API_BASE_URL}/${commentData.author_profile_picture}` }
            : '👤',
        },
        text: commentData.content || commentText.trim(),
        timestamp: commentData.created_at ? formatTimestamp(commentData.created_at) : 'Just now',
      };

      // Add to user comments (shown at top) and refresh all comments
      setUserComments(prev => [newComment, ...prev]);
      setCommentText('');
      
      // Refresh comments from API to get updated list
      const commentsData = await getFeedPostComments(token, post.id);
      const transformedComments = commentsData.map(comment => ({
        id: comment.id?.toString() || Date.now().toString(),
        user: {
          name: comment.author_name || 'Unknown User',
          avatar: comment.author_profile_picture 
            ? { uri: comment.author_profile_picture.startsWith('http') 
                ? comment.author_profile_picture 
                : `${API_BASE_URL}/${comment.author_profile_picture}` }
            : '👤',
        },
        text: comment.content || '',
        timestamp: comment.created_at ? formatTimestamp(comment.created_at) : 'Just now',
      }));
      setAllComments(transformedComments);
      
      // Scroll to top to show new comment
      setTimeout(() => {
        scrollViewRef.current?.scrollToOffset({ offset: 0, animated: true });
      }, 100);
    } catch (err) {
      console.error('Error posting comment:', err);
      Alert.alert('Error', err.message || 'Failed to post comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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

          {isLoadingComments ? (
            <View style={styles.emptyComments}>
              <ActivityIndicator size="large" color="#0A1D37" />
              <Text style={styles.emptyCommentsText}>Loading comments...</Text>
            </View>
          ) : allDisplayedComments.length === 0 && !hasMore ? (
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
              renderItem={({ item: comment }) => {
                const safeCommentUser = comment.user || { name: 'Unknown User', avatar: '👤' };
                const avatarSource = typeof safeCommentUser.avatar === 'object' && safeCommentUser.avatar.uri
                  ? safeCommentUser.avatar
                  : null;
                
                return (
                  <View style={styles.commentItem}>
                    {avatarSource ? (
                      <Image source={avatarSource} style={styles.commentAvatar} />
                    ) : (
                      <View style={styles.commentAvatarPlaceholder}>
                        <Text style={styles.commentAvatarText}>
                          {typeof safeCommentUser.avatar === 'string' ? safeCommentUser.avatar : '👤'}
                        </Text>
                      </View>
                    )}
                    <View style={styles.commentContent}>
                      <View style={styles.commentBubble}>
                        <Text style={styles.commentUserName}>{safeCommentUser.name}</Text>
                        <Text style={styles.commentText}>{comment.text || ''}</Text>
                      </View>
                      <Text style={styles.commentTimestamp}>{comment.timestamp || ''}</Text>
                    </View>
                  </View>
                );
              }}
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
              maxLength={2000}
            />
            <TouchableOpacity
              style={[styles.sendButton, (commentText.trim() === '' || isSubmitting) && styles.sendButtonDisabled]}
              onPress={handleSendComment}
              activeOpacity={0.7}
              disabled={commentText.trim() === '' || isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons name="send" size={20} color={(commentText.trim() === '' || isSubmitting) ? '#C0C0C0' : '#FFFFFF'} />
              )}
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
  commentAvatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F7F7F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  commentAvatarText: {
    fontSize: 18,
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

