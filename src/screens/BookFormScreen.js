import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Alert,
  TouchableOpacity, Switch, StatusBar, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import { bookService } from '../api/api';
import { colors } from '../styles/globalStyles';

const GENEROS = ['Romance', 'Fantasia', 'Ficção Científica', 'Terror', 'Biografia', 'História', 'Técnico', 'Poesia', 'Infantil', 'Outro'];

const BookFormScreen = ({ navigation, route }) => {
  const editingBook = route.params?.book || null;
  const isEditing = !!editingBook;

  const [form, setForm] = useState({
    titulo: '',
    autor: '',
    editora: '',
    ano_publicacao: '',
    isbn: '',
    genero: '',
    disponivel: true,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showGeneros, setShowGeneros] = useState(false);

  useEffect(() => {
    if (editingBook) {
      setForm({
        titulo: editingBook.titulo || '',
        autor: editingBook.autor || '',
        editora: editingBook.editora || '',
        ano_publicacao: editingBook.ano_publicacao?.toString() || '',
        isbn: editingBook.isbn || '',
        genero: editingBook.genero || '',
        disponivel: editingBook.disponivel ?? true,
      });
    }

    navigation.setOptions({
      title: isEditing ? 'Editar Livro' : 'Novo Livro',
    });
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.titulo.trim()) errs.titulo = 'O título é obrigatório';
    if (!form.autor.trim()) errs.autor = 'O autor é obrigatório';
    if (form.ano_publicacao) {
      const ano = parseInt(form.ano_publicacao);
      if (isNaN(ano) || ano < 1000 || ano > new Date().getFullYear()) {
        errs.ano_publicacao = `Ano inválido (1000–${new Date().getFullYear()})`;
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      const payload = {
        ...form,
        ano_publicacao: form.ano_publicacao ? parseInt(form.ano_publicacao) : null,
        isbn: form.isbn || null,
        editora: form.editora || null,
        genero: form.genero || null,
      };

      if (isEditing) {
        await bookService.update(editingBook._id, payload);
        Alert.alert('✅ Sucesso', 'Livro atualizado com sucesso!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        await bookService.create(payload);
        Alert.alert('✅ Sucesso', 'Livro cadastrado com sucesso!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      Alert.alert('Erro', error.message || 'Erro ao salvar livro');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Excluir Livro',
      `Deseja excluir "${form.titulo}"? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await bookService.delete(editingBook._id);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Erro', error.message || 'Erro ao excluir');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        {/* Custom Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerTitleArea}>
            <Text style={styles.headerTitle}>{isEditing ? 'Editar Livro' : 'Novo Livro'}</Text>
            <Text style={styles.headerSubtitle}>{isEditing ? 'Atualize os dados do livro' : 'Preencha os dados do livro'}</Text>
          </View>
          {isEditing && (
            <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
              <Ionicons name="trash-outline" size={20} color={colors.danger} />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Campos obrigatórios */}
          <Text style={styles.sectionLabel}>Informações Principais</Text>

          <AppInput
            label="Título *"
            value={form.titulo}
            onChangeText={(v) => handleChange('titulo', v)}
            placeholder="Ex: Dom Casmurro"
            error={errors.titulo}
          />

          <AppInput
            label="Autor *"
            value={form.autor}
            onChangeText={(v) => handleChange('autor', v)}
            placeholder="Ex: Machado de Assis"
            error={errors.autor}
          />

          {/* Campos opcionais */}
          <Text style={[styles.sectionLabel, { marginTop: 8 }]}>Informações Adicionais</Text>

          <AppInput
            label="Editora"
            value={form.editora}
            onChangeText={(v) => handleChange('editora', v)}
            placeholder="Ex: Companhia das Letras"
          />

          <AppInput
            label="Ano de Publicação"
            value={form.ano_publicacao}
            onChangeText={(v) => handleChange('ano_publicacao', v)}
            placeholder={`Ex: ${new Date().getFullYear()}`}
            keyboardType="numeric"
            error={errors.ano_publicacao}
          />

          <AppInput
            label="ISBN"
            value={form.isbn}
            onChangeText={(v) => handleChange('isbn', v)}
            placeholder="Ex: 978-85-001-0001-1"
            keyboardType="numeric"
          />

          {/* Seletor de Gênero */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Gênero</Text>
            <TouchableOpacity
              onPress={() => setShowGeneros(!showGeneros)}
              style={styles.selectButton}
              activeOpacity={0.8}
            >
              <Text style={[styles.selectText, !form.genero && { color: colors.textMuted }]}>
                {form.genero || 'Selecione um gênero'}
              </Text>
              <Ionicons name={showGeneros ? 'chevron-up' : 'chevron-down'} size={16} color={colors.textMuted} />
            </TouchableOpacity>
            {showGeneros && (
              <View style={styles.genreList}>
                <TouchableOpacity
                  onPress={() => { handleChange('genero', ''); setShowGeneros(false); }}
                  style={styles.genreItem}
                >
                  <Text style={[styles.genreItemText, { color: colors.textMuted }]}>Nenhum</Text>
                </TouchableOpacity>
                {GENEROS.map((g) => (
                  <TouchableOpacity
                    key={g}
                    onPress={() => { handleChange('genero', g); setShowGeneros(false); }}
                    style={[styles.genreItem, form.genero === g && styles.genreItemSelected]}
                  >
                    <Text style={[styles.genreItemText, form.genero === g && { color: colors.primary }]}>{g}</Text>
                    {form.genero === g && <Ionicons name="checkmark" size={16} color={colors.primary} />}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Toggle disponível */}
          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.toggleLabel}>Disponível para empréstimo</Text>
              <Text style={styles.toggleSub}>{form.disponivel ? 'Livro disponível no acervo' : 'Livro emprestado'}</Text>
            </View>
            <Switch
              value={form.disponivel}
              onValueChange={(v) => handleChange('disponivel', v)}
              trackColor={{ false: colors.border, true: colors.primary + '80' }}
              thumbColor={form.disponivel ? colors.primary : colors.textMuted}
            />
          </View>

          {/* Botão de salvar */}
          <AppButton
            title={isEditing ? 'Salvar Alterações' : 'Cadastrar Livro'}
            onPress={handleSubmit}
            loading={loading}
            style={{ marginTop: 24, marginBottom: 8 }}
          />

          {isEditing && (
            <AppButton
              title="Excluir Livro"
              variant="danger"
              onPress={handleDelete}
              style={{ marginBottom: 24 }}
            />
          )}
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
  deleteBtn: {
    width: 40,
    height: 40,
    backgroundColor: colors.danger + '15',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.danger + '40',
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 16,
    marginTop: 4,
  },
  inputContainer: { marginBottom: 16 },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  selectButton: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  selectText: {
    fontSize: 15,
    color: colors.text,
  },
  genreList: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginTop: 6,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  genreItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  genreItemSelected: {
    backgroundColor: colors.primary + '10',
  },
  genreItemText: {
    fontSize: 14,
    color: colors.text,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceLight,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  toggleSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
});

export default BookFormScreen;