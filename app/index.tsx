import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router';

import {
  hasLocalUser,
} from '../src/data/storage/authStorage';

import {
  isSessionActive,
} from '../src/data/storage/appStorage';

import { useTheme } from '../src/presentation/theme/ThemeProvider';

export default function Index() {
  const theme = useTheme();

  const [loading, setLoading] = useState(true);
  const [destino, setDestino] = useState<
    '/login' | '/(tabs)' | null
  >(null);

  useEffect(() => {
    const verificarAcceso = async () => {
      try {
        const usuarioExiste = await hasLocalUser();

        if (!usuarioExiste) {
          setDestino('/login');
          return;
        }

        const sesionActiva = await isSessionActive();

        if (sesionActiva) {
          setDestino('/(tabs)');
        } else {
          setDestino('/login');
        }
      } catch (error) {
        console.error(
          'Error verificando acceso:',
          error,
        );

        setDestino('/login');
      } finally {
        setLoading(false);
      }
    };

    verificarAcceso();
  }, []);

  if (loading || !destino) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.colors.background,
        }}
      >
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
        />
      </View>
    );
  }

  return <Redirect href={destino} />;
}