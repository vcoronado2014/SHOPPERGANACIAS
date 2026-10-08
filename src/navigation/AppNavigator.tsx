import React from 'react';
import {
  NavigationContainer,
} from '@react-navigation/native';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import { HomeScreen } from '../screens/HomeScreen';
import  PedidosView from '../presentation/screens/pedidos/PedidosView';
import { useTheme } from '../presentation/theme/ThemeProvider';
import  ConfiguracionView  from '../presentation/screens/configuracion/ConfiguracionView';

export type RootStackParamList = {
  Home: undefined;
  Pedidos: undefined;
  Configuracion: undefined;
};

const Stack =
  createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const theme = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Pedidos"
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor:
            theme.colors.onPrimary,
          headerTitleStyle: {
            fontWeight: '700',
          },
          contentStyle: {
            backgroundColor:
              theme.colors.background,
          },
        }}
      >
        <Stack.Screen
          name="Configuracion"
          component={ConfiguracionView}
          options={{
            title: 'Configuración',
          }}
        />

        <Stack.Screen
          name="Pedidos"
          component={PedidosView}
          options={{
            title: 'ShopperGanancias',
          }}
        />

        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Inicio',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
