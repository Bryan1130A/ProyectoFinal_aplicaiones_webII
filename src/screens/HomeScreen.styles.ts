import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../theme/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  tilesRow: {
    flexDirection: 'row',
  },
  sectionHeader: {
    marginTop: spacing.sm,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.text,
  },
  errorBanner: {
    backgroundColor: colors.dangerLight,
    borderRadius: spacing.sm,
    padding: spacing.md,
  },
  errorBannerText: {
    ...typography.body,
    color: colors.danger,
  },
});
