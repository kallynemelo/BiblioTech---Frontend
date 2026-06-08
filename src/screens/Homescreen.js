import React from 'react';
import {
  View, Text, StyleSheet, StatusBar, TouchableOpacity, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppButton from '../components/AppButton';
import { useAuth } from '../context/AuthContext';
import { colors } from '../styles/globalStyles';

export default function HomeScreen({ navigation }) {
  const { user, signOut } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.content}>
        {/* Boas vindas */}
        <View style={styles.welcomeCard}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={28} color={colors.primary} />
          </View>
          <View>
            <Text style={styles.welcomeText}>Olá, {user?.name} 👋</Text>
            <View style={styles.roleBadge}>
              <Ionicons
                name={user?.role === 'admin' ? 'shield-checkmark-outline' : 'person-outline'}
                size={12}
                color={user?.role === 'admin' ? colors.primary : colors.textSecondary}
              />
              <Text style={[styles.roleText, user?.role === 'admin' && { color: colors.primary }]}>
                {user?.role === 'admin' ? 'Administrador' : 'Usuário'}
              </Text>
            </View>
          </View>
        </View>

        {/* Acervo */}
        <Text style={styles.sectionLabel}>Acervo</Text>

        <AppButton
          title="Ver livros"
          icon={<Ionicons name="book-outline" size={18} color={colors.white} />}
          onPress={() => navigation.navigate('BooksList')}
          style={styles.btn}
        />

        <AppButton
          title="Cadastrar livro"
          icon={<Ionicons name="add-circle-outline" size={18} color={colors.white} />}
          onPress={() => navigation.navigate('CreateBook')}
          style={styles.btn}
        />

        {user?.role === 'admin' && (
          <>
            <Text style={styles.sectionLabel}>Administração</Text>
            <AppButton
              title="Listar usuários"
              icon={<Ionicons name="people-outline" size={18} color={colors.white} />}
              onPress={() => navigation.navigate('UsersList')}
              style={styles.btn}
            />
            <AppButton
              title="Cadastrar usuário"
              icon={<Ionicons name="person-add-outline" size={18} color={colors.white} />}
              onPress={() => navigation.navigate('CreateUser')}
              style={styles.btn}
            />
          </>
        )}

        <AppButton
          title="Sair"
          variant="danger"
          icon={<Ionicons name="log-out-outline" size={18} color={colors.white} />}
          onPress={signOut}
          style={styles.btnSair}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logoImage: {
    width: 180,
    height: 120,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  welcomeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 28,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primaryUltraLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 12,
    marginTop: 4,
  },
  btn: {
    marginBottom: 12,
  },
  btnSair: {
    marginTop: 'auto',
    marginBottom: 16,
  },
});