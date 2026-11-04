// ==============================================================================
// MENU ADMINISTRATION & 86 STOCK AVAILABILITY (Part 6.4 Specification)
// Allows restaurant staff/managers to toggle in-stock / out-of-stock items in real-time
// ==============================================================================

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Switch,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../theme/colors';
import { radii, spacing, shadows } from '../../theme/spacing';
import { Header } from '../../components/common/Header';
import { DietaryBadge } from '../../components/common/DietaryBadge';
import { formatPaise } from '../../utils/currency';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { MenuItem } from '../../types';

export default function MenuAdminScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [items, setItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    // Role-based route guard: only managers and owners can manage menu catalog
    if (!user || !['manager', 'owner', 'admin'].includes(user.role)) {
      Alert.alert(
        'Access Denied',
        'Managerial privileges are required to configure menu stock availability.',
        [{ text: 'Return to Home', onPress: () => router.replace('/(customer)/(tabs)') }]
      );
      return;
    }

    async function loadItems() {
      const all = await api.getMenuItems();
      setItems(all);
    }
    loadItems();
  }, [user, router]);

  const handleToggleStock = async (item: MenuItem, newValue: boolean) => {
    try {
      const updated = await api.toggleMenuItemStock(item.id, newValue, user?.role);
      setItems((prev) =>
        prev.map((i) => (i.id === updated.id ? updated : i))
      );
    } catch (e: any) {
      alert(e.message || 'Error updating stock');
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Menu Stock & 86 Admin"
        showBack={true}
        onBack={() => router.back()}
        style={styles.header}
      />

      <View style={styles.infoBanner}>
        <Text style={styles.infoText}>
          Toggling an item "Off" immediately prevents customers from adding it to cart or ordering it.
        </Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View
            style={[
              styles.itemCard,
              !item.isAvailable && styles.itemCardUnavailable,
            ]}
          >
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.thumb}
              resizeMode="cover"
            />

            <View style={styles.itemInfo}>
              <View style={styles.titleRow}>
                <DietaryBadge type={item.dietaryClassification} size={14} />
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.name}
                </Text>
              </View>

              <Text style={styles.itemPrice}>
                {formatPaise(item.pricePaise)}
              </Text>

              <Text
                style={[
                  styles.stockStatus,
                  item.isAvailable ? styles.inStock : styles.outOfStock,
                ]}
              >
                {item.isAvailable ? 'AVAILABLE IN KITCHEN' : '86 / OUT OF STOCK'}
              </Text>
            </View>

            {/* Toggle Switch */}
            <Switch
              value={item.isAvailable}
              onValueChange={(val) => handleToggleStock(item, val)}
              trackColor={{
                false: colors.surfaceSecondary,
                true: 'rgba(216, 240, 107, 0.4)',
              }}
              thumbColor={item.isAvailable ? colors.accent : colors.textMuted}
            />
          </View>
        )}
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
  infoBanner: {
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 40,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    ...shadows.card,
  },
  itemCardUnavailable: {
    opacity: 0.6,
    borderColor: colors.error,
  },
  thumb: {
    width: 60,
    height: 60,
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceSecondary,
  },
  itemInfo: {
    flex: 1,
    marginLeft: spacing.md,
    marginRight: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  stockStatus: {
    fontSize: 10,
    fontWeight: '800',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  inStock: {
    color: colors.success,
  },
  outOfStock: {
    color: colors.error,
  },
});

