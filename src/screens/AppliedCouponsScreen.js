import React from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { useAppliedCoupons } from '../context/AppliedCouponsContext';

export default function AppliedCouponsScreen() {
  const { appliedCoupons, removeCoupon } = useAppliedCoupons();

  if (appliedCoupons.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>
          No coupons applied yet. Validate a coupon to add it here.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={appliedCoupons}
        keyExtractor={(item) => item.coupon.code}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.code}>{item.coupon.code}</Text>
              <Text style={styles.detail}>
                Discount: ₹{item.discountAmount} · Final: ₹{item.finalPrice}
              </Text>
            </View>
            <Pressable
              style={styles.removeButton}
              onPress={() => removeCoupon(item.coupon.code)}
              accessibilityRole="button"
              accessibilityLabel={`Remove coupon ${item.coupon.code}`}
            >
              <Text style={styles.removeText}>Remove</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA', padding: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { color: '#777', textAlign: 'center' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  code: { fontWeight: '700', fontSize: 15, marginBottom: 4 },
  detail: { color: '#555', fontSize: 13 },
  removeButton: {
    backgroundColor: '#FBEAEA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  removeText: { color: '#D14343', fontWeight: '600', fontSize: 12 },
});
