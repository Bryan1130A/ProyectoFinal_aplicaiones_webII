import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList, RefreshControl, View } from 'react-native';
import { EmptyState } from '../components/EmptyState';
import { Loading } from '../components/Loading';
import { MovementCard } from '../components/MovementCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { movementService } from '../services/movementService';
import type { AppStackParamList } from '../navigation/types';
import type { Movement } from '../types/Movement';
import { getErrorMessage } from '../utils/errorHandler';
import { styles } from './MovementsScreen.styles';

type Props = NativeStackScreenProps<AppStackParamList, 'Movements'>;

export function MovementsScreen({ navigation }: Props) {
  const { user } = useAuth();
  const userId = user?.id;
  const [movements, setMovements] = useState<Movement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMovements = useCallback(
    async (isRefresh = false) => {
      if (!userId) return;
      if (isRefresh) setIsRefreshing(true);
      else setIsLoading(true);
      setError(null);
      try {
        const data = await movementService.getMovements(userId);
        setMovements(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [userId]
  );

  useFocusEffect(
    useCallback(() => {
      loadMovements();
    }, [loadMovements])
  );

  function confirmDelete(movement: Movement) {
    Alert.alert(
      'Eliminar movimiento',
      '¿Estás seguro de eliminar este movimiento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => handleDelete(movement) },
      ]
    );
  }

  async function handleDelete(movement: Movement) {
    if (!userId) return;
    try {
      await movementService.deleteMovement(movement.id, userId);
      await loadMovements();
    } catch (err) {
      Alert.alert('No se pudo eliminar', getErrorMessage(err));
    }
  }

  if (isLoading) {
    return <Loading message="Cargando movimientos..." />;
  }

  return (
    <View style={styles.container}>
      {error ? (
        <View style={styles.errorBanner}>
          <EmptyState icon="⚠️" title="No se pudieron cargar los movimientos" subtitle={error} />
          <PrimaryButton label="Reintentar" onPress={() => loadMovements()} variant="outline" />
        </View>
      ) : (
        <FlatList
          data={movements}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => loadMovements(true)} />}
          renderItem={({ item }) => (
            <MovementCard
              movement={item}
              showActions
              onPress={() => navigation.navigate('MovementDetail', { movementId: item.id })}
              onEdit={() => navigation.navigate('EditMovement', { movementId: item.id })}
              onDelete={() => confirmDelete(item)}
            />
          )}
          ListEmptyComponent={
            <EmptyState title="Aún no tienes movimientos" subtitle="Registra tu primer depósito o retiro" />
          }
        />
      )}

      <View style={styles.footer}>
        <PrimaryButton label="Registrar movimiento" onPress={() => navigation.navigate('CreateMovement')} />
      </View>
    </View>
  );
}
