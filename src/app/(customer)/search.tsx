// ==============================================================================
// SCREEN 10 — SEARCH (Exact Reference Screen 10 Layout)
// ==============================================================================

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/spacing';
import { FoodCard } from '../../components/cards/FoodCard';
import { api } from '../../services/api';
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
  const [results, setResults] = useState<MenuItem[]>([]);

  useEffect(() => {
    async function executeSearch() {
      const items = await api.searchDishes(query, activeFilter);
      setResults(items);
    }
    executeSearch();
  }, [query, activeFilter]);

  return (
    <View style={styles.container}>
      {/* 1. Top Search Header with Back & Clear */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.searchBox}>
          <Ionicons
            name="search-outline"
            size={18}
            color={colors.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search dishes, cuisines..."
            placeholderTextColor={colors.textMuted}
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            autoFocus={false}
          />
          {query.length > 0 && (
            <TouchableOpacity
              onPress={() => setQuery('')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
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
              onPress={() => setActiveFilter(f.key as any)}
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

