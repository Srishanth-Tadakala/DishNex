// ==============================================================================
// EMBER ROOT LAYOUT (_layout.tsx)
// ==============================================================================

import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { colors } from '../theme/colors';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export default function RootLayout() {
  return (
    <SafeAreaProvider style={{ backgroundColor: colors.background }}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="light" backgroundColor={colors.background} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)/sign-in" />
          <Stack.Screen name="(customer)/(tabs)" />
          <Stack.Screen name="(customer)/onboarding/index" />
          <Stack.Screen name="(customer)/category/[id]" />
          <Stack.Screen name="(customer)/food/[id]" />
          <Stack.Screen name="(customer)/search" />
          <Stack.Screen name="(customer)/checkout" />
          <Stack.Screen name="(customer)/confirmation" />
          <Stack.Screen name="(customer)/orders/index" />
          <Stack.Screen name="(customer)/orders/[id]" />
          <Stack.Screen name="(customer)/profile" />
          <Stack.Screen name="(customer)/addresses/index" />
          <Stack.Screen name="(customer)/support" />
          <Stack.Screen name="(staff)" />
        </Stack>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

