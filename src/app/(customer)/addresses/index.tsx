// ==============================================================================
// SAVED ADDRESSES MANAGEMENT (Part 5.3 Specification)
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
import { Button } from '../../../components/common/Button';
import { api } from '../../../services/api';
import { useAuthStore } from '../../../store/authStore';
import { Address } from '../../../types';

export default function AddressesScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [addresses, setAddresses] = useState<Address[]>([]);

  useEffect(() => {
    async function fetchAddresses() {
      const data = await api.getAddresses(user?.id || 'user-siddu-01');
      setAddresses(data);
    }
    fetchAddresses();
  }, [user]);

  return (
    <View style={styles.container}>
      <Header
        title="Saved Addresses"
        showBack={true}
        onBack={() => router.back()}
        style={styles.header}
      />

      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.addressCard}>
            <View style={styles.cardTop}>
              <View style={styles.labelRow}>
                <Ionicons
                  name={item.label === 'Home' ? 'home-outline' : 'briefcase-outline'}
                  size={18}
                  color={colors.accent}
                />
                <Text style={styles.addressLabel}>{item.label}</Text>
                {item.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultText}>DEFAULT</Text>
                  </View>
                )}
              </View>

              <TouchableOpacity>
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.recipientText}>{item.recipientName} ({item.phoneNumber})</Text>
            <Text style={styles.streetText}>{item.streetAddress}</Text>
          </View>
        )}
      />

      <View style={styles.footer}>
        <Button
          title="Add New Address"
          iconLeft="add"
          variant="outline"
          onPress={() => alert('New address modal')}
        />
      </View>
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
  addressCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    marginBottom: spacing.md,
    ...shadows.card,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addressLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  defaultBadge: {
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radii.xs,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  defaultText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.accent,
  },
  editText: {
    fontSize: 13,
    color: colors.accent,
    fontWeight: '600',
  },
  recipientText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  streetText: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 32,
  },
});

