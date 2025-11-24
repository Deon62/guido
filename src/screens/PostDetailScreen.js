import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Platform, StatusBar as RNStatusBar, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, Alert, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { ErrorCard } from '../components/ErrorCard';
import { FONTS } from '../constants/fonts';
import { triggerHaptic } from '../utils/haptics';
import { createCommunityPostComment, getCommunityPostComments } from '../services/authService';
import { getToken } from '../utils/storage';
import { API_BASE_URL } from '../config/api';

export const PostDetailScreen = ({ post, community, comments: initialComments, onBack, onAddComment }) => {
  const [comments, setComments] = useState(initialComments || []);
  const [commentText, setCommentText] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const scrollViewRef = useRef(null);

  // Ensure post has required structure with defaults
  const safePost = post || {};
  const safeUser = safePost.user || { name: 'Unknown User', avatar: '👤' };
  const safePostData = {
    ...safePost,
    user: safeUser,
    title: safePost.title || '',
    content: safePost.content || '',
    timestamp: safePost.timestamp || '',
    upvotes: safePost.upvotes || 0,
    isUpvoted: safePost.isUpvoted || false,
  };

  // Ensure community has required structure with defaults
  const safeCommunity = community || {
    id: 'unknown',
    name: 'Community',
    description: '',
    members: 0,
  };

  // Handle keyboard visibility
  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardWillHide = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  // Fetch comments when component mounts or when post/community changes
  useEffect(() => {
    const fetchComments = async () => {
      if (!post?.id || !community?.id) {
        return;
      }

      const token = getToken();
      if (!token) {
        return;
      }

      setIsLoadingComments(true);
      setError(null);

      try {
        const commentsData = await getCommunityPostComments(token, community.id, post.id);
        
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

        setComments(transformedComments);
      } catch (err) {
        console.error('Error fetching comments:', err);
        setError('Failed to load comments. Please try again.');
      } finally {
        setIsLoadingComments(false);
      }
    };

    fetchComments();
  }, [post?.id, community?.id]);

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

  const handleSendComment = async () => {
    if (commentText.trim() === '' || isSubmitting) return;

    if (!post?.id || !community?.id) {
      Alert.alert('Error', 'Post or community information is missing.');
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
    setError(null);

    try {
      const commentData = await createCommunityPostComment(
        token,
        community.id,
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

      setComments(prev => [...prev, newComment]);
      setCommentText('');
      triggerHaptic('success');
      
      // Call the callback if provided
      if (onAddComment) {
        onAddComment(newComment);
      }
      
      // Scroll to bottom after adding comment
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (err) {
      setError(err.message || 'Failed to post comment. Please try again.');
      triggerHaptic('error');
      console.error('Error posting comment:', err);
      Alert.alert('Error', err.message || 'Failed to post comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const statusBarHeight = Platform.OS === 'ios' ? 44 : RNStatusBar.currentHeight || 0;

  // If post is missing, show error state
  if (!post) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <View style={[styles.header, { paddingTop: statusBarHeight + 12 }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#0A1D37" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Post Not Found</Text>
          </View>
        </View>
        <View style={styles.errorContainerFull}>
          <ErrorCard
            message="The post you're looking for couldn't be found. It may have been deleted or doesn't exist."
            onRetry={onBack}
          />
        </View>
      </View>
    );
  }

  // If community is missing, show error state
  if (!community) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <View style={[styles.header, { paddingTop: statusBarHeight + 12 }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#0A1D37" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Community Not Found</Text>
          </View>
        </View>
        <View style={styles.errorContainerFull}>
          <ErrorCard
            message="The community for this post couldn't be found. It may have been deleted or doesn't exist."
            onRetry={onBack}
          />
        </View>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <StatusBar style="dark" />
        
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
        >
        {/* Header */}
        <View style={[styles.header, { paddingTop: statusBarHeight + 12 }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#0A1D37" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Comments</Text>
            <Text style={styles.headerSubtitle}>{comments.length} {comments.length === 1 ? 'comment' : 'comments'}</Text>
          </View>
        </View>

        {/* Post Content */}
        <View style={styles.postContent}>
          <View style={styles.postHeader}>
            <View style={styles.postUserInfo}>
              <View style={styles.postAvatar}>
                {safePostData.user.avatar && typeof safePostData.user.avatar === 'object' && safePostData.user.avatar.uri ? (
                  <Image source={safePostData.user.avatar} style={styles.postAvatarImage} />
                ) : (
                  <Text style={styles.postAvatarText}>
                    {typeof safePostData.user.avatar === 'string' ? safePostData.user.avatar : '👤'}
                  </Text>
                )}
              </View>
              <View>
                <Text style={styles.postUserName}>{safePostData.user.name}</Text>
                <Text style={styles.postTimestamp}>{safePostData.timestamp}</Text>
              </View>
            </View>
          </View>
          <Text style={styles.postTitle}>{safePostData.title}</Text>
          <Text style={styles.postContentText}>{safePostData.content}</Text>
          <View style={styles.postActions}>
            <View style={styles.actionButton}>
              <Ionicons
                name={safePostData.isUpvoted ? 'arrow-up' : 'arrow-up-outline'}
                size={18}
                color={safePostData.isUpvoted ? '#0A1D37' : '#6D6D6D'}
              />
              <Text style={[styles.actionText, safePostData.isUpvoted && styles.actionTextActive]}>
                {formatNumber(safePostData.upvotes)}
              </Text>
            </View>
          </View>
        </View>

        {/* Comments List */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.commentsList}
          contentContainerStyle={styles.commentsListContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {error && (
            <View style={styles.errorContainer}>
              <ErrorCard
                message={error}
                onRetry={() => {
                  setError(null);
                  // Refetch comments
                  const token = getToken();
                  if (token && post?.id && community?.id) {
                    getCommunityPostComments(token, community.id, post.id)
                      .then(commentsData => {
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
                        setComments(transformedComments);
                      })
                      .catch(err => console.error('Error refetching comments:', err));
                  }
                }}
              />
            </View>
          )}
          {isLoadingComments ? (
            <View style={styles.emptyComments}>
              <Text style={styles.emptyCommentsText}>Loading comments...</Text>
            </View>
          ) : comments.length === 0 ? (
            <View style={styles.emptyComments}>
              <Ionicons name="chatbubble-outline" size={48} color="#C0C0C0" />
              <Text style={styles.emptyCommentsText}>No comments yet</Text>
              <Text style={styles.emptyCommentsSubtext}>Be the first to comment!</Text>
            </View>
          ) : (
            comments.map((comment) => {
              const safeCommentUser = comment.user || { name: 'Unknown User', avatar: '👤' };
              const avatarSource = typeof safeCommentUser.avatar === 'object' && safeCommentUser.avatar.uri
                ? safeCommentUser.avatar
                : null;
              
              return (
                <View key={comment.id} style={styles.commentItem}>
                  <View style={styles.commentAvatar}>
                    {avatarSource ? (
                      <Image source={avatarSource} style={styles.commentAvatarImage} />
                    ) : (
                      <Text style={styles.commentAvatarText}>
                        {typeof safeCommentUser.avatar === 'string' ? safeCommentUser.avatar : '👤'}
                      </Text>
                    )}
                  </View>
                  <View style={styles.commentContent}>
                    <View style={styles.commentBubble}>
                      <Text style={styles.commentUserName}>{safeCommentUser.name}</Text>
                      <Text style={styles.commentText}>{comment.text || ''}</Text>
                    </View>
                    <Text style={styles.commentTimestamp}>{comment.timestamp || ''}</Text>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>

        {/* Floating Input Area */}
        <View style={[styles.floatingInputContainer, isKeyboardVisible && styles.floatingInputContainerKeyboard]}>
          <View style={styles.commentInputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Add a comment..."
              placeholderTextColor="#9B9B9B"
              value={commentText}
              onChangeText={setCommentText}
              multiline
              maxLength={2000}
              returnKeyType="done"
              blurOnSubmit={true}
              onSubmitEditing={Keyboard.dismiss}
            />
            <Text style={styles.commentCharacterCount}>
              {commentText.length} / 2000
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.sendButton, (commentText.trim() === '' || isSubmitting) && styles.sendButtonDisabled]}
            onPress={handleSendComment}
            activeOpacity={0.7}
            disabled={commentText.trim() === '' || isSubmitting}
          >
            <Ionicons name="send" size={20} color={(commentText.trim() === '' || isSubmitting) ? '#C0C0C0' : '#FFFFFF'} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: '#0A1D37',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: '#6D6D6D',
  },
  postContent: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    marginBottom: 8,
  },
  postHeader: {
    marginBottom: 12,
  },
  postUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F7F7F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  postAvatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  postAvatarText: {
    fontSize: 18,
  },
  postUserName: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    color: '#0A1D37',
    marginBottom: 2,
  },
  postTimestamp: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: '#9B9B9B',
  },
  postTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: '#0A1D37',
    marginBottom: 10,
    lineHeight: 26,
  },
  postContentText: {
    fontSize: 15,
    fontFamily: FONTS.regular,
    color: '#3A3A3A',
    lineHeight: 22,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F7F7F7',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: '#6D6D6D',
  },
  actionTextActive: {
    color: '#0A1D37',
    fontFamily: FONTS.semiBold,
  },
  commentsList: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  commentsListContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 150,
  },
  emptyComments: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
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
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  commentAvatarText: {
    fontSize: 18,
  },
  commentAvatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  commentContent: {
    flex: 1,
  },
  commentBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  commentUserName: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
    color: '#0A1D37',
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
    marginLeft: 14,
  },
  floatingInputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    backgroundColor: 'transparent',
  },
  floatingInputContainerKeyboard: {
    backgroundColor: 'transparent',
  },
  commentInputWrapper: {
    flex: 1,
    position: 'relative',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: '#1A1A1A',
    maxHeight: 100,
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingBottom: 28,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  commentCharacterCount: {
    position: 'absolute',
    bottom: 8,
    right: 12,
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: '#9B9B9B',
    letterSpacing: 0.2,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0A1D37',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#E8E8E8',
  },
  errorContainer: {
    padding: 16,
    paddingTop: 20,
  },
  errorContainerFull: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
});

