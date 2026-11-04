// ==============================================================================
// EMBER QUANTITY STEPPER COMPONENT ([-] 1 [+])
// ==============================================================================

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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

  return (
    <View style={[styles.container, isSmall ? styles.smallContainer : styles.mediumContainer]}>
      <TouchableOpacity
        onPress={onDecrement}
        activeOpacity={0.7}
        style={styles.button}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons
          name={quantity === 1 ? 'trash-outline' : 'remove'}
          size={isSmall ? 13 : 16}
          color={colors.textSecondary}
        />
      </TouchableOpacity>

      <Text style={[styles.quantityText, { fontSize: isSmall ? 13 : 15 }]}>
        {quantity}
      </Text>

      <TouchableOpacity
        onPress={onIncrement}
        activeOpacity={0.7}
        style={styles.button}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
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

