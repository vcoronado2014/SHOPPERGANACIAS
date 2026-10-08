import React, { useState } from 'react';
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import Avatar from '../../../components/Avatar';

import { useTheme } from '../../../theme/ThemeProvider';


const AVATARES = [
  { id: 'person', icon: 'person', value: '👤' },
  { id: 'car', icon: 'car', value: '🚗' },
  { id: 'speedometer', icon: 'speedometer', value: '🛵' },
  { id: 'bicycle', icon: 'bicycle', value: '🚲' },
  { id: 'happy', icon: 'happy', value: '😎' },
  { id: 'star', icon: 'star', value: '🦸' },
];

// -------------------------------------------------------------
// COMPONENTE 1: Cabecera con Imagen de Perfil y Email
// -------------------------------------------------------------
interface PerfilHeaderProps {
  email: string;
  avatarUri?: string;
  processing: boolean;
  onSelectFoto: () => void;
  styles: any;
}

export const PerfilHeader = ({
  email,
  avatarUri,
  processing,
  onSelectFoto,
  styles,
}: PerfilHeaderProps) => {
  const theme = useTheme();

  return (
    <View style={styles.headerContainer}>
    <View style={styles.avatarWrapper}>
      <Avatar uri={avatarUri} size={110} />
      <TouchableOpacity
        onPress={onSelectFoto}
        disabled={processing}
        activeOpacity={0.8}
        style={[styles.cameraButton, processing && styles.disabled]}
      >
        <Ionicons
  name="camera"
  size={20}
 color={theme.colors.onPrimary}
/>
      </TouchableOpacity>
    </View>

    <Text style={styles.headerTitle}>Mi Perfil</Text>
    <Text style={styles.headerEmail}>{email}</Text>
  </View>
  );
};

// -------------------------------------------------------------
// COMPONENTE 2: Card de Selección de Avatar
// -------------------------------------------------------------
interface AvatarSectionProps {
  avatarUri?: string;
  processing: boolean;
  onSelectAvatar: (avatar: string) => void;
  onSelectFoto: () => void;
  onEliminarAvatar: () => void;
  styles: any;
  theme: any;
}

export const AvatarSection = ({
  avatarUri,
  processing,
  onSelectAvatar,
  onSelectFoto,
  onEliminarAvatar,
  styles,
  theme,
}: AvatarSectionProps) => {
  const esFotoGaleria =
    avatarUri &&
    (avatarUri.startsWith('file://') ||
      avatarUri.startsWith('content://') ||
      avatarUri.startsWith('http://') ||
      avatarUri.startsWith('https://'));

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Avatar</Text>
      <Text style={styles.sectionSubtitle}>
        Selecciona un avatar o elige una foto de tu galería.
      </Text>

      <TouchableOpacity
        onPress={onSelectFoto}
        disabled={processing}
        activeOpacity={0.8}
        style={[styles.galleryButton, processing && styles.disabled]}
      >
        <View style={styles.galleryButtonContent}>
  <Ionicons
    name="camera-outline"
    size={20}
    color={theme.colors.onPrimary}
  />

  <Text style={styles.galleryButtonText}>
    Elegir foto de galería
  </Text>
</View>
      </TouchableOpacity>

    <View style={styles.avatarGrid}>
        {AVATARES.map((avatar) => {
            const seleccionado = avatarUri === avatar.value;

            return (
                <TouchableOpacity
                    key={avatar.id}
                    onPress={() => onSelectAvatar(avatar.value)}
                    disabled={processing}
                    activeOpacity={0.8}
                    style={[
                        styles.avatarItem,
                        seleccionado
                            ? styles.avatarSelected
                            : styles.avatarUnselected,
                        processing && styles.disabled,
                    ]}
                >
                    <Ionicons
                        name={avatar.icon as any}
                        size={42}
                        color={theme.colors.primary}
                    />
                </TouchableOpacity>
            );
        })}
    </View>

      {esFotoGaleria && (
        <TouchableOpacity
          onPress={onEliminarAvatar}
          disabled={processing}
          activeOpacity={0.8}
          style={styles.deletePhotoButton}
        >
          <Text style={styles.deletePhotoText}>Eliminar foto</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// -------------------------------------------------------------
// COMPONENTE 3: Formulario de Cambio de Contraseña
// -------------------------------------------------------------
interface PasswordSectionProps {
  passwordActual: string;
  nuevaPassword: string;
  confirmarPassword: string;
  processing: boolean;
  setPasswordActual: (text: string) => void;
  setNuevaPassword: (text: string) => void;
  setConfirmarPassword: (text: string) => void;
  onGuardar: () => void;
  styles: any;
  theme: any;
}

export const PasswordSection = ({
  passwordActual,
  nuevaPassword,
  confirmarPassword,
  processing,
  setPasswordActual,
  setNuevaPassword,
  setConfirmarPassword,
  onGuardar,
  styles,
  theme,
}: PasswordSectionProps) => {
  const [mostrarActual, setMostrarActual] = useState(false);
  const [mostrarNueva, setMostrarNueva] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  const renderPasswordField = (
    label: string,
    value: string,
    placeholder: string,
    onChangeText: (text: string) => void,
    mostrar: boolean,
    setMostrar: React.Dispatch<React.SetStateAction<boolean>>,
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.muted}
          secureTextEntry={!mostrar}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!processing}
        />
        <TouchableOpacity
          onPress={() => setMostrar((prev) => !prev)}
          style={styles.togglePasswordButton}
        >
          <Text style={styles.togglePasswordText}>
            {mostrar ? 'Ocultar' : 'Mostrar'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Cambiar contraseña</Text>
      <Text style={[styles.sectionSubtitle, { marginBottom: theme.spacing.lg }]}>
        Ingresa tu contraseña actual y luego define una nueva.
      </Text>

      {renderPasswordField(
        'Contraseña actual',
        passwordActual,
        'Contraseña actual',
        setPasswordActual,
        mostrarActual,
        setMostrarActual,
      )}

      {renderPasswordField(
        'Nueva contraseña',
        nuevaPassword,
        'Nueva contraseña',
        setNuevaPassword,
        mostrarNueva,
        setMostrarNueva,
      )}

      {renderPasswordField(
        'Confirmar nueva contraseña',
        confirmarPassword,
        'Repite la nueva contraseña',
        setConfirmarPassword,
        mostrarConfirmar,
        setMostrarConfirmar,
      )}

      <TouchableOpacity
        onPress={onGuardar}
        disabled={processing}
        activeOpacity={0.8}
        style={[styles.saveButton, processing && { opacity: 0.7 }]}
      >
        {processing ? (
          <ActivityIndicator color={theme.colors.onPrimary} />
        ) : (
          <Text style={styles.saveButtonText}>Actualizar contraseña</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};