// ==============================================================================
// STAFF OPERATIONS DASHBOARD (Part 6.1 Specification)
// Live Kitchen Metrics: Incoming, Active, Completed, Revenue
// ==============================================================================

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { radii, spacing, shadows } from '../../theme/spacing';
import { Header } from '../../components/common/Header';
import { Button } from '../../components/common/Button';
import { formatPaise } from '../../utils/currency';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { Order } from '../../types';

export default function StaffDashboardScreen() {
  const router = useRouter();
  const { user, setUserRole } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Role-based route guard
    if (!user || !['staff', 'manager', 'owner', 'admin'].includes(user.role)) {
      Alert.alert(
        'Access Denied',
        'Staff privileges are required to view the operations dashboard.',
        [{ text: 'Return to Home', onPress: () => router.replace('/(customer)/(tabs)') }]
      );
      return;
    }

    async function loadMetrics() {
      try {
        const allOrders = await api.getStaffOrders(user?.role);
        setOrders(allOrders);
      } catch (err) {
        console.warn('Unauthorized staff metrics fetch:', err);
      }
    }
    loadMetrics();
    const interval = setInterval(loadMetrics, 3000);
    return () => clearInterval(interval);
  }, [user, router]);

  const incomingCount = orders.filter((o) => o.status === 'placed').length;
  const activeCount = orders.filter((o) =>
    ['confirmed', 'preparing', 'ready', 'dispatched'].includes(o.status)
  ).length;
  const completedCount = orders.filter((o) => o.status === 'completed').length;
  const totalRevenuePaise = orders
    .filter((o) => o.status === 'completed')
    .reduce((sum, o) => sum + o.totalPaise, 0);

  const handleExitStaffMode = () => {
    setUserRole('customer');
    router.replace('/(customer)/(tabs)');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header
        title="Operations Hub"
        showBack={true}
        onBack={handleExitStaffMode}
        style={styles.header}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Branch Identifier Badge */}
        <View style={styles.branchCard}>
          <View>
            <Text style={styles.branchName}>DishNex Flagship — Rajkot</Text>
            <Text style={styles.staffRoleText}>
              Logged in as {user?.fullName} ({user?.role.toUpperCase()})
            </Text>
          </View>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>KITCHEN ONLINE</Text>
          </View>
        </View>

        {/* 4 Core Metrics Grid */}
        <View style={styles.metricsGrid}>
          {/* Incoming Orders */}
          <TouchableOpacity
            style={[styles.metricCard, incomingCount > 0 && styles.metricAlert]}
            onPress={() => router.push('/(staff)/orders')}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name="bell-ring-outline"
              size={24}
              color={incomingCount > 0 ? colors.accent : colors.textSecondary}
            />
            <Text style={styles.metricNumber}>{incomingCount}</Text>
            <Text style={styles.metricLabel}>New Incoming</Text>
          </TouchableOpacity>

          {/* Active Orders */}
          <TouchableOpacity
            style={styles.metricCard}
            onPress={() => router.push('/(staff)/orders')}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name="chef-hat"
              size={24}
              color={colors.accent}
            />
            <Text style={styles.metricNumber}>{activeCount}</Text>
            <Text style={styles.metricLabel}>Preparing / Ready</Text>
          </TouchableOpacity>

          {/* Completed Orders */}
          <View style={styles.metricCard}>
            <Ionicons
              name="checkmark-circle-outline"
              size={24}
              color={colors.success}
            />
            <Text style={styles.metricNumber}>{completedCount}</Text>
            <Text style={styles.metricLabel}>Completed Today</Text>
          </View>

          {/* Daily Revenue */}
          <View style={styles.metricCard}>
            <Ionicons
              name="cash-outline"
              size={24}
              color={colors.accent}
            />
            <Text style={styles.metricNumber}>
              {formatPaise(totalRevenuePaise)}
            </Text>
            <Text style={styles.metricLabel}>Total Revenue</Text>
          </View>
        </View>

        {/* Operational Action Shortcuts */}
        <Text style={styles.sectionTitle}>Operational Modules</Text>

        {/* Kitchen Display System (KDS) */}
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => router.push('/(staff)/orders')}
          style={styles.actionCard}
        >
          <View style={styles.actionLeft}>
            <View style={styles.actionIconBox}>
              <MaterialCommunityIcons
                name="clipboard-list-outline"
                size={24}
                color={colors.textDark}
              />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionTitle}>Kitchen Display System (KDS)</Text>
              <Text style={styles.actionSub}>
                Accept, prepare and dispatch customer orders
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.accent} />
        </TouchableOpacity>

        {/* Menu Administration (86 Stock Toggle) */}
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => router.push('/(staff)/menu-admin')}
          style={styles.actionCard}
        >
          <View style={styles.actionLeft}>
            <View style={[styles.actionIconBox, { backgroundColor: '#F1B75A' }]}>
              <MaterialCommunityIcons
                name="silverware-clean"
                size={24}
                color={colors.textDark}
              />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionTitle}>Menu Item & 86 Stock Admin</Text>
              <Text style={styles.actionSub}>
                Toggle item stock, update pricing, manage add-ons
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.accent} />
        </TouchableOpacity>

        {/* Exit Staff Mode Button */}
        <Button
          title="Return to Customer App"
          variant="outline"
          onPress={handleExitStaffMode}
          style={{ marginTop: spacing.xl }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 48,
    height: 96,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 40,
  },
  branchCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    marginBottom: spacing.lg,
    ...shadows.card,
  },
  branchName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  staffRoleText: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(216, 240, 107, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
    marginRight: 6,
  },
  liveText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.accent,
    letterSpacing: 0.5,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  metricCard: {
    width: '47.5%',
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    ...shadows.card,
  },
  metricAlert: {
    borderColor: colors.accent,
    backgroundColor: 'rgba(216, 240, 107, 0.05)',
  },
  metricNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 8,
  },
  metricLabel: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    marginBottom: spacing.md,
    ...shadows.card,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionIconBox: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  actionSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
});

