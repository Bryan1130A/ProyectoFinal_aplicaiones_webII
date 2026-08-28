import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, spacing, typography } from '../theme/theme';

interface HeaderProps {
  title: string;
  subtitle?: string;
  rightLabel?: string;
  onRightPress?: () => void;
}

export function Header({ title, subtitle, rightLabel, onRightPress }: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.texts}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {rightLabel ? (
        <TouchableOpacity onPress={onRightPress} style={styles.rightButton}>
          <Text style={styles.rightLabel}>{rightLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  texts: {
    flexShrink: 1,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 2,
  },
  rightButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  rightLabel: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
});
