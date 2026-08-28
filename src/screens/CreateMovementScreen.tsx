import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { FormInput } from '../components/FormInput';
import { PrimaryButton } from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { movementService } from '../services/movementService';
import type { AppStackParamList } from '../navigation/types';
import type { MovementType } from '../types/Movement';
import { getErrorMessage } from '../utils/errorHandler';
import {
  validateAmount,
  validateDescription,
  validateMovementType,
  validateSufficientBalance,
} from '../utils/validators';
import { styles } from './CreateMovementScreen.styles';

function formatMoney(amount: number): string {
  return `$${amount.toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

type Props = NativeStackScreenProps<AppStackParamList, 'CreateMovement'>;

export function CreateMovementScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [tipo, setTipo] = useState<MovementType | ''>('');
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [errors, setErrors] = useState<{ tipo?: string | null; monto?: string | null; descripcion?: string | null }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    const tipoError = validateMovementType(tipo);
    let montoError = validateAmount(monto);
    const descripcionError = validateDescription(descripcion);
    const montoValue = Number(monto.replace(',', '.'));

    if (!montoError && tipo === 'RETIRO' && user) {
      montoError = validateSufficientBalance(montoValue, user.saldo);
    }

    setErrors({ tipo: tipoError, monto: montoError, descripcion: descripcionError });
    setServerError(null);

    if (tipoError || montoError || descripcionError || !user) return;

    setIsSubmitting(true);
    try {
      await movementService.createMovement(user.id, {
        tipo: tipo as MovementType,
        monto: montoValue,
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
      <View style={styles.balanceBanner}>
        <Text style={styles.balanceLabel}>Saldo disponible</Text>
        <Text style={styles.balanceValue}>{formatMoney(user?.saldo ?? 0)}</Text>
      </View>

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
