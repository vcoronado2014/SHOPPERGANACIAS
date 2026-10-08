import React from 'react';

import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../theme/ThemeProvider';

interface AvatarProps {
  uri?: string | null;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

function esImagen(uri: string | null | undefined): boolean {
  if (!uri) {
    return false;
  }

  return (
    uri.startsWith('file://') ||
    uri.startsWith('content://') ||
    uri.startsWith('http://') ||
    uri.startsWith('https://')
  );
}

function obtenerIconoAvatar(
  avatar: string | null | undefined,
): keyof typeof Ionicons.glyphMap {
  switch (avatar) {
    case '🚗':
      return 'car';

    case '🛵':
      return 'speedometer';

    case '🚲':
      return 'bicycle';

    case '😎':
      return 'happy';

    case '🦸':
      return 'star';

    case '👤':
    default:
      return 'person';
  }
}

export default function Avatar({
  uri,
  size = 96,
  style,
}: AvatarProps) {
  const theme = useTheme();

  const borderRadius = size / 2;

  const iconSize = size * 0.48;

  const mostrarImagen = esImagen(uri);

  return (
    <View
      style={[
        styles.contenedor,
        {
          width: size,
          height: size,
          borderRadius,
          backgroundColor: theme.colors.primarySoft,
          borderColor: theme.colors.primary,
        },
        style,
      ]}
    >
      {mostrarImagen ? (
        <Image
          source={{ uri: uri! }}
          style={{
            width: size,
            height: size,
            borderRadius,
          }}
          resizeMode="cover"
        />
      ) : (
        <Ionicons
          name={obtenerIconoAvatar(uri)}
          size={iconSize}
          color={theme.colors.primary}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    overflow: 'hidden',
  },
});