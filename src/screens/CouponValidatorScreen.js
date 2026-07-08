import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { mockCoupons } from '../data/mockCoupons';
import { validateCoupon } from '../utils/couponValidation';
import { useAppliedCoupons } from '../context/AppliedCouponsContext';

export default function CouponValidatorScreen() {
  const [code, setCode] = useState('');
  const [cartTotal, setCartTotal] = useState('');
  const [result, setResult] = useState(null);
  const [validating, setValidating] = useState(false);
  const { applyCoupon } = useAppliedCoupons();

  const canValidate = code.trim().length > 0 && cartTotal.trim().length > 0;

  const handleValidate = () => {
    if (!canValidate) return;
    // Simulate a brief network round-trip, matching how a real
    // server-side validation call would feel to the user.
    setValidating(true);
    setResult(null);
    setTimeout(() => {
      const outcome = validateCoupon(mockCoupons, code, cartTotal);
      setResult(outcome);
      setValidating(false);
    }, 500);
  };

  const handleApply = () => {
    if (result?.valid) {
      applyCoupon(result);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Coupon Code</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. SAVE20"
        autoCapitalize="characters"
        value={code}
        onChangeText={setCode}
        accessibilityLabel="Coupon code input"
      />

      <Text style={styles.label}>Cart Total (₹)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 1200"
        keyboardType="numeric"
        value={cartTotal}
        onChangeText={setCartTotal}
        accessibilityLabel="Cart total input in rupees"
      />

      <Pressable
        style={[
          styles.validateButton,
          (!canValidate || validating) && styles.validateButtonDisabled,
        ]}
        onPress={handleValidate}
        disabled={!canValidate || validating}
        accessibilityRole="button"
        accessibilityLabel="Validate coupon"
        accessibilityState={{ disabled: !canValidate || validating }}
      >
        {validating ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.validateText}>Validate</Text>
        )}
      </Pressable>

      {result && !validating && (
        <View
          style={[
            styles.resultBox,
            result.valid ? styles.resultValid : styles.resultInvalid,
          ]}
        >
          {result.valid ? (
            <>
              <Text style={styles.resultTitle}>Coupon applied successfully!</Text>
              <Text style={styles.resultLine}>
                Discount: ₹{result.discountAmount}
              </Text>
              <Text style={styles.resultLine}>
                Final price: ₹{result.finalPrice}
              </Text>
              <Pressable
                style={styles.applyButton}
                onPress={handleApply}
                accessibilityRole="button"
                accessibilityLabel="Add coupon to applied coupons"
              >
                <Text style={styles.applyText}>Add to Applied Coupons</Text>
              </Pressable>
            </>
          ) : (
            <Text style={styles.resultError}>{result.reason}</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA', padding: 20 },
  label: { fontSize: 13, color: '#555', marginBottom: 6, marginTop: 12 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  validateButton: {
    marginTop: 24,
    backgroundColor: '#2A6DF4',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  validateButtonDisabled: { backgroundColor: '#A9BFEF' },
  validateText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  resultBox: {
    marginTop: 24,
    padding: 16,
    borderRadius: 10,
  },
  resultValid: { backgroundColor: '#E6F7ED' },
  resultInvalid: { backgroundColor: '#FBEAEA' },
  resultTitle: { fontWeight: '700', color: '#1D9A5C', marginBottom: 8 },
  resultLine: { color: '#222', marginBottom: 4 },
  resultError: { color: '#D14343', fontWeight: '600' },
  applyButton: {
    marginTop: 12,
    backgroundColor: '#1D9A5C',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyText: { color: '#fff', fontWeight: '600' },
});
