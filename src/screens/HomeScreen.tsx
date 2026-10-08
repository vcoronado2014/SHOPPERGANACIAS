import React, { useEffect, useState } from 'react';

import { getAvatarUri } from '../data/storage/appStorage';

import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../presentation/theme/ThemeProvider';

export function HomeScreen() {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <Text style={[styles.title, { color: theme.colors.text }]}>ShopperGanancias</Text>
        <Text style={[styles.subtitle, { color: theme.colors.muted }]}>
          Tu panel principal para controlar ganancias, pedidos y bonos.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
});
