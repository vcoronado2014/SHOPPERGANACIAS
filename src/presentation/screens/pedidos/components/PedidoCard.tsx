
import React from 'react';

import {
  Pressable,
  Text,
  View,
} from 'react-native';

import { useTheme } from '../../../theme/ThemeProvider';

import { styles } from './PedidoCardStyles';

// Conserva aquí el import actual de Pedido de tu proyecto.
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

const formatearPesos = (valor: number): string => {
  return `$${Math.round(valor).toLocaleString('es-CL')}`;
};

export default function PedidoCard({
  pedido,
  resultado,
  onEditar,
  onEliminar,
}: Props) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
    >
      {/* Encabezado: orden y líquido estimado */}
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text
            style={[
              styles.orderTitle,
              { color: theme.colors.text },
            ]}
            numberOfLines={1}
          >
            Orden {pedido.numeroOrden}
          </Text>

          <Text
            style={[
              styles.operationalInfo,
              { color: theme.colors.muted },
            ]}
            numberOfLines={1}
          >
            {pedido.ventanaInicio} - {pedido.ventanaFin}
            {'  ·  '}
            {pedido.cantidadSku} SKU
            {'  ·  '}
            {pedido.kilometros} km
          </Text>
        </View>

        <View style={styles.liquidContainer}>
          <Text
            style={[
              styles.liquidAmount,
              { color: theme.colors.primary },
            ]}
          >
            {formatearPesos(resultado.liquidoEstimado)}
          </Text>

          <Text
            style={[
              styles.liquidLabel,
              { color: theme.colors.muted },
            ]}
          >
            Líquido estimado
          </Text>
        </View>
      </View>

      {/* Información económica */}
      <View
        style={[
          styles.economicSummary,
          { borderTopColor: theme.colors.border },
        ]}
      >
        <View style={styles.economicItem}>
          <Text
            style={[
              styles.economicLabel,
              { color: theme.colors.muted },
            ]}
          >
            Bruto
          </Text>

          <Text
            style={[
              styles.economicValue,
              { color: theme.colors.text },
            ]}
          >
            {formatearPesos(resultado.bruto)}
          </Text>
        </View>

        <View style={styles.economicItem}>
          <Text
            style={[
              styles.economicLabel,
              { color: theme.colors.muted },
            ]}
          >
            Bonos
          </Text>

          <Text
            style={[
              styles.economicValue,
              { color: theme.colors.text },
            ]}
          >
            {formatearPesos(resultado.totalBonos)}
          </Text>
        </View>

        <View style={styles.economicItem}>
          <Text
            style={[
              styles.economicLabel,
              { color: theme.colors.muted },
            ]}
          >
            Combustible
          </Text>

          <Text
            style={[
              styles.economicValue,
              { color: theme.colors.text },
            ]}
          >
            {formatearPesos(resultado.combustible)}
          </Text>
        </View>
      </View>

      {/* Boleta y acciones */}
      <View style={styles.footer}>
        <Text
          style={[
            styles.receiptText,
            { color: theme.colors.muted },
          ]}
        >
          Boleta: {formatearPesos(resultado.boleta)}
        </Text>

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Editar orden ${pedido.numeroOrden}`}
            hitSlop={6}
            onPress={() => onEditar(pedido.id)}
            style={({ pressed }) => [
              styles.actionButton,
              {
                backgroundColor: pressed
                  ? theme.colors.primarySoft
                  : 'transparent',
              },
            ]}
          >
            <Text
              style={[
                styles.editText,
                { color: theme.colors.primary },
              ]}
            >
              Editar
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Eliminar orden ${pedido.numeroOrden}`}
            hitSlop={6}
            onPress={() => onEliminar(pedido.id)}
            style={({ pressed }) => [
              styles.actionButton,
              {
                backgroundColor: pressed
                  ? theme.colors.danger
                  : 'transparent',
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.deleteText,
                { color: theme.colors.danger },
              ]}
            >
              Eliminar
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}