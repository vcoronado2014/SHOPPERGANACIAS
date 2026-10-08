import React, { useEffect } from 'react';

import {
  Pressable,
  Text,
  View,
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useTheme } from '../../theme/ThemeProvider';
import { styles } from './SnackBarStyles';

export type SnackBarPosicion =
  | 'top'
  | 'center'
  | 'bottom';

export type SnackBarTipo =
  | 'success'
  | 'error'
  | 'warning'
  | 'info';

interface SnackBarProps {
  mensaje: string;
  visible: boolean;
  tipo: SnackBarTipo;
  onClose: () => void;
  duracion?: number;
  posicion?: SnackBarPosicion;
}

const iconos: Record<
  SnackBarTipo,
  keyof typeof MaterialCommunityIcons.glyphMap
> = {
  success: 'check-circle',
  error: 'alert-circle',
  warning: 'alert',
  info: 'information',
};

export function SnackBar({
  mensaje,
  visible,
  tipo,
  onClose,
  duracion = 3000,
  posicion = 'top'
}: SnackBarProps) {
  const theme = useTheme();

  useEffect(() => {
    if (!visible) {
      return;
    }

    const timer = setTimeout(() => {
      onClose();
    }, duracion);

    return () => clearTimeout(timer);
  }, [
    visible,
    duracion,
    onClose,
  ]);

  if (!visible) {
    return null;
  }

    const colorIcono = {
    success: theme.colors.success,
    error: theme.colors.danger,
    warning: theme.colors.warning,
    info: theme.colors.primary,
    }[tipo];

    const colorFondo = {
    success: theme.colors.success,
    error: theme.colors.danger,
    warning: theme.colors.warning,
    info: theme.colors.primary,
    }[tipo];

  return (
    <View
    pointerEvents="box-none"
    style={[
        styles.container,
        styles[posicion],
    ]}
    >
    <View
    style={[
        styles.snackBar,
        {
        backgroundColor:
            theme.colors.text,
        borderColor:
            theme.colors.border,
        },
    ]}
    >
        <MaterialCommunityIcons
          name={iconos[tipo]}
          size={22}
          color={colorIcono}
          style={styles.icono}
        />

        <Text
          style={[
            styles.mensaje,
            {
              color: theme.colors.background,
            },
          ]}
        >
          {mensaje}
        </Text>

        <Pressable
          onPress={onClose}
          hitSlop={10}
          style={styles.botonCerrar}
        >
          <MaterialCommunityIcons
            name="close"
            size={20}
            color={theme.colors.muted}
          />
        </Pressable>
      </View>
    </View>
  );
}