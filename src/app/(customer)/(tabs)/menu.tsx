// ==============================================================================
// SCREEN 07 — MENU / CATEGORIES
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
import { useRouter } from 'expo-router';
import { colors } from '../../../theme/colors';
import { radii, spacing } from '../../../theme/spacing';
import { Header } from '../../../components/common/Header';
import { CategoryCard } from '../../../components/cards/CategoryCard';
import { api } from '../../../services/api';
import { MenuCategory } from '../../../types';

const FILTER_TAGS = ['All', 'Veg', 'Non-Veg', 'Beverages'];

export default function MenuScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    async function fetchCategories() {
      const data = await api.getCategories();
      setCategories(data);
    }
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((cat) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Beverages') return cat.slug === 'beverages';
    return true;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header
        title="Menu"
        showBack={true}
        onBack={() => router.back()}
        rightIcon="search-outline"
        onRightPress={() => router.push('/(customer)/search')}
        style={styles.header}
      />

      {/* Filter Chips (All, Veg, Non-Veg, Beverages) */}
      <View style={styles.filtersContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScroll}
        >
          {FILTER_TAGS.map((tag) => {
            const isActive = tag === activeFilter;
            return (
              <TouchableOpacity
                key={tag}
                activeOpacity={0.8}
                onPress={() => setActiveFilter(tag)}
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
                  {tag}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 2-Column Grid */}
      <FlatList
        data={filteredCategories}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.gridContent}
        renderItem={({ item }) => (
          <CategoryCard
            category={item}
            onPress={() => router.push(`/(customer)/category/${item.id}`)}
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
    marginVertical: spacing.sm,
  },
  filtersScroll: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: 20,
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
  gridContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: 40,
  },
});

