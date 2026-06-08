import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#1565C0',
  primaryDark: '#0D47A1',
  primaryLight: '#1E88E5',
  primaryUltraLight: '#E3F2FD',
  secondary: '#42A5F5',
  background: '#FFFFFF',
  surface: '#F5F9FF',
  surfaceLight: '#EBF4FF',
  card: '#FFFFFF',
  border: '#BBDEFB',
  text: '#0D1B2A',
  textSecondary: '#37474F',
  textMuted: '#90A4AE',
  success: '#2E7D32',
  danger: '#C62828',
  warning: '#F57F17',
  white: '#FFFFFF',
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenPadding: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimaryText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  buttonDanger: {
    backgroundColor: colors.danger,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputFocused: {
    borderColor: colors.primary,
  },
  errorText: {
    color: colors.danger,
    fontSize: 13,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flex1: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 8,
    textAlign: 'center',
  },
});