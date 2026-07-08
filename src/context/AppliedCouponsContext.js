import React, { createContext, useContext, useState, useMemo } from 'react';

const AppliedCouponsContext = createContext(null);

export function AppliedCouponsProvider({ children }) {
  const [appliedCoupons, setAppliedCoupons] = useState([]);

  const applyCoupon = (couponWithResult) => {
    setAppliedCoupons((prev) => {
      // avoid duplicate entries for the same coupon code
      const exists = prev.some((c) => c.coupon.code === couponWithResult.coupon.code);
      if (exists) return prev;
      return [...prev, couponWithResult];
    });
  };

  const removeCoupon = (code) => {
    setAppliedCoupons((prev) => prev.filter((c) => c.coupon.code !== code));
  };

  const value = useMemo(
    () => ({ appliedCoupons, applyCoupon, removeCoupon }),
    [appliedCoupons]
  );

  return (
    <AppliedCouponsContext.Provider value={value}>
      {children}
    </AppliedCouponsContext.Provider>
  );
}

export function useAppliedCoupons() {
  const ctx = useContext(AppliedCouponsContext);
  if (!ctx) {
    throw new Error('useAppliedCoupons must be used within AppliedCouponsProvider');
  }
  return ctx;
}
