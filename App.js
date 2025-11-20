import React, { useState } from 'react';
import { LandingScreen } from './src/screens/LandingScreen';
import { CitySelectionScreen } from './src/screens/CitySelectionScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { TripsScreen } from './src/screens/TripsScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [selectedCity, setSelectedCity] = useState(null);
  const [activeTab, setActiveTab] = useState('home');

  const handleFindCityGuide = () => {
    setCurrentScreen('citySelection');
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setCurrentScreen('home');
  };

  const handleBack = () => {
    setCurrentScreen('landing');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    
    // Only navigate if we're already in the main app (not on landing or city selection)
    if (currentScreen === 'home') {
      // Tab changes are handled by showing different screens
      // TripsScreen and HomeScreen will be shown based on activeTab
    }
    
    console.log('Tab changed to:', tab);
  };

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
