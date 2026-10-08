import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  Configuracion,
  configuracionInicial,
} from '../../domain/models/Configuracion';

const CONFIG_KEY = '@shopper/configuracion';
const ONBOARDING_KEY = '@shopper/onboarding_completed';
const THEME_KEY = '@shopper/theme';
const AVATAR_KEY = '@shopper/avatar';
const SESSION_KEY = '@shopper/session';

export type ThemeMode = 'system' | 'light' | 'dark';

/**
 * ==============================
 * CONFIGURACIÓN
 * ==============================
 */

export async function getConfiguracion(): Promise<Configuracion> {
  const value = await AsyncStorage.getItem(CONFIG_KEY);

  if (!value) {
    return configuracionInicial;
  }

  return {
    ...configuracionInicial,
    ...JSON.parse(value),
  };
}

export async function saveConfiguracion(
  configuracion: Configuracion,
): Promise<void> {
  await AsyncStorage.setItem(
    CONFIG_KEY,
    JSON.stringify(configuracion),
  );
}

/**
 * ==============================
 * ONBOARDING
 * ==============================
 */

export async function isOnboardingCompleted(): Promise<boolean> {
  const value = await AsyncStorage.getItem(ONBOARDING_KEY);

  return value === 'true';
}

export async function setOnboardingCompleted(): Promise<void> {
  await AsyncStorage.setItem(
    ONBOARDING_KEY,
    'true',
  );
}

/**
 * ==============================
 * TEMA
 * ==============================
 */

export async function getTheme(): Promise<ThemeMode> {
  const value = await AsyncStorage.getItem(THEME_KEY);

  if (
    value === 'light' ||
    value === 'dark' ||
    value === 'system'
  ) {
    return value;
  }

  return 'system';
}

export async function saveTheme(
  theme: ThemeMode,
): Promise<void> {
  await AsyncStorage.setItem(
    THEME_KEY,
    theme,
  );
}

/**
 * ==============================
 * AVATAR
 * ==============================
 */

export async function getAvatarUri(): Promise<string | null> {
  return AsyncStorage.getItem(AVATAR_KEY);
}

export async function saveAvatarUri(
  uri: string,
): Promise<void> {
  await AsyncStorage.setItem(
    AVATAR_KEY,
    uri,
  );
}

export async function removeAvatar(): Promise<void> {
  await AsyncStorage.removeItem(AVATAR_KEY);
}

/**
 * ==============================
 * SESIÓN
 * ==============================
 */

/**
 * Indica si existe una sesión activa.
 */
export async function isSessionActive(): Promise<boolean> {
  const value = await AsyncStorage.getItem(
    SESSION_KEY,
  );

  return value === 'true';
}

/**
 * Marca la sesión como activa.
 */
export async function setSessionActive(): Promise<void> {
  await AsyncStorage.setItem(
    SESSION_KEY,
    'true',
  );
}

/**
 * Cierra la sesión actual.
 *
 * No elimina:
 * - Usuario
 * - Contraseña
 * - Avatar
 * - Configuración
 * - Tema
 */
export async function clearSession(): Promise<void> {
  await AsyncStorage.removeItem(
    SESSION_KEY,
  );
}
