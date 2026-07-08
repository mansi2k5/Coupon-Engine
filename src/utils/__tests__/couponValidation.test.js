import {
  isExpired,
  getStatus,
  validateCoupon,
  calculateDiscount,
  formatDiscountLabel,
} from '../couponValidation';
import { COUPON_TYPES } from '../../data/mockCoupons';

// A fixed "today" so expiry checks are deterministic regardless of when tests run.
const TODAY = new Date('2026-07-07');

const activeCoupon = {
  code: 'SAVE20',
  type: COUPON_TYPES.PERCENTAGE,
  value: 20,
  minOrderValue: 500,
  expiryDate: '2026-12-31',
};

const expiredCoupon = {
  code: 'WELCOME10',
  type: COUPON_TYPES.PERCENTAGE,
  value: 10,
  minOrderValue: 0,
  expiryDate: '2025-01-01',
};

const flatCoupon = {
  code: 'FLAT100',
  type: COUPON_TYPES.FLAT,
  value: 100,
  minOrderValue: 300,
  expiryDate: '2026-09-15',
};

const freeShippingCoupon = {
  code: 'FREESHIP',
  type: COUPON_TYPES.FREE_SHIPPING,
  value: 0,
  minOrderValue: 0,
  expiryDate: '2026-08-01',
};

const coupons = [activeCoupon, expiredCoupon, flatCoupon, freeShippingCoupon];

describe('isExpired / getStatus', () => {
  test('an active coupon is not expired', () => {
    expect(isExpired(activeCoupon, TODAY)).toBe(false);
    expect(getStatus(activeCoupon, TODAY)).toBe('Active');
  });

  test('a past-dated coupon is expired', () => {
    expect(isExpired(expiredCoupon, TODAY)).toBe(true);
    expect(getStatus(expiredCoupon, TODAY)).toBe('Expired');
  });
});

describe('calculateDiscount', () => {
  test('percentage coupon calculates correct discount', () => {
    expect(calculateDiscount(activeCoupon, 1000)).toBe(200); // 20% of 1000
  });

  test('flat coupon discounts a fixed amount, capped at cart total', () => {
    expect(calculateDiscount(flatCoupon, 1000)).toBe(100);
    expect(calculateDiscount(flatCoupon, 50)).toBe(50); // can't discount more than the cart total
  });

  test('free shipping coupon has no monetary discount', () => {
    expect(calculateDiscount(freeShippingCoupon, 1000)).toBe(0);
  });
});

describe('formatDiscountLabel', () => {
  test('formats each coupon type correctly', () => {
    expect(formatDiscountLabel(activeCoupon)).toBe('20% off');
    expect(formatDiscountLabel(flatCoupon)).toBe('₹100 off');
    expect(formatDiscountLabel(freeShippingCoupon)).toBe('Free shipping');
  });
});

describe('validateCoupon', () => {
  test('rejects an empty code', () => {
    const result = validateCoupon(coupons, '', 1000);
    expect(result.valid).toBe(false);
    expect(result.reason).toMatch(/enter a coupon code/i);
  });

  test('rejects a missing/invalid cart total', () => {
    const result = validateCoupon(coupons, 'SAVE20', '');
    expect(result.valid).toBe(false);
    expect(result.reason).toMatch(/valid cart total/i);
  });

  test('rejects a coupon code that does not exist', () => {
    const result = validateCoupon(coupons, 'DOESNOTEXIST', 1000);
    expect(result.valid).toBe(false);
    expect(result.reason).toMatch(/not found/i);
  });

  test('rejects an expired coupon', () => {
    const result = validateCoupon(coupons, 'WELCOME10', 1000);
    expect(result.valid).toBe(false);
    expect(result.reason).toMatch(/expired/i);
  });

  test('rejects a cart total below the minimum order value', () => {
    const result = validateCoupon(coupons, 'FLAT100', 100);
    expect(result.valid).toBe(false);
    expect(result.reason).toMatch(/at least/i);
  });

  test('accepts a valid coupon and returns discount + final price', () => {
    const result = validateCoupon(coupons, 'SAVE20', 1000);
    expect(result.valid).toBe(true);
    expect(result.discountAmount).toBe(200);
    expect(result.finalPrice).toBe(800);
  });

  test('is case-insensitive on the coupon code', () => {
    const result = validateCoupon(coupons, 'save20', 1000);
    expect(result.valid).toBe(true);
  });
});
