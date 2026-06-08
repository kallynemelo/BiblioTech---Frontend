import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  StatusBar, KeyboardAvoidingView, Platform,
  ScrollView, Alert, ActivityIndicator, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import AppInput from '../components/AppInput';
import { colors } from '../styles/globalStyles';

const LoginScreen = () => {
  const { signIn } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = 'O e-mail é obrigatório';
    if (!form.password.trim()) errs.password = 'A senha é obrigatória';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await signIn(form.email, form.password);
    } catch (error) {
      Alert.alert('Erro ao entrar', error.message || 'Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <View style={styles.logoArea}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          {/* Card de login */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Entrar na sua conta</Text>
            <Text style={styles.cardSubtitle}>Informe suas credenciais para continuar</Text>

            <AppInput
              label="E-mail"
              value={form.email}
              onChangeText={(v) => handleChange('email', v)}
              placeholder="seu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <View style={styles.passwordWrapper}>
              <AppInput
                label="Senha"
                value={form.password}
                onChangeText={(v) => handleChange('password', v)}
                placeholder="Digite sua senha"
                secureTextEntry={!showPassword}
                error={errors.password}
                style={{ marginBottom: 0 }}
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.loginBtn}
              onPress={handleLogin}
              activeOpacity={0.85}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <>
                  <Ionicons name="log-in-outline" size={20} color={colors.white} />
                  <Text style={styles.loginBtnText}>Entrar</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.footer}>BiblioTech © {new Date().getFullYear()}</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 32,
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoImage: {
    width: 220,
    height: 160,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 24,
  },
  passwordWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  eyeBtn: {
    position: 'absolute',
    right: 16,
    bottom: 14,
  },
  loginBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  loginBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  footer: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 32,
  },
});

export default LoginScreen;