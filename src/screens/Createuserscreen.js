import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Alert, StatusBar,
  KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Modal, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import api from '../api/api';
import { colors } from '../styles/globalStyles';

const ROLES = [
  { label: 'Usuário', value: 'usuário' },
  { label: 'Admin', value: 'admin' },
];

export default function CreateUserScreen({ navigation }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'usuário',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'O nome é obrigatório';
    if (!form.email.trim()) errs.email = 'O e-mail é obrigatório';
    if (!form.password.trim()) errs.password = 'A senha é obrigatória';
    if (!['admin', 'usuário'].includes(form.role)) errs.role = 'Perfil deve ser admin ou usuário';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  async function handleSubmit() {
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post('/users', form);
      Alert.alert('Sucesso', 'Usuário cadastrado com sucesso.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  }

  const selectedLabel = ROLES.find((r) => r.value === form.role)?.label || 'Selecione';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerTitleArea}>
            <Text style={styles.headerTitle}>Cadastrar usuário</Text>
            <Text style={styles.headerSubtitle}>Apenas administradores acessam esta tela</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <AppInput
            label="Nome"
            placeholder="Nome completo"
            value={form.name}
            onChangeText={(v) => handleChange('name', v)}
            error={errors.name}
          />
          <AppInput
            label="E-mail"
            placeholder="email@exemplo.com"
            value={form.email}
            onChangeText={(v) => handleChange('email', v)}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />
          <AppInput
            label="Senha"
            placeholder="Senha"
            value={form.password}
            onChangeText={(v) => handleChange('password', v)}
            secureTextEntry
            error={errors.password}
          />

          {/* Dropdown de Perfil */}
          <View style={styles.dropdownWrapper}>
            <Text style={styles.dropdownLabel}>Perfil</Text>
            <TouchableOpacity
              style={[styles.dropdownBtn, errors.role && styles.dropdownBtnError]}
              onPress={() => setDropdownOpen(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.dropdownBtnText}>{selectedLabel}</Text>
              <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
            {errors.role && <Text style={styles.dropdownError}>{errors.role}</Text>}
          </View>

          <AppButton
            title="Salvar usuário"
            onPress={handleSubmit}
            loading={loading}
            style={{ marginTop: 8 }}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal Dropdown */}
      <Modal
        visible={dropdownOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setDropdownOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setDropdownOpen(false)}
        >
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Selecionar Perfil</Text>
            {ROLES.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.modalOption,
                  form.role === item.value && styles.modalOptionActive,
                ]}
                onPress={() => {
                  handleChange('role', item.value);
                  setDropdownOpen(false);
                }}
              >
                <Text style={[
                  styles.modalOptionText,
                  form.role === item.value && styles.modalOptionTextActive,
                ]}>
                  {item.label}
                </Text>
                {form.role === item.value && (
                  <Ionicons name="checkmark" size={18} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerTitleArea: { flex: 1 },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 32,
  },
  dropdownWrapper: {
    marginBottom: 16,
  },
  dropdownLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 13,
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dropdownBtnError: {
    borderColor: 'red',
  },
  dropdownBtnText: {
    fontSize: 14,
    color: colors.text,
  },
  dropdownError: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 0,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  modalOptionActive: {
    backgroundColor: colors.primaryUltraLight,
  },
  modalOptionText: {
    fontSize: 15,
    color: colors.text,
  },
  modalOptionTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
});