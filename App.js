import React, { useState } from 'react';
import { LandingScreen } from './src/screens/LandingScreen';
import { CitySelectionScreen } from './src/screens/CitySelectionScreen';
import { HomeScreen } from './src/screens/HomeScreen';

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
    // TODO: Handle navigation to different tabs
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

  if (currentScreen === 'home') {
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
