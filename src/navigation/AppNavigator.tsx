import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { colors } from '../theme/theme';
import { CreateMovementScreen } from '../screens/CreateMovementScreen';
import { EditMovementScreen } from '../screens/EditMovementScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { MovementDetailScreen } from '../screens/MovementDetailScreen';
import { MovementsScreen } from '../screens/MovementsScreen';
import type { AppStackParamList } from './types';

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Movements" component={MovementsScreen} options={{ title: 'Movimientos' }} />
      <Stack.Screen
        name="CreateMovement"
        component={CreateMovementScreen}
        options={{ title: 'Nuevo movimiento' }}
      />
      <Stack.Screen
        name="EditMovement"
        component={EditMovementScreen}
        options={{ title: 'Editar movimiento' }}
      />
      <Stack.Screen
        name="MovementDetail"
        component={MovementDetailScreen}
        options={{ title: 'Detalle del movimiento' }}
      />
    </Stack.Navigator>
  );
}
