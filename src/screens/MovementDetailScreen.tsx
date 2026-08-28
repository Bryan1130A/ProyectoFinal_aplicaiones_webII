import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Loading } from '../components/Loading';
import { PrimaryButton } from '../components/PrimaryButton';
import { movementService } from '../services/movementService';
import { colors, radius, shadow, spacing, typography } from '../theme/theme';
import type { AppStackParamList } from '../navigation/types';
import type { Movement } from '../types/Movement';
import { getErrorMessage } from '../utils/errorHandler';

type Props = NativeStackScreenProps<AppStackParamList, 'MovementDetail'>;

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDateTime(fecha: string): string {
  const date = new Date(fecha);
  if (Number.isNaN(date.getTime())) return fecha;
  return date.toLocaleString('es-EC', { dateStyle: 'long', timeStyle: 'short' });
}

export function MovementDetailScreen({ navigation, route }: Props) {
  const { movementId } = route.params;
  const [movement, setMovement] = useState<Movement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMovement = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await movementService.getMovementById(movementId);
      setMovement(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [movementId]);

  useFocusEffect(
    useCallback(() => {
      loadMovement();
    }, [loadMovement])
  );

  function confirmDelete() {
    Alert.alert('Eliminar movimiento', '¿Estás seguro de eliminar este movimiento?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: handleDelete },
    ]);
  }

  async function handleDelete() {
    try {
      await movementService.deleteMovement(movementId);
      Alert.alert('Movimiento eliminado', 'El movimiento se eliminó correctamente.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert('No se pudo eliminar', getErrorMessage(err));
    }
  }

  if (isLoading) {
    return <Loading message="Cargando detalle..." />;
  }

  if (error || !movement) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error ?? 'Movimiento no encontrado'}</Text>
      </View>
    );
  }

  const isDeposit = movement.tipo === 'DEPOSITO';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.type}>{isDeposit ? 'Depósito' : 'Retiro'}</Text>
        <Text style={[styles.amount, { color: isDeposit ? colors.success : colors.danger }]}>
          {isDeposit ? '+' : '-'}
          {formatCurrency(movement.monto)}
        </Text>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Fecha</Text>
          <Text style={styles.rowValue}>{formatDateTime(movement.fecha)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Descripción</Text>
          <Text style={styles.rowValue}>{movement.descripcion}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>ID de movimiento</Text>
          <Text style={styles.rowValue}>{movement.id}</Text>
        </View>
      </View>

      <PrimaryButton
        label="Editar movimiento"
        onPress={() => navigation.navigate('EditMovement', { movementId })}
        variant="outline"
      />
      <View style={{ height: spacing.sm }} />
      <PrimaryButton label="Eliminar movimiento" onPress={confirmDelete} variant="danger" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
