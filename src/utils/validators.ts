const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): string | null {
  if (!email.trim()) return 'El correo es obligatorio';
  if (!EMAIL_REGEX.test(email.trim())) return 'Ingresa un correo válido';
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return 'La contraseña es obligatoria';
  if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
  return null;
}

export function validateConfirmPassword(password: string, confirmPassword: string): string | null {
  if (!confirmPassword) return 'Confirma tu contraseña';
  if (password !== confirmPassword) return 'Las contraseñas no coinciden';
  return null;
}

export function validateName(name: string): string | null {
  if (!name.trim()) return 'El nombre es obligatorio';
  if (name.trim().length < 2) return 'El nombre es demasiado corto';
  return null;
}

export function validateMovementType(tipo: string): string | null {
  if (tipo !== 'DEPOSITO' && tipo !== 'RETIRO') return 'Selecciona un tipo de movimiento';
  return null;
}

export function validateAmount(amount: string): string | null {
  if (!amount.trim()) return 'El monto es obligatorio';
  const normalized = amount.replace(',', '.');
  const value = Number(normalized);
  if (Number.isNaN(value)) return 'El monto debe ser un número válido';
  if (value <= 0) return 'El monto debe ser mayor que cero';
  return null;
}

export function validateDescription(description: string): string | null {
  if (!description.trim()) return 'La descripción es obligatoria';
  if (description.trim().length < 3) return 'La descripción es demasiado corta';
  if (description.trim().length > 120) return 'La descripción es demasiado larga';
  return null;
}
