import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import CouponListScreen from '../screens/CouponListScreen';
import CouponDetailScreen from '../screens/CouponDetailScreen';
import CouponValidatorScreen from '../screens/CouponValidatorScreen';
import AppliedCouponsScreen from '../screens/AppliedCouponsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Coupon list + its detail screen live in one stack so tapping a card
// pushes the detail screen on top, while the tab bar stays visible
// for the other top-level sections.
function CouponsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CouponList"
        component={CouponListScreen}
        options={{ title: 'Coupons' }}
      />
      <Stack.Screen
        name="CouponDetail"
        component={CouponDetailScreen}
        options={{ title: 'Coupon Details' }}
      />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen
          name="Coupons"
          component={CouponsStack}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Validator"
          component={CouponValidatorScreen}
          options={{ headerShown: true, title: 'Validate Coupon' }}
        />
        <Tab.Screen
          name="Applied"
          component={AppliedCouponsScreen}
          options={{ headerShown: true, title: 'Applied Coupons' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
