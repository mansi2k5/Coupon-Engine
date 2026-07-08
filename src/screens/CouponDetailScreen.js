import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import StatusBadge from '../components/StatusBadge';
import { getStatus, formatDiscountLabel } from '../utils/couponValidation';

export default function CouponDetailScreen({ route }) {
  const { coupon } = route.params;
  const [copied, setCopied] = useState(false);
  const status = getStatus(coupon);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(coupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.code}>{coupon.code}</Text>
        <StatusBadge status={status} />
      </View>

      <Text style={styles.discount}>{formatDiscountLabel(coupon)}</Text>

      <View style={styles.detailRow}>
        <Text style={styles.label}>Minimum order value</Text>
        <Text style={styles.value}>₹{coupon.minOrderValue}</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.label}>Expiry date</Text>
        <Text style={styles.value}>{coupon.expiryDate}</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.label}>Applicable categories</Text>
        <Text style={styles.value}>{coupon.categories.join(', ')}</Text>
      </View>

      <Text style={styles.description}>{coupon.description}</Text>

      <Pressable
        style={styles.copyButton}
        onPress={handleCopy}
        accessibilityRole="button"
        accessibilityLabel={copied ? 'Coupon code copied' : `Copy coupon code ${coupon.code}`}
      >
        <Text style={styles.copyText}>{copied ? 'Copied!' : 'Copy Code'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA', padding: 20 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  code: { fontSize: 24, fontWeight: '700', letterSpacing: 0.5 },
  discount: { fontSize: 16, color: '#2A6DF4', fontWeight: '600', marginBottom: 20 },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  label: { color: '#777', fontSize: 14 },
  value: { color: '#222', fontSize: 14, fontWeight: '600' },
  description: { marginTop: 16, color: '#555', fontSize: 14, lineHeight: 20 },
  copyButton: {
    marginTop: 30,
    backgroundColor: '#2A6DF4',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  copyText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
