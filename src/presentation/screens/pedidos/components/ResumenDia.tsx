import React from 'react';

import {
  Text,
  View,
} from 'react-native';

import { styles } from '../PedidosStyles';
import {
  useTheme,
} from '../../../theme/ThemeProvider';

interface ResultadoDia {
  brutoPedidos: number;
  asegurado: number;
  ajusteAsegurado: number;
  bonosDia: number;
  combustible: number;
  boleta: number;
  liquido: number;
}

interface Props {
  pedidos: unknown[];
  resultadoDia:
    | ResultadoDia
    | null
    | undefined;
}

const formatearPesos = (
  valor: number,
): string => {
  return `$${Math.round(
    valor,
  ).toLocaleString('es-CL')}`;
};

export default function ResumenDia({
  pedidos,
  resultadoDia,
}: Props) {
  const theme = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: theme.colors.background }]}>
      <Text
        style={[styles.sectionTitle, { color: theme.colors.text }]}
      >
        Resumen del día
      </Text>

      <View style={styles.row}>
        <Text style={[styles.label, { color: theme.colors.text }]}>
          Pedidos
        </Text>

        <Text style={styles.value}>
          {pedidos.length}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={[styles.label, { color: theme.colors.text }]}>
          Bruto
        </Text>

        <Text style={[styles.value, { color: theme.colors.text }]}>
          {formatearPesos(
            resultadoDia
              ?.brutoPedidos || 0,
          )}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={[styles.label, { color: theme.colors.text }]}>
          Asegurado
        </Text>

        <Text style={[styles.value, { color: theme.colors.text }]}>
          {formatearPesos(
            resultadoDia
              ?.asegurado || 0,
          )}
        </Text>
      </View>

      {(resultadoDia
        ?.ajusteAsegurado || 0) > 0 && (
        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Ajuste asegurado
          </Text>

          <Text style={[styles.value, { color: theme.colors.text }]}>
            {formatearPesos(
              resultadoDia
                ?.ajusteAsegurado || 0,
            )}
          </Text>
        </View>
      )}

      <View style={styles.row}>
        <Text style={[styles.label, { color: theme.colors.text }]}>
          Bonos
        </Text>

        <Text style={[styles.value, { color: theme.colors.text }]}>
          {formatearPesos(
            resultadoDia
              ?.bonosDia || 0,
          )}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={[styles.label, { color: theme.colors.text }]}>
          Combustible
        </Text>

        <Text
          style={
            [styles.expenseValue, { color: theme.colors.text }]
          }
        >
          -{' '}
          {formatearPesos(
            resultadoDia
              ?.combustible || 0,
          )}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={[styles.label, { color: theme.colors.text }]}>
          Boleta
        </Text>

        <Text
          style={
            [styles.expenseValue, { color: theme.colors.text }]
          }
        >
          -{' '}
          {formatearPesos(
            resultadoDia
              ?.boleta || 0,
          )}
        </Text>
      </View>

      <View style={styles.totalRow}>
        <Text
          style={[styles.totalLabel, { color: theme.colors.text }]}
        >
          Líquido estimado
        </Text>

        <Text
          style={[styles.totalValue, { color: theme.colors.text }]}
        >
          {formatearPesos(
            resultadoDia
              ?.liquido || 0,
          )}
        </Text>
      </View>
    </View>
  );
}