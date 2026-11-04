// ==============================================================================
// SCREEN 11 — SAVED / FAVOURITES
// ==============================================================================

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { Header } from '../../../components/common/Header';
import { SegmentedControl } from '../../../components/common/SegmentedControl';
import { FoodCard } from '../../../components/cards/FoodCard';
import { useFavoritesStore } from '../../../store/favoritesStore';
import { api } from '../../../services/api';
import { MenuItem } from '../../../types';

export default function SavedScreen() {
  const router = useRouter();
  const { favoriteDishIds, activeTab, setActiveTab } = useFavoritesStore();
  const [favoriteItems, setFavoriteItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    async function loadFavorites() {
      const allItems = await api.getMenuItems();
      const filtered = allItems.filter((item) =>
        favoriteDishIds.includes(item.id)
      );
      setFavoriteItems(filtered);
    }
    loadFavorites();
  }, [favoriteDishIds]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header
        title="Saved"
        showBack={true}
        onBack={() => router.back()}
        style={styles.header}
      />

      {/* Segmented Tabs: Dishes (4) | Restaurants */}
      <View style={styles.tabContainer}>
        <SegmentedControl
          options={[
            {
              key: 'dishes',
              label: `Dishes (${favoriteDishIds.length})`,
            },
            { key: 'restaurants', label: 'Restaurants' },
          ]}
          selectedKey={activeTab}
          onSelect={(key) => setActiveTab(key as any)}
        />
      </View>

      {/* Content */}
      {activeTab === 'dishes' ? (
        <FlatList
          data={favoriteItems}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <FoodCard
              item={item}
              variant="ivory"
              onPress={() => router.push(`/(customer)/food/${item.id}`)}
              showAddButton={true}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No saved dishes yet</Text>
              <Text style={styles.emptySub}>
                Tap the heart on any culinary masterpiece to save it here.
              </Text>
            </View>
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>EMBER Flagship — Rajkot</Text>
          <Text style={styles.emptySub}>
            Your primary luxury dining destination is saved.
          </Text>
        </View>
      )}
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
  tabContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 40,
  },
  emptyContainer: {
    paddingTop: 80,
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
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
    textAlign: 'center',
  },
});

