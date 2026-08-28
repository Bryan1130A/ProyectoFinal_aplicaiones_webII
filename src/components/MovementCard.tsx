import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Movement } from '../types/Movement';
import { colors, radius, shadow, spacing, typography } from '../theme/theme';

interface MovementCardProps {
  movement: Movement;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

function formatAmount(movement: Movement): string {
  const sign = movement.tipo === 'DEPOSITO' ? '+' : '-';
  return `${sign}$${movement.monto.toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(fecha: string): string {
  const date = new Date(fecha);
  if (Number.isNaN(date.getTime())) return fecha;
  return date.toLocaleDateString('es-EC', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function MovementCard({ movement, onPress, onEdit, onDelete, showActions }: MovementCardProps) {
  const isDeposit = movement.tipo === 'DEPOSITO';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={onPress ? 0.7 : 1}>
      <View style={[styles.badge, { backgroundColor: isDeposit ? colors.successLight : colors.dangerLight }]}>
        <Text style={styles.badgeIcon}>{isDeposit ? '↓' : '↑'}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.type}>{isDeposit ? 'Depósito' : 'Retiro'}</Text>
        <Text style={styles.description} numberOfLines={1}>
          {movement.descripcion}
        </Text>
        <Text style={styles.date}>{formatDate(movement.fecha)}</Text>
      </View>

      <View style={styles.right}>
        <Text style={[styles.amount, { color: isDeposit ? colors.success : colors.danger }]}>
          {formatAmount(movement)}
        </Text>
        {showActions ? (
          <View style={styles.actions}>
            <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
              <Text style={styles.actionText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
              <Text style={[styles.actionText, { color: colors.danger }]}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadow.card,
  },
  badge: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  badgeIcon: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  info: {
    flex: 1,
    marginRight: spacing.sm,
  },
  type: {
    ...typography.subtitle,
    color: colors.text,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 2,
  },
  date: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
  },
  amount: {
    ...typography.subtitle,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    marginTop: spacing.xs,
    gap: spacing.sm,
  },
  actionButton: {
    paddingVertical: 2,
  },
  actionText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
});
