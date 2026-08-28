import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { colors } from '../theme/theme';
import { styles } from './Loading.styles';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export function Loading({ message = 'Cargando...', fullScreen = true }: LoadingProps) {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}
