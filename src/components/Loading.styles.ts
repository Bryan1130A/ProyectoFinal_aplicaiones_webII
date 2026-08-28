import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../theme/theme';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  fullScreen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  message: {
    marginTop: spacing.sm,
    color: colors.textSecondary,
    ...typography.body,
  },
});
