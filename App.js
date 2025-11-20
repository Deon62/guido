import React, { useState } from 'react';
import { LandingScreen } from './src/screens/LandingScreen';
import { CitySelectionScreen } from './src/screens/CitySelectionScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { TripsScreen } from './src/screens/TripsScreen';
import { MessagesScreen } from './src/screens/MessagesScreen';
import { ChatScreen } from './src/screens/ChatScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [selectedCity, setSelectedCity] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedMessage, setSelectedMessage] = useState(null);

  const handleFindCityGuide = () => {
    setCurrentScreen('citySelection');
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setCurrentScreen('home');
  };

  const handleBack = () => {
    if (selectedMessage) {
      setSelectedMessage(null);
    } else if (currentScreen === 'citySelection') {
      setCurrentScreen('landing');
    } else if (currentScreen === 'home' && activeTab !== 'home') {
      setActiveTab('home');
    } else {
      setCurrentScreen('landing');
    }
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
        onSettingsPress={() => console.log('Settings pressed')}
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
      />
    );
  }

  return <LandingScreen onFindCityGuide={handleFindCityGuide} />;
}
