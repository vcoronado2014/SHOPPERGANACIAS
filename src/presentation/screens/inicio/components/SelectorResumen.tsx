
import React from 'react';

import { Pressable, Text, View } from 'react-native';

import { useTheme } from '../../../theme/ThemeProvider';

import { styles } from '../InicioStyles';

export type VistaResumen = 'hoy' | 'semanal' | 'general';

interface SelectorResumenProps {
  vista: VistaResumen;
  onCambiar: (vista: VistaResumen) => void;
}

export default function SelectorResumen({
  vista,
  onCambiar,
}: SelectorResumenProps) {
  const theme = useTheme();

  const opciones: { valor: VistaResumen; titulo: string }[] = [
    { valor: 'hoy', titulo: 'Hoy' },
    { valor: 'semanal', titulo: 'Semanal' },
    { valor: 'general', titulo: 'General' },
  ];

  return (
    <View style={styles.selector}>
      {opciones.map((opcion) => {
        const seleccionada = vista === opcion.valor;

        return (
          <Pressable
            key={opcion.valor}
            onPress={() => onCambiar(opcion.valor)}
            style={[
              styles.selectorItem,
              {
                backgroundColor: seleccionada
                  ? theme.colors.primary
                  : theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.selectorText,
                {
                  color: seleccionada
                    ? theme.colors.onPrimary
                    : theme.colors.text,
                },
              ]}
            >
              {opcion.titulo}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}