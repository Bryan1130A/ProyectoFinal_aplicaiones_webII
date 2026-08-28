import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../theme/theme';

export const styles = StyleSheet.create({
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
