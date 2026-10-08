import React from 'react';

import {
  Pressable,
  Text,
  View,
} from 'react-native';

import { useTheme } from '../../../theme/ThemeProvider';

interface PeriodoSelectorProps {
  fechaInicio: string;
  fechaFin: string;
  onAnterior: () => void;
  onSiguiente: () => void;
}

function formatearFecha(
  fecha: string,
): string {
  const [
    year,
    month,
    day,
  ] = fecha.split('-');

  return `${day}/${month}/${year}`;
}

export function PeriodoSelector({
  fechaInicio,
  fechaFin,
  onAnterior,
  onSiguiente,
}: PeriodoSelectorProps) {
  const theme =
    useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Pressable
        onPress={onAnterior}
        style={{
          width: 42,
          height: 42,
          borderRadius: theme.radius.md,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor:
            theme.colors.surface,
          borderWidth: 1,
          borderColor:
            theme.colors.border,
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: '600',
            color: theme.colors.text,
          }}
        >
          ‹
        </Text>
      </Pressable>

      <View
        style={{
          flex: 1,
          alignItems: 'center',
          marginHorizontal:
            theme.spacing.sm,
        }}
      >
        <Text
          style={{
            fontSize: 13,
            color: theme.colors.muted,
          }}
        >
          Semana
        </Text>

        <Text
          style={{
            fontSize: 16,
            fontWeight: '700',
            color: theme.colors.text,
            textAlign: 'center',
          }}
        >
          {formatearFecha(
            fechaInicio,
          )}
          {' — '}
          {formatearFecha(
            fechaFin,
          )}
        </Text>
      </View>

      <Pressable
        onPress={onSiguiente}
        style={{
          width: 42,
          height: 42,
          borderRadius: theme.radius.md,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor:
            theme.colors.surface,
          borderWidth: 1,
          borderColor:
            theme.colors.border,
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: '600',
            color: theme.colors.text,
          }}
        >
          ›
        </Text>
      </Pressable>
    </View>
  );
}
