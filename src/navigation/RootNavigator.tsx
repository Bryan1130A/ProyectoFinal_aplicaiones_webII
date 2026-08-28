import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { Loading } from '../components/Loading';
import { useAuth } from '../context/AuthContext';
import { AppNavigator } from './AppNavigator';
import { AuthNavigator } from './AuthNavigator';

export function RootNavigator() {
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return <Loading message="Preparando la aplicación..." />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
