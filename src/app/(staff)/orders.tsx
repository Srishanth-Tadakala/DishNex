// ==============================================================================
// KITCHEN DISPLAY SYSTEM & ORDER PROCESSING (Part 6.2 & 6.3)
// Real-time lifecycle: Placed -> Confirmed -> Preparing -> Ready -> Completed
// ==============================================================================

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { radii, spacing, shadows } from '../../theme/spacing';
import { Header } from '../../components/common/Header';
import { formatPaise } from '../../utils/currency';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { Order, OrderStatus } from '../../types';

export default function StaffOrdersScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<'active' | 'all'>('active');

  useEffect(() => {
    // Role-based route guard
    if (!user || !['staff', 'manager', 'owner', 'admin'].includes(user.role)) {
      Alert.alert(
        'Access Denied',
        'Staff privileges are required to view the kitchen orders queue.',
        [{ text: 'Return to Home', onPress: () => router.replace('/(customer)/(tabs)') }]
      );
      return;
    }

    async function loadOrders() {
      try {
        const data = await api.getStaffOrders(user?.role);
        setOrders(data);
      } catch (e: any) {
        console.warn('Unauthorized staff orders fetch:', e);
      }
    }
    loadOrders();
    const interval = setInterval(loadOrders, 3000);
    return () => clearInterval(interval);
  }, [user, router]);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const updated = await api.updateOrderStatus(orderId, newStatus, undefined, user?.role);
      setOrders((prev) =>
        prev.map((o) => (o.id === updated.id ? updated : o))
      );
    } catch (e: any) {
      alert(e.message || 'Status update failed');
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (filter === 'active') {
      return !['completed', 'cancelled', 'rejected'].includes(o.status);
    }
    return true;
  });

  const renderOrderCard = ({ item }: { item: Order }) => {
    return (
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.orderNumber}>{item.orderNumber}</Text>
            <Text style={styles.orderType}>
              Mode: {item.orderType.toUpperCase()} {item.tableIdentifier ? `(${item.tableIdentifier})` : ''}
            </Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
          </View>
        </View>

        {/* Customer & Address */}
        {item.deliveryAddress && (
          <Text style={styles.addressText} numberOfLines={1}>
            📍 {item.deliveryAddress.recipientName} — {item.deliveryAddress.streetAddress}
          </Text>
        )}

        {/* Items List */}
        <View style={styles.itemsBox}>
          {item.items?.map((i) => (
            <View key={i.id} style={styles.itemRow}>
              <Text style={styles.itemName}>
                {i.quantity}x {i.itemName}
              </Text>
              <Text style={styles.itemPrice}>
                {formatPaise(i.totalPricePaise)}
              </Text>
            </View>
          ))}
        </View>

        {/* Total & Payment */}
        <View style={styles.totalRow}>
          <Text style={styles.paymentMethod}>
            Payment: {item.paymentMethod.toUpperCase()} ({item.paymentStatus})
          </Text>
          <Text style={styles.totalPrice}>{formatPaise(item.totalPaise)}</Text>
        </View>

        {/* Status Transition Actions */}
        <View style={styles.actionsRow}>
          {item.status === 'placed' && (
            <>
              <TouchableOpacity
                onPress={() => handleUpdateStatus(item.id, 'rejected')}
                style={[styles.actionBtn, styles.rejectBtn]}
              >
                <Text style={styles.rejectBtnText}>Reject</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleUpdateStatus(item.id, 'confirmed')}
                style={[styles.actionBtn, styles.acceptBtn]}
              >
                <Text style={styles.acceptBtnText}>Accept Order</Text>
              </TouchableOpacity>
            </>
          )}

          {item.status === 'confirmed' && (
            <TouchableOpacity
              onPress={() => handleUpdateStatus(item.id, 'preparing')}
              style={[styles.actionBtn, styles.prepBtn]}
            >
              <Text style={styles.actionBtnText}>Mark Preparing</Text>
            </TouchableOpacity>
          )}

          {item.status === 'preparing' && (
            <TouchableOpacity
              onPress={() => handleUpdateStatus(item.id, 'ready')}
              style={[styles.actionBtn, styles.readyBtn]}
            >
              <Text style={styles.actionBtnText}>Mark Ready</Text>
            </TouchableOpacity>
          )}

          {item.status === 'ready' && (
            <TouchableOpacity
              onPress={() => handleUpdateStatus(item.id, 'completed')}
              style={[styles.actionBtn, styles.completeBtn]}
            >
              <Text style={styles.actionBtnText}>Mark Completed</Text>
            </TouchableOpacity>
          )}

          {item.status === 'completed' && (
            <View style={styles.completedBadge}>
              <Ionicons name="checkmark-circle" size={16} color={colors.success} />
              <Text style={styles.completedText}>Order Fulfilled</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Kitchen Display Queue"
        showBack={true}
        onBack={() => router.back()}
        style={styles.header}
      />

      {/* Filter Tabs */}
      <View style={styles.filterBar}>
        <TouchableOpacity
          onPress={() => setFilter('active')}
          style={[styles.filterTab, filter === 'active' && styles.filterTabActive]}
        >
          <Text
            style={[
              styles.filterTabText,
              filter === 'active' && styles.filterTabTextActive,
            ]}
          >
            Active Orders ({orders.filter((o) => !['completed', 'rejected'].includes(o.status)).length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setFilter('all')}
          style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
        >
          <Text
            style={[
              styles.filterTabText,
              filter === 'all' && styles.filterTabTextActive,
            ]}
          >
            All Orders ({orders.length})
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={renderOrderCard}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Kitchen Queue Clear</Text>
            <Text style={styles.emptySub}>
              All incoming customer orders have been processed.
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
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: radii.full,
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  filterTabActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  filterTabTextActive: {
    color: colors.textDark,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    marginBottom: spacing.md,
    ...shadows.card,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  orderType: {
    fontSize: 11,
    color: colors.accent,
    fontWeight: '700',
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.xs,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  addressText: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  itemsBox: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radii.md,
    padding: spacing.sm,
    marginVertical: spacing.xs,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  itemPrice: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
  },
  paymentMethod: {
    fontSize: 11,
    color: colors.textMuted,
  },
  totalPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.accent,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptBtn: {
    backgroundColor: colors.accent,
  },
  acceptBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textDark,
  },
  rejectBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.error,
  },
  rejectBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.error,
  },
  prepBtn: {
    backgroundColor: '#F1B75A',
  },
  readyBtn: {
    backgroundColor: '#64B5F6',
  },
  completeBtn: {
    backgroundColor: colors.success,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textDark,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
  },
  completedText: {
    fontSize: 13,
    color: colors.success,
    fontWeight: '700',
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

