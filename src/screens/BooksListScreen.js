import React, { useState, useCallback, useRef } from 'react';
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator,
  Alert, TouchableOpacity, TextInput, RefreshControl, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import BookCard from '../components/BookCard';
import { bookService } from '../api/api';
import { colors } from '../styles/globalStyles';

const BooksListScreen = ({ navigation }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const debounceRef = useRef(null);

  const fetchBooks = async (searchTerm = '') => {
    try {
      const params = searchTerm ? { search: searchTerm } : {};
      const response = await bookService.getAll(params);
      setBooks(response.data.data || []);
    } catch (error) {
      Alert.alert('Erro', error.message || 'Erro ao carregar livros');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchBooks(search);
    }, [search])
  );

  const onSearchChange = (text) => {
    setSearch(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchBooks(text);
    }, 400);
  };

  const handleDelete = (book) => {
    Alert.alert(
      'Excluir Livro',
      `Tem certeza que deseja excluir "${book.titulo}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await bookService.delete(book._id);
              setBooks((prev) => prev.filter((b) => b._id !== book._id));
            } catch (error) {
              Alert.alert('Erro', error.message || 'Erro ao excluir livro');
            }
          },
        },
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchBooks(search);
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="library-outline" size={72} color={colors.border} />
      <Text style={styles.emptyText}>
        {search ? 'Nenhum livro encontrado' : 'Biblioteca vazia'}
      </Text>
      <Text style={styles.emptySubtext}>
        {search ? 'Tente outra pesquisa' : 'Adicione seu primeiro livro!'}
      </Text>
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
        <View style={styles.headerTextArea}>
          <Text style={styles.headerTitle}>📚 Biblioteca</Text>
          <Text style={styles.headerSubtitle}>
            {books.length} livro{books.length !== 1 ? 's' : ''} cadastrado{books.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateBook')}
          style={styles.addButton}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={26} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={[styles.searchWrapper, searchFocused && styles.searchWrapperFocused]}>
        <Ionicons name="search-outline" size={18} color={searchFocused ? colors.primary : colors.textMuted} />
        <TextInput
          value={search}
          onChangeText={onSearchChange}
          placeholder="Buscar por título ou autor..."
          placeholderTextColor={colors.textMuted}
          style={styles.searchInput}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => onSearchChange('')}>
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Carregando livros...</Text>
        </View>
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item._id.toString()}
          contentContainerStyle={[styles.list, books.length === 0 && { flex: 1 }]}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          renderItem={({ item }) => (
            <BookCard
              book={item}
              onEdit={() => navigation.navigate('EditBook', { book: item })}
              onDelete={() => handleDelete(item)}
              onPress={() => navigation.navigate('EditBook', { book: item })}
            />
          )}
        />
      )}
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
    paddingVertical: 16,
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
  headerTextArea: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  addButton: {
    backgroundColor: colors.primary,
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 1.5,
    borderColor: colors.border,
    gap: 10,
  },
  searchWrapperFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 15,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    gap: 8,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textSecondary,
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },
});

export default BooksListScreen;