import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { FormInput } from '../components/FormInput';
import { PrimaryButton } from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { colors, spacing, typography } from '../theme/theme';
import { getErrorMessage } from '../utils/errorHandler';
import { validateEmail, validatePassword } from '../utils/validators';

export function LoginScreen() {
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logo: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
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
