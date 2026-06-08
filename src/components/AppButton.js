import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, View } from 'react-native';
import { colors } from '../styles/globalStyles';

const AppButton = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary', // 'primary' | 'danger' | 'outline' | 'ghost'
  size = 'md',         // 'sm' | 'md' | 'lg'
  icon,
  style,
  textStyle,
}) => {
  const variantStyles = {
    primary: { bg: colors.primary, text: colors.white, border: colors.primary },
    danger: { bg: colors.danger, text: colors.white, border: colors.danger },
    outline: { bg: 'transparent', text: colors.primary, border: colors.primary },
    ghost: { bg: 'transparent', text: colors.textSecondary, border: 'transparent' },
    success: { bg: colors.success, text: colors.white, border: colors.success },
  };

  const sizeStyles = {
    sm: { paddingVertical: 8, paddingHorizontal: 16, fontSize: 13 },
    md: { paddingVertical: 13, paddingHorizontal: 20, fontSize: 15 },
    lg: { paddingVertical: 16, paddingHorizontal: 24, fontSize: 17 },
  };

  const vs = variantStyles[variant] || variantStyles.primary;
  const ss = sizeStyles[size] || sizeStyles.md;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.button,
        {
          backgroundColor: vs.bg,
          borderColor: vs.border,
          paddingVertical: ss.paddingVertical,
          paddingHorizontal: ss.paddingHorizontal,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={vs.text} size="small" />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.iconWrapper}>{icon}</View>}
          <Text style={[styles.text, { color: vs.text, fontSize: ss.fontSize }, textStyle]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconWrapper: {
    marginRight: 4,
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default AppButton;
