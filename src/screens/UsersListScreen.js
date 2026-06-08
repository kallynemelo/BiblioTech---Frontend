import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, StatusBar, TouchableOpacity,
  FlatList, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import api from '../api/api';
import { colors } from '../styles/globalStyles';

export default function UsersListScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/users');
      setUsers(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchUsers(); }, []));

  const handleDelete = (userId, userName) => {
    Alert.alert(
      'Excluir usuário',
      `Deseja excluir "${userName}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/users/${userId}`);
              setUsers((prev) => prev.filter((u) => u._id !== userId));
            } catch (err) {
              Alert.alert('Erro', err.message);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.avatarCircle}>
        <Ionicons
          name={item.role === 'admin' ? 'shield-checkmark' : 'person'}
          size={22}
          color={item.role === 'admin' ? colors.primary : colors.textSecondary}
        />
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardName}>{item.name}</Text>
        <Text style={styles.cardEmail}>{item.email}</Text>
        <View style={[styles.roleBadge, item.role === 'admin' && styles.roleBadgeAdmin]}>
          <Text style={[styles.roleText, item.role === 'admin' && styles.roleTextAdmin]}>
            {item.role === 'admin' ? 'Administrador' : 'Usuário'}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => handleDelete(item._id, item.name)}
      >
        <Ionicons name="trash-outline" size={18} color={colors.danger} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerTitleArea}>
          <Text style={styles.headerTitle}>Usuários</Text>
          <Text style={styles.headerSubtitle}>{users.length} cadastrado{users.length !== 1 ? 's' : ''}</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('CreateUser')}
        >
          <Ionicons name="person-add-outline" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.danger} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchUsers}>
            <Text style={styles.retryText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : users.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="people-outline" size={48} color={colors.textMuted} />
          <Text style={styles.emptyText}>Nenhum usuário cadastrado</Text>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
  addBtn: {
    width: 40,
    height: 40,
    backgroundColor: colors.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    padding: 20,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
    marginBottom: 12,
  },
  avatarCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.primaryUltraLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  cardEmail: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceLight,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  roleBadgeAdmin: {
    backgroundColor: colors.primaryUltraLight,
    borderColor: colors.primaryLight,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  roleTextAdmin: {
    color: colors.primary,
  },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.danger + '15',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.danger + '30',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  errorText: {
    fontSize: 14,
    color: colors.danger,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
  },
  retryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
  retryText: {
    color: colors.white,
    fontWeight: '600',
  },
});