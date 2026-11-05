// ==============================================================================
// DISHNEX QUANTITY STEPPER COMPONENT ([-] 1 [+])
// Tactile Controls with Spring Bump & Haptic Feedback
// ==============================================================================

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '../../theme/colors';
import { radii } from '../../theme/spacing';

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

  useEffect(() => {
    Animated.sequence([
      Animated.timing(numScale, {
        toValue: 1.25,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.spring(numScale, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [quantity]);

  const handleDec = () => {
    try {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (_) {}
    onDecrement();
  };

  const handleInc = () => {
    try {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (_) {}
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
        <Ionicons
          name={quantity === 1 ? 'trash-outline' : 'remove'}
          size={isSmall ? 13 : 16}
          color={quantity === 1 ? colors.error : colors.textSecondary}
        />
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
        <Ionicons
          name="add"
          size={isSmall ? 14 : 17}
          color={colors.accent}
        />
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
  },
  smallContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 78,
  },
  mediumContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 96,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    color: colors.textPrimary,
    fontWeight: '700',
    marginHorizontal: 8,
  },
});
