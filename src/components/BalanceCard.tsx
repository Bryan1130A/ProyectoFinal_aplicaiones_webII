import React from 'react';
import { Text, View } from 'react-native';
import { colors, typography } from '../theme/theme';
import { styles } from './BalanceCard.styles';

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
