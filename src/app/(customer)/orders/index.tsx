// ==============================================================================
// ORDER HISTORY SCREEN (Part 5.4 Specification)
// ==============================================================================

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { radii, spacing, shadows } from '../../../theme/spacing';
import { Header } from '../../../components/common/Header';
import { formatPaise } from '../../../utils/currency';
import { api } from '../../../services/api';
import { useAuthStore } from '../../../store/authStore';
import { Order } from '../../../types';

export default function OrderHistoryScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function loadOrders() {
      const data = await api.getUserOrders(user?.id || 'user-siddu-01');
      setOrders(data);
    }
    loadOrders();
  }, [user]);

  const renderOrderItem = ({ item }: { item: Order }) => {
    const isCompleted = item.status === 'completed';
    const statusColor = isCompleted ? colors.success : colors.accent;

    return (
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={() => router.push(`/(customer)/orders/${item.id}`)}
        style={styles.orderCard}
      >
        <View style={styles.orderCardTop}>
          <View>
            <Text style={styles.orderNumber}>{item.orderNumber}</Text>
            <Text style={styles.orderDate}>
              {new Date(item.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </Text>
          </View>

          <View style={[styles.statusBadge, { borderColor: statusColor }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.itemsSummary}>
          <Text style={styles.itemsSummaryText} numberOfLines={1}>
            {item.items?.map((i) => `${i.quantity}x ${i.itemName}`).join(', ') ||
              'Fine dining items'}
          </Text>
        </View>

        <View style={styles.orderCardBottom}>
          <Text style={styles.orderTotal}>{formatPaise(item.totalPaise)}</Text>
          <View style={styles.trackLink}>
            <Text style={styles.trackText}>Track Order</Text>
            <Ionicons name="arrow-forward" size={14} color={colors.accent} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Order History"
        showBack={true}
        onBack={() => router.back()}
        style={styles.header}
      />

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={renderOrderItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <Text style={styles.emptySub}>
              Your past luxury feasts will appear here.
            </Text>
          </View>
        }
      />
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
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 40,
  },
  orderCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    marginBottom: spacing.md,
    ...shadows.card,
  },
  orderCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  orderNumber: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  orderDate: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radii.full,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  itemsSummary: {
    marginVertical: spacing.sm,
  },
  itemsSummaryText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  orderCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
  },
  orderTotal: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  trackLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trackText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.accent,
  },
  emptyContainer: {
    paddingTop: 80,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 13,
    color: colors.textMuted,
  },
});

