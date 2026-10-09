import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  Configuracion,
  configuracionInicial,
  DiaSemana,
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

/**
 * Recupera la configuración guardada.
 *
 * - Completa los valores que no existan con los valores iniciales.
 * - Migra los montos del asegurado desde la configuración antigua.
 * - Conserva las ventanas horarias personalizadas.
 */
export async function getConfiguracion(): Promise<Configuracion> {
  const value = await AsyncStorage.getItem(CONFIG_KEY);

  if (!value) {
    return configuracionInicial;
  }

  try {
    const guardada: Partial<Configuracion> & {
      aseguradoLunesSabado?: number;
      aseguradoDomingo?: number;
    } = JSON.parse(value);

    const dias: DiaSemana[] = [
      'lunes',
      'martes',
      'miercoles',
      'jueves',
      'viernes',
      'sabado',
      'domingo',
    ];

    const aseguradoGuardado =
      guardada.aseguradoPorDia ?? configuracionInicial.aseguradoPorDia;

    const aseguradoPorDia: Configuracion['aseguradoPorDia'] = {
      ...configuracionInicial.aseguradoPorDia,
    };

    for (const dia of dias) {
      const valorInicial =
        configuracionInicial.aseguradoPorDia[dia];

      const valorGuardado = aseguradoGuardado[dia];

      const montoAnterior =
        dia === 'domingo'
          ? guardada.aseguradoDomingo
          : guardada.aseguradoLunesSabado;

      aseguradoPorDia[dia] = {
        monto:
          typeof valorGuardado?.monto === 'number'
            ? valorGuardado.monto
            : typeof montoAnterior === 'number'
              ? montoAnterior
              : valorInicial.monto,

        pedidosMinimos:
          typeof valorGuardado?.pedidosMinimos === 'number'
            ? valorGuardado.pedidosMinimos
            : valorInicial.pedidosMinimos,
      };
    }

    const ventanasHorarias =
      Array.isArray(guardada.ventanasHorarias)
        ? guardada.ventanasHorarias
        : configuracionInicial.ventanasHorarias;

    return {
      ...configuracionInicial,
      ...guardada,
      aseguradoPorDia,
      ventanasHorarias,
    };
  } catch (error) {
    console.error(
      'Error leyendo la configuración guardada:',
      error,
    );

    return configuracionInicial;
  }
}

/**
 * Guarda la configuración actual.
 */
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