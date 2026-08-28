import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FormInput } from '../components/FormInput';
import { PrimaryButton } from '../components/PrimaryButton';
import { movementService } from '../services/movementService';
import { colors, radius, spacing, typography } from '../theme/theme';
import type { AppStackParamList } from '../navigation/types';
import type { MovementType } from '../types/Movement';
import { getErrorMessage } from '../utils/errorHandler';
import { validateAmount, validateDescription, validateMovementType } from '../utils/validators';

type Props = NativeStackScreenProps<AppStackParamList, 'CreateMovement'>;

export function CreateMovementScreen({ navigation }: Props) {
  const [tipo, setTipo] = useState<MovementType | ''>('');
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [errors, setErrors] = useState<{ tipo?: string | null; monto?: string | null; descripcion?: string | null }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    const tipoError = validateMovementType(tipo);
    const montoError = validateAmount(monto);
    const descripcionError = validateDescription(descripcion);
    setErrors({ tipo: tipoError, monto: montoError, descripcion: descripcionError });
    setServerError(null);

    if (tipoError || montoError || descripcionError) return;

    setIsSubmitting(true);
    try {
      await movementService.createMovement({
        tipo: tipo as MovementType,
        monto: Number(monto.replace(',', '.')),
        descripcion: descripcion.trim(),
      });
      Alert.alert('Movimiento registrado', 'El movimiento se registró correctamente.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      setServerError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Tipo de movimiento</Text>
      <View style={styles.typeRow}>
        <TouchableOpacity
          style={[styles.typeButton, tipo === 'DEPOSITO' && styles.typeButtonDepositSelected]}
          onPress={() => setTipo('DEPOSITO')}
        >
          <Text style={[styles.typeButtonText, tipo === 'DEPOSITO' && styles.typeButtonTextSelected]}>
            Depósito
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeButton, tipo === 'RETIRO' && styles.typeButtonWithdrawSelected]}
          onPress={() => setTipo('RETIRO')}
        >
          <Text style={[styles.typeButtonText, tipo === 'RETIRO' && styles.typeButtonTextSelected]}>
            Retiro
          </Text>
        </TouchableOpacity>
      </View>
      {errors.tipo ? <Text style={styles.typeError}>{errors.tipo}</Text> : null}

      <FormInput
        label="Monto"
        value={monto}
        onChangeText={setMonto}
        error={errors.monto}
        placeholder="0.00"
        keyboardType="decimal-pad"
      />

      <FormInput
        label="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
        error={errors.descripcion}
        placeholder="Ej. Pago de servicios"
        multiline
      />

      {serverError ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{serverError}</Text>
        </View>
      ) : null}

      <PrimaryButton label="Registrar movimiento" onPress={handleSubmit} loading={isSubmitting} />
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
  label: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  typeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  typeButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingVertical: spacing.md,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  typeButtonDepositSelected: {
    backgroundColor: colors.successLight,
    borderColor: colors.success,
  },
  typeButtonWithdrawSelected: {
    backgroundColor: colors.dangerLight,
    borderColor: colors.danger,
  },
  typeButtonText: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  typeButtonTextSelected: {
    color: colors.text,
  },
  typeError: {
    ...typography.caption,
    color: colors.danger,
    marginBottom: spacing.md,
  },
  errorBanner: {
    backgroundColor: colors.dangerLight,
    borderRadius: spacing.sm,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  errorBannerText: {
    ...typography.body,
    color: colors.danger,
  },
});
