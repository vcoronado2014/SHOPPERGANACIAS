
import React from 'react';

import {
  Modal,
  Pressable,
  Text,
  View,
} from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';

import {
  dialogoStyles,
} from './DialogoPersonalizadoStyles';

export interface DialogoPersonalizadoProps {
  visible: boolean;

  icono?: React.ReactNode;

  titulo: string;
  subtitulo?: string;
  parrafo: string;

  textoAceptar?: string;
  textoCancelar?: string;

  onAceptar: () => void;
  onCancelar: () => void;
}

export default function DialogoPersonalizado({
  visible,
  icono,
  titulo,
  subtitulo,
  parrafo,
  textoAceptar = 'Aceptar',
  textoCancelar = 'Cancelar',
  onAceptar,
  onCancelar,
}: DialogoPersonalizadoProps) {
  const theme = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCancelar}
    >
      <View
        style={[
          dialogoStyles.overlay,
          {
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
          },
        ]}
      >
        <View
          style={[
            dialogoStyles.contenedor,
            {
              backgroundColor: theme.colors.surface,
            },
          ]}
        >
          {icono != null && (
            <View style={dialogoStyles.contenedorIcono}>
              {icono}
            </View>
          )}

          <Text
            style={[
              dialogoStyles.titulo,
              {
                color: theme.colors.text,
              },
            ]}
          >
            {titulo}
          </Text>

          {subtitulo ? (
            <Text
              style={[
                dialogoStyles.subtitulo,
                {
                  color: theme.colors.primary,
                },
              ]}
            >
              {subtitulo}
            </Text>
          ) : null}

          <Text
            style={[
              dialogoStyles.parrafo,
              {
                color: theme.colors.muted,
              },
            ]}
          >
            {parrafo}
          </Text>

          <View style={dialogoStyles.contenedorBotones}>
            <Pressable
              accessibilityRole="button"
              onPress={onCancelar}
              style={({ pressed }) => [
                dialogoStyles.boton,
                {
                  backgroundColor: theme.colors.surface,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Text
                style={[
                  dialogoStyles.textoBoton,
                  {
                    color: theme.colors.text,
                  },
                ]}
              >
                {textoCancelar}
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={onAceptar}
              style={({ pressed }) => [
                dialogoStyles.boton,
                {
                  backgroundColor: theme.colors.primary,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text
                style={[
                  dialogoStyles.textoBoton,
                  {
                    color: theme.colors.onPrimary,
                  },
                ]}
              >
                {textoAceptar}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}