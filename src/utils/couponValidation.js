import { COUPON_TYPES } from '../data/mockCoupons';

// Pure functions only — no React, no state, no side effects.
// This keeps validation logic testable and reusable (e.g. if this app later
// needs to validate coupons on a details screen AND a checkout screen,
// both can call the same function without duplicating rules).

export function isExpired(coupon, today = new Date()) {
  return new Date(coupon.expiryDate) < today;
}

export function getStatus(coupon, today = new Date()) {
  return isExpired(coupon, today) ? 'Expired' : 'Active';
}

/**
 * Validates a coupon code against a cart total.
 * @param {Array} coupons - full coupon list (acts as the "database")
 * @param {string} code - coupon code entered by user
 * @param {number} cartTotal - numeric cart total
 * @returns {{ valid: boolean, reason?: string, discountAmount?: number, finalPrice?: number, coupon?: object }}
 */
export function validateCoupon(coupons, code, cartTotal) {
  if (!code || !code.trim()) {
    return { valid: false, reason: 'Please enter a coupon code.' };
  }
  if (cartTotal === '' || cartTotal === null || isNaN(cartTotal)) {
    return { valid: false, reason: 'Please enter a valid cart total.' };
  }

  const coupon = coupons.find(
    (c) => c.code.toLowerCase() === code.trim().toLowerCase()
  );

  if (!coupon) {
    return { valid: false, reason: 'Coupon code not found.' };
  }

  if (isExpired(coupon)) {
    return { valid: false, reason: 'This coupon has expired.', coupon };
  }

  if (Number(cartTotal) < coupon.minOrderValue) {
    return {
      valid: false,
      reason: `Cart total must be at least ₹${coupon.minOrderValue} to use this coupon.`,
      coupon,
    };
  }

  const discountAmount = calculateDiscount(coupon, Number(cartTotal));
  const finalPrice = Math.max(Number(cartTotal) - discountAmount, 0);

  return { valid: true, coupon, discountAmount, finalPrice };
}

export function calculateDiscount(coupon, cartTotal) {
  switch (coupon.type) {
    case COUPON_TYPES.PERCENTAGE:
      return Math.round((coupon.value / 100) * cartTotal);
    case COUPON_TYPES.FLAT:
      return Math.min(coupon.value, cartTotal);
    case COUPON_TYPES.FREE_SHIPPING:
      // No monetary discount modeled in this mock; shipping cost isn't tracked.
      return 0;
    default:
      return 0;
  }
}

export function formatDiscountLabel(coupon) {
  switch (coupon.type) {
    case COUPON_TYPES.PERCENTAGE:
      return `${coupon.value}% off`;
    case COUPON_TYPES.FLAT:
      return `₹${coupon.value} off`;
    case COUPON_TYPES.FREE_SHIPPING:
      return 'Free shipping';
    default:
      return '';
  }
}
