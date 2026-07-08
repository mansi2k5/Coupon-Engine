import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { fetchCoupons, COUPON_TYPES } from '../data/mockCoupons';
import CouponCard from '../components/CouponCard';

const FILTERS = [
  { label: 'All', value: 'ALL' },
  { label: 'Percentage', value: COUPON_TYPES.PERCENTAGE },
  { label: 'Flat', value: COUPON_TYPES.FLAT },
  { label: 'Free Shipping', value: COUPON_TYPES.FREE_SHIPPING },
];

const SORT_OPTIONS = [
  { label: 'Default', value: 'DEFAULT' },
  { label: 'Expiry (soonest)', value: 'EXPIRY_ASC' },
  { label: 'Discount (highest)', value: 'DISCOUNT_DESC' },
];

// Free shipping has no percentage/flat value to compare, so it sorts
// after monetary discounts when sorting by discount value.
function getComparableDiscountValue(coupon) {
  if (coupon.type === COUPON_TYPES.FREE_SHIPPING) return -1;
  return coupon.value;
}

export default function CouponListScreen({ navigation }) {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('DEFAULT');
  // Lets the error state be demoed on demand instead of only existing as
  // unreachable dead code — see the "Simulate API Error" button below.
  const [simulateError, setSimulateError] = useState(false);

  const loadCoupons = (forceFail = simulateError) => {
    setLoading(true);
    setError(null);
    fetchCoupons({ shouldFail: forceFail })
      .then((data) => setCoupons(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const handleSimulateError = () => {
    setSimulateError(true);
    loadCoupons(true);
  };

  const handleRetry = () => {
    // Retrying always attempts a real (non-failing) load, same as a user
    // pulling to refresh after a genuine network error would expect.
    setSimulateError(false);
    loadCoupons(false);
  };

  // Separate handler for pull-to-refresh so it doesn't show the full-screen
  // loading state (which would feel jarring mid-gesture) — just the native
  // pull-to-refresh spinner instead.
  const handleRefresh = () => {
    setRefreshing(true);
    fetchCoupons({ shouldFail: false })
      .then((data) => {
        setCoupons(data);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setRefreshing(false));
  };

  useEffect(() => {
    loadCoupons(false);
  }, []);

  const filteredCoupons = useMemo(() => {
    const result = coupons.filter((c) => {
      const matchesSearch =
        c.code.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = activeFilter === 'ALL' || c.type === activeFilter;
      return matchesSearch && matchesFilter;
    });

    if (sortBy === 'EXPIRY_ASC') {
      return [...result].sort(
        (a, b) => new Date(a.expiryDate) - new Date(b.expiryDate)
      );
    }
    if (sortBy === 'DISCOUNT_DESC') {
      return [...result].sort(
        (a, b) => getComparableDiscountValue(b) - getComparableDiscountValue(a)
      );
    }
    return result;
  }, [coupons, search, activeFilter, sortBy]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2A6DF4" />
        <Text style={styles.centeredText}>Loading coupons...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable
          style={styles.retryButton}
          onPress={handleRetry}
          accessibilityRole="button"
          accessibilityLabel="Retry loading coupons"
        >
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.simulateErrorButton}
        onPress={handleSimulateError}
        accessibilityRole="button"
        accessibilityLabel="Simulate an API error for demo purposes"
      >
        <Text style={styles.simulateErrorText}>⚠ Simulate API Error (demo)</Text>
      </Pressable>

      <TextInput
        style={styles.search}
        placeholder="Search by code or description"
        value={search}
        onChangeText={setSearch}
        accessibilityLabel="Search coupons by code or description"
        accessibilityHint="Type to filter the coupon list"
      />

      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <Pressable
            key={f.value}
            style={[
              styles.filterChip,
              activeFilter === f.value && styles.filterChipActive,
            ]}
            onPress={() => setActiveFilter(f.value)}
            accessibilityRole="button"
            accessibilityState={{ selected: activeFilter === f.value }}
            accessibilityLabel={`Filter by ${f.label}`}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === f.value && styles.filterTextActive,
              ]}
            >
              {f.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>Sort:</Text>
        {SORT_OPTIONS.map((s) => (
          <Pressable
            key={s.value}
            style={[
              styles.sortChip,
              sortBy === s.value && styles.sortChipActive,
            ]}
            onPress={() => setSortBy(s.value)}
            accessibilityRole="button"
            accessibilityState={{ selected: sortBy === s.value }}
            accessibilityLabel={`Sort by ${s.label}`}
          >
            <Text
              style={[
                styles.sortText,
                sortBy === s.value && styles.sortTextActive,
              ]}
            >
              {s.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {filteredCoupons.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.centeredText}>No coupons found.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredCoupons}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CouponCard
              coupon={item}
              onPress={(coupon) =>
                navigation.navigate('CouponDetail', { coupon })
              }
            />
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA', padding: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  centeredText: { marginTop: 8, color: '#666' },
  errorText: { color: '#D14343', marginBottom: 12, textAlign: 'center' },
  retryButton: {
    backgroundColor: '#2A6DF4',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: { color: '#fff', fontWeight: '600' },
  simulateErrorButton: {
    backgroundColor: '#FFF4E5',
    borderWidth: 1,
    borderColor: '#F5C177',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  simulateErrorText: { color: '#946200', fontSize: 12, fontWeight: '600' },
  search: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#DDD',
    marginRight: 8,
    marginBottom: 8,
  },
  filterChipActive: {
    backgroundColor: '#2A6DF4',
    borderColor: '#2A6DF4',
  },
  filterText: { fontSize: 13, color: '#444' },
  filterTextActive: { color: '#fff', fontWeight: '600' },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 6,
  },
  sortLabel: { fontSize: 12, color: '#777', marginRight: 4 },
  sortChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: '#F0F2F5',
    marginRight: 6,
    marginBottom: 6,
  },
  sortChipActive: {
    backgroundColor: '#DCE6FD',
  },
  sortText: { fontSize: 12, color: '#555' },
  sortTextActive: { color: '#2A6DF4', fontWeight: '700' },
});
