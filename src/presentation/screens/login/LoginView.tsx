import React, { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { getAvatarUri } from '../../../data/storage/appStorage';

import { useRouter } from 'expo-router';

import { useTheme } from '../../theme/ThemeProvider';

import { useLoginViewModel } from '../../screens/login/LoginViewModel';

import { useSnackBar } from '../../components/snackbar/useSnackBar';

import Avatar from '../../components/Avatar';

export default function LoginView() {
  const router = useRouter();
  const theme = useTheme();
  const { mostrarSnackBar } = useSnackBar();
  const [avatarUri, setAvatarUri] =
  useState<string | null>(null);

  useEffect(() => {
    const cargarAvatar = async () => {
      const avatar = await getAvatarUri();

      setAvatarUri(avatar);
    };

    cargarAvatar();
  }, []);

  const {
    email,
    password,
    confirmPassword,

    setEmail,
    setPassword,
    setConfirmPassword,

    isRegisterMode,

    loading,
    processing,
    error,

    iniciarSesion,
    registrarUsuario,
  } = useLoginViewModel();

  const continuar = async () => {
    const resultado = isRegisterMode
      ? await registrarUsuario()
      : await iniciarSesion();

    if (!resultado.ok) {
      mostrarSnackBar(
        resultado.error ??
        'No fue posible completar la operación.',
        'error',
        5000,
        'bottom'
      );

      return;
    }

    router.replace('/(tabs)');
  };

  if (loading) {
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

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          padding: theme.spacing.xl,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{
            width: '100%',
            maxWidth: 480,
            alignSelf: 'center',
          }}
        >
          {/* Avatar */}
          <View
            style={{
              alignItems: 'center',
              marginBottom: theme.spacing.xl,
            }}
          >
            <Avatar
              uri={avatarUri}
              size={96}
            />
          </View>

          {/* Título */}
          <Text
            style={{
              fontSize: 28,
              fontWeight: '700',
              color: theme.colors.text,
              textAlign: 'center',
              marginBottom: theme.spacing.sm,
            }}
          >
            {isRegisterMode
              ? 'Crear cuenta'
              : 'Iniciar sesión'}
          </Text>

          <Text
            style={{
              fontSize: 15,
              color: theme.colors.muted,
              textAlign: 'center',
              marginBottom: theme.spacing.xl,
              lineHeight: 22,
            }}
          >
            {isRegisterMode
              ? 'Crea tu cuenta local para comenzar a registrar y controlar tus ganancias.'
              : 'Ingresa tus datos para continuar.'}
          </Text>

          {/* Email */}
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: theme.colors.text,
              marginBottom: theme.spacing.xs,
            }}
          >
            Correo electrónico
          </Text>

          <TextInput
            style={{
              borderWidth: 1,
              borderColor: theme.colors.border,
              borderRadius: theme.radius.md,
              backgroundColor: theme.colors.surface,
              color: theme.colors.text,
              paddingHorizontal: theme.spacing.md,
              paddingVertical: 13,
              fontSize: 16,
              marginBottom: theme.spacing.lg,
            }}
            value={email}
            onChangeText={setEmail}
            placeholder="correo@ejemplo.com"
            placeholderTextColor={theme.colors.muted}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!processing}
          />

          {/* Password */}
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: theme.colors.text,
              marginBottom: theme.spacing.xs,
            }}
          >
            Contraseña
          </Text>

          <TextInput
            style={{
              borderWidth: 1,
              borderColor: theme.colors.border,
              borderRadius: theme.radius.md,
              backgroundColor: theme.colors.surface,
              color: theme.colors.text,
              paddingHorizontal: theme.spacing.md,
              paddingVertical: 13,
              fontSize: 16,
              marginBottom: isRegisterMode
                ? theme.spacing.lg
                : theme.spacing.md,
            }}
            value={password}
            onChangeText={setPassword}
            placeholder="Ingresa tu contraseña"
            placeholderTextColor={theme.colors.muted}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            editable={!processing}
          />

          {/* Confirm password */}
          {isRegisterMode && (
            <>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: theme.colors.text,
                  marginBottom: theme.spacing.xs,
                }}
              >
                Confirmar contraseña
              </Text>

              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  borderRadius: theme.radius.md,
                  backgroundColor:
                    theme.colors.surface,
                  color: theme.colors.text,
                  paddingHorizontal:
                    theme.spacing.md,
                  paddingVertical: 13,
                  fontSize: 16,
                  marginBottom: theme.spacing.md,
                }}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Repite tu contraseña"
                placeholderTextColor={
                  theme.colors.muted
                }
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={!processing}
              />
            </>
          )}

          {/* Main button */}
          <TouchableOpacity
            style={{
              backgroundColor:
                theme.colors.primary,
              borderRadius: theme.radius.md,
              minHeight: 52,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: theme.spacing.sm,
              opacity: processing ? 0.7 : 1,
            }}
            onPress={continuar}
            disabled={processing}
            activeOpacity={0.8}
          >
            {processing ? (
              <ActivityIndicator
                color={theme.colors.onPrimary}
              />
            ) : (
              <Text
                style={{
                  color: theme.colors.onPrimary,
                  fontSize: 16,
                  fontWeight: '700',
                }}
              >
                {isRegisterMode
                  ? 'Crear cuenta'
                  : 'Ingresar'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Informativo */}
          <Text
            style={{
              color: theme.colors.muted,
              fontSize: 12,
              lineHeight: 18,
              textAlign: 'center',
              marginTop: theme.spacing.lg,
            }}
          >
            Tus datos de acceso se almacenan
            localmente en este dispositivo.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}