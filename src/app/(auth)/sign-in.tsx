// ==============================================================================
// SCREEN 05 — SIGN IN / SIGN UP
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
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { radii, spacing, shadows } from '../../theme/spacing';
import { EmberFlameLogo } from '../../components/common/EmberFlameLogo';
import { Button } from '../../components/common/Button';
import { SegmentedControl } from '../../components/common/SegmentedControl';
import { useAuthStore } from '../../store/authStore';

export default function SignInScreen() {
  const router = useRouter();
  const { signIn, signUp, isLoading } = useAuthStore();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [emailOrPhone, setEmailOrPhone] = useState('siddu@ember.luxury');
  const [password, setPassword] = useState('••••••••••••');
  const [fullName, setFullName] = useState('Siddu');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async () => {
    setErrorMessage('');
    if (!emailOrPhone) {
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
      >
        {/* Top Flame Branding */}
        <View style={styles.brandWrapper}>
          <EmberFlameLogo size="small" showTagline={false} />
        </View>

        {/* Headings */}
        <Text style={styles.greetingTitle}>
          {mode === 'signin' ? 'Welcome Back 👋' : 'Create Account ✨'}
        </Text>
        <Text style={styles.greetingSubtitle}>
          {mode === 'signin'
            ? 'Sign in to continue your culinary journey.'
            : 'Join EMBER to explore fine dining & artisan flavours.'}
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
            <View style={styles.inputContainer}>
              <Ionicons
                name="person-outline"
                size={20}
                color={colors.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Full Name"
                placeholderTextColor={colors.textMuted}
                style={styles.textInput}
                value={fullName}
                onChangeText={setFullName}
              />
            </View>
          )}

          {/* Email or Phone */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color={colors.textSecondary}
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
            />
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={colors.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor={colors.textMuted}
              secureTextEntry={!showPassword}
              style={styles.textInput}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword((prev) => !prev)}
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
          >
            <Ionicons name="logo-google" size={20} color={colors.textPrimary} />
          </TouchableOpacity>

          {/* Apple */}
          <TouchableOpacity
            style={styles.socialButton}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Ionicons name="logo-apple" size={22} color={colors.textPrimary} />
          </TouchableOpacity>

          {/* Phone */}
          <TouchableOpacity
            style={styles.socialButton}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Ionicons name="call-outline" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Bottom Toggle Footer */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>
            {mode === 'signin'
              ? 'New to Ember? '
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
  },
  greetingSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
  segmentedControl: {
    marginBottom: spacing.xl,
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    marginBottom: spacing.md,
  },
  inputIcon: {
    marginRight: spacing.md,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
  },
  forgotPasswordText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  errorText: {
    color: colors.error,
    fontSize: 13,
    marginBottom: spacing.md,
  },
  submitButton: {
    marginTop: spacing.sm,
  },
  socialDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.borderSubtle,
  },
  dividerText: {
    marginHorizontal: spacing.md,
    fontSize: 12,
    color: colors.textMuted,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
    marginBottom: spacing.xxl,
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
});

