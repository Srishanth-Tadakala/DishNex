// ==============================================================================
// SCREEN 05 — SIGN IN / SIGN UP (DishNex Brand & Interactive Micro-Interactions)
// ==============================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '../../theme/colors';
import { radii, spacing, shadows } from '../../theme/spacing';
import { DishNexFlameLogo } from '../../components/common/EmberFlameLogo';
import { Button } from '../../components/common/Button';
import { SegmentedControl } from '../../components/common/SegmentedControl';
import { useAuthStore } from '../../store/authStore';

export default function SignInScreen() {
  const router = useRouter();
  const { signIn, signUp, isLoading } = useAuthStore();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [emailOrPhone, setEmailOrPhone] = useState('siddu@dishnex.luxury');
  const [password, setPassword] = useState('••••••••••••');
  const [fullName, setFullName] = useState('Siddu');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async () => {
    setErrorMessage('');
    if (!emailOrPhone) {
      try {
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }
      } catch (_) {}
      setErrorMessage('Please enter your email or phone number.');
      return;
    }

    try {
      if (mode === 'signin') {
        await signIn(emailOrPhone);
      } else {
        await signUp(emailOrPhone, fullName);
      }
      router.replace('/(customer)/(tabs)');
    } catch (e: any) {
      try {
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
      } catch (_) {}
      setErrorMessage(e.message || 'Authentication failed. Please retry.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Top Flame Branding */}
        <View style={styles.brandWrapper}>
          <DishNexFlameLogo size="small" showTagline={false} />
        </View>

        {/* Headings */}
        <Text style={styles.greetingTitle}>
          {mode === 'signin' ? 'Welcome Back 👋' : 'Create Account ✨'}
        </Text>
        <Text style={styles.greetingSubtitle}>
          {mode === 'signin'
            ? 'Sign in to continue your culinary journey.'
            : 'Join DishNex to explore fine dining & artisan flavours.'}
        </Text>

        {/* Segmented Selector: Sign In | Sign Up */}
        <SegmentedControl
          options={[
            { key: 'signin', label: 'Sign In' },
            { key: 'signup', label: 'Sign Up' },
          ]}
          selectedKey={mode}
          onSelect={(key) => {
            setMode(key);
            setErrorMessage('');
          }}
          style={styles.segmentedControl}
        />

        {/* Form Inputs */}
        <View style={styles.formContainer}>
          {mode === 'signup' && (
            <View
              style={[
                styles.inputContainer,
                focusedInput === 'name' && styles.inputFocused,
              ]}
            >
              <Ionicons
                name="person-outline"
                size={20}
                color={
                  focusedInput === 'name'
                    ? colors.accent
                    : colors.textSecondary
                }
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Full Name"
                placeholderTextColor={colors.textMuted}
                style={styles.textInput}
                value={fullName}
                onChangeText={setFullName}
                onFocus={() => setFocusedInput('name')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
          )}

          {/* Email or Phone */}
          <View
            style={[
              styles.inputContainer,
              focusedInput === 'email' && styles.inputFocused,
            ]}
          >
            <Ionicons
              name="mail-outline"
              size={20}
              color={
                focusedInput === 'email'
                  ? colors.accent
                  : colors.textSecondary
              }
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Email or Phone"
              placeholderTextColor={colors.textMuted}
              style={styles.textInput}
              autoCapitalize="none"
              keyboardType="email-address"
              value={emailOrPhone}
              onChangeText={setEmailOrPhone}
              onFocus={() => setFocusedInput('email')}
              onBlur={() => setFocusedInput(null)}
            />
          </View>

          {/* Password */}
          <View
            style={[
              styles.inputContainer,
              focusedInput === 'password' && styles.inputFocused,
            ]}
          >
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={
                focusedInput === 'password'
                  ? colors.accent
                  : colors.textSecondary
              }
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor={colors.textMuted}
              style={[styles.textInput, { flex: 1 }]}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocusedInput('password')}
              onBlur={() => setFocusedInput(null)}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Forgot Password */}
          {mode === 'signin' && (
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.forgotPasswordContainer}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          )}

          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}

          {/* Submit Button */}
          <Button
            title={mode === 'signin' ? 'Sign In' : 'Sign Up'}
            iconRight="arrow-forward"
            onPress={handleSubmit}
            loading={isLoading}
            style={styles.submitButton}
          />
        </View>

        {/* Social Authentication */}
        <View style={styles.socialDivider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialRow}>
          {/* Google */}
          <TouchableOpacity
            style={styles.socialButton}
            onPress={handleSubmit}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Continue with Google"
          >
            <Ionicons name="logo-google" size={20} color={colors.textPrimary} />
          </TouchableOpacity>

          {/* Apple */}
          <TouchableOpacity
            style={styles.socialButton}
            onPress={handleSubmit}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Continue with Apple"
          >
            <Ionicons name="logo-apple" size={22} color={colors.textPrimary} />
          </TouchableOpacity>

          {/* Phone */}
          <TouchableOpacity
            style={styles.socialButton}
            onPress={handleSubmit}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Continue with Phone"
          >
            <Ionicons name="call-outline" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Bottom Toggle Footer */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>
            {mode === 'signin'
              ? 'New to DishNex? '
              : 'Already have an account? '}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setMode(mode === 'signin' ? 'signup' : 'signin');
              setErrorMessage('');
            }}
          >
            <Text style={styles.footerLink}>
              {mode === 'signin' ? 'Create an account' : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: spacing.xxl,
    paddingTop: 50,
    paddingBottom: 40,
  },
  brandWrapper: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  greetingTitle: {
    fontFamily: 'serif',
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
    textAlign: 'center',
  },
  greetingSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xxl,
    lineHeight: 20,
  },
  segmentedControl: {
    marginBottom: spacing.xxl,
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radii.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    marginBottom: spacing.lg,
  },
  inputFocused: {
    borderColor: colors.accent,
    backgroundColor: colors.surfaceElevated,
    ...shadows.emeraldGlow,
  },
  inputIcon: {
    marginRight: spacing.md,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    padding: 0,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: spacing.xl,
    marginTop: -spacing.xs,
  },
  forgotPasswordText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  submitButton: {
    marginTop: spacing.xs,
    marginBottom: spacing.xxl,
  },
  socialDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.borderSubtle,
  },
  dividerText: {
    fontSize: 12,
    color: colors.textMuted,
    marginHorizontal: spacing.lg,
    textTransform: 'lowercase',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
    marginBottom: spacing.xxxl,
  },
  socialButton: {
    width: 52,
    height: 52,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  footerLink: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.accent,
  },
  errorText: {
    color: colors.error,
    fontSize: 13,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
});
