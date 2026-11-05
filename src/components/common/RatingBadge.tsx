// ==============================================================================
// DISHNEX RATING BADGE COMPONENT
// Luminous Gold Star Rating with Accessible Contrast
// ==============================================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

interface RatingBadgeProps {
  rating: number;
  reviewsCount?: number;
  size?: 'small' | 'medium';
  showCountText?: boolean;
  textColor?: string;
}

export const RatingBadge: React.FC<RatingBadgeProps> = ({
  rating,
  reviewsCount,
  size = 'small',
  showCountText = false,
  textColor,
}) => {
  const formatCount = (count?: number): string => {
    if (!count) return '';
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const isSmall = size === 'small';

  return (
    <View style={styles.container}>
      <Ionicons
        name="star"
        size={isSmall ? 12 : 14}
        color={colors.gold} // Luminous warm gold #FFC66B
        style={styles.star}
      />
      <Text
        style={[
          styles.rating,
          { fontSize: isSmall ? 12 : 14 },
          textColor ? { color: textColor } : undefined,
        ]}
      >
        {rating.toFixed(1)}
      </Text>
      {reviewsCount !== undefined && (
        <Text
          style={[
            styles.reviews,
            { fontSize: isSmall ? 11 : 13 },
            textColor ? { color: textColor, opacity: 0.8 } : undefined,
          ]}
        >
          {showCountText
            ? ` (${formatCount(reviewsCount)} reviews)`
            : ` (${formatCount(reviewsCount)})`}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  star: {
    marginRight: 3,
  },
  rating: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  reviews: {
    color: colors.textMuted,
    marginLeft: 2,
  },
});
