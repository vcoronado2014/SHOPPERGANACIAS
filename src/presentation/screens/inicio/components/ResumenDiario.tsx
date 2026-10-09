
import React from 'react';

import { Text, View } from 'react-native';

import { useTheme } from '../../../theme/ThemeProvider';

import { ResultadoDia } from '../../../../domain/calculators/diaCalculator';

import { styles } from '../InicioStyles';

interface ResumenDiarioProps {
  fecha: string;
  cantidadPedidos: number;
  resultado: ResultadoDia | null;
}

function formatearMonto(valor: number): string {
  return `$${Math.round(valor).toLocaleString('es-CL')}`;
}

function formatearKilometros(valor: number): string {
  return `${valor.toLocaleString('es-CL', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} km`;
}

function formatearFecha(fecha: string): string {
  const partes = fecha.split('-');

  if (partes.length !== 3) {
    return fecha;
  }

  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

export default function ResumenDiario({
  fecha,
  cantidadPedidos,
  resultado,
}: ResumenDiarioProps) {
  const theme = useTheme();

  const kilometros = resultado?.kilometros ?? 0;

  const kilometrosPorPedido =
    cantidadPedidos > 0 ? kilometros / cantidadPedidos : 0;

  const estadisticas = [
    {
      titulo: 'Pedidos',
      valor: cantidadPedidos.toLocaleString('es-CL'),
    },
    {
      titulo: 'Kilómetros',
      valor: formatearKilometros(kilometros),
    },
    {
      titulo: 'Bruto',
      valor: formatearMonto(resultado?.brutoDia ?? 0),
    },
  ];

  const detalles = [
    { titulo: 'Bruto pedidos', valor: resultado?.brutoPedidos ?? 0 },
    { titulo: 'Asegurado', valor: resultado?.asegurado ?? 0 },
    { titulo: 'Ajuste asegurado', valor: resultado?.ajusteAsegurado ?? 0 },
    { titulo: 'Bonos de pedidos', valor: resultado?.bonosPedido ?? 0 },
    { titulo: 'Bonos del día', valor: resultado?.bonosDia ?? 0 },
    { titulo: 'Combustible', valor: resultado?.combustible ?? 0 },
    { titulo: 'Boleta', valor: resultado?.boleta ?? 0 },
  ];

  return (
    <>
      <View
        style={[
          styles.periodCard,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <Text
          style={[
            styles.periodLabel,
            { color: theme.colors.muted },
          ]}
        >
          Resumen diario
        </Text>

        <Text
          style={[
            styles.periodValue,
            { color: theme.colors.text },
          ]}
        >
          {formatearFecha(fecha)}
        </Text>
      </View>

      <View
        style={[
          styles.heroCard,
          { backgroundColor: theme.colors.primary },
        ]}
      >
        <Text
          style={[
            styles.heroLabel,
            { color: theme.colors.onPrimary },
          ]}
        >
          Líquido estimado del día
        </Text>

        <Text
          style={[
            styles.heroAmount,
            { color: theme.colors.onPrimary },
          ]}
        >
          {formatearMonto(resultado?.liquido ?? 0)}
        </Text>

        <Text
          style={[
            styles.heroSubtext,
            { color: theme.colors.onPrimary },
          ]}
        >
          Ganancia después de combustible y boleta
        </Text>
      </View>

      <View style={styles.statsGrid}>
        {estadisticas.map((estadistica) => (
          <View
            key={estadistica.titulo}
            style={[
              styles.statCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.statLabel,
                { color: theme.colors.muted },
              ]}
            >
              {estadistica.titulo}
            </Text>

            <Text
              style={[
                styles.statValue,
                { color: theme.colors.text },
              ]}
            >
              {estadistica.valor}
            </Text>
          </View>
        ))}
      </View>

      <View
        style={[
          styles.averageCard,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.colors.text },
          ]}
        >
          Distancia promedio
        </Text>

        <Text
          style={[
            styles.averageValue,
            { color: theme.colors.primary },
          ]}
        >
          {formatearKilometros(kilometrosPorPedido)}
        </Text>

        <Text
          style={[
            styles.averageDescription,
            { color: theme.colors.muted },
          ]}
        >
          por pedido
        </Text>
      </View>

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
            styles.sectionTitle,
            { color: theme.colors.text },
          ]}
        >
          Detalle del día
        </Text>

        {detalles.map((detalle) => (
          <View
            key={detalle.titulo}
            style={styles.detailRow}
          >
            <Text
              style={[
                styles.detailLabel,
                { color: theme.colors.muted },
              ]}
            >
              {detalle.titulo}
            </Text>

            <Text
              style={[
                styles.detailValue,
                { color: theme.colors.text },
              ]}
            >
              {formatearMonto(detalle.valor)}
            </Text>
          </View>
        ))}
      </View>
    </>
  );
}