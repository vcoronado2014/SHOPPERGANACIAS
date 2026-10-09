
import React, { useState } from 'react';

import {
  ActivityIndicator,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { useSQLiteContext } from 'expo-sqlite';

import { useTheme } from '../../theme/ThemeProvider';

import { useInicioViewModel } from './InicioViewModel';

import { styles } from './InicioStyles';

import SelectorResumen, {
  VistaResumen,
} from './components/SelectorResumen';

import ResumenContenido from './components/ResumenContenido';

import ResumenDiario from './components/ResumenDiario';

import HistorialSemanal from './components/HistorialSemanal';

function obtenerFechaHoy(): string {
  const fecha = new Date();
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');

  return `${anio}-${mes}-${dia}`;
}

export default function InicioView() {
  const db = useSQLiteContext();
  const theme = useTheme();

  const {
    resultadoSemanal,
    resultadoGeneral,
    semanasRegistradas,
    loadingSemana,
    loadingGeneral,
    errorSemana,
    errorGeneral,
    resultadoDia,
    pedidos,
    loading: loadingHoy,
    error: errorHoy,
  } = useInicioViewModel(db);

  const [vista, setVista] =
    useState<VistaResumen>('hoy');

  const cargando =
    vista === 'hoy'
      ? loadingHoy
      : vista === 'semanal'
        ? loadingSemana
        : loadingGeneral;

  const mensajeError =
    vista === 'hoy'
      ? errorHoy
      : vista === 'semanal'
        ? errorSemana
        : errorGeneral;

  const resultado =
    vista === 'semanal'
      ? resultadoSemanal
      : vista === 'general'
        ? resultadoGeneral
        : null;

  const sinDatosHoy =
    vista === 'hoy' &&
    pedidos.length === 0 &&
    resultadoDia === null;

  const sinDatosPeriodo =
    vista !== 'hoy' && resultado === null;

  return (
    <ScrollView
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
        },
      ]}
      contentContainerStyle={styles.content}
    >
      <SelectorResumen
        vista={vista}
        onCambiar={setVista}
      />

      {cargando ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={theme.colors.primary}
          />
        </View>
      ) : mensajeError ? (
        <View
          style={[
            styles.errorCard,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.errorText,
              { color: theme.colors.danger },
            ]}
          >
            {mensajeError}
          </Text>
        </View>
      ) : vista === 'hoy' ? (
        sinDatosHoy ? (
          <View
            style={[
              styles.detailCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.detailLabel,
                { color: theme.colors.muted },
              ]}
            >
              Todavía no tienes pedidos registrados hoy.
            </Text>
          </View>
        ) : (
          <ResumenDiario
            fecha={obtenerFechaHoy()}
            cantidadPedidos={pedidos.length}
            resultado={resultadoDia}
          />
        )
      ) : sinDatosPeriodo ? (
        <View
          style={[
            styles.detailCard,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.detailLabel,
              { color: theme.colors.muted },
            ]}
          >
            No hay días registrados todavía.
          </Text>
        </View>
      ) : resultado ? (
        <>
          <ResumenContenido
            resultado={resultado}
            tituloLiquido={
              vista === 'semanal'
                ? 'Líquido semanal'
                : 'Líquido general'
            }
            tituloDetalle={
              vista === 'semanal'
                ? 'Resumen semanal'
                : 'Resumen general'
            }
            mostrarDias={vista === 'semanal'}
          />

          {vista === 'general' && (
            <HistorialSemanal
              semanas={semanasRegistradas}
            />
          )}
        </>
      ) : null}
    </ScrollView>
  );
}