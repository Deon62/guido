import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { LandingScreen } from './src/screens/LandingScreen';
import { CitySelectionScreen } from './src/screens/CitySelectionScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { TripsScreen } from './src/screens/TripsScreen';
import { MessagesScreen } from './src/screens/MessagesScreen';
import { ChatScreen } from './src/screens/ChatScreen';
import { HotspotsScreen } from './src/screens/HotspotsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { NotificationsScreen } from './src/screens/NotificationsScreen';
import { AboutDeveloperScreen } from './src/screens/AboutDeveloperScreen';
import { NotificationPreferencesScreen } from './src/screens/NotificationPreferencesScreen';
import { LanguageScreen } from './src/screens/LanguageScreen';
import { GuideDetailsScreen } from './src/screens/GuideDetailsScreen';
import { BookingOptionsScreen } from './src/screens/BookingOptionsScreen';
import { BookingSuccessScreen } from './src/screens/BookingSuccessScreen';
import { HelpSupportScreen } from './src/screens/HelpSupportScreen';
import { TermsScreen } from './src/screens/TermsScreen';
import { PrivacyScreen } from './src/screens/PrivacyScreen';
import { EditProfileScreen } from './src/screens/EditProfileScreen';
import { ConfirmationModal } from './src/components/ConfirmationModal';
import { ProfilePictureSelectorScreen } from './src/screens/ProfilePictureSelectorScreen';
import { GuideRegistrationScreen } from './src/screens/GuideRegistrationScreen';
import { GuideHomeScreen } from './src/screens/GuideHomeScreen';
import { GuideProfileScreen } from './src/screens/GuideProfileScreen';
import { GuideBookingDetailsScreen } from './src/screens/GuideBookingDetailsScreen';
import { GuideBookingActionSuccessScreen } from './src/screens/GuideBookingActionSuccessScreen';
import { UserRateGuideScreen } from './src/screens/UserRateGuideScreen';
import { GuideRateClientScreen } from './src/screens/GuideRateClientScreen';
import { GuideVerificationScreen } from './src/screens/GuideVerificationScreen';
import { GuideBottomNavBar } from './src/components/GuideBottomNavBar';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [selectedCity, setSelectedCity] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAboutDeveloper, setShowAboutDeveloper] = useState(false);
  const [showNotificationPreferences, setShowNotificationPreferences] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [showBookingOptions, setShowBookingOptions] = useState(false);
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [showHelpSupport, setShowHelpSupport] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteAccountConfirm, setShowDeleteAccountConfirm] = useState(false);
  const [showProfilePictureSelector, setShowProfilePictureSelector] = useState(false);
  const [profilePictureContext, setProfilePictureContext] = useState(null); // 'profile' or 'edit'
  const [showGuideRegistration, setShowGuideRegistration] = useState(false);
  const [isGuide, setIsGuide] = useState(false);
  const [guideActiveTab, setGuideActiveTab] = useState('home');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingActionSuccess, setShowBookingActionSuccess] = useState(false);
  const [bookingAction, setBookingAction] = useState(null); // 'accepted' or 'rejected'
  const [selectedTripForRating, setSelectedTripForRating] = useState(null);
  const [selectedBookingForRating, setSelectedBookingForRating] = useState(null);
  const [showGuideVerification, setShowGuideVerification] = useState(false);
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    city: 'New York',
    location: 'New York, USA',
    avatar: require('./assets/profiles/ic.png'),
  });

  const handleFindCityGuide = () => {
    setCurrentScreen('citySelection');
  };

  const handleRegisterAsGuide = () => {
    setShowGuideRegistration(true);
  };

  const handleGuideRegistrationSubmit = (formData) => {
    console.log('Guide registration submitted:', formData);
    // TODO: Handle guide registration submission
    setIsGuide(true);
    setShowGuideRegistration(false);
    setCurrentScreen('guideHome');
  };

  const handleGuideTabChange = (tab) => {
    setGuideActiveTab(tab);
  };

  const handleBookingPress = (booking) => {
    setSelectedBooking(booking);
  };

  const handleBookingAccept = (booking) => {
    setBookingAction('accepted');
    setShowBookingActionSuccess(true);
    // Keep selectedBooking for success screen display
  };

  const handleBookingReject = (booking) => {
    setBookingAction('rejected');
    setShowBookingActionSuccess(true);
    // Keep selectedBooking for success screen display
  };

  const handleBookingActionSuccessDone = () => {
    setShowBookingActionSuccess(false);
    setBookingAction(null);
    setSelectedBooking(null);
    // Optionally refresh booking list or update status
  };

  const handleRateGuidePress = (trip) => {
    console.log('Rate guide pressed for trip:', trip);
    setSelectedTripForRating(trip);
  };

  const handleRateClientPress = (booking) => {
    setSelectedBookingForRating(booking);
  };

  const handleRatingSubmit = (ratingData) => {
    console.log('Rating submitted:', ratingData);
    // TODO: Submit rating to backend
    setSelectedTripForRating(null);
    setSelectedBookingForRating(null);
  };

  const handleGetBadgePress = () => {
    console.log('Get Badge pressed');
    setShowGuideVerification(true);
  };

  const handleVerificationSubmit = (verificationData) => {
    console.log('Verification submitted:', verificationData);
    // TODO: Handle verification submission and payment
    setShowGuideVerification(false);
    // TODO: Update guide's verified status
    Alert.alert('Verification Submitted', 'Your verification request has been submitted. You will receive your badge once approved.');
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setCurrentScreen('home');
  };

  const handleBack = () => {
    if (showGuideVerification) {
      setShowGuideVerification(false);
    } else if (selectedTripForRating) {
      setSelectedTripForRating(null);
    } else if (selectedBookingForRating) {
      setSelectedBookingForRating(null);
    } else if (showBookingActionSuccess) {
      handleBookingActionSuccessDone();
    } else if (selectedBooking) {
      setSelectedBooking(null);
    } else if (isGuide && currentScreen === 'guideHome' && selectedMessage) {
      setSelectedMessage(null);
    } else if (isGuide && currentScreen === 'guideHome' && guideActiveTab !== 'home') {
      setGuideActiveTab('home');
    } else if (showGuideRegistration) {
      setShowGuideRegistration(false);
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
    } else if (showBookingSuccess) {
      handleBookingSuccessBack();
    } else if (showBookingOptions) {
      setShowBookingOptions(false);
    } else if (selectedGuide) {
      setSelectedGuide(null);
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
    } else if (currentScreen === 'citySelection') {
      setCurrentScreen('landing');
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

  const handleGuidePress = (guide) => {
    setSelectedGuide(guide);
  };

  const handleRequestGuide = (guide) => {
    setShowBookingOptions(true);
  };

  const handleBookingOptionSelect = (bookingOption) => {
    console.log('Booking request:', {
      guide: selectedGuide?.name,
      option: bookingOption,
    });
    // TODO: Handle booking submission
    setBookingDetails({
      guide: selectedGuide,
      bookingOption: bookingOption,
    });
    setShowBookingOptions(false);
    setShowBookingSuccess(true);
  };

  const handleBookingSuccessBack = () => {
    setShowBookingSuccess(false);
    setSelectedGuide(null);
    setBookingDetails(null);
  };

  const handleBookingOptionsBack = () => {
    setShowBookingOptions(false);
  };

  const handleNotificationsPress = () => {
    setShowNotifications(true);
  };

  const handleSettingsPress = () => {
    setShowSettings(true);
  };

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

  // Show booking success screen
  if (showBookingSuccess && bookingDetails) {
    return (
      <BookingSuccessScreen
        guide={bookingDetails.guide}
        bookingOption={bookingDetails.bookingOption}
        onBack={handleBookingSuccessBack}
      />
    );
  }

  // Show booking options screen
  if (showBookingOptions && selectedGuide) {
    return (
      <BookingOptionsScreen
        guide={selectedGuide}
        onBack={handleBookingOptionsBack}
        onSelect={handleBookingOptionSelect}
      />
    );
  }

  // Show guide details screen
  if (selectedGuide) {
    return (
      <GuideDetailsScreen
        guide={selectedGuide}
        onBack={handleBack}
        onRequestGuide={handleRequestGuide}
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

  if (currentScreen === 'citySelection') {
    return (
      <CitySelectionScreen
        onCitySelect={handleCitySelect}
        onBack={handleBack}
      />
    );
  }

  // Show user rate guide screen (must be before trips screen check)
  if (selectedTripForRating && !isGuide) {
    return (
      <UserRateGuideScreen
        trip={selectedTripForRating}
        onBack={handleBack}
        onSubmit={handleRatingSubmit}
      />
    );
  }

  // Show guide rate client screen (must be before guide home screen check)
  if (selectedBookingForRating && isGuide) {
    return (
      <GuideRateClientScreen
        booking={selectedBookingForRating}
        onBack={handleBack}
        onSubmit={handleRatingSubmit}
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
        onRatePress={handleRateGuidePress}
      />
    );
  }

  // Show messages screen when messages tab is active
  if (currentScreen === 'home' && activeTab === 'messages') {
    return (
      <MessagesScreen
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onMessagePress={handleMessagePress}
      />
    );
  }

  // Show profile screen when profile tab is active
  if (currentScreen === 'home' && activeTab === 'hotspots') {
    return (
      <HotspotsScreen
        selectedCity={selectedCity}
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
        onGuidePress={handleGuidePress}
      />
    );
  }


  // Show guide booking action success screen
  if (showBookingActionSuccess && bookingAction) {
    // Store booking before clearing selectedBooking
    const bookingForSuccess = selectedBooking;
    return (
      <GuideBookingActionSuccessScreen
        action={bookingAction}
        booking={bookingForSuccess}
        onDone={handleBookingActionSuccessDone}
      />
    );
  }

  // Show guide booking details screen
  if (selectedBooking && isGuide) {
    return (
      <GuideBookingDetailsScreen
        booking={selectedBooking}
        onBack={handleBack}
        onAccept={handleBookingAccept}
        onReject={handleBookingReject}
      />
    );
  }

  // Show guide chat screen (when a message is opened)
  if (isGuide && currentScreen === 'guideHome' && selectedMessage) {
    return (
      <ChatScreen
        message={selectedMessage}
        onBack={handleChatBack}
      />
    );
  }

  // Show guide home screen if user is a guide
  if (isGuide && currentScreen === 'guideHome') {
    // Check for verification screen first (before any tab screens)
    if (showGuideVerification) {
      return (
        <GuideVerificationScreen
          onBack={handleBack}
          onSubmit={handleVerificationSubmit}
        />
      );
    }
    
    if (guideActiveTab === 'messages') {
      return (
        <View style={{ flex: 1 }}>
          <MessagesScreen
            activeTab={guideActiveTab}
            onTabChange={handleGuideTabChange}
            onMessagePress={handleMessagePress}
            hideBottomNav={true}
          />
          <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
            <GuideBottomNavBar activeTab={guideActiveTab} onTabChange={handleGuideTabChange} />
          </View>
        </View>
      );
    }
    
    if (guideActiveTab === 'notifications') {
      return (
        <View style={{ flex: 1 }}>
          <NotificationsScreen onBack={() => setGuideActiveTab('home')} />
          <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
            <GuideBottomNavBar activeTab={guideActiveTab} onTabChange={handleGuideTabChange} />
          </View>
        </View>
      );
    }
    
    if (guideActiveTab === 'profile') {
      return (
        <View style={{ flex: 1 }}>
          <GuideProfileScreen
            activeTab={guideActiveTab}
            onTabChange={handleGuideTabChange}
            onSettingsPress={handleSettingsPress}
            onHelpSupportPress={handleHelpSupportPress}
            onTermsPrivacyPress={handleTermsPrivacyPress}
            onEditProfilePress={handleEditProfilePress}
            onLogoutPress={() => {
              setIsGuide(false);
              setCurrentScreen('landing');
            }}
            onProfilePicturePress={() => handleProfilePicturePress('profile')}
            onGetBadgePress={handleGetBadgePress}
            user={userData}
            hideBottomNav={true}
          />
          <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
            <GuideBottomNavBar activeTab={guideActiveTab} onTabChange={handleGuideTabChange} />
          </View>
        </View>
      );
    }
    
    // Default: Guide Home (bookings)
    return (
      <GuideHomeScreen
        activeTab={guideActiveTab}
        onTabChange={handleGuideTabChange}
        onMessagesPress={() => setGuideActiveTab('messages')}
        onNotificationsPress={() => setGuideActiveTab('notifications')}
        onProfilePress={() => setGuideActiveTab('profile')}
        onBookingPress={handleBookingPress}
        onRateClientPress={handleRateClientPress}
      />
    );
  }

  // Show guide registration screen
  if (showGuideRegistration) {
    return (
      <GuideRegistrationScreen
        onBack={handleBack}
        onSubmit={handleGuideRegistrationSubmit}
      />
    );
  }

  return <LandingScreen onFindCityGuide={handleFindCityGuide} onRegisterAsGuide={handleRegisterAsGuide} />;
}
