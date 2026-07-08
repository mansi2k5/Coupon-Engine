import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StatusBadge({ status }) {
  const isActive = status === 'Active';
  return (
    <View style={[styles.badge, isActive ? styles.active : styles.expired]}>
      <Text style={[styles.text, isActive ? styles.activeText : styles.expiredText]}>
        {status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  active: {
    backgroundColor: '#E6F7ED',
  },
  expired: {
    backgroundColor: '#FBEAEA',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeText: {
    color: '#1D9A5C',
  },
  expiredText: {
    color: '#D14343',
  },
});
