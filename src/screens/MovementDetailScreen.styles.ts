import { StyleSheet } from 'react-native';
import { colors, radius, shadow, spacing, typography } from '../theme/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadow.card,
  },
  type: {
    ...typography.subtitle,
    color: colors.textSecondary,
  },
  amount: {
    ...typography.amount,
    marginVertical: spacing.sm,
  },
  row: {
    marginTop: spacing.md,
  },
  rowLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  rowValue: {
    ...typography.body,
    color: colors.text,
    marginTop: 2,
  },
  errorText: {
    ...typography.body,
    color: colors.danger,
    padding: spacing.lg,
  },
});
