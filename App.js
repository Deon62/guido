import React, { useState } from 'react';
import { LandingScreen } from './src/screens/LandingScreen';
import { CitySelectionScreen } from './src/screens/CitySelectionScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { TripsScreen } from './src/screens/TripsScreen';
import { MessagesScreen } from './src/screens/MessagesScreen';
import { ChatScreen } from './src/screens/ChatScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { NotificationsScreen } from './src/screens/NotificationsScreen';
import { AboutDeveloperScreen } from './src/screens/AboutDeveloperScreen';
import { NotificationPreferencesScreen } from './src/screens/NotificationPreferencesScreen';
import { LanguageScreen } from './src/screens/LanguageScreen';
import { GuideDetailsScreen } from './src/screens/GuideDetailsScreen';
import { BookingOptionsScreen } from './src/screens/BookingOptionsScreen';
import { BookingSuccessScreen } from './src/screens/BookingSuccessScreen';

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

  const handleFindCityGuide = () => {
    setCurrentScreen('citySelection');
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setCurrentScreen('home');
  };

  const handleBack = () => {
    if (showBookingSuccess) {
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
      <SettingsScreen
        onBack={handleBack}
        onAboutDeveloperPress={handleAboutDeveloperPress}
        onNotificationPreferencesPress={handleNotificationPreferencesPress}
        onLanguagePress={handleLanguagePress}
      />
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

  // Show trips screen when trips tab is active
  if (currentScreen === 'home' && activeTab === 'trips') {
    return (
      <TripsScreen
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onNotificationsPress={handleNotificationsPress}
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
  if (currentScreen === 'home' && activeTab === 'profile') {
    return (
      <ProfileScreen
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onSettingsPress={handleSettingsPress}
      />
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

  return <LandingScreen onFindCityGuide={handleFindCityGuide} />;
}
