import React from 'react';

import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { useTheme } from '../../src/presentation/theme/ThemeProvider';
import HeaderAvatar from '../../src/presentation/components/HeaderAvatar';

export default function TabsLayout() {
  const theme = useTheme();

  return (
    <Tabs
      initialRouteName="pedidos"
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },

        headerTintColor: theme.colors.onPrimary,

        headerTitleStyle: {
          fontWeight: '700',
        },

        headerLeft: () => <HeaderAvatar />,

        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },

        tabBarActiveTintColor: theme.colors.primary,

        tabBarInactiveTintColor: theme.colors.muted,

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },

        tabBarIconStyle: {
          marginBottom: -2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarLabel: 'Inicio',

          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="home-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="pedidos"
        options={{
          title: 'Pedidos',
          tabBarLabel: 'Pedidos',

          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="bag-handle-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="ganancias"
        options={{
          title: 'Ganancias',
          tabBarLabel: 'Ganancias',

          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="cash-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="configuracion"
        options={{
          title: 'Configuración',
          tabBarLabel: 'Configuración',

          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="settings-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Mi Perfil',
          tabBarLabel: 'Perfil',

          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="person-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}