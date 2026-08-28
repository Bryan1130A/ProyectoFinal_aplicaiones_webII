import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { FormInput } from '../components/FormInput';
import { Loading } from '../components/Loading';
import { PrimaryButton } from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { movementService } from '../services/movementService';
import type { AppStackParamList } from '../navigation/types';
import type { Movement, MovementType } from '../types/Movement';
import { getErrorMessage } from '../utils/errorHandler';
import {
  validateAmount,
  validateDescription,
  validateMovementType,
  validateSufficientBalance,
} from '../utils/validators';
import { styles } from './EditMovementScreen.styles';

type Props = NativeStackScreenProps<AppStackParamList, 'EditMovement'>;

function formatMoney(amount: number): string {
  return `$${amount.toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function EditMovementScreen({ navigation, route }: Props) {
  const { movementId } = route.params;
  const { user } = useAuth();
  const userId = user?.id;

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [originalMovement, setOriginalMovement] = useState<Movement | null>(null);
  const [tipo, setTipo] = useState<MovementType | ''>('');
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [errors, setErrors] = useState<{ tipo?: string | null; monto?: string | null; descripcion?: string | null }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const movement = await movementService.getMovementById(movementId, userId);
        setOriginalMovement(movement);
        setTipo(movement.tipo);
        setMonto(String(movement.monto));
        setDescripcion(movement.descripcion);
      } catch (error) {
        setLoadError(getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    })();
  }, [movementId, userId]);

  // Saldo disponible si se deshace el efecto del movimiento original,
  // igual que calcula editar_movimiento en el servidor.
  const saldoSinEsteMovimiento =
    user && originalMovement
      ? user.saldo - (originalMovement.tipo === 'DEPOSITO' ? originalMovement.monto : -originalMovement.monto)
      : 0;

  async function handleSubmit() {
    const tipoError = validateMovementType(tipo);
    let montoError = validateAmount(monto);
    const descripcionError = validateDescription(descripcion);
    const montoValue = Number(monto.replace(',', '.'));

    if (!montoError && tipo === 'RETIRO') {
      montoError = validateSufficientBalance(montoValue, saldoSinEsteMovimiento);
    }

    setErrors({ tipo: tipoError, monto: montoError, descripcion: descripcionError });
    setServerError(null);

    if (tipoError || montoError || descripcionError || !userId) return;

    setIsSubmitting(true);
    try {
      await movementService.updateMovement(movementId, userId, {
        tipo: tipo as MovementType,
        monto: montoValue,
        descripcion: descripcion.trim(),
      });
      Alert.alert('Movimiento actualizado', 'Los cambios se guardaron correctamente.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      setServerError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <Loading message="Cargando movimiento..." />;
  }

  if (loadError) {
    return (
      <View style={styles.content}>
        <Text style={styles.errorBannerText}>{loadError}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.balanceBanner}>
        <Text style={styles.balanceLabel}>Saldo disponible</Text>
        <Text style={styles.balanceValue}>{formatMoney(saldoSinEsteMovimiento)}</Text>
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

      <PrimaryButton label="Guardar cambios" onPress={handleSubmit} loading={isSubmitting} />
    </ScrollView>
  );
}
