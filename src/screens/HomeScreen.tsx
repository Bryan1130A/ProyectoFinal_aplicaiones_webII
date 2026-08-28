import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BalanceCard } from '../components/BalanceCard';
import { EmptyState } from '../components/EmptyState';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { MovementCard } from '../components/MovementCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { movementService } from '../services/movementService';
import { userService } from '../services/userService';
import { spacing } from '../theme/theme';
import type { AppStackParamList } from '../navigation/types';
import type { Movement } from '../types/Movement';
import { getErrorMessage } from '../utils/errorHandler';
import { styles } from './HomeScreen.styles';

type Props = NativeStackScreenProps<AppStackParamList, 'Home'>;

const RECENT_MOVEMENTS_LIMIT = 5;

export function HomeScreen({ navigation }: Props) {
  const { user, logout, refreshUser } = useAuth();
  const [movements, setMovements] = useState<Movement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userId = user?.id;

  const loadData = useCallback(
    async (isRefresh = false) => {
      if (!userId) return;
      if (isRefresh) setIsRefreshing(true);
      else setIsLoading(true);
      setError(null);
      try {
        const [freshUser, movementsData] = await Promise.all([
          userService.getUser(userId),
          movementService.getMovements(userId),
        ]);
        if (freshUser) refreshUser(freshUser);
        setMovements(movementsData);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [userId, refreshUser]
  );

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const totalDeposits = movements
    .filter((m) => m.tipo === 'DEPOSITO')
    .reduce((sum, m) => sum + m.monto, 0);
  const totalWithdrawals = movements
    .filter((m) => m.tipo === 'RETIRO')
    .reduce((sum, m) => sum + m.monto, 0);
  const recentMovements = movements.slice(0, RECENT_MOVEMENTS_LIMIT);

  if (isLoading) {
    return <Loading message="Cargando tu información..." />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title={`Hola, ${user?.nombre || user?.email || 'Usuario'} 👋`}
        subtitle="Bienvenido de nuevo"
        rightLabel="Salir"
        onRightPress={logout}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => loadData(true)} />}
      >
        {error ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{error}</Text>
          </View>
        ) : null}

        <BalanceCard label="Saldo disponible" amount={user?.saldo ?? 0} size="large" />

        <View style={styles.tilesRow}>
          <BalanceCard label="Depósitos" amount={totalDeposits} size="small" tone="success" />
          <View style={{ width: spacing.md }} />
          <BalanceCard label="Retiros" amount={totalWithdrawals} size="small" tone="danger" />
        </View>

        <PrimaryButton label="Registrar movimiento" onPress={() => navigation.navigate('CreateMovement')} />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Movimientos recientes</Text>
        </View>

        {recentMovements.length === 0 ? (
          <EmptyState title="Aún no tienes movimientos" subtitle="Registra tu primer depósito o retiro" />
        ) : (
          recentMovements.map((movement) => (
            <MovementCard
              key={movement.id}
              movement={movement}
              onPress={() => navigation.navigate('MovementDetail', { movementId: movement.id })}
            />
          ))
        )}

        <PrimaryButton
          label="Ver movimientos"
          onPress={() => navigation.navigate('Movements')}
          variant="outline"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
