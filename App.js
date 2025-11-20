import React, { useState } from 'react';
import { LandingScreen } from './src/screens/LandingScreen';
import { CitySelectionScreen } from './src/screens/CitySelectionScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('landing');

  const handleFindCityGuide = () => {
    setCurrentScreen('citySelection');
  };

  const handleCitySelect = (city) => {
    console.log('City selected:', city);
    // TODO: Navigate to guide listing for selected city
  };

  const handleBack = () => {
    setCurrentScreen('landing');
  };

  if (currentScreen === 'citySelection') {
    return (
      <CitySelectionScreen
        onCitySelect={handleCitySelect}
        onBack={handleBack}
      />
    );
  }

  return <LandingScreen onFindCityGuide={handleFindCityGuide} />;
}
