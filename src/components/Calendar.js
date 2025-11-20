import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const Calendar = ({ selectedDate, onDateSelect, minDate = new Date() }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false;
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const isToday = (date) => {
    return isSameDay(date, today);
  };

  const isPastDate = (date) => {
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate < today;
  };

  const isSelected = (date) => {
    return selectedDate && isSameDay(date, selectedDate);
  };

  const handleDatePress = (day) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (!isPastDate(date)) {
      onDateSelect(date);
    }
  };

  const goToPreviousMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(currentMonth.getMonth() - 1);
    setCurrentMonth(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(currentMonth.getMonth() + 1);
    setCurrentMonth(newDate);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      days.push(date);
    }

    return (
      <View style={styles.calendarContainer}>
        {/* Month Navigation */}
        <View style={styles.monthNavigation}>
          <TouchableOpacity
            onPress={goToPreviousMonth}
            style={styles.navButton}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={20} color="#0A1D37" />
          </TouchableOpacity>
          
          <Text style={styles.monthYear}>
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </Text>
          
          <TouchableOpacity
            onPress={goToNextMonth}
            style={styles.navButton}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-forward" size={20} color="#0A1D37" />
          </TouchableOpacity>
        </View>

        {/* Week Day Headers */}
        <View style={styles.weekDaysContainer}>
          {weekDays.map((day, index) => (
            <View key={index} style={styles.weekDay}>
              <Text style={styles.weekDayText}>{day}</Text>
            </View>
          ))}
        </View>

        {/* Calendar Grid */}
        <View style={styles.daysContainer}>
          {days.map((date, index) => {
            if (!date) {
              return <View key={`empty-${index}`} style={styles.dayCell} />;
            }

            const day = date.getDate();
            const isDatePast = isPastDate(date);
            const isDateToday = isToday(date);
            const isDateSelected = isSelected(date);

            return (
              <TouchableOpacity
                key={`day-${day}`}
                style={[
                  styles.dayCell,
                  isDateToday && !isDateSelected && styles.todayCell,
                  isDateSelected && styles.selectedCell,
                  isDatePast && styles.pastCell,
                ]}
                onPress={() => handleDatePress(day)}
                disabled={isDatePast}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.dayText,
                    isDatePast && styles.pastDayText,
                    isDateToday && !isDateSelected && styles.todayDayText,
                    isDateSelected && styles.selectedDayText,
                  ]}
                >
                  {day}
                </Text>
                {isDateToday && !isDateSelected && (
                  <View style={styles.todayIndicator} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return renderCalendar();
};

const styles = StyleSheet.create({
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#0A1D37',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F7F7F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthYear: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0A1D37',
    letterSpacing: 0.3,
  },
  weekDaysContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  weekDay: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6D6D6D',
    letterSpacing: 0.3,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
    position: 'relative',
  },
  dayText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1A1A1A',
    letterSpacing: 0.2,
  },
  todayCell: {
    backgroundColor: '#F7F7F7',
    borderRadius: 20,
  },
  todayDayText: {
    color: '#0A1D37',
    fontWeight: '600',
  },
  todayIndicator: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#0A1D37',
  },
  selectedCell: {
    backgroundColor: '#0A1D37',
    borderRadius: 20,
  },
  selectedDayText: {
    color: '#F7F7F7',
    fontWeight: '600',
  },
  pastCell: {
    opacity: 0.3,
  },
  pastDayText: {
    color: '#6D6D6D',
  },
});

