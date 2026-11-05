// ==============================================================================
// HELP & CONCIERGE SUPPORT (Part 5.7 Specification)
// ==============================================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { radii, spacing, shadows } from '../../theme/spacing';
import { Header } from '../../components/common/Header';

export default function SupportScreen() {
  const router = useRouter();

  const FAQS = [
    {
      q: 'How does table ordering work for Dine-In?',
      a: 'Select "Dine In" mode at checkout and provide your table number. Your order is transmitted directly to the kitchen display.',
    },
    {
      q: 'Can I customize spice levels or add-ons?',
      a: 'Yes, each dish detail page features customizable spice levels and add-ons such as extra cuts, gravies, and accompaniments.',
    },
    {
      q: 'What payment modes does DishNex accept?',
      a: 'We accept UPI (Google Pay, PhonePe, Paytm), Credit/Debit cards, Net Banking, and Cash on Delivery.',
    },
  ];

  return (
    <View style={styles.container}>
      <Header
        title="Concierge Support"
        showBack={true}
        onBack={() => router.back()}
        style={styles.header}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Quick Contact Cards */}
        <View style={styles.contactRow}>
          <TouchableOpacity style={styles.contactCard} activeOpacity={0.8}>
            <Ionicons name="call-outline" size={24} color={colors.accent} />
            <Text style={styles.contactTitle}>Direct Line</Text>
            <Text style={styles.contactSub}>+91 98765 43210</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactCard} activeOpacity={0.8}>
            <Ionicons name="mail-outline" size={24} color={colors.accent} />
            <Text style={styles.contactTitle}>Concierge Email</Text>
            <Text style={styles.contactSub}>vip@dishnex.luxury</Text>
          </TouchableOpacity>
        </View>

        {/* FAQs */}
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        {FAQS.map((faq, idx) => (
          <View key={idx} style={styles.faqCard}>
            <Text style={styles.faqQuestion}>{faq.q}</Text>
            <Text style={styles.faqAnswer}>{faq.a}</Text>
          </View>
        ))}
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
  contactRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  contactCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    ...shadows.card,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 8,
  },
  contactSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  faqCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    marginBottom: spacing.md,
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  faqAnswer: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});

