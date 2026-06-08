import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/globalStyles';

const BookCard = ({ book, onEdit, onDelete, onPress }) => {
  const genreColor = {
    'Romance': '#f472b6',
    'Fantasia': '#a78bfa',
    'Ficção Científica': '#38bdf8',
    'Terror': '#f87171',
    'Biografia': '#34d399',
    'História': '#fbbf24',
    'Técnico': '#60a5fa',
  };

  const tagColor = genreColor[book.genero] || colors.primaryLight;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.card}>
      {/* Faixa lateral colorida */}
      <View style={[styles.accent, { backgroundColor: tagColor }]} />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleArea}>
            <Text style={styles.titulo} numberOfLines={2}>{book.titulo}</Text>
            <Text style={styles.autor}>{book.autor}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: book.disponivel ? '#10b98120' : '#ef444420' }]}>
            <View style={[styles.dot, { backgroundColor: book.disponivel ? colors.success : colors.danger }]} />
            <Text style={[styles.badgeText, { color: book.disponivel ? colors.success : colors.danger }]}>
              {book.disponivel ? 'Disponível' : 'Emprestado'}
            </Text>
          </View>
        </View>

        {/* Metadados */}
        <View style={styles.meta}>
          {book.editora && (
            <View style={styles.metaItem}>
              <Ionicons name="business-outline" size={12} color={colors.textMuted} />
              <Text style={styles.metaText}>{book.editora}</Text>
            </View>
          )}
          {book.ano_publicacao && (
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={12} color={colors.textMuted} />
              <Text style={styles.metaText}>{book.ano_publicacao}</Text>
            </View>
          )}
          {book.genero && (
            <View style={[styles.genre, { borderColor: tagColor + '60', backgroundColor: tagColor + '15' }]}>
              <Text style={[styles.genreText, { color: tagColor }]}>{book.genero}</Text>
            </View>
          )}
        </View>

        {/* Ações */}
        <View style={styles.actions}>
          <TouchableOpacity onPress={onEdit} style={styles.actionBtn}>
            <Ionicons name="pencil-outline" size={16} color={colors.primaryLight} />
            <Text style={[styles.actionText, { color: colors.primaryLight }]}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete} style={[styles.actionBtn, styles.deleteBtn]}>
            <Ionicons name="trash-outline" size={16} color={colors.danger} />
            <Text style={[styles.actionText, { color: colors.danger }]}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  accent: {
    width: 4,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  content: {
    flex: 1,
    padding: 14,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },
  titleArea: {
    flex: 1,
  },
  titulo: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 22,
  },
  autor: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  genre: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  genreText: {
    fontSize: 11,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  deleteBtn: {},
  actionText: {
    fontSize: 13,
    fontWeight: '600',
  },
});

export default BookCard;
