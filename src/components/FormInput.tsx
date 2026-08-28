import React from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';
import { colors } from '../theme/theme';
import { styles } from './FormInput.styles';

interface FormInputProps extends TextInputProps {
  label: string;
  error?: string | null;
}

export function FormInput({ label, error, style, ...inputProps }: FormInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null, style]}
        placeholderTextColor={colors.disabled}
        {...inputProps}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}
