import { StyleSheet } from 'react-native';
import { colors, radius, shadow, spacing, typography } from '../theme/theme';

export const styles = StyleSheet.create({
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
