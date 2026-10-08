import React, { useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  View,
} from 'react-native';

import { useTheme } from '../../../theme/ThemeProvider';

import { crearGananciasStyles } from '../GananciasStyles';

import {
  DiaGanancias,
} from '../GananciasViewModel';

import {
  ResultadoSemanal,
} from '../../../../domain/calculators/semanaCalculator';

import {
  exportarGananciasExcel,
} from '../../../../data/export/gananciasExcel';

interface ExportarGananciasProps {
  fechaInicio: string;
  fechaFin: string;
  tieneDatos: boolean;
  datosDias: DiaGanancias[];
  resultadoSemana: ResultadoSemanal | null;
}

function formatearFecha(fecha: string): string {
  const [year, month, day] = fecha.split('-');

  return `${day}/${month}/${year}`;
}

export function ExportarGanancias({
  fechaInicio,
  fechaFin,
  tieneDatos,
  datosDias,
  resultadoSemana,
}: ExportarGananciasProps) {
  const theme = useTheme();

  const styles =
    crearGananciasStyles(theme);

  const [
    exportando,
    setExportando,
  ] = useState(false);

  const handleExportar = async () => {
    if (!tieneDatos) {
      Alert.alert(
        'Sin información',
        'No hay información de ganancias para exportar.',
      );

      return;
    }

    if (!resultadoSemana) {
      Alert.alert(
        'Sin información',
        'No existe un resumen semanal para exportar.',
      );

      return;
    }

    try {
      setExportando(true);

      await exportarGananciasExcel(
        fechaInicio,
        fechaFin,
        datosDias,
        resultadoSemana,
      );
    } catch (error) {
      console.error(
        'Error exportando ganancias:',
        error,
      );

      Alert.alert(
        'Error',
        'No fue posible generar el archivo Excel.',
      );
    } finally {
      setExportando(false);
    }
  };

  return (
    <View style={styles.tarjeta}>
      <Text style={styles.seccionTitulo}>
        Exportar ganancias
      </Text>

      <Text style={styles.textoMuted}>
        Exporta el resumen completo de la semana para
        llevar tus cuentas.
      </Text>

      <Text
        style={[
          styles.texto,
          {
            marginTop: theme.spacing.sm,
          },
        ]}
      >
        Semana:{' '}
        {formatearFecha(fechaInicio)}
        {' - '}
        {formatearFecha(fechaFin)}
      </Text>

      <Pressable
        style={({ pressed }) => [
          styles.botonExportar,

          pressed &&
            !exportando && {
              opacity: 0.8,
            },

          exportando && {
            opacity: 0.6,
          },
        ]}
        onPress={handleExportar}
        disabled={exportando}
      >
        {exportando ? (
          <ActivityIndicator
            color={theme.colors.onPrimary}
          />
        ) : (
          <Text
            style={
              styles.botonExportarTexto
            }
          >
            Exportar a Excel
          </Text>
        )}
      </Pressable>
    </View>
  );
}
