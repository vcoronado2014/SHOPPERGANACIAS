import React, {
  useState,
} from 'react';

import {
  Pressable,
  Text,
  View,
} from 'react-native';

import {
  VentanaHoraria,
} from '../../../../domain/models/Configuracion';

import { styles } from '../PedidosStyles';

import {
  useTheme,
} from '../../../theme/ThemeProvider';

interface Props {
  inicio: string;
  fin: string;

  ventanas: VentanaHoraria[];

  onChange: (
    inicio: string,
    fin: string,
  ) => void;
}

export default function VentanaHorariaSelector({
  inicio,
  fin,
  ventanas,
  onChange,
}: Props) {
  const theme = useTheme();

  const [
    abierto,
    setAbierto,
  ] = useState(false);

  const seleccionar = (
    ventana: VentanaHoraria,
  ) => {
    onChange(
      ventana.inicio,
      ventana.fin,
    );

    setAbierto(false);
  };

  return (
    <View
      style={styles.selectorContainer}
    >
      <Pressable
        style={styles.selector}
        onPress={() =>
          setAbierto(!abierto)
        }
      >
        <Text
          style={
            inicio && fin
              ? styles.selectorText
              : styles.selectorPlaceholder
          }
        >
          {inicio && fin
            ? `${inicio} - ${fin}`
            : 'Seleccionar ventana horaria'}
        </Text>

        <Text
          style={styles.selectorArrow}
        >
          ▼
        </Text>
      </Pressable>

      {abierto && (
        <View
          style={
            styles.selectorOptions
          }
        >
          {ventanas.map(
            (ventana) => (
              <Pressable
                key={`${ventana.inicio}-${ventana.fin}`}
                style={
                  styles.selectorOption
                }
                onPress={() =>
                  seleccionar(
                    ventana,
                  )
                }
              >
                <Text
                  style={
                    styles.selectorOptionText
                  }
                >
                  {ventana.label}
                </Text>
              </Pressable>
            ),
          )}
        </View>
      )}
    </View>
  );
}