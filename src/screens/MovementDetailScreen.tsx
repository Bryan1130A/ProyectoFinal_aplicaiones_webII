import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { Loading } from '../components/Loading';
import { PrimaryButton } from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { movementService } from '../services/movementService';
import { colors, spacing } from '../theme/theme';
import type { AppStackParamList } from '../navigation/types';
import type { Movement } from '../types/Movement';
import { getErrorMessage } from '../utils/errorHandler';
import { styles } from './MovementDetailScreen.styles';

type Props = NativeStackScreenProps<AppStackParamList, 'MovementDetail'>;

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(fecha: string): string {
  const date = new Date(fecha);
  if (Number.isNaN(date.getTime())) return fecha;
  return date.toLocaleDateString('es-EC', { dateStyle: 'long' });
}

export function MovementDetailScreen({ navigation, route }: Props) {
  const { movementId } = route.params;
  const { user } = useAuth();
  const userId = user?.id;
  const [movement, setMovement] = useState<Movement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMovement = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await movementService.getMovementById(movementId, userId);
      setMovement(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [movementId, userId]);

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
    if (!userId) return;
    try {
      await movementService.deleteMovement(movementId, userId);
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
          <Text style={styles.rowValue}>{formatDate(movement.fecha)}</Text>
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
