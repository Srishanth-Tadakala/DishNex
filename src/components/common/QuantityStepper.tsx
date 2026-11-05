// ==============================================================================
// DISHNEX QUANTITY STEPPER COMPONENT ([-] 1 [+]) (Industry-Grade)
// Tactile Controls with Spring Bump, Counter Pop & Haptic Dynamics
// ==============================================================================

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { radii, shadows } from '../../theme/spacing';
import { triggerHaptic } from '../../theme/animations';

interface QuantityStepperProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  size?: 'small' | 'medium';
}

export const QuantityStepper: React.FC<QuantityStepperProps> = ({
  quantity,
  onIncrement,
  onDecrement,
  size = 'small',
}) => {
  const isSmall = size === 'small';
  const numScale = useRef(new Animated.Value(1)).current;
  const decScale = useRef(new Animated.Value(1)).current;
  const incScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(numScale, {
        toValue: 1.28,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.spring(numScale, {
        toValue: 1,
        friction: 4,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, [quantity]);

  const handleDec = () => {
    triggerHaptic.light();
    Animated.sequence([
      Animated.timing(decScale, { toValue: 0.8, duration: 60, useNativeDriver: true }),
      Animated.spring(decScale, { toValue: 1, friction: 3, tension: 50, useNativeDriver: true }),
    ]).start();
    onDecrement();
  };

  const handleInc = () => {
    triggerHaptic.light();
    Animated.sequence([
      Animated.timing(incScale, { toValue: 0.8, duration: 60, useNativeDriver: true }),
      Animated.spring(incScale, { toValue: 1, friction: 3, tension: 50, useNativeDriver: true }),
    ]).start();
    onIncrement();
  };

  return (
    <View
      style={[
        styles.container,
        isSmall ? styles.smallContainer : styles.mediumContainer,
      ]}
    >
      <TouchableOpacity
        onPress={handleDec}
        activeOpacity={0.7}
        style={styles.button}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessibilityRole="button"
        accessibilityLabel="Decrease quantity"
      >
        <Animated.View style={{ transform: [{ scale: decScale }] }}>
          <Ionicons
            name={quantity === 1 ? 'trash-outline' : 'remove'}
            size={isSmall ? 13 : 16}
            color={quantity === 1 ? colors.error : colors.textSecondary}
          />
        </Animated.View>
      </TouchableOpacity>

      <Animated.Text
        style={[
          styles.quantityText,
          { fontSize: isSmall ? 13 : 15, transform: [{ scale: numScale }] },
        ]}
      >
        {quantity}
      </Animated.Text>

      <TouchableOpacity
        onPress={handleInc}
        activeOpacity={0.7}
        style={styles.button}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessibilityRole="button"
        accessibilityLabel="Increase quantity"
      >
        <Animated.View style={{ transform: [{ scale: incScale }] }}>
          <Ionicons
            name="add"
            size={isSmall ? 14 : 17}
            color={colors.accent}
          />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceSecondary,
    borderColor: colors.borderSubtle,
    borderWidth: 1,
    borderRadius: radii.full,
    ...shadows.card,
  },
  smallContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    minWidth: 80,
  },
  mediumContainer: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    minWidth: 100,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    color: colors.textPrimary,
    fontWeight: '800',
    marginHorizontal: 8,
  },
});
