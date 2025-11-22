import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar as RNStatusBar, Animated, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { TourGuideCard } from '../components/TourGuideCard';
import { TourGuideCardSkeleton } from '../components/TourGuideCardSkeleton';
import { BottomNavBar } from '../components/BottomNavBar';
import { FONTS } from '../constants/fonts';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const BOTTOM_NAVBAR_HEIGHT = Platform.OS === 'ios' ? 80 : 70; // Approximate height of bottom navbar
const BOTTOM_SHEET_MIN_HEIGHT = 120; // Minimum visible height when collapsed
const HEADER_HEIGHT = 100; // Approximate height for header
const BOTTOM_SHEET_MAX_HEIGHT = SCREEN_HEIGHT - BOTTOM_NAVBAR_HEIGHT - HEADER_HEIGHT; // Maximum height when expanded (leaving space for header)

export const HomeScreen = ({ selectedCity, activeTab = 'home', onTabChange, onNotificationsPress, onGuidePress }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasUnreadNotifications] = useState(true); // TODO: Replace with actual notification state
  const [userLocation, setUserLocation] = useState(null);
  const [isSheetExpanded, setIsSheetExpanded] = useState(false);
  // TODO: Replace with your Mapbox PUBLIC access token (must start with 'pk.')
  // Get your token from: https://account.mapbox.com/access-tokens/
  // IMPORTANT: Use a PUBLIC token (pk.*), NOT a secret token (sk.*)
  const [mapboxToken] = useState('pk.eyJ1IjoiZGVvbmNoaW5lc2UiLCJhIjoiY21odG82dHVuMDQ1eTJpc2RmdDdlZWZ3NiJ9.W0Nbf6fypzPbXgnMcOcoTA'); // Replace with your PUBLIC token
  const webViewRef = useRef(null);
  
  // Bottom sheet animation - Y position from top of screen
  const bottomSheetY = useRef(new Animated.Value(SCREEN_HEIGHT - BOTTOM_SHEET_MIN_HEIGHT - BOTTOM_NAVBAR_HEIGHT)).current;
  const bottomSheetHeight = useRef(new Animated.Value(BOTTOM_SHEET_MIN_HEIGHT)).current;
  
  // Get safe area insets
  const statusBarHeight = Platform.OS === 'ios' ? 44 : RNStatusBar.currentHeight || 0;
  
  // Toggle bottom sheet
  const toggleBottomSheet = () => {
    const newExpanded = !isSheetExpanded;
    setIsSheetExpanded(newExpanded);
    
    const targetY = newExpanded 
      ? SCREEN_HEIGHT - BOTTOM_SHEET_MAX_HEIGHT - BOTTOM_NAVBAR_HEIGHT
      : SCREEN_HEIGHT - BOTTOM_SHEET_MIN_HEIGHT - BOTTOM_NAVBAR_HEIGHT;
    const targetHeight = newExpanded 
      ? BOTTOM_SHEET_MAX_HEIGHT
      : BOTTOM_SHEET_MIN_HEIGHT;
    
    Animated.parallel([
      Animated.spring(bottomSheetY, {
        toValue: targetY,
        useNativeDriver: false,
        tension: 60,
        friction: 9,
      }),
      Animated.spring(bottomSheetHeight, {
        toValue: targetHeight,
        useNativeDriver: false,
        tension: 60,
        friction: 9,
      }),
    ]).start();
  };
  

  // Get user location
  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Location permission denied');
          return;
        }
        let location = await Location.getCurrentPositionAsync({});
        setUserLocation(location);
        // Update map with user location
        if (webViewRef.current) {
          const script = `
            if (window.map) {
              window.map.flyTo({
                center: [${location.coords.longitude}, ${location.coords.latitude}],
                zoom: 13,
                duration: 1000
              });
              new mapboxgl.Marker({ color: '#2196F3' })
                .setLngLat([${location.coords.longitude}, ${location.coords.latitude}])
                .setPopup(new mapboxgl.Popup().setHTML('<b>Your Location</b>'))
                .addTo(window.map);
            }
          `;
          webViewRef.current.injectJavaScript(script);
        }
      } catch (error) {
        console.log('Error getting location:', error);
      }
    })();
  }, []);

  // Generate Mapbox HTML
  const getMapHTML = () => {
    const defaultLat = userLocation?.coords?.latitude || selectedCity?.latitude || 40.7128;
    const defaultLng = userLocation?.coords?.longitude || selectedCity?.longitude || -74.0060;
    
    // Generate markers for guides
    const markers = !isLoading ? mockGuides.map((guide, index) => {
      const lat = defaultLat + (index * 0.01) - 0.015;
      const lng = defaultLng + (index * 0.01) - 0.015;
      const name = guide.name.replace(/'/g, "\\'").replace(/"/g, '&quot;');
      const specialty = guide.specialty.replace(/'/g, "\\'").replace(/"/g, '&quot;');
      return `
        new mapboxgl.Marker({ color: '#0A1D37' })
          .setLngLat([${lng}, ${lat}])
          .setPopup(new mapboxgl.Popup().setHTML('<b>${name}</b><br>${specialty}'))
          .addTo(window.map);
      `;
    }).join('') : '';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <script src='https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js'></script>
        <link href='https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css' rel='stylesheet' />
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html, body { width: 100%; height: 100%; overflow: hidden; }
          #map { width: 100%; height: 100%; position: absolute; top: 0; left: 0; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          try {
            mapboxgl.accessToken = '${mapboxToken}';
            
            if (!mapboxgl.accessToken || mapboxgl.accessToken.startsWith('sk.')) {
              console.error('Invalid Mapbox token. Use a PUBLIC token (pk.*), not a secret token (sk.*)');
              document.getElementById('map').innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:red;padding:20px;text-align:center;">Invalid token. Use a PUBLIC token (pk.*)</div>';
            } else {
              window.map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [${defaultLng}, ${defaultLat}],
                zoom: 13,
                attributionControl: false
              });

              window.map.on('load', function() {
                console.log('Map loaded successfully');
                ${userLocation ? `
                  new mapboxgl.Marker({ color: '#2196F3' })
                    .setLngLat([${defaultLng}, ${defaultLat}])
                    .setPopup(new mapboxgl.Popup().setHTML('<b>Your Location</b>'))
                    .addTo(window.map);
                ` : ''}

                ${markers}
              });

              window.map.on('error', function(e) {
                console.error('Map error:', e);
              });
            }
          } catch (error) {
            console.error('Error initializing map:', error);
            document.getElementById('map').innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:red;padding:20px;text-align:center;">Error loading map: ' + error.message + '</div>';
          }
        </script>
      </body>
      </html>
    `;
  };


  // Mock tour guide data
  const mockGuides = [
    {
      id: '1',
      name: 'Sarah Johnson',
      specialty: 'Historical Tours & Culture',
      location: 'Downtown',
      rating: 4.9,
      tours: 127,
      price: 45,
      avatar: { uri: 'https://i.pravatar.cc/150?img=1' },
      verified: true,
      status: 'available', // available, on trip, offline
    },
    {
      id: '2',
      name: 'Michael Chen',
      specialty: 'Food & Local Cuisine',
      location: 'City Center',
      rating: 4.8,
      tours: 89,
      price: 50,
      avatar: { uri: 'https://i.pravatar.cc/150?img=2' },
      verified: false,
      status: 'on trip',
    },
    {
      id: '3',
      name: 'Emma Williams',
      specialty: 'Art & Architecture',
      location: 'Historic District',
      rating: 5.0,
      tours: 156,
      price: 55,
      avatar: { uri: 'https://i.pravatar.cc/150?img=3' },
      verified: true,
      status: 'available',
    },
    {
      id: '4',
      name: 'David Martinez',
      specialty: 'Nightlife & Entertainment',
      location: 'Entertainment Quarter',
      rating: 4.7,
      tours: 94,
      price: 40,
      avatar: { uri: 'https://i.pravatar.cc/150?img=4' },
      verified: false,
      status: 'offline',
    },
    {
      id: '5',
      name: 'Lisa Anderson',
      specialty: 'Nature & Outdoor',
      location: 'Parks & Gardens',
      rating: 4.9,
      tours: 112,
      price: 48,
      avatar: { uri: 'https://i.pravatar.cc/150?img=5' },
      verified: true,
      status: 'available',
    },
    {
      id: '6',
      name: 'James Wilson',
      specialty: 'Photography Tours',
      location: 'Scenic Areas',
      rating: 4.8,
      tours: 73,
      price: 52,
      avatar: { uri: 'https://i.pravatar.cc/150?img=6' },
      verified: false,
      status: 'on trip',
    },
  ];

  // Simulate loading guides data
  useEffect(() => {
    const loadGuides = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsLoading(false);
    };
    loadGuides();
  }, []);

  // Add markers to map after guides finish loading
  useEffect(() => {
    if (!isLoading && webViewRef.current) {
      setTimeout(() => {
        const defaultLat = userLocation?.coords?.latitude || selectedCity?.latitude || 40.7128;
        const defaultLng = userLocation?.coords?.longitude || selectedCity?.longitude || -74.0060;
        const markersScript = mockGuides.map((guide, index) => {
          const lat = defaultLat + (index * 0.01) - 0.015;
          const lng = defaultLng + (index * 0.01) - 0.015;
          const name = guide.name.replace(/'/g, "\\'").replace(/"/g, '&quot;');
          const specialty = guide.specialty.replace(/'/g, "\\'").replace(/"/g, '&quot;');
          return `
            new mapboxgl.Marker({ color: '#0A1D37' })
              .setLngLat([${lng}, ${lat}])
              .setPopup(new mapboxgl.Popup().setHTML('<b>${name}</b><br>${specialty}'))
              .addTo(window.map);
          `;
        }).join('');
        webViewRef.current.injectJavaScript(`
          if (window.map && window.map.loaded()) {
            ${markersScript}
          } else {
            window.map.on('load', function() {
              ${markersScript}
            });
          }
        `);
      }, 500);
    }
  }, [isLoading, userLocation, selectedCity]);

  const handleGuidePress = (guide) => {
    if (onGuidePress) {
      onGuidePress(guide);
    } else {
      console.log('Guide selected:', guide.name);
    }
  };

  // Calculate map height based on bottom sheet position
  // bottomSheetY is the top position of the sheet, so map height = bottomSheetY
  const mapHeight = bottomSheetY.interpolate({
    inputRange: [
      SCREEN_HEIGHT - BOTTOM_SHEET_MAX_HEIGHT - BOTTOM_NAVBAR_HEIGHT,
      SCREEN_HEIGHT - BOTTOM_SHEET_MIN_HEIGHT - BOTTOM_NAVBAR_HEIGHT
    ],
    outputRange: [200, SCREEN_HEIGHT - BOTTOM_NAVBAR_HEIGHT],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Map Section - Full Screen Initially */}
      <Animated.View style={[styles.mapSection, { height: mapHeight }]}>
        <WebView
          ref={webViewRef}
          source={{ html: getMapHTML() }}
          style={styles.mapView}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('WebView error: ', nativeEvent);
          }}
          onHttpError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('WebView HTTP error: ', nativeEvent);
          }}
          onMessage={(event) => {
            console.log('WebView message:', event.nativeEvent.data);
          }}
          onLoadEnd={() => {
            console.log('WebView loaded');
          }}
        />
        
        {/* Header Overlay */}
        <View style={[styles.header, { paddingTop: statusBarHeight + 16 }]}>
          <View>
            <Text style={styles.greeting}>Hello!</Text>
            <Text style={styles.location}>
              {selectedCity ? `${selectedCity.name}, ${selectedCity.country}` : 'Explore Cities'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => onNotificationsPress && onNotificationsPress()}
            style={styles.notificationButton}
            activeOpacity={0.7}
          >
            <View style={styles.notificationIconContainer}>
              <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
              {hasUnreadNotifications && <View style={styles.notificationDot} />}
            </View>
          </TouchableOpacity>
        </View>

        {/* Map controls overlay */}
        <TouchableOpacity 
          style={styles.mapControlButton} 
          activeOpacity={0.7}
          onPress={async () => {
            try {
              let { status } = await Location.requestForegroundPermissionsAsync();
              if (status === 'granted') {
                let location = await Location.getCurrentPositionAsync({});
                setUserLocation(location);
                // Update map
                if (webViewRef.current) {
                  const script = `
                    if (window.map) {
                      window.map.flyTo({
                        center: [${location.coords.longitude}, ${location.coords.latitude}],
                        zoom: 13,
                        duration: 1000
                      });
                      new mapboxgl.Marker({ color: '#2196F3' })
                        .setLngLat([${location.coords.longitude}, ${location.coords.latitude}])
                        .setPopup(new mapboxgl.Popup().setHTML('<b>Your Location</b>'))
                        .addTo(window.map);
                    }
                  `;
                  webViewRef.current.injectJavaScript(script);
                }
              }
            } catch (error) {
              console.log('Error getting location:', error);
            }
          }}
        >
          <Ionicons name="locate" size={20} color="#0A1D37" />
        </TouchableOpacity>
      </Animated.View>

      {/* Bottom Sheet with Guides */}
      <Animated.View
        style={[
          styles.bottomSheet,
          {
            height: bottomSheetHeight,
            top: bottomSheetY,
          },
        ]}
      >
        {/* Toggle Button */}
        <TouchableOpacity 
          style={styles.toggleButton}
          onPress={toggleBottomSheet}
          activeOpacity={0.7}
        >
          <View style={styles.toggleButtonContainer}>
            <Ionicons 
              name={isSheetExpanded ? "chevron-down" : "chevron-up"} 
              size={24} 
              color="#0A1D37" 
            />
          </View>
        </TouchableOpacity>

        {/* Bottom Sheet Content */}
        <ScrollView
          style={styles.bottomSheetContent}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          bounces={false}
        >
          <Text style={styles.sectionTitle}>Recommended Guides</Text>
          {isLoading ? (
            // Show skeleton loaders
            Array.from({ length: 6 }).map((_, index) => (
              <TourGuideCardSkeleton key={`skeleton-${index}`} />
            ))
          ) : (
            // Show actual guide cards
            mockGuides.map((guide) => (
              <TourGuideCard
                key={guide.id}
                guide={guide}
                onPress={() => handleGuidePress(guide)}
              />
            ))
          )}
        </ScrollView>
      </Animated.View>

      {/* Bottom NavBar - Always visible */}
      <View style={styles.bottomNavContainer}>
        <BottomNavBar activeTab={activeTab} onTabChange={onTabChange} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  mapSection: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    backgroundColor: '#E8F4F8',
    zIndex: 1,
  },
  mapView: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E8F4F8',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: 'rgba(10, 29, 55, 0.85)',
    zIndex: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  notificationButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  notificationIconContainer: {
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E74C3C',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  greeting: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: '#FFFFFF',
    letterSpacing: 0.5,
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  location: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: 'rgba(255, 255, 255, 0.95)',
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  mapControlButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0A1D37',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 5,
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#0A1D37',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 15,
    zIndex: 10,
  },
  toggleButton: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingTop: 12,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#FFFFFF',
  },
  toggleButtonContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bottomSheetContent: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 20,
    minHeight: '100%',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: FONTS.semiBold,
    color: '#1A1A1A',
    letterSpacing: 0.3,
    marginBottom: 16,
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 30,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 5,
  },
});

