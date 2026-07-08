import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import StatusBadge from './StatusBadge';
import { getStatus, formatDiscountLabel } from '../utils/couponValidation';

export default function CouponCard({ coupon, onPress }) {
  const status = getStatus(coupon);

  return (
    <Pressable
      style={styles.card}
      onPress={() => onPress(coupon)}
      accessibilityRole="button"
      accessibilityLabel={`${coupon.code}, ${formatDiscountLabel(coupon)}, ${status}, expires ${coupon.expiryDate}`}
      accessibilityHint="Opens coupon details"
    >
      <View style={styles.row}>
        <Text style={styles.code}>{coupon.code}</Text>
        <StatusBadge status={status} />
      </View>
      <Text style={styles.discount}>{formatDiscountLabel(coupon)}</Text>
      <Text style={styles.description}>{coupon.description}</Text>
      <Text style={styles.expiry}>Expires: {coupon.expiryDate}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  code: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  discount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2A6DF4',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
  },
  expiry: {
    fontSize: 12,
    color: '#888',
  },
});
