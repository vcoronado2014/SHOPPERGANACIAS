import React from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import { useTheme } from '../../theme/ThemeProvider';
import { usePerfilViewModel } from './PerfilViewModel';

import { useSnackBar } from '../../components/snackbar/useSnackBar';

import { createStyles } from './PerfilStyles';
import {
  AvatarSection,
  PasswordSection,
  PerfilHeader,
} from './components/PerfilComponents';

export default function PerfilView() {
  const router = useRouter();
  const theme = useTheme();
  const styles = createStyles(theme);

  const { mostrarSnackBar } = useSnackBar();

  const {
    email,
    avatarUri,
    loading,
    processing,
    error,
    success,
    passwordActual,
    nuevaPassword,
    confirmarPassword,
    setPasswordActual,
    setNuevaPassword,
    setConfirmarPassword,
    actualizarPassword,
    cambiarAvatar,
    seleccionarFotoGaleria,
    eliminarAvatar,
    cerrarSesion,
  } = usePerfilViewModel();

  const seleccionarAvatar = async (avatar: string) => {
    if (!processing) await cambiarAvatar(avatar);
  };

  const seleccionarFoto = async () => {
    if (!processing) await seleccionarFotoGaleria();
  };

  const guardarPassword = async () => {
    const resultado = await actualizarPassword();
    if (resultado) {
      mostrarSnackBar(
        'Contraseña actualizada',
        'success'
      );
    }
  };

  const confirmarCerrarSesion = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que quieres cerrar tu sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: async () => {
            const resultado = await cerrarSesion();
            if (resultado) {
              router.replace('/login');
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Componente de Cabecera */}
        <PerfilHeader
          email={email}
          avatarUri={avatarUri ?? undefined}
          processing={processing}
          onSelectFoto={seleccionarFoto}
          styles={styles}
        />

        {/* 2. Componente Card Selección de Avatar */}
        <AvatarSection
          avatarUri={avatarUri ?? undefined}
          processing={processing}
          onSelectAvatar={seleccionarAvatar}
          onSelectFoto={seleccionarFoto}
          onEliminarAvatar={eliminarAvatar}
          styles={styles}
          theme={theme}
        />

        {/* 3. Componente Card Cambiar Contraseña */}
        <PasswordSection
          passwordActual={passwordActual}
          nuevaPassword={nuevaPassword}
          confirmarPassword={confirmarPassword}
          processing={processing}
          setPasswordActual={setPasswordActual}
          setNuevaPassword={setNuevaPassword}
          setConfirmarPassword={setConfirmarPassword}
          onGuardar={guardarPassword}
          styles={styles}
          theme={theme}
        />

        {/* Feedback de Estado */}
        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {success && (
          <View style={styles.successBox}>
            <Text style={styles.successText}>{success}</Text>
          </View>
        )}

        {/* Botón Cerrar Sesión (En vista principal) */}
        <TouchableOpacity
          onPress={confirmarCerrarSesion}
          disabled={processing}
          activeOpacity={0.8}
          style={[styles.logoutButton, processing && styles.disabled]}
        >
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}