export const colors = {
  primary: '#0F4C81',
  primaryDark: '#0A3660',
  primaryLight: '#E8F0FA',
  background: '#F4F6F9',
  surface: '#FFFFFF',
  text: '#1A2233',
  textSecondary: '#5B6472',
  border: '#E1E5EB',
  success: '#16A34A',
  successLight: '#E7F7EC',
  danger: '#DC2626',
  dangerLight: '#FCEAEA',
  warning: '#D97706',
  white: '#FFFFFF',
  disabled: '#B7BEC9',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  pill: 999,
};

export const typography = {
  title: { fontSize: 24, fontWeight: '700' as const },
  subtitle: { fontSize: 16, fontWeight: '600' as const },
  body: { fontSize: 14, fontWeight: '400' as const },
  caption: { fontSize: 12, fontWeight: '400' as const },
  amount: { fontSize: 32, fontWeight: '700' as const },
};

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
};
