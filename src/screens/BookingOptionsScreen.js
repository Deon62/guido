import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/Button';
import { Calendar } from '../components/Calendar';

export const BookingOptionsScreen = ({ guide, onBack, onSelect }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeWindow, setTimeWindow] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  // Get safe area insets
  const statusBarHeight = Platform.OS === 'ios' ? 44 : RNStatusBar.currentHeight || 0;

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    if (option === 'now') {
      handleConfirm();
    }
  };

  const handleTimeWindowSelect = (window) => {
    setTimeWindow(window);
    handleConfirm({ type: 'laterToday', timeWindow: window });
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleConfirm = (option) => {
    if (onSelect) {
      const bookingOption = option || { type: 'now' };
      onSelect(bookingOption);
    }
    if (onBack) {
      onBack();
    }
  };

  const timeWindows = [
    { id: 'morning', label: 'Morning', time: '9:00 AM - 12:00 PM' },
    { id: 'afternoon', label: 'Afternoon', time: '12:00 PM - 5:00 PM' },
    { id: 'evening', label: 'Evening', time: '5:00 PM - 9:00 PM' },
  ];


  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: statusBarHeight + 16 }]}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#0A1D37" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Options</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!selectedOption ? (
          <View style={styles.content}>
            <Text style={styles.title}>When would you like to book?</Text>
            <Text style={styles.subtitle}>Choose your preferred booking time</Text>
            
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => handleOptionSelect('now')}
                activeOpacity={0.7}
              >
                <View style={styles.optionIconContainer}>
                  <Ionicons name="flash" size={24} color="#0A1D37" />
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionButtonText}>Now</Text>
                  <Text style={styles.optionButtonSubtext}>Within 30 minutes</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#6D6D6D" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => setSelectedOption('laterToday')}
                activeOpacity={0.7}
              >
                <View style={styles.optionIconContainer}>
                  <Ionicons name="time" size={24} color="#0A1D37" />
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionButtonText}>Later Today</Text>
                  <Text style={styles.optionButtonSubtext}>Choose a time window</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#6D6D6D" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => setSelectedOption('schedule')}
                activeOpacity={0.7}
              >
                <View style={styles.optionIconContainer}>
                  <Ionicons name="calendar" size={24} color="#0A1D37" />
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionButtonText}>Schedule</Text>
                  <Text style={styles.optionButtonSubtext}>Pick a date and time</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#6D6D6D" />
              </TouchableOpacity>
            </View>
          </View>
        ) : selectedOption === 'laterToday' ? (
          <View style={styles.content}>
            <TouchableOpacity
              style={styles.backOptionButton}
              onPress={() => setSelectedOption(null)}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={20} color="#0A1D37" />
              <Text style={styles.backOptionText}>Back</Text>
            </TouchableOpacity>
            
            <Text style={styles.title}>Select Time Window</Text>
            <Text style={styles.subtitle}>Choose when you'd like to meet</Text>
            
            <View style={styles.optionsContainer}>
              {timeWindows.map((window) => (
                <TouchableOpacity
                  key={window.id}
                  style={[styles.timeWindowButton, timeWindow === window.id && styles.timeWindowButtonActive]}
                  onPress={() => handleTimeWindowSelect(window.id)}
                  activeOpacity={0.7}
                >
                  <View>
                    <Text style={[styles.timeWindowLabel, timeWindow === window.id && styles.timeWindowLabelActive]}>
                      {window.label}
                    </Text>
                    <Text style={[styles.timeWindowTime, timeWindow === window.id && styles.timeWindowTimeActive]}>
                      {window.time}
                    </Text>
                  </View>
                  {timeWindow === window.id && (
                    <Ionicons name="checkmark-circle" size={24} color="#F7F7F7" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : selectedOption === 'schedule' ? (
          <View style={styles.content}>
            <Text style={styles.title}>Select Date</Text>
            <Text style={styles.subtitle}>Choose your preferred date</Text>
            
            <View style={styles.calendarWrapper}>
              <Calendar
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
              />
            </View>

            {selectedDate && (
              <View style={styles.selectedDateContainer}>
                <View style={styles.selectedDateInfo}>
                  <Ionicons name="calendar" size={20} color="#0A1D37" />
                  <View style={styles.selectedDateTextContainer}>
                    <Text style={styles.selectedDateLabel}>Selected Date</Text>
                    <Text style={styles.selectedDateText}>
                      {selectedDate.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={() => handleConfirm({ type: 'schedule', date: selectedDate })}
                  activeOpacity={0.7}
                >
                  <Text style={styles.confirmButtonText}>Confirm</Text>
                  <Ionicons name="checkmark" size={18} color="#F7F7F7" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0A1D37',
    letterSpacing: 0.5,
  },
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0A1D37',
    letterSpacing: 0.3,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6D6D6D',
    letterSpacing: 0.2,
    marginBottom: 24,
  },
  backOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 8,
  },
  backOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0A1D37',
    marginLeft: 8,
    letterSpacing: 0.3,
  },
  optionsContainer: {
    marginTop: 8,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#0A1D37',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  optionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F7F7F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0A1D37',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  optionButtonSubtext: {
    fontSize: 13,
    color: '#6D6D6D',
    letterSpacing: 0.2,
  },
  timeWindowButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#0A1D37',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  timeWindowButtonActive: {
    backgroundColor: '#0A1D37',
    borderColor: '#0A1D37',
  },
  timeWindowLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  timeWindowLabelActive: {
    color: '#F7F7F7',
  },
  timeWindowTime: {
    fontSize: 14,
    color: '#6D6D6D',
    letterSpacing: 0.2,
  },
  timeWindowTimeActive: {
    color: '#F7F7F7',
    opacity: 0.9,
  },
  calendarWrapper: {
    marginTop: 16,
    marginBottom: 24,
  },
  selectedDateContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    marginTop: 16,
  },
  selectedDateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  selectedDateTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  selectedDateLabel: {
    fontSize: 12,
    color: '#6D6D6D',
    letterSpacing: 0.2,
    marginBottom: 4,
  },
  selectedDateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0A1D37',
    letterSpacing: 0.3,
  },
  confirmButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A1D37',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F7F7F7',
    letterSpacing: 0.3,
    marginRight: 8,
  },
});

