import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { FormInput } from '../components/FormInput';
import { PrimaryButton } from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import type { AuthStackParamList } from '../navigation/types';
import { getErrorMessage } from '../utils/errorHandler';
import { validateEmail, validatePassword } from '../utils/validators';
import { styles } from './LoginScreen.styles';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit() {
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    setEmailError(emailValidation);
    setPasswordError(passwordValidation);
    setServerError(null);

    if (emailValidation || passwordValidation) return;

    setIsLoading(true);
    try {
      await login({ email: email.trim(), password });
    } catch (error) {
      setServerError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.logo}>🏦</Text>
          <Text style={styles.title}>Banco Autónoma</Text>
          <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
        </View>

        {serverError ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{serverError}</Text>
          </View>
        ) : null}

        <FormInput
          label="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          error={emailError}
          placeholder="usuario@email.com"
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!isLoading}
        />

        <FormInput
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          error={passwordError}
          placeholder="••••••••"
          secureTextEntry
          editable={!isLoading}
        />

        <PrimaryButton label="Iniciar sesión" onPress={handleSubmit} loading={isLoading} />

        <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>¿No tienes cuenta? Regístrate</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
