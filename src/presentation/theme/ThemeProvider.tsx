import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useColorScheme } from 'react-native';

import {
  getTheme,
  saveTheme,
  ThemeMode,
} from '../../data/storage/appStorage';

export type AppTheme = {
  colors: {
    background: string;
    surface: string;
    primary: string;
    primarySoft: string;
    text: string;
    muted: string;
    border: string;
    onPrimary: string;
    success: string;
    warning: string;
    danger: string;
  };

  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };

  radius: {
    sm: number;
    md: number;
    lg: number;
  };
};

const lightTheme: AppTheme = {
  colors: {
    background: '#F5F7FB',
    surface: '#FFFFFF',
    primary: '#1D4ED8',
    primarySoft: '#DBEAFE',
    text: '#111827',
    muted: '#6B7280',
    border: '#E5E7EB',
    onPrimary: '#FFFFFF',
    success: '#16A34A',
    warning: '#F59E0B',
    danger: '#DC2626',
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },

  radius: {
    sm: 8,
    md: 12,
    lg: 16,
  },
};

const darkTheme: AppTheme = {
  colors: {
    background: '#0F172A',
    surface: '#111827',
    primary: '#60A5FA',
    primarySoft: '#1E3A8A',
    text: '#F8FAFC',
    muted: '#94A3B8',
    border: '#334155',
    onPrimary: '#0F172A',
    success: '#4ADE80',
    warning: '#FBBF24',
    danger: '#F87171',
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },

  radius: {
    sm: 8,
    md: 12,
    lg: 16,
  },
};

type AppThemeContextValue = {
  theme: AppTheme;

  themeMode: ThemeMode;

  resolvedTheme: 'light' | 'dark';

  cambiarTema: (mode: ThemeMode) => Promise<void>;
};

const AppThemeContext =
  createContext<AppThemeContextValue | null>(null);

export function AppThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const systemScheme = useColorScheme();

  const [themeMode, setThemeMode] =
    useState<ThemeMode>('system');

  useEffect(() => {
    const cargarTema = async () => {
      try {
        const temaGuardado = await getTheme();

        setThemeMode(temaGuardado);
      } catch (error) {
        console.error(
          'Error cargando tema:',
          error,
        );
      }
    };

    cargarTema();
  }, []);

  const cambiarTema = useCallback(
    async (mode: ThemeMode) => {
      try {
        setThemeMode(mode);

        await saveTheme(mode);
      } catch (error) {
        console.error(
          'Error guardando tema:',
          error,
        );
      }
    },
    [],
  );

  const resolvedTheme: 'light' | 'dark' =
    themeMode === 'system'
      ? systemScheme === 'dark'
        ? 'dark'
        : 'light'
      : themeMode;

  const theme = useMemo<AppTheme>(() => {
    return resolvedTheme === 'dark'
      ? darkTheme
      : lightTheme;
  }, [resolvedTheme]);

  const value = useMemo<AppThemeContextValue>(
    () => ({
      theme,
      themeMode,
      resolvedTheme,
      cambiarTema,
    }),
    [
      theme,
      themeMode,
      resolvedTheme,
      cambiarTema,
    ],
  );

  return (
    <AppThemeContext.Provider value={value}>
      {children}
    </AppThemeContext.Provider>
  );
}

export function useTheme(): AppTheme {
  const context = useContext(AppThemeContext);

  if (!context) {
    throw new Error(
      'useTheme debe utilizarse dentro de AppThemeProvider',
    );
  }

  return context.theme;
}

export function useThemeSettings() {
  const context = useContext(AppThemeContext);

  if (!context) {
    throw new Error(
      'useThemeSettings debe utilizarse dentro de AppThemeProvider',
    );
  }

  return {
    themeMode: context.themeMode,
    resolvedTheme: context.resolvedTheme,
    cambiarTema: context.cambiarTema,
  };
}