import { StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/theme';

export const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  danger: {
    backgroundColor: colors.danger,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  disabled: {
    opacity: 0.6,
  },
  label: {
    ...typography.subtitle,
    color: colors.white,
  },
  labelOutline: {
    color: colors.primary,
  },
});
