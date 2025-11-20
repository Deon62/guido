import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const ConfirmationModal = ({ visible, title, message, confirmText, cancelText, onConfirm, onCancel, danger = false }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.iconContainer}>
            <View style={[styles.iconCircle, danger && styles.iconCircleDanger]}>
              <Ionicons
                name={danger ? 'warning' : 'help-circle'}
                size={32}
                color={danger ? '#E74C3C' : '#0A1D37'}
              />
            </View>
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>{cancelText || 'Cancel'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, danger ? styles.confirmButtonDanger : styles.confirmButton]}
              onPress={onConfirm}
              activeOpacity={0.7}
            >
              <Text style={[styles.confirmButtonText, danger && styles.confirmButtonTextDanger]}>
                {confirmText || 'Confirm'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#0A1D37',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  iconContainer: {
    marginBottom: 20,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F7F7F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircleDanger: {
    backgroundColor: '#FEE',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0A1D37',
    letterSpacing: 0.3,
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: '#3A3A3A',
    letterSpacing: 0.2,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    letterSpacing: 0.3,
  },
  confirmButton: {
    backgroundColor: '#0A1D37',
  },
  confirmButtonDanger: {
    backgroundColor: '#E74C3C',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F7F7F7',
    letterSpacing: 0.3,
  },
  confirmButtonTextDanger: {
    color: '#FFFFFF',
  },
});

