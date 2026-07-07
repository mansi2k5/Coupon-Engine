import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { AppliedCouponsProvider } from './src/context/AppliedCouponsContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppliedCouponsProvider>
        <StatusBar style="dark" />
        <AppNavigator />
      </AppliedCouponsProvider>
    </SafeAreaProvider>
  );
}
