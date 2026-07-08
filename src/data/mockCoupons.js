// Simulated "database" of coupons. In a real app this would come from a backend.
// Types: PERCENTAGE, FLAT, FREE_SHIPPING
// Dates are ISO strings so they are easy to compare against `new Date()`.

export const COUPON_TYPES = {
  PERCENTAGE: 'PERCENTAGE',
  FLAT: 'FLAT',
  FREE_SHIPPING: 'FREE_SHIPPING',
};

export const mockCoupons = [
  {
    id: 'c1',
    code: 'SAVE20',
    type: COUPON_TYPES.PERCENTAGE,
    value: 20, // 20% off
    minOrderValue: 500,
    expiryDate: '2026-12-31',
    categories: ['All courses'],
    description: '20% off on all courses',
  },
  {
    id: 'c2',
    code: 'FLAT100',
    type: COUPON_TYPES.FLAT,
    value: 100, // ₹100 off
    minOrderValue: 300,
    expiryDate: '2026-09-15',
    categories: ['Science only'],
    description: '₹100 off on Science courses',
  },
  {
    id: 'c3',
    code: 'FREESHIP',
    type: COUPON_TYPES.FREE_SHIPPING,
    value: 0,
    minOrderValue: 0,
    expiryDate: '2026-08-01',
    categories: ['All courses'],
    description: 'Free shipping on any order',
  },
  {
    id: 'c4',
    code: 'WELCOME10',
    type: COUPON_TYPES.PERCENTAGE,
    value: 10,
    minOrderValue: 0,
    expiryDate: '2025-01-01', // expired
    categories: ['All courses'],
    description: '10% off for new users',
  },
  {
    id: 'c5',
    code: 'MEGA500',
    type: COUPON_TYPES.FLAT,
    value: 500,
    minOrderValue: 2000,
    expiryDate: '2026-11-30',
    categories: ['All courses'],
    description: '₹500 off on orders above ₹2000',
  },
  {
    id: 'c6',
    code: 'SUMMER15',
    type: COUPON_TYPES.PERCENTAGE,
    value: 15,
    minOrderValue: 800,
    expiryDate: '2025-06-01', // expired
    categories: ['Science only'],
    description: '15% off summer sale (Science)',
  },
  {
    id: 'c7',
    code: 'SHIPFREE2',
    type: COUPON_TYPES.FREE_SHIPPING,
    value: 0,
    minOrderValue: 100,
    expiryDate: '2026-10-10',
    categories: ['All courses'],
    description: 'Free shipping above ₹100',
  },
];

// Simulates a network call. Set `shouldFail` to true to test the error state.
export function fetchCoupons({ shouldFail = false, delay = 1200 } = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('Failed to fetch coupons. Please try again.'));
      } else {
        resolve(mockCoupons);
      }
    }, delay);
  });
}
