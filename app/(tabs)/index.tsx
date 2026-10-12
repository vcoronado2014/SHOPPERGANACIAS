
import React from 'react';

import {
  Text,
} from 'react-native';

import {
  router,
  useFocusEffect,
} from 'expo-router';

import { Ionicons } from '@expo/vector-icons';

import InicioView from '../../src/presentation/screens/inicio/InicioView';

import DialogoPersonalizado from '../../src/presentation/components/dialogo/DialogoPersonalizado';

import {
  useDialogo,
} from '../../src/presentation/components/dialogo/useDialogo';

import {
  consumirAvisoConfiguracionInicial,
} from '../../src/data/storage/appStorage';

import {
  useTheme,
} from '../../src/presentation/theme/ThemeProvider';

export default function Inicio() {
  const theme = useTheme();

  const {
    dialogo,
    mostrarDialogo,
    aceptarDialogo,
    cancelarDialogo,
  } = useDialogo();

  useFocusEffect(
    React.useCallback(() => {
      let activo = true;

      const verificarAviso = async () => {
        try {
          const mostrarAviso =
            await consumirAvisoConfiguracionInicial();

          if (!activo || !mostrarAviso) {
            return;
          }

          mostrarDialogo({
            icono: (
              <Ionicons
                name="settings-outline"
                size={48}
                color={theme.colors.primary}
              />
            ),

            titulo: 'Revisa tu configuración',

            subtitulo: 'Personaliza tus ganancias',

            parrafo:
              'Los valores iniciales vienen definidos por defecto. Revisa el valor base por pedido, los SKU, la compensación por kilómetros, los asegurados, el porcentaje de boleta y el combustible para que tus cálculos sean correctos.',

            textoAceptar: 'Ir a Configuración',

            textoCancelar: 'Revisar más tarde',

            onAceptar: () => {
              router.navigate('/(tabs)/configuracion');
            },
          });
        } catch (error) {
          console.error(
            '[AvisoConfig] Error:',
            error,
          );
        }
      };

      verificarAviso();

      return () => {
        activo = false;
      };
    }, [mostrarDialogo, theme.colors.primary]),
  );

  return (
    <>
      <InicioView />

      <DialogoPersonalizado
        {...dialogo}
        onAceptar={aceptarDialogo}
        onCancelar={cancelarDialogo}
      />
    </>
  );
}
