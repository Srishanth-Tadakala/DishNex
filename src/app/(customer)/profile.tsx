// ==============================================================================
// CUSTOMER PROFILE & ACCOUNT CONTROLS (Part 5.1 & Part 6 Bridge)
// Includes operational toggle to enter Restaurant Staff Mode
// ==============================================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { radii, spacing, shadows } from '../../theme/spacing';
import { Header } from '../../components/common/Header';
import { useAuthStore } from '../../store/authStore';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut, setUserRole } = useAuthStore();

  const handleEnterStaffMode = () => {
    setUserRole('manager');
    router.push('/(staff)');
  };

  const handleLogout = () => {
    signOut();
    router.replace('/(auth)/sign-in');
  };

  return (
    <View style={styles.container}>
      <Header
        title="Profile"
        showBack={true}
        onBack={() => router.back()}
        style={styles.header}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* User Card */}
        <View style={styles.userCard}>
          <Image
            source={{
              uri:
                user?.avatarUrl ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
            }}
            style={styles.avatar}
            resizeMode="cover"
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.fullName || 'Siddu'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'siddu@dishnex.luxury'}</Text>
            <View style={styles.tierBadge}>
              <Text style={styles.tierBadgeText}>DISHNEX VIP MEMBER</Text>
            </View>
          </View>
        </View>

        {/* Staff Operations Portal Card (Part 6) */}
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={handleEnterStaffMode}
          style={styles.staffPortalCard}
        >
          <View style={styles.staffPortalLeft}>
            <MaterialCommunityIcons
              name="chef-hat"
              size={28}
              color={colors.textDark}
            />
            <View style={{ marginLeft: spacing.md }}>
              <Text style={styles.staffPortalTitle}>Restaurant Operations</Text>
              <Text style={styles.staffPortalSub}>
                Kitchen Display, Order Queue & Menu 86
              </Text>
            </View>
          </View>
          <Ionicons name="arrow-forward" size={18} color={colors.textDark} />
        </TouchableOpacity>

        {/* General Settings Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Preferences & Delivery</Text>

          {/* Saved Addresses */}
          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => router.push('/(customer)/addresses')}
          >
            <View style={styles.menuLeft}>
              <Ionicons
                name="location-outline"
                size={20}
                color={colors.textSecondary}
              />
              <Text style={styles.menuText}>Saved Delivery Addresses</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.textMuted}
            />
          </TouchableOpacity>

          {/* Order History */}
          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => router.push('/(customer)/orders')}
          >
            <View style={styles.menuLeft}>
              <Ionicons
                name="receipt-outline"
                size={20}
                color={colors.textSecondary}
              />
              <Text style={styles.menuText}>Past Orders & Invoices</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.textMuted}
            />
          </TouchableOpacity>

          {/* Help & Support */}
          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => router.push('/(customer)/support')}
          >
            <View style={styles.menuLeft}>
              <Ionicons
                name="help-circle-outline"
                size={20}
                color={colors.textSecondary}
              />
              <Text style={styles.menuText}>Help & Concierge Support</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.textMuted}
            />
          </TouchableOpacity>
        </View>

        {/* Sign Out */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
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
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    marginBottom: spacing.lg,
    ...shadows.card,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  userInfo: {
    marginLeft: spacing.lg,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  userEmail: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  tierBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.xs,
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  tierBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.accent,
    letterSpacing: 0.5,
  },
  staffPortalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.accent,
    borderRadius: radii.xl,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    ...shadows.accent,
  },
  staffPortalLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  staffPortalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textDark,
  },
  staffPortalSub: {
    fontSize: 11,
    color: '#1a3320',
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.md,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 14,
    color: colors.textPrimary,
    marginLeft: spacing.md,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    gap: 8,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.error,
  },
});

