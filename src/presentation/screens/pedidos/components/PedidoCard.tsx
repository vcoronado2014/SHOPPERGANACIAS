import React from 'react';

import {
  Pressable,
  Text,
  View,
} from 'react-native';

import { styles } from '../PedidosStyles';
import {
  useTheme,
} from '../../../theme/ThemeProvider';

interface Pedido {
  id: number;
  numeroOrden: string;
  ventanaInicio: string;
  ventanaFin: string;
  pedidoBaseAplicado: number;
  cantidadSku: number;
  kilometros: number;
}

interface ResultadoPedido {
  totalBonos: number;
  bruto: number;
  combustible: number;
  boleta: number;
  liquidoEstimado: number;
}

interface Props {
  pedido: Pedido;
  resultado: ResultadoPedido;
  onEditar: (pedidoId: number) => void;
  onEliminar: (pedidoId: number) => void;
}

const formatearPesos = (
  valor: number,
): string => {
  return `$${Math.round(
    valor,
  ).toLocaleString('es-CL')}`;
};

export default function PedidoCard({
  pedido,
  resultado,
  onEditar,
  onEliminar,
}: Props) {
  const theme = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: theme.colors.background }]}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderInfo}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Orden {pedido.numeroOrden}
          </Text>

          <Text style={[styles.cardSubtitle, { color: theme.colors.text }]}>
            {pedido.ventanaInicio} -{' '}
            {pedido.ventanaFin}
          </Text>
        </View>

        <Text style={[styles.cardAmount, { color: theme.colors.text }]}>
          {formatearPesos(
            resultado.liquidoEstimado,
          )}
        </Text>
      </View>

      <View style={styles.cardRow}>
        <Text style={[styles.cardLabel, { color: theme.colors.text }]}>
          Pedido base
        </Text>

        <Text style={[styles.cardValue, { color: theme.colors.text }]}>
          {formatearPesos(
            pedido.pedidoBaseAplicado,
          )}
        </Text>
      </View>

      <View style={styles.cardRow}>
        <Text style={[styles.cardLabel, { color: theme.colors.text }]}>
          SKU
        </Text>

        <Text style={[styles.cardValue, { color: theme.colors.text }]}>
          {pedido.cantidadSku}
        </Text>
      </View>

      <View style={styles.cardRow}>
        <Text style={[styles.cardLabel, { color: theme.colors.text }]}>
          Kilómetros
        </Text>

        <Text style={[styles.cardValue, { color: theme.colors.text }]}>
          {pedido.kilometros}
        </Text>
      </View>

      <View style={styles.cardRow}>
        <Text style={[styles.cardLabel, { color: theme.colors.text }]}>
          Bonos
        </Text>

        <Text style={[styles.cardValue, { color: theme.colors.text }]}>
          {formatearPesos(
            resultado.totalBonos,
          )}
        </Text>
      </View>

      <View style={styles.cardRow}>
        <Text style={[styles.cardLabel, { color: theme.colors.text }]}>
          Bruto
        </Text>

        <Text style={[styles.cardValue, { color: theme.colors.text }]}>
          {formatearPesos(
            resultado.bruto,
          )}
        </Text>
      </View>

      <View style={styles.cardRow}>
        <Text style={[styles.cardLabel, { color: theme.colors.text }]}>
          Combustible
        </Text>

        <Text style={[styles.cardValue, { color: theme.colors.text }]}>
          {formatearPesos(
            resultado.combustible,
          )}
        </Text>
      </View>

      <View style={styles.cardRow}>
        <Text style={[styles.cardLabel, { color: theme.colors.text }]}>
          Boleta
        </Text>

        <Text style={[styles.cardValue, { color: theme.colors.text }]}>
          {formatearPesos(
            resultado.boleta,
          )}
        </Text>
      </View>

      <View style={styles.cardActions}>
        <Pressable
          style={styles.editButton}
          onPress={() =>
            onEditar(pedido.id)
          }
        >
          <Text style={styles.editText}>
            Editar
          </Text>
        </Pressable>

        <Pressable
          style={styles.deleteButton}
          onPress={() =>
            onEliminar(pedido.id)
          }
        >
          <Text style={styles.deleteText}>
            Eliminar
          </Text>
        </Pressable>
      </View>
    </View>
  );
}