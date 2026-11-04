// ==============================================================================
// SCREEN 08 — CATEGORY MENU LIST (Biryani)
// ==============================================================================

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors } from '../../../theme/colors';
import { radii, spacing } from '../../../theme/spacing';
import { Header } from '../../../components/common/Header';
import { FoodCard } from '../../../components/cards/FoodCard';
import { api } from '../../../services/api';
import { MenuItem } from '../../../types';

const DIETARY_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'veg', label: 'Veg' },
  { key: 'non-veg', label: 'Non-Veg' },
];

export default function CategoryMenuScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [categoryName, setCategoryName] = useState('Biryani');
  const [items, setItems] = useState<MenuItem[]>([]);
  const [activeDietary, setActiveDietary] = useState('all');

  useEffect(() => {
    async function fetchItems() {
      const categoryId = id || 'c-biryani';
      const categories = await api.getCategories();
      const cat = categories.find((c) => c.id === categoryId);
      if (cat) {
        setCategoryName(cat.name);
      }
      const data = await api.getMenuItems(categoryId, activeDietary);
      setItems(data);
    }
    fetchItems();
  }, [id, activeDietary]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header
        title={categoryName}
        showBack={true}
        onBack={() => router.back()}
        style={styles.header}
      />

      {/* Filter Chips (All, Veg, Non-Veg) */}
      <View style={styles.filtersContainer}>
        <View style={styles.filtersRow}>
          {DIETARY_FILTERS.map((f) => {
            const isActive = f.key === activeDietary;
            return (
              <TouchableOpacity
                key={f.key}
                activeOpacity={0.8}
                onPress={() => setActiveDietary(f.key)}
                style={[
                  styles.filterChip,
                  isActive ? styles.activeFilterChip : styles.inactiveFilterChip,
                ]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isActive
                      ? styles.activeFilterChipText
                      : styles.inactiveFilterChipText,
                  ]}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Food Cards List */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <FoodCard
            item={item}
            variant="ivory"
            onPress={() => router.push(`/(customer)/food/${item.id}`)}
          />
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
  filtersContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  filtersRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: 22,
    paddingVertical: 7,
    borderRadius: radii.full,
    borderWidth: 1,
  },
  activeFilterChip: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  inactiveFilterChip: {
    backgroundColor: colors.surfaceSecondary,
    borderColor: colors.borderSubtle,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  activeFilterChipText: {
    color: colors.textDark,
  },
  inactiveFilterChipText: {
    color: colors.textSecondary,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 40,
  },
});

