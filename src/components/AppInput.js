import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors } from '../styles/globalStyles';

const AppInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  style,
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          styles.input,
          focused && styles.inputFocused,
          error && styles.inputError,
          multiline && styles.inputMultiline,
        ]}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  input: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: colors.text,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  inputFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  inputError: {
    borderColor: colors.danger,
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 5,
    fontWeight: '500',
  },
});

export default AppInput;
