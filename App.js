import React, { useState, useEffect } from 'react';
import { View, Alert } from 'react-native';
import { useFonts } from 'expo-font';
import { Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { LandingScreen } from './src/screens/LandingScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { TripsScreen } from './src/screens/TripsScreen';
import { AddPastTripScreen } from './src/screens/AddPastTripScreen';
import { AddTripSuccessScreen } from './src/screens/AddTripSuccessScreen';
import { AIRecommendationsScreen } from './src/screens/AIRecommendationsScreen';
import { MessagesScreen } from './src/screens/MessagesScreen';
import { FeedScreen } from './src/screens/FeedScreen';
import { AddFeedPostScreen } from './src/screens/AddFeedPostScreen';
import { AddFeedPostSuccessScreen } from './src/screens/AddFeedPostSuccessScreen';
import { ChatScreen } from './src/screens/ChatScreen';
import { CommunitiesScreen } from './src/screens/CommunitiesScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { NotificationsScreen } from './src/screens/NotificationsScreen';
import { AboutDeveloperScreen } from './src/screens/AboutDeveloperScreen';
import { NotificationPreferencesScreen } from './src/screens/NotificationPreferencesScreen';
import { LanguageScreen } from './src/screens/LanguageScreen';
import { HelpSupportScreen } from './src/screens/HelpSupportScreen';
import { TermsScreen } from './src/screens/TermsScreen';
import { PrivacyScreen } from './src/screens/PrivacyScreen';
import { EditProfileScreen } from './src/screens/EditProfileScreen';
import { ConfirmationModal } from './src/components/ConfirmationModal';
import { ProfilePictureSelectorScreen } from './src/screens/ProfilePictureSelectorScreen';

export default function App() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });

  const [currentScreen, setCurrentScreen] = useState('landing');
  const [selectedCity, setSelectedCity] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAboutDeveloper, setShowAboutDeveloper] = useState(false);
  const [showNotificationPreferences, setShowNotificationPreferences] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showHelpSupport, setShowHelpSupport] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteAccountConfirm, setShowDeleteAccountConfirm] = useState(false);
  const [showProfilePictureSelector, setShowProfilePictureSelector] = useState(false);
  const [profilePictureContext, setProfilePictureContext] = useState(null); // 'profile' or 'edit'
  const [showAddPastTrip, setShowAddPastTrip] = useState(false);
  const [showAddTripSuccess, setShowAddTripSuccess] = useState(false);
  const [savedTripData, setSavedTripData] = useState(null);
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  const [aiRecommendationData, setAIRecommendationData] = useState(null);
  const [showAddFeedPost, setShowAddFeedPost] = useState(false);
  const [showAddFeedPostSuccess, setShowAddFeedPostSuccess] = useState(false);
  const [savedFeedPostData, setSavedFeedPostData] = useState(null);
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    city: 'New York',
    location: 'New York, USA',
    avatar: require('./assets/profiles/ic.png'),
  });

  const handleFindCityGuide = () => {
    setCurrentScreen('home');
  };

  const handleBack = () => {
    if (showAddFeedPostSuccess) {
      handleAddFeedPostSuccessBack();
    } else if (showAddFeedPost) {
      setShowAddFeedPost(false);
    } else if (showAIRecommendations) {
      setShowAIRecommendations(false);
      setAIRecommendationData(null);
    } else if (showAddTripSuccess) {
      handleAddTripSuccessBack();
    } else if (showAddPastTrip) {
      setShowAddPastTrip(false);
    } else if (showProfilePictureSelector) {
      setShowProfilePictureSelector(false);
      setProfilePictureContext(null);
    } else if (showEditProfile) {
      setShowEditProfile(false);
    } else if (showPrivacy) {
      setShowPrivacy(false);
    } else if (showTerms) {
      setShowTerms(false);
    } else if (showHelpSupport) {
      setShowHelpSupport(false);
    } else if (showLanguage) {
      setShowLanguage(false);
    } else if (showNotificationPreferences) {
      setShowNotificationPreferences(false);
    } else if (showAboutDeveloper) {
      setShowAboutDeveloper(false);
    } else if (showNotifications) {
      setShowNotifications(false);
    } else if (showSettings) {
      setShowSettings(false);
    } else if (selectedMessage) {
      setSelectedMessage(null);
    } else if (currentScreen === 'home' && activeTab !== 'home') {
      setActiveTab('home');
    } else {
      setCurrentScreen('landing');
    }
  };

  const handleAboutDeveloperPress = () => {
    setShowAboutDeveloper(true);
  };

  const handleNotificationPreferencesPress = () => {
    setShowNotificationPreferences(true);
  };

  const handleLanguagePress = () => {
    setShowLanguage(true);
  };

  const handlePlacePress = (place) => {
    // Place selected - navigation to place details will be implemented later
    console.log('Place selected:', place.name);
    // TODO: Navigate to place details screen
    setSelectedPlace(place);
  };

  const handleAddTripPress = () => {
    setShowAddPastTrip(true);
  };

  const handleAddTripSave = (tripData) => {
    console.log('Trip saved:', tripData);
    // TODO: Save trip to database/state
    setSavedTripData(tripData);
    setShowAddPastTrip(false);
    setShowAddTripSuccess(true);
  };

  const handleAIRecommend = (tripData) => {
    console.log('AI Recommend requested with data:', tripData);
    setAIRecommendationData(tripData);
    setShowAIRecommendations(true);
  };

  const handleAddTripSuccessBack = () => {
    setShowAddTripSuccess(false);
    setSavedTripData(null);
  };

  const handleAddFeedPostPress = () => {
    setShowAddFeedPost(true);
  };

  const handleAddFeedPostSave = (postData) => {
    console.log('Feed post saved:', postData);
    // TODO: Save post to database/state
    setSavedFeedPostData(postData);
    setShowAddFeedPost(false);
    setShowAddFeedPostSuccess(true);
  };

  const handleAddFeedPostSuccessBack = () => {
    setShowAddFeedPostSuccess(false);
    setSavedFeedPostData(null);
  };

  const handleNotificationsPress = () => {
    setShowNotifications(true);
  };

  const handleSettingsPress = () => {
    setShowSettings(true);
  };

  // Wait for fonts to load before rendering
  if (!fontsLoaded) {
    return null;
  }

  const handleHelpSupportPress = () => {
    setShowHelpSupport(true);
  };

  const handleTermsPrivacyPress = () => {
    setShowTerms(true);
  };

  const handleTermsBack = () => {
    setShowTerms(false);
    setShowHelpSupport(true);
  };

  const handleEditProfilePress = () => {
    setShowEditProfile(true);
  };

  const handleSaveProfile = (formData) => {
    setUserData({
      ...userData,
      ...formData,
      location: formData.city ? `${formData.city}, USA` : userData.location,
    });
    console.log('Profile saved:', formData);
  };

  const handleProfilePicturePress = (context) => {
    setProfilePictureContext(context);
    setShowProfilePictureSelector(true);
  };

  const handleProfilePictureSelect = (image) => {
    setUserData({
      ...userData,
      avatar: image,
    });
    setShowProfilePictureSelector(false);
    setProfilePictureContext(null);
    console.log('Profile picture updated');
  };

  const handleLogoutPress = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutConfirm(false);
    console.log('User logged out');
    // TODO: Handle logout logic (clear session, redirect to landing, etc.)
    setCurrentScreen('landing');
    setActiveTab('home');
  };

  const handleDeleteAccountPress = () => {
    setShowDeleteAccountConfirm(true);
  };

  const handleDeleteAccountConfirm = () => {
    setShowDeleteAccountConfirm(false);
    console.log('Account deleted');
    // TODO: Handle account deletion logic
    setCurrentScreen('landing');
    setActiveTab('home');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    
    // Only navigate if we're already in the main app (not on landing or city selection)
    if (currentScreen === 'home') {
      // Tab changes are handled by showing different screens
      // TripsScreen, MessagesScreen and HomeScreen will be shown based on activeTab
    }
    
    console.log('Tab changed to:', tab);
  };

  const handleMessagePress = (message) => {
    setSelectedMessage(message);
  };

  const handleChatBack = () => {
    setSelectedMessage(null);
  };

  // Show profile picture selector screen
  if (showProfilePictureSelector) {
    return (
      <ProfilePictureSelectorScreen
        currentAvatar={userData.avatar}
        onBack={handleBack}
        onSelect={handleProfilePictureSelect}
      />
    );
  }

  // Show edit profile screen
  if (showEditProfile) {
    return (
      <EditProfileScreen
        user={userData}
        onBack={handleBack}
        onSave={handleSaveProfile}
        onProfilePicturePress={() => handleProfilePicturePress('edit')}
        currentAvatar={userData.avatar}
      />
    );
  }

  // Show privacy screen
  if (showPrivacy) {
    return (
      <PrivacyScreen
        onBack={handleBack}
        onTermsPress={() => {
          setShowPrivacy(false);
          setShowTerms(true);
        }}
      />
    );
  }

  // Show terms screen
  if (showTerms) {
    return (
      <TermsScreen
        onBack={handleBack}
        onPrivacyPress={() => {
          setShowTerms(false);
          setShowPrivacy(true);
        }}
      />
    );
  }

  // Show help & support screen
  if (showHelpSupport) {
    return (
      <HelpSupportScreen
        onBack={handleBack}
        onTermsPress={() => {
          setShowHelpSupport(false);
          setShowTerms(true);
        }}
        onPrivacyPress={() => {
          setShowHelpSupport(false);
          setShowPrivacy(true);
        }}
      />
    );
  }


  // Show language screen
  if (showLanguage) {
    return (
      <LanguageScreen
        onBack={handleBack}
      />
    );
  }

  // Show notification preferences screen
  if (showNotificationPreferences) {
    return (
      <NotificationPreferencesScreen
        onBack={handleBack}
      />
    );
  }

  // Show about developer screen
  if (showAboutDeveloper) {
    return (
      <AboutDeveloperScreen
        onBack={handleBack}
      />
    );
  }

  // Show notifications screen
  if (showNotifications) {
    return (
      <NotificationsScreen
        onBack={handleBack}
      />
    );
  }

  // Show settings screen
  if (showSettings) {
    return (
      <>
        <SettingsScreen
          onBack={handleBack}
          onAboutDeveloperPress={handleAboutDeveloperPress}
          onNotificationPreferencesPress={handleNotificationPreferencesPress}
          onLanguagePress={handleLanguagePress}
          onDeleteAccountPress={handleDeleteAccountPress}
        />
        
        {/* Delete Account Confirmation Modal */}
        <ConfirmationModal
          visible={showDeleteAccountConfirm}
          title="Delete Account"
          message="Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted."
          confirmText="Delete"
          cancelText="Cancel"
          danger={true}
          onConfirm={handleDeleteAccountConfirm}
          onCancel={() => setShowDeleteAccountConfirm(false)}
        />
      </>
    );
  }

  // Show chat screen when a message is selected
  if (selectedMessage) {
    return (
      <ChatScreen
        message={selectedMessage}
        onBack={handleChatBack}
      />
    );
  }

  // Show add trip success screen
  if (showAddTripSuccess && savedTripData) {
    return (
      <AddTripSuccessScreen
        tripData={savedTripData}
        onBack={handleAddTripSuccessBack}
      />
    );
  }

  // Show add feed post success screen
  if (showAddFeedPostSuccess && savedFeedPostData) {
    return (
      <AddFeedPostSuccessScreen
        postData={savedFeedPostData}
        onBack={handleBack}
      />
    );
  }

  // Show add feed post screen
  if (showAddFeedPost) {
    return (
      <AddFeedPostScreen
        onBack={handleBack}
        onSave={handleAddFeedPostSave}
      />
    );
  }

  // Show add past trip screen
  if (showAddPastTrip) {
    return (
      <AddPastTripScreen
        onBack={handleBack}
        onSave={handleAddTripSave}
      />
    );
  }

  // Show AI recommendations screen
  if (showAIRecommendations && aiRecommendationData) {
    return (
      <AIRecommendationsScreen
        tripData={aiRecommendationData}
        onBack={handleBack}
        onPlacePress={handlePlacePress}
      />
    );
  }

  // Show trips screen when trips tab is active
  if (currentScreen === 'home' && activeTab === 'trips') {
    return (
      <TripsScreen
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onNotificationsPress={handleNotificationsPress}
        onAddTripPress={handleAddTripPress}
        onAIRecommend={handleAIRecommend}
      />
    );
  }

  // Show messages screen when messages tab is active
  if (currentScreen === 'home' && activeTab === 'feed') {
    return (
      <FeedScreen
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onAddPostPress={handleAddFeedPostPress}
      />
    );
  }

  // Show communities screen when communities tab is active
  if (currentScreen === 'home' && activeTab === 'communities') {
    return (
      <CommunitiesScreen
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
    );
  }

  if (currentScreen === 'home' && activeTab === 'profile') {
    return (
      <>
        <ProfileScreen
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onSettingsPress={handleSettingsPress}
          onHelpSupportPress={handleHelpSupportPress}
          onTermsPrivacyPress={handleTermsPrivacyPress}
          onEditProfilePress={handleEditProfilePress}
          onLogoutPress={handleLogoutPress}
          onProfilePicturePress={() => handleProfilePicturePress('profile')}
          user={userData}
        />
        
        {/* Logout Confirmation Modal */}
        <ConfirmationModal
          visible={showLogoutConfirm}
          title="Logout"
          message="Are you sure you want to logout? You'll need to sign in again to access your account."
          confirmText="Logout"
          cancelText="Cancel"
          onConfirm={handleLogoutConfirm}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      </>
    );
  }

  // Show home screen when home tab is active
  if (currentScreen === 'home' && activeTab === 'home') {
    return (
      <HomeScreen
        selectedCity={selectedCity}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onNotificationsPress={handleNotificationsPress}
        onPlacePress={handlePlacePress}
      />
    );
  }


  return <LandingScreen onFindCityGuide={handleFindCityGuide} />;
}
