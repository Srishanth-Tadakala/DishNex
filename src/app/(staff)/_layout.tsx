// ==============================================================================
// RESTAURANT STAFF OPERATIONS LAYOUT (_layout.tsx)
// Role-protected guard ensuring only authorized staff/manager/owner can access
// ==============================================================================

import React, { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { colors } from '../../theme/colors';

export default function StaffLayout() {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    // Role protection guard
    const isStaff = user && ['staff', 'manager', 'owner', 'chef'].includes(user.role);
    if (!isStaff) {
      router.replace('/(customer)/(tabs)');
    }
  }, [user, router]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="orders" />
      <Stack.Screen name="menu-admin" />
    </Stack>
  );
}

