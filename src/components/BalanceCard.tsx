import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadow, spacing, typography } from '../theme/theme';

interface BalanceCardProps {
  label: string;
  amount: number;
  size?: 'large' | 'small';
  tone?: 'primary' | 'success' | 'danger';
}

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function BalanceCard({ label, amount, size = 'large', tone = 'primary' }: BalanceCardProps) {
  const isLarge = size === 'large';
  const amountColor =
    tone === 'success' ? colors.success : tone === 'danger' ? colors.danger : colors.text;

  return (
    <View
      style={[
        styles.card,
        isLarge ? styles.large : styles.small,
        isLarge && { backgroundColor: colors.primary },
      ]}
    >
      <Text style={[styles.label, isLarge && styles.labelOnPrimary]}>{label}</Text>
      <Text
        style={[
          isLarge ? typography.amount : typography.subtitle,
          { color: isLarge ? colors.white : amountColor },
        ]}
      >
        {formatCurrency(amount)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    ...shadow.card,
  },
  large: {
    padding: spacing.lg,
  },
  small: {
    flex: 1,
    padding: spacing.md,
  },
  label: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  labelOnPrimary: {
    color: colors.primaryLight,
  },
});
