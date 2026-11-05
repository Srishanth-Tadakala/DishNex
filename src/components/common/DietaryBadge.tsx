// ==============================================================================
// DISHNEX DIETARY BADGE (Veg / Non-Veg Indicator)
// ==============================================================================

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DietaryClassification } from '../../types';
import { colors } from '../../theme/colors';

interface DietaryBadgeProps {
  type: DietaryClassification;
  size?: number;
}

export const DietaryBadge: React.FC<DietaryBadgeProps> = ({
  type,
  size = 14,
}) => {
  const isVeg = type === 'veg' || type === 'vegan';
  const color = isVeg ? colors.veg : colors.nonVeg;

  const dotSize = Math.max(5, Math.floor(size * 0.45));

  return (
    <View
      style={[
        styles.box,
        {
          width: size,
          height: size,
          borderColor: color,
        },
      ]}
      accessibilityRole="text"
      accessibilityLabel={isVeg ? 'Vegetarian dish' : 'Non-vegetarian dish'}
    >
      <View
        style={[
          styles.dot,
          {
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize / 2,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    borderWidth: 1.5,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  dot: {},
});
