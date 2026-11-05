// ==============================================================================
// SCREEN 10 — SEARCH (Exact Reference Screen 10 Layout & Instant Querying)
// ==============================================================================

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '../../theme/colors';
import { radii, spacing, shadows } from '../../theme/spacing';
import { FoodCard } from '../../components/cards/FoodCard';
import { api } from '../../services/api';
import { MOCK_MENU_ITEMS } from '../../services/mockData';
import { MenuItem } from '../../types';

const SEARCH_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'dishes', label: 'Dishes' },
  { key: 'categories', label: 'Categories' },
];

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('Biryani');
  const [activeFilter, setActiveFilter] = useState<'all' | 'dishes' | 'categories'>('all');
  const [results, setResults] = useState<MenuItem[]>(
    MOCK_MENU_ITEMS.filter((i) => i.categoryId === 'c-biryani')
  );
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    async function executeSearch() {
      const items = await api.searchDishes(query, activeFilter);
      setResults(items);
    }
    executeSearch();
  }, [query, activeFilter]);

  const handleClear = () => {
    try {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (_) {}
    setQuery('');
  };

  const handleFilterSelect = (key: 'all' | 'dishes' | 'categories') => {
    if (key !== activeFilter) {
      try {
        if (Platform.OS !== 'web') {
          Haptics.selectionAsync();
        }
      } catch (_) {}
      setActiveFilter(key);
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. Top Search Header with Back & Clear */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>

        <View
          style={[
            styles.searchBox,
            isFocused && styles.searchBoxFocused,
          ]}
        >
          <Ionicons
            name="search-outline"
            size={18}
            color={isFocused ? colors.accent : colors.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search dishes, cuisines..."
            placeholderTextColor={colors.textMuted}
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            autoFocus={false}
          />
          {query.length > 0 && (
            <TouchableOpacity
              onPress={handleClear}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel="Clear search input"
            >
              <Ionicons
                name="close-circle"
                size={18}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 2. Filter Pills (All, Dishes, Categories) */}
      <View style={styles.filtersRow}>
        {SEARCH_FILTERS.map((f) => {
          const isActive = f.key === activeFilter;
          return (
            <TouchableOpacity
              key={f.key}
              activeOpacity={0.8}
              onPress={() => handleFilterSelect(f.key as any)}
              style={[
                styles.filterChip,
                isActive ? styles.activeFilterChip : styles.inactiveFilterChip,
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
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

      {/* 3. Results Header Count */}
      <View style={styles.resultsCountRow}>
        <Text style={styles.resultsCountText}>
          Results ({results.length})
        </Text>
      </View>

      {/* 4. Results List */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <FoodCard
            item={item}
            onPress={() => router.push(`/(customer)/food/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No dishes found</Text>
            <Text style={styles.emptySub}>
              Try searching for "Biryani", "Paneer", or "Lava Cake"
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
    paddingTop: 50,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  backButton: {
    marginRight: spacing.md,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    ...shadows.card,
  },
  searchBoxFocused: {
    borderColor: colors.accent,
    backgroundColor: colors.surfaceSecondary,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 14,
  },
  filtersRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: radii.full,
    borderWidth: 1,
  },
  activeFilterChip: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
    ...shadows.accent,
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
  resultsCountRow: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  resultsCountText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 40,
  },
  emptyContainer: {
    paddingTop: 60,
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
