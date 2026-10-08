import React from 'react';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SQLiteProvider } from 'expo-sqlite';
import { Stack } from 'expo-router';

import { initializeDatabase } from '../src/data/database/database';
import { AppThemeProvider } from '../src/presentation/theme/ThemeProvider';
import { SnackBarProvider } from '../src/presentation/components/snackbar/SnackBarProvider';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SQLiteProvider
        databaseName="shopper_ganancias.db"
        onInit={initializeDatabase}
      >
        <AppThemeProvider>
          <SnackBarProvider>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />
          </SnackBarProvider>
        </AppThemeProvider>
      </SQLiteProvider>
    </SafeAreaProvider>
  );
}